import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

let cachedServer: any;

export async function bootstrap() {
  if (cachedServer) {
    return cachedServer;
  }

  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appName = configService.get<string>('APP_NAME', 'MotoTix');
  const port = process.env.PORT || configService.get<number>('PORT', 3001);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');

  // Set global prefix /api
  app.setGlobalPrefix('api');

  // Enable CORS
  const isCorsWildcard = corsOrigin === '*' || !corsOrigin;
  app.enableCors({
    origin: isCorsWildcard
      ? true
      : corsOrigin.includes(',')
        ? corsOrigin.split(',').map((o) => o.trim())
        : corsOrigin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Setup Swagger API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${appName} API`)
    .setDescription(
      `Official REST API documentation for ${appName} - MotoGP Grand Prix Ticketing System`,
    )
    .setVersion('1.0')
    .addTag('Health', 'System status and database connectivity')
    .addTag('Events', 'MotoGP races, circuits, zones and ticket categories')
    .addTag('Notifications', 'Live broadcast and email notification templates')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.css',
    ],
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js',
    ],
    customSiteTitle: `${appName} API Documentation`,
  });

  // Route helpers on underlying Express server
  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter.get('/', (_req: any, res: any) => {
    res.redirect('/api/docs');
  });
  httpAdapter.get('/api', (_req: any, res: any) => {
    res.json({
      status: 'online',
      name: `${appName} API`,
      docs: '/api/docs',
      health: '/api/health',
    });
  });

  await app.init();
  cachedServer = httpAdapter;

  if (!process.env.VERCEL) {
    await app.listen(port);
    logger.log(`====================================================`);
    logger.log(`🚀 ${appName} Backend running on: http://localhost:${port}/api`);
    logger.log(`📖 Swagger API Documentation:  http://localhost:${port}/api/docs`);
    logger.log(`❤️  Health Check:               http://localhost:${port}/api/health`);
    logger.log(`====================================================`);
  }

  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  server(req, res);
}

if (!process.env.VERCEL) {
  bootstrap();
}
