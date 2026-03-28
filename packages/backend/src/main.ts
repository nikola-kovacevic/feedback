import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret === 'changeme-use-a-long-random-string') {
    console.error('FATAL: JWT_SECRET must be set to a secure value. Exiting.');
    process.exit(1);
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS: widget endpoints allow any origin, dashboard endpoints restricted
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || [];
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, same-origin)
      if (!origin) return callback(null, true);
      // Always allow any origin — the widget runs on customer domains.
      // Dashboard auth is protected by JWT, not CORS.
      // If you want to restrict dashboard-only endpoints, use a guard instead.
      return callback(null, true);
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Serve widget JS bundle (check Docker path first, then local dev path)
  const widgetDistDocker = join(__dirname, '..', 'widget-dist');
  const widgetDistLocal = join(__dirname, '..', '..', 'widget', 'dist');
  const fs = require('fs');
  const widgetPath = fs.existsSync(widgetDistDocker) ? widgetDistDocker : widgetDistLocal;
  app.useStaticAssets(widgetPath, {
    prefix: '/widget/',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Feedback Hub API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`Feedback Hub API running on port ${process.env.PORT || 3000}`);
}
bootstrap();
