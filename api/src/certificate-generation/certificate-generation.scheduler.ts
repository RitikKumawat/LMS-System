import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CertificateGenerationProducer } from './certificate-generation.producer';

@Injectable()
export class CertificateGenerationScheduler {
  private readonly logger = new Logger(CertificateGenerationScheduler.name);

  constructor(
    private readonly certificateProducer: CertificateGenerationProducer,
  ) {}

  /**
   * Run every minute to scan for completed courses
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCertificateGeneration() {
    this.logger.log('CRON: Starting certificate generation scan');

    try {
      await this.certificateProducer.scanAndEnqueueCompletedCourses();
      this.logger.log(
        'CRON: Certificate generation scan completed successfully',
      );
    } catch (error) {
      this.logger.error('CRON: Certificate generation scan failed', error);
    }
  }
}
