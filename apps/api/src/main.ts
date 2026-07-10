import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InternalAppKeyGuard } from './security/internal-app-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const internalAppKey = process.env.INTERNAL_API_KEY?.trim();
  if (internalAppKey) {
    app.useGlobalGuards(new InternalAppKeyGuard(internalAppKey));
  } else if (process.env.NODE_ENV === 'production') {
    throw new Error('INTERNAL_API_KEY is required in production');
  }
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
