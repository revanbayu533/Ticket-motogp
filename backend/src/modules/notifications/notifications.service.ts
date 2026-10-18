import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Pusher = require('pusher');

export interface EmailTemplatePayload {
  recipientName: string;
  recipientEmail: string;
  eventName: string;
  bookingCode: string;
  zoneName: string;
  totalAmount: number;
  qrCodeUrl?: string;
  tickets?: Array<{ ticketNumber: string; holderName: string }>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly appName: string;
  private pusher: Pusher | null = null;

  constructor(private readonly configService: ConfigService) {
    this.appName = this.configService.get<string>('APP_NAME', 'MotoTix');

    const appId = this.configService.get<string>('PUSHER_APP_ID');
    const key = this.configService.get<string>('PUSHER_KEY');
    const secret = this.configService.get<string>('PUSHER_SECRET');
    const cluster = this.configService.get<string>('PUSHER_CLUSTER', 'ap1');

    if (appId && key && secret) {
      try {
        this.pusher = new Pusher({
          appId,
          key,
          secret,
          cluster,
          useTLS: true,
        });
        this.logger.log(`[${this.appName}] Pusher initialized for cluster: ${cluster}`);
      } catch (err) {
        this.logger.warn(`Failed to initialize Pusher: ${err.message}`);
      }
    }
  }

  getAppName(): string {
    return this.appName;
  }

  /**
   * Send live real-time notification with application name prefix
   */
  async sendNotification(
    channel: string,
    event: string,
    data: { title: string; message: string; payload?: any },
  ) {
    const formattedTitle = data.title.startsWith(`[${this.appName}]`)
      ? data.title
      : `[${this.appName}] ${data.title}`;

    const notificationPayload = {
      appName: this.appName,
      title: formattedTitle,
      message: data.message,
      timestamp: new Date().toISOString(),
      payload: data.payload,
    };

    this.logger.log(`Broadcasting notification: "${formattedTitle}" to channel "${channel}"`);

    if (this.pusher) {
      try {
        await this.pusher.trigger(channel, event, notificationPayload);
      } catch (err) {
        this.logger.error(`Error broadcasting to Pusher: ${err.message}`);
      }
    }

    return notificationPayload;
  }

  /**
   * Generates official branded email template using agreed application name
   */
  generateEmailTemplate(
    type: 'BOOKING_CONFIRMATION' | 'PAYMENT_SUCCESS' | 'TICKET_ISSUED',
    payload: EmailTemplatePayload,
  ): { subject: string; html: string; text: string } {
    const subjectPrefix = `[${this.appName}]`;

    switch (type) {
      case 'BOOKING_CONFIRMATION': {
        const subject = `${subjectPrefix} Konfirmasi Pemesanan - Kode Booking: ${payload.bookingCode}`;
        const text = `Halo ${payload.recipientName},\n\nTerima kasih telah memesan tiket ${payload.eventName} melalui ${this.appName}.\nKode Booking: ${payload.bookingCode}\nZona: ${payload.zoneName}\nTotal Tagihan: Rp ${payload.totalAmount.toLocaleString('id-ID')}\n\nSilakan selesaikan pembayaran sebelum batas waktu berakhir.\n\nSalam Hangat,\nTim ${this.appName}`;

        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0F1015; color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #222;">
            <div style="background: linear-gradient(135deg, #E10600 0%, #8A0000 100%); padding: 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; color: #FFFFFF; text-transform: uppercase;">${this.appName}</h1>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #F0F0F0;">Official MotoGP Ticketing System</p>
            </div>
            <div style="padding: 28px;">
              <h2 style="color: #FFFFFF; margin-top: 0;">Konfirmasi Pemesanan Tiket</h2>
              <p style="color: #CCCCCC;">Halo <strong>${payload.recipientName}</strong>,</p>
              <p style="color: #CCCCCC;">Pemesanan tiket Anda di <strong>${this.appName}</strong> telah berhasil dibuat. Berikut detail pemesanan Anda:</p>
              
              <div style="background: #181920; border-left: 4px solid #E10600; padding: 16px; margin: 20px 0; border-radius: 6px;">
                <p style="margin: 4px 0; color: #AAAAAA; font-size: 12px; text-transform: uppercase;">Kode Booking</p>
                <p style="margin: 0 0 12px 0; font-size: 20px; font-weight: bold; color: #E10600; letter-spacing: 1.5px;">${payload.bookingCode}</p>
                
                <p style="margin: 4px 0; color: #AAAAAA; font-size: 12px; text-transform: uppercase;">Acara / Event</p>
                <p style="margin: 0 0 12px 0; font-size: 16px; color: #FFFFFF; font-weight: 600;">${payload.eventName}</p>

                <p style="margin: 4px 0; color: #AAAAAA; font-size: 12px; text-transform: uppercase;">Zona / Kategori</p>
                <p style="margin: 0 0 12px 0; font-size: 15px; color: #FFFFFF;">${payload.zoneName}</p>

                <p style="margin: 4px 0; color: #AAAAAA; font-size: 12px; text-transform: uppercase;">Total Pembayaran</p>
                <p style="margin: 0; font-size: 18px; color: #00F0FF; font-weight: bold;">Rp ${payload.totalAmount.toLocaleString('id-ID')}</p>
              </div>

              <p style="color: #AAAAAA; font-size: 13px; line-height: 1.5;">Segera selesaikan pembayaran untuk mengamankan kursi Anda. Setelah pembayaran diverifikasi, E-Ticket resmi akan dikirimkan otomatis ke email ini.</p>
            </div>
            <div style="background: #090A0D; padding: 16px; text-align: center; border-top: 1px solid #1E2028; font-size: 12px; color: #666666;">
              © ${new Date().getFullYear()} ${this.appName}. All rights reserved. Pertamina Mandalika International Circuit Official Partner.
            </div>
          </div>
        `;

        return { subject, html, text };
      }

      case 'PAYMENT_SUCCESS': {
        const subject = `${subjectPrefix} Pembayaran Berhasil - ${payload.bookingCode}`;
        const text = `Halo ${payload.recipientName},\n\nPembayaran untuk kode booking ${payload.bookingCode} senilai Rp ${payload.totalAmount.toLocaleString('id-ID')} telah sukses diverifikasi oleh sistem ${this.appName}.\n\nTiket Anda siap digunakan.\n\nSalam,\nTim ${this.appName}`;
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0F1015; color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #222;">
            <div style="background: linear-gradient(135deg, #10B981 0%, #065F46 100%); padding: 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; color: #FFFFFF;">${this.appName}</h1>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #E6FFFA;">Pembayaran Telah Diterima</p>
            </div>
            <div style="padding: 28px;">
              <h2 style="color: #FFFFFF; margin-top: 0;">Pembayaran Berhasil!</h2>
              <p style="color: #CCCCCC;">Halo <strong>${payload.recipientName}</strong>, transaksi Anda untuk booking <strong>${payload.bookingCode}</strong> telah sukses.</p>
              <p style="color: #10B981; font-size: 20px; font-weight: bold;">Rp ${payload.totalAmount.toLocaleString('id-ID')}</p>
            </div>
            <div style="background: #090A0D; padding: 16px; text-align: center; border-top: 1px solid #1E2028; font-size: 12px; color: #666666;">
              © ${new Date().getFullYear()} ${this.appName}. Semua hak dilindungi undang-undang.
            </div>
          </div>
        `;
        return { subject, html, text };
      }

      case 'TICKET_ISSUED': {
        const subject = `${subjectPrefix} E-Ticket Resmi Anda Siap! - ${payload.eventName}`;
        const text = `Halo ${payload.recipientName},\n\nE-Ticket Anda untuk ${payload.eventName} telah terbit. Tunjukkan kode booking ${payload.bookingCode} saat memasuki sirkuit.\n\nSelamat menikmati balapan!\n${this.appName} Team`;
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0F1015; color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #222;">
            <div style="background: linear-gradient(135deg, #E10600 0%, #8A0000 100%); padding: 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; color: #FFFFFF;">${this.appName} E-TICKET</h1>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #F0F0F0;">Valid For Circuit Entry</p>
            </div>
            <div style="padding: 28px;">
              <h2 style="color: #FFFFFF; margin-top: 0;">Tiket Balapan MotoGP Anda Siap</h2>
              <p style="color: #CCCCCC;">Acara: <strong>${payload.eventName}</strong></p>
              <p style="color: #CCCCCC;">Pemegang: <strong>${payload.recipientName}</strong></p>
              <p style="color: #CCCCCC;">Zona: <strong>${payload.zoneName}</strong></p>
            </div>
            <div style="background: #090A0D; padding: 16px; text-align: center; border-top: 1px solid #1E2028; font-size: 12px; color: #666666;">
              © ${new Date().getFullYear()} ${this.appName}. Mandalika Grand Prix Official Ticket.
            </div>
          </div>
        `;
        return { subject, html, text };
      }
    }
  }
}
