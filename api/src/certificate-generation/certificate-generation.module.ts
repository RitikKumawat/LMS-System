import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { CertificateGenerationScheduler } from './certificate-generation.scheduler';
import { CertificateGenerationProducer } from './certificate-generation.producer';
import { CertificateGenerationService } from './certificate-generation.service';
import { CertificateGenerationProcessor } from './certificate-generation.processor';
import { CertificateGenerationResolver } from './certificate-generation.resolver';
import { CertificateDownloadController } from './certificate-download.controller';
import { PdfGeneratorService } from './pdf-generator.service';
import { Certificate, CertificateSchema } from '../schemas/certificate.schema';
import { Enrollment, EnrollmentSchema } from '../schemas/enrollment.schema';
import { Lesson, LessonSchema } from '../schemas/lesson.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Course, CourseSchema } from '../schemas/course.schema';
import {
  CertificateTemplate,
  CertificateTemplateSchema,
} from '../schemas/certificate-template.schema';
import { CERTIFICATE_QUEUE_NAME } from './constants';

@Module({
  controllers: [CertificateDownloadController],
  imports: [
    // Register BullMQ queue
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host', 'localhost'),
          port: configService.get<number>('redis.port', 6379),
          password: configService.get<string>('redis.password'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: CERTIFICATE_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
    // Register Mongoose schemas
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: CertificateTemplate.name, schema: CertificateTemplateSchema },
    ]),
  ],
  providers: [
    CertificateGenerationScheduler,
    CertificateGenerationProducer,
    CertificateGenerationService,
    CertificateGenerationProcessor,
    CertificateGenerationResolver,
    PdfGeneratorService,
  ],
  exports: [CertificateGenerationProducer, CertificateGenerationService],
})
export class CertificateGenerationModule {}
