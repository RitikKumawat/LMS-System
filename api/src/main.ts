import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
// import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import * as bodyParser from "body-parser";
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
            'blob:',
            'http://localhost:4000',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'uploads'), {
      setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Content-Type, Authorization',
        );
      },
    }),
  );
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 500000000, maxFiles: 10 }),
  );

  app.use(
    '/webhooks/razorpay',
    bodyParser.raw({ type: '*/*' }),
  );

  app.use(compression());
  app.use(cookieParser());
  app.enableCors({
    origin: config.get<string[]>('cors.origin'),
    credentials: true,
  });
  app.use(express.json({ limit: '50mb' }));

  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe());
  // app.use(morgan('combined'));
  app.getHttpAdapter().get('/health', (_req, res) => {
    try {
      res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    } catch {
      res.status(500).json({ status: 'error' });
    }
  });

  await app.listen(config.get('app.port') ?? 4000);
}
bootstrap();
