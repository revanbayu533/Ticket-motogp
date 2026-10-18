import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOperation({ summary: 'Health check endpoint' })
  @Get()
  async getHealth() {
    let dbStatus = 'healthy';
    let userCount = 0;
    let eventCount = 0;
    let zoneCount = 0;

    try {
      [userCount, eventCount, zoneCount] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.event.count(),
        this.prisma.zone.count(),
      ]);
    } catch {
      dbStatus = 'unreachable';
    }

    return {
      appName: this.configService.get<string>('APP_NAME', 'MotoTix'),
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: this.configService.get<string>('NODE_ENV', 'development'),
      database: {
        status: dbStatus,
        provider: 'PostgreSQL (Neon)',
        counts: {
          users: userCount,
          events: eventCount,
          zones: zoneCount,
        },
      },
      endpoints: {
        apiDocs: '/api/docs',
        events: '/api/events',
        notifications: '/api/notifications',
      },
    };
  }
}
