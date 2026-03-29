import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { basename, isAbsolute, join } from 'path';
import { Certificate, CERTIFICATE_STATUS } from '../schemas/certificate.schema';
import { Enrollment } from '../schemas/enrollment.schema';
import { Course } from '../schemas/course.schema';
import { User } from '../schemas/user.schema';
import { CERTIFICATE_QUEUE_NAME, GENERATE_CERTIFICATE_JOB } from './constants';
import { CertificateJobPayload } from './certificate-generation.types';
import { getCourseProgressPipeline } from 'src/aggregation/getCourseProgress.aggregation';
import { Lesson } from 'src/schemas/lesson.schema';
import { CertificateGenerationProcessor } from './certificate-generation.processor';

@Injectable()
export class CertificateGenerationService {
  private readonly logger = new Logger(CertificateGenerationService.name);

  constructor(
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectQueue(CERTIFICATE_QUEUE_NAME)
    private readonly certificateQueue: Queue<CertificateJobPayload>,
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<Lesson>,
    private readonly certificateGenerationProcessor: CertificateGenerationProcessor,
    private readonly configService: ConfigService,
  ) {}

  async getUserCertificateDownloadDetails(
    userId: string,
    courseId: string,
  ): Promise<{
    filePath: string;
    fileName: string;
  }> {
    const certificate = await this.certificateModel
      .findOne({
        user_id: new Types.ObjectId(userId),
        course_id: new Types.ObjectId(courseId),
        status: CERTIFICATE_STATUS.ISSUED,
      })
      .lean();

    if (!certificate || !certificate.certificate_url) {
      throw new NotFoundException(
        'Issued certificate not found for this course',
      );
    }

    const uploadsPath = this.configService.get<string>(
      'certificate.uploadsPath',
      './uploads/certificates',
    );
    const certificateFileName = basename(certificate.certificate_url);
    const rootPath = isAbsolute(uploadsPath)
      ? uploadsPath
      : join(process.cwd(), uploadsPath);
    const filePath = join(rootPath, certificateFileName);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Certificate file does not exist on server');
    }

    return {
      filePath,
      fileName: certificateFileName,
    };
  }

  async sendCertificate(userId?: string, courseId?: string): Promise<string> {
    // If both userId and courseId are provided, generate certificate for specific enrollment
    if (userId && courseId) {
      return await this.generateCertificateForSpecificEnrollment(
        userId,
        courseId,
      );
    }
    throw new BadRequestException('Both userId and courseId are required');
  }

  private async generateCertificateForSpecificEnrollment(
    userId: string,
    courseId: string,
  ): Promise<string> {
    this.logger.log(
      `Generating certificate for user ${userId}, course ${courseId}`,
    );

    try {
      const enrollment = await this.enrollmentModel.findOne({
        user_id: new Types.ObjectId(userId),
        course_id: new Types.ObjectId(courseId),
      });

      if (!enrollment) {
        throw new BadRequestException(
          `No enrollment found for user ${userId} in course ${courseId}`,
        );
      }

      // Verify user exists
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new BadRequestException(`User ${userId} not found`);
      }

      const course = await this.courseModel.findById(courseId);
      if (!course) {
        throw new BadRequestException(`Course ${courseId} not found`);
      }

      if (!(course as any).certificate_template_id) {
        throw new BadRequestException(
          `Course ${courseId} does not have a certificate template assigned`,
        );
      }

      const existingCert = await this.certificateModel.findOne({
        user_id: new Types.ObjectId(userId),
        course_id: new Types.ObjectId(courseId),
        status: {
          $in: [CERTIFICATE_STATUS.PENDING, CERTIFICATE_STATUS.ISSUED],
        },
      });

      if (existingCert) {
        this.logger.warn(
          `Certificate already exists for user ${userId}, course ${courseId}. Status: ${existingCert.status}`,
        );
        await this.certificateGenerationProcessor
          .sendCertificateEmail(
            user.email,
            user.name,
            course.title,
            existingCert.certificate_url,
          )
          .then(async () => {
            await this.enrollmentModel.findOneAndUpdate(
              {
                user_id: user._id,
                course_id: course._id,
              },
              {
                certificate_sent: true,
              },
            );
          });
        return `Certificate already exists for this enrollment (Status: ${existingCert.status})`;
      }
      const pipeline = getCourseProgressPipeline(courseId, userId);
      const progressResult = await this.lessonModel.aggregate(pipeline);

      if (!progressResult.length) {
        throw new BadRequestException(
          `No progress found for user ${userId} in course ${courseId}`,
        );
      }

      const { totalLessons, completedLessons } = progressResult[0];
      const percentage =
        totalLessons > 0
          ? Math.floor((completedLessons / totalLessons) * 100)
          : 0;

      // Only enqueue if 100% complete
      if (percentage === 100) {
        // Check if the course has a certificate template assigned

        const certificate = await this.certificateModel.create({
          user_id: new Types.ObjectId(userId),
          course_id: new Types.ObjectId(courseId),
          certificate_url: '',
          status: CERTIFICATE_STATUS.PENDING,
          issued_at: null,
          error_message: null,
        });

        const jobId = `cert:${userId}:${courseId}`;
        await this.certificateQueue.add(
          GENERATE_CERTIFICATE_JOB,
          {
            userId,
            courseId,
            certificateId: certificate._id.toString(),
          } as CertificateJobPayload,
          {
            jobId,
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 5000,
            },
            removeOnComplete: {
              count: 100,
            },
            removeOnFail: false,
          },
        );

        this.logger.log(
          `Certificate generation enqueued for user ${userId}, course ${courseId}. Certificate ID: ${certificate._id}`,
        );
        return `Certificate generation initiated for user ${user.name} in course ${course.title}. Certificate will be generated and sent to ${user.email}`;
      }
    } catch (error) {
      this.logger.error(
        `Failed to generate certificate for user ${userId}, course ${courseId}`,
        error,
      );
      throw error;
    }
  }
}
