import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateSnapTokenDto } from './dto/create-snap-token.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly serverKey: string;
  private readonly isProduction: boolean;
  private readonly snapBaseUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
  ) {
    this.serverKey = this.configService.get<string>('MIDTRANS_SERVER_KEY', '');
    this.isProduction =
      this.configService.get<string>('MIDTRANS_IS_PRODUCTION') === 'true';
    this.snapBaseUrl = this.isProduction
      ? 'https://app.midtrans.com/snap/v1'
      : 'https://app.sandbox.midtrans.com/snap/v1';
  }

  async createSnapToken(dto: CreateSnapTokenDto) {
    if (!this.serverKey) {
      this.logger.error('MIDTRANS_SERVER_KEY is not configured in .env');
      throw new BadRequestException('Kunci server Midtrans belum dikonfigurasi');
    }

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingCode = `MTX-2026-MDK-${randomSuffix}`;
    const grossAmount = Math.round(dto.unitPrice * dto.quantity);

    // Ensure User exists in Neon PostgreSQL
    let user = dto.userId
      ? await this.prisma.user.findUnique({ where: { id: dto.userId } })
      : null;

    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    }

    if (!user) {
      const dummyPassword = await bcrypt.hash(crypto.randomUUID(), 10);
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          phone: dto.phone,
          password: dummyPassword,
          role: 'CUSTOMER',
        },
      });
    }

    // Save pending Order & Payment in DB
    const order = await this.prisma.order.create({
      data: {
        bookingCode,
        userId: user.id,
        totalAmount: grossAmount,
        status: 'PENDING',
        payment: {
          create: {
            amount: grossAmount,
            paymentMethod: 'Midtrans Snap',
            paymentStatus: 'PENDING',
          },
        },
      },
    });

    // Prepare Midtrans Snap Payload
    const payload = {
      transaction_details: {
        order_id: bookingCode,
        gross_amount: grossAmount,
      },
      item_details: [
        {
          id: dto.zoneId,
          price: dto.unitPrice,
          quantity: dto.quantity,
          name: dto.zoneName.substring(0, 50),
        },
      ],
      customer_details: {
        first_name: dto.name,
        email: dto.email,
        phone: dto.phone,
      },
      callbacks: {
        finish: 'https://ticket-motogp-hape.vercel.app/?payment=finish',
      },
    };

    try {
      const authHeader = `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`;
      const response = await fetch(`${this.snapBaseUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        this.logger.error(`Midtrans Snap error: ${errText}`);
        throw new InternalServerErrorException(
          `Gagal membuat transaksi Midtrans: ${errText}`,
        );
      }

      const snapData = await response.json();

      return {
        snapToken: snapData.token,
        redirectUrl: snapData.redirect_url,
        bookingCode,
        orderId: order.id,
        grossAmount,
      };
    } catch (err) {
      this.logger.error('Error contacting Midtrans Snap API', err);
      throw new InternalServerErrorException(
        err.message || 'Gagal menghubungi server Midtrans',
      );
    }
  }

  async handleNotification(body: any) {
    this.logger.log(`Received Midtrans webhook: ${JSON.stringify(body)}`);

    const orderId = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;
    const signatureKey = body.signature_key;

    // Verify Midtrans Signature Key
    if (this.serverKey && signatureKey) {
      const hash = crypto
        .createHash('sha512')
        .update(`${orderId}${statusCode}${grossAmount}${this.serverKey}`)
        .digest('hex');

      if (hash !== signatureKey) {
        this.logger.warn(`Signature verification failed for order: ${orderId}`);
        throw new BadRequestException('Tanda tangan Midtrans tidak valid');
      }
    }

    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    let orderStatus: 'PAID' | 'PENDING' | 'CANCELLED' | 'EXPIRED' = 'PENDING';
    let paymentStatus: 'SUCCESS' | 'PENDING' | 'FAILED' | 'EXPIRED' = 'PENDING';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        orderStatus = 'PAID';
        paymentStatus = 'SUCCESS';
      }
    } else if (transactionStatus === 'settlement') {
      orderStatus = 'PAID';
      paymentStatus = 'SUCCESS';
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      orderStatus = 'CANCELLED';
      paymentStatus = 'FAILED';
    } else if (transactionStatus === 'pending') {
      orderStatus = 'PENDING';
      paymentStatus = 'PENDING';
    }

    return this.finalizePayment(
      orderId,
      orderStatus,
      paymentStatus,
      body.payment_type || 'Midtrans',
      body.transaction_id,
    );
  }

  async finalizePayment(
    bookingCode: string,
    orderStatus: 'PAID' | 'PENDING' | 'CANCELLED' | 'EXPIRED',
    paymentStatus: 'SUCCESS' | 'PENDING' | 'FAILED' | 'EXPIRED',
    paymentMethod: string,
    transactionId?: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { bookingCode },
      include: { user: true, payment: true },
    });

    if (!order) {
      this.logger.warn(`Order not found for booking code: ${bookingCode}`);
      return { status: 'ORDER_NOT_FOUND' };
    }

    // Update order and payment status
    await this.prisma.order.update({
      where: { bookingCode },
      data: {
        status: orderStatus,
        payment: {
          update: {
            paymentStatus,
            paymentMethod,
            transactionId: transactionId || order.payment?.transactionId,
            paidAt: paymentStatus === 'SUCCESS' ? new Date() : null,
          },
        },
      },
    });

    if (orderStatus === 'PAID') {
      // Find zone for ticket creation
      const zones = await this.prisma.zone.findMany({ take: 1 });
      const zoneId = zones[0]?.id || 'zone-default';

      // Generate Ticket record
      const ticketNumber = `TKT-${bookingCode.replace('MTX-2026-MDK-', '')}-01`;
      await this.prisma.ticket.upsert({
        where: { ticketNumber },
        create: {
          ticketNumber,
          orderId: order.id,
          zoneId,
          holderName: order.user.name,
          holderEmail: order.user.email,
          status: 'ACTIVE',
        },
        update: {
          status: 'ACTIVE',
        },
      });

      // Broadcast real-time notification via Pusher
      await this.notificationsService.sendNotification(
        'mototix-channel',
        'ticket-alert',
        {
          title: `Pembayaran Berhasil: ${bookingCode}`,
          message: `E-Ticket resmi atas nama ${order.user.name} telah sukses terbit.`,
        },
      );
    }

    return {
      status: 'UPDATED',
      bookingCode,
      orderStatus,
      paymentStatus,
    };
  }
}
