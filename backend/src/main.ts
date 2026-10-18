import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appName = configService.get<string>('APP_NAME', 'MotoTix');
  const port = configService.get<number>('PORT', 3001);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:5173');

  // Set global prefix /api
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: corsOrigin.includes(',') ? corsOrigin.split(',') : corsOrigin,
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
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  logger.log(`====================================================`);
  logger.log(`🚀 ${appName} Backend running on: http://localhost:${port}/api`);
  logger.log(`📖 Swagger API Documentation:  http://localhost:${port}/api/docs`);
  logger.log(`❤️  Health Check:               http://localhost:${port}/api/health`);
  logger.log(`====================================================`);
}

bootstrap();
