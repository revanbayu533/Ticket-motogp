import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Preview official branded email template' })
  @Get('email-preview')
  getEmailPreview(
    @Query('type')
    type: 'BOOKING_CONFIRMATION' | 'PAYMENT_SUCCESS' | 'TICKET_ISSUED' = 'BOOKING_CONFIRMATION',
  ) {
    const samplePayload = {
      recipientName: 'Bastian Ramadhan',
      recipientEmail: 'bastian@mototix.com',
      eventName: 'Pertamina Grand Prix of Indonesia 2026',
      bookingCode: 'MTX-MANDALIKA-7892',
      zoneName: 'VIP Hospitality Village Deluxe Class',
      totalAmount: 15000000,
    };

    return this.notificationsService.generateEmailTemplate(type, samplePayload);
  }

  @ApiOperation({ summary: 'Broadcast real-time notification' })
  @Post('broadcast')
  async broadcast(
    @Body() body: { title: string; message: string; channel?: string; event?: string },
  ) {
    const channel = body.channel || 'mototix-channel';
    const event = body.event || 'ticket-alert';
    return await this.notificationsService.sendNotification(channel, event, {
      title: body.title,
      message: body.message,
    });
  }
}
