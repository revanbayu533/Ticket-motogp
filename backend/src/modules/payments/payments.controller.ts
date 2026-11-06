import { Controller, Post, Body, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreateSnapTokenDto } from './dto/create-snap-token.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Create Midtrans Snap Token for Ticket Booking' })
  @ApiResponse({ status: 201, description: 'Snap token and booking code generated' })
  @Post('snap-token')
  createSnapToken(@Body() dto: CreateSnapTokenDto) {
    return this.paymentsService.createSnapToken(dto);
  }

  @ApiOperation({ summary: 'Midtrans Webhook HTTP Notification Callback' })
  @ApiResponse({ status: 200, description: 'Notification processed' })
  @HttpCode(HttpStatus.OK)
  @Post('notification')
  handleNotification(@Body() body: any) {
    return this.paymentsService.handleNotification(body);
  }

  @ApiOperation({ summary: 'Simulate successful payment for local testing' })
  @Post('simulate-success/:bookingCode')
  simulateSuccess(@Param('bookingCode') bookingCode: string) {
    return this.paymentsService.finalizePayment(
      bookingCode,
      'PAID',
      'SUCCESS',
      'QRIS Simulator Verified',
    );
  }

  @ApiOperation({ summary: 'Cancel pending payment / order' })
  @Post('cancel/:bookingCode')
  cancelOrder(@Param('bookingCode') bookingCode: string) {
    return this.paymentsService.finalizePayment(
      bookingCode,
      'CANCELLED',
      'FAILED',
      'Dibatalkan oleh Pengguna',
    );
  }
}

