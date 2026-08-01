import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerService } from './common/services/logger.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const apiPrefix = configService.get<string>('API_PREFIX', '/api/v1');

  // ==========================================
  // SECURITY MIDDLEWARES
  // ==========================================
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Disable for development
  }));

  // CORS Configuration
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3000').split(','),
    credentials: configService.get<boolean>('CORS_CREDENTIALS', true),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // ==========================================
  // GLOBAL PIPES & FILTERS
  // ==========================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true, // Auto-transform payloads to DTO types
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // ==========================================
  // API PREFIX
  // ==========================================
  app.setGlobalPrefix(apiPrefix);

  // ==========================================
  // SWAGGER API DOCUMENTATION
  // ==========================================
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nahrain Social Media API')
    .setDescription('Enterprise-grade Social Media Platform Backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication & Authorization endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Posts', 'Post management endpoints')
    .addTag('Comments', 'Comment management endpoints')
    .addTag('Stories', 'Story management endpoints')
    .addTag('Messages', 'Messaging endpoints')
    .addTag('Notifications', 'Notification endpoints')
    .addTag('Admin', 'Admin management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Nahrain API Docs',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // ==========================================
  // START SERVER
  // ==========================================
  await app.listen(port);

  const logger = new LoggerService();
  logger.log(`🚀 Application is running on: http://localhost:${port}${apiPrefix}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  logger.log(`🌍 Environment: ${configService.get<string>('NODE_ENV')}`);
}

bootstrap();
