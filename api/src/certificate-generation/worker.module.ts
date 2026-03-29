import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import config from '../config/config';
import { envSchema } from '../config/schema';
import { CertificateGenerationProcessor } from './certificate-generation.processor';
import { PdfGeneratorService } from './pdf-generator.service';
import { Certificate, CertificateSchema } from '../schemas/certificate.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Course, CourseSchema } from '../schemas/course.schema';
import {
  CertificateTemplate,
  CertificateTemplateSchema,
} from '../schemas/certificate-template.schema';
import { CERTIFICATE_QUEUE_NAME } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: envSchema,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.url'),
      }),
      inject: [ConfigService],
    }),
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
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema },
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: CertificateTemplate.name, schema: CertificateTemplateSchema },
    ]),
  ],
  providers: [CertificateGenerationProcessor, PdfGeneratorService],
})
export class WorkerModule {}
