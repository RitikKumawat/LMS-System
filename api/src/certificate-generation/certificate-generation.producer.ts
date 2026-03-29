import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Enrollment } from '../schemas/enrollment.schema';
import { Certificate, CERTIFICATE_STATUS } from '../schemas/certificate.schema';
import { Lesson } from '../schemas/lesson.schema';
import { User } from '../schemas/user.schema';
import { Course } from '../schemas/course.schema';
import { ENROLLMENT_STATUS } from '../enum/enrollmentStatus';
import { getCourseProgressPipeline } from '../aggregation/getCourseProgress.aggregation';
import { CERTIFICATE_QUEUE_NAME, GENERATE_CERTIFICATE_JOB } from './constants';
import { CertificateJobPayload } from './certificate-generation.types';

/** Pending certificates older than this are considered "stuck" and re-enqueued */
const STUCK_PENDING_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

@Injectable()
export class CertificateGenerationProducer {
  private readonly logger = new Logger(CertificateGenerationProducer.name);

  constructor(
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<Lesson>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
    @InjectQueue(CERTIFICATE_QUEUE_NAME)
    private readonly certificateQueue: Queue<CertificateJobPayload>,
  ) {}

  /**
   * Find completed enrollments and enqueue certificate generation jobs.
   * Also re-enqueues stuck pending certificates.
   */
  async scanAndEnqueueCompletedCourses(): Promise<void> {
    this.logger.log('Starting completion scan...');

    try {
      // Find all active enrollments
      const activeEnrollments = await this.enrollmentModel
        .find({ status: ENROLLMENT_STATUS.ACTIVE })
        .lean();

      this.logger.log(`Found ${activeEnrollments.length} active enrollments`);

      let enqueuedCount = 0;
      let skippedCount = 0;

      for (const enrollment of activeEnrollments) {
        try {
          // Check if certificate already exists (pending or issued)
          const existingCert = await this.certificateModel.findOne({
            user_id: enrollment.user_id,
            course_id: enrollment.course_id,
            status: {
              $in: [CERTIFICATE_STATUS.PENDING, CERTIFICATE_STATUS.ISSUED],
            },
          });

          if (existingCert) {
            skippedCount++;
            continue;
          }

          // Check course progress
          const userId = enrollment.user_id.toString();
          const courseId = enrollment.course_id.toString();

          const pipeline = getCourseProgressPipeline(courseId, userId);
          const progressResult = await this.lessonModel.aggregate(pipeline);

          if (!progressResult.length) {
            continue;
          }

          const { totalLessons, completedLessons } = progressResult[0];
          const percentage =
            totalLessons > 0
              ? Math.floor((completedLessons / totalLessons) * 100)
              : 0;

          // Only enqueue if 100% complete
          if (percentage === 100) {
            // Check if the course has a certificate template assigned
            const course = await this.courseModel
              .findById(courseId)
              .select('certificate_template_id')
              .lean();

            if (!course?.certificate_template_id) {
              this.logger.debug(
                `Course ${courseId} has no certificate template assigned, skipping`,
              );
              continue;
            }

            // Atomically create pending certificate record
            try {
              const certificate = await this.certificateModel.create({
                user_id: enrollment.user_id,
                course_id: enrollment.course_id,
                certificate_url: '',
                status: CERTIFICATE_STATUS.PENDING,
                issued_at: null,
                error_message: null,
              });

              // Enqueue job with deterministic ID
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

              enqueuedCount++;
              this.logger.log(
                `Enqueued certificate generation for user ${userId}, course ${courseId}`,
              );
            } catch (error: any) {
              if (error.code === 11000) {
                this.logger.debug(
                  `Certificate already being processed for user ${userId}, course ${courseId}`,
                );
                skippedCount++;
              } else {
                throw error;
              }
            }
          }
        } catch (error) {
          this.logger.error(
            `Error processing enrollment ${enrollment._id}`,
            error,
          );
        }
      }

      this.logger.log(
        `Completion scan finished. Enqueued: ${enqueuedCount}, Skipped: ${skippedCount}`,
      );

      // Re-enqueue stuck pending certificates
      await this.reEnqueueStuckPendingCerts();
    } catch (error) {
      this.logger.error('Completion scan failed', error);
      throw error;
    }
  }

  /**
   * Find certificates stuck in "pending" for longer than the threshold
   * and re-enqueue them so the worker can retry.
   */
  private async reEnqueueStuckPendingCerts(): Promise<void> {
    const cutoff = new Date(Date.now() - STUCK_PENDING_THRESHOLD_MS);

    const stuckCerts = await this.certificateModel
      .find({
        status: CERTIFICATE_STATUS.PENDING,
        createdAt: { $lt: cutoff },
      })
      .lean();

    if (!stuckCerts.length) {
      return;
    }

    this.logger.warn(
      `Found ${stuckCerts.length} stuck pending certificate(s), re-enqueuing...`,
    );

    for (const cert of stuckCerts) {
      const userId = cert.user_id.toString();
      const courseId = cert.course_id.toString();
      const certId = (cert as any)._id.toString();
      const jobId = `cert:${userId}:${courseId}`;

      try {
        // Check if this job already exists in the queue
        const existingJob = await this.certificateQueue.getJob(jobId);

        if (existingJob) {
          const state = await existingJob.getState();
          if (
            state === 'active' ||
            state === 'waiting' ||
            state === 'delayed'
          ) {
            this.logger.debug(
              `Job ${jobId} still in queue (state: ${state}), skipping re-enqueue`,
            );
            continue;
          }
          // Job exists but is completed/failed — remove it so we can re-add
          await existingJob.remove();
        }

        await this.certificateQueue.add(
          GENERATE_CERTIFICATE_JOB,
          { userId, courseId, certificateId: certId } as CertificateJobPayload,
          {
            jobId,
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: { count: 100 },
            removeOnFail: false,
          },
        );

        this.logger.log(
          `Re-enqueued stuck certificate ${certId} (job ${jobId})`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to re-enqueue stuck certificate ${certId}`,
          error,
        );
      }
    }
  }
}
