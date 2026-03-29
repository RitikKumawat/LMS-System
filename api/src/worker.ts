import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './certificate-generation/worker.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Worker');

  logger.log('Starting certificate generation worker...');

  // Create application context (no HTTP server)
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  logger.log('Certificate generation worker started successfully');
  logger.log('Worker is now processing jobs from the certificate-generation queue');

  // Keep the process running
  process.on('SIGINT', async () => {
    logger.log('Received SIGINT, shutting down worker gracefully...');
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.log('Received SIGTERM, shutting down worker gracefully...');
    await app.close();
    process.exit(0);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start worker:', error);
  process.exit(1);
});
