import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// Swagger removed
import { Logger } from 'nestjs-pino';
import { AllExceptionsFilter } from './common/http-exception.filter';
import { TransformInterceptor } from './common/transform.interceptor';
import { CorrelationIdMiddleware } from './common/correlation-id.middleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';

async function bootstrap() {
  // Debug: trace any unexpected process.exit calls
  const _realExit = process.exit.bind(process) as (code?: number) => never;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (process.exit as any) = (code?: number) => {
    // eslint-disable-next-line no-console
    console.error('process.exit called with code', code, new Error('exit stack').stack);
    return _realExit(code);
  };
  // eslint-disable-next-line no-console
  console.log('Bootstrapping Nest application...');
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  try {
    app.useLogger(app.get(Logger));
  } catch {
    // eslint-disable-next-line no-console
    console.warn('Logger setup failed, using default logger');
  }
  app.use(cookieParser());
  app.use(new CorrelationIdMiddleware().use as any);
  
  // Enable CORS using NestJS built-in method
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID'],
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  
  // Handle OPTIONS requests after global prefix
  app.use((req: any, res: any, next: any) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Correlation-ID');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.status(200).end();
      return;
    }
    next();
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidUnknownValues: true }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger UI disabled for Postman-only testing

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  // eslint-disable-next-line no-console
  console.log('Using PORT=', port);
  try {
    // eslint-disable-next-line no-console
    console.log('About to call app.listen...');
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log('app.listen resolved');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('app.listen failed:', err);
    throw err;
  }
  // eslint-disable-next-line no-console
  console.log(`API listening on ${await app.getUrl()}`);
}
bootstrap().catch((err) => {
  // Log startup errors explicitly to aid diagnosis
  // eslint-disable-next-line no-console
  console.error('Application bootstrap failed:', err);
  process.exit(1);
});

// Global handlers to catch any silent failures
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('uncaughtException:', err);
});
process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('unhandledRejection:', reason);
});
process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.error('Received SIGINT');
});
process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.error('Received SIGTERM');
});
process.on('beforeExit', (code) => {
  // eslint-disable-next-line no-console
  console.error('beforeExit with code', code);
});
process.on('exit', (code) => {
  // eslint-disable-next-line no-console
  console.error('exit with code', code);
});
