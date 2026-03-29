import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Certificate, CERTIFICATE_STATUS } from '../schemas/certificate.schema';
import { User } from '../schemas/user.schema';
import { Course } from '../schemas/course.schema';
import { CertificateTemplate } from '../schemas/certificate-template.schema';
import { PdfGeneratorService } from './pdf-generator.service';
import { CertificateJobPayload } from './certificate-generation.types';
import { CERTIFICATE_QUEUE_NAME, GENERATE_CERTIFICATE_JOB } from './constants';
import sendMail from '../utils/sendEmail.utils';
import { Enrollment } from 'src/schemas/enrollment.schema';

@Processor(CERTIFICATE_QUEUE_NAME)
export class CertificateGenerationProcessor {
  private readonly logger = new Logger(CertificateGenerationProcessor.name);

  constructor(
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
    @InjectModel(CertificateTemplate.name)
    private readonly certificateTemplateModel: Model<CertificateTemplate>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,
    private readonly configService: ConfigService,
    private readonly pdfGenerator: PdfGeneratorService,
  ) {}

  @Process(GENERATE_CERTIFICATE_JOB)
  async process(job: Job<CertificateJobPayload>): Promise<void> {
    const { userId, courseId, certificateId } = job.data;

    this.logger.log(
      `Processing certificate generation for user ${userId}, course ${courseId}`,
    );

    try {
      // 1. Load data
      const [certificate, user, course] = await Promise.all([
        this.certificateModel.findById(certificateId),
        this.userModel.findById(userId).lean(),
        this.courseModel.findById(courseId).lean(),
      ]);

      if (!certificate) {
        throw new Error(`Certificate ${certificateId} not found`);
      }

      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      if (!course) {
        throw new Error(`Course ${courseId} not found`);
      }

      // 2. Find the certificate template assigned to this course
      if (!(course as any).certificate_template_id) {
        throw new Error(
          `Course ${courseId} does not have a certificate template assigned.`,
        );
      }

      const template = await this.certificateTemplateModel
        .findById((course as any).certificate_template_id)
        .lean();

      if (!template) {
        throw new Error(
          `Certificate template ${(course as any).certificate_template_id} not found for course ${courseId}.`,
        );
      }

      // 3. Prepare placeholders
      const placeholders: Record<string, string> = {
        student_name: user.name,
        course_title: course.title,
        issue_date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        // Retaining old ones for backwards compatibility
        name: user.name,
        Name: user.name,
        courseName: course.title,
        'Course Name': course.title,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        Date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };

      // 4. Generate PDF
      this.logger.log(`Generating PDF for certificate ${certificateId}`);
      const pdfBuffer = await this.pdfGenerator.generateCertificatePDF(
        template.fabric_json,
        template.background_url || null,
        placeholders,
      );

      // 5. Save PDF to uploads/certificates
      const uploadsPath = this.configService.get<string>(
        'certificate.uploadsPath',
        './uploads/certificates',
      );

      if (!existsSync(uploadsPath)) {
        mkdirSync(uploadsPath, { recursive: true });
      }

      const filename = `${certificateId}.pdf`;
      const filePath = join(uploadsPath, filename);
      writeFileSync(filePath, pdfBuffer);

      const baseUrl = this.configService.get<string>('app.baseUrl');
      const certificateUrl = `${baseUrl}/uploads/certificates/${filename}`;

      this.logger.log(`Certificate PDF saved: ${certificateUrl}`);

      // 6. Update certificate record
      certificate.certificate_url = certificateUrl;
      certificate.status = CERTIFICATE_STATUS.ISSUED;
      certificate.issued_at = new Date();
      certificate.error_message = null;
      await certificate.save();

      this.logger.log(`Certificate ${certificateId} marked as issued`);

      // 7. Send email notification
      await this.sendCertificateEmail(
        user.email,
        user.name,
        course.title,
        certificateUrl,
      ).then(async () => {
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

      this.logger.log(
        `Certificate generation completed for user ${userId}, course ${courseId}`,
      );
    } catch (error) {
      const errorMsg = error?.message || 'Unknown error';
      const errorStack = error?.stack || '';

      this.logger.error(
        `Certificate generation FAILED for cert=${certificateId} user=${userId} course=${courseId}: ${errorMsg}`,
      );
      this.logger.error(`Stack trace: ${errorStack}`);

      // Update certificate with detailed error info
      try {
        await this.certificateModel.findByIdAndUpdate(certificateId, {
          status: CERTIFICATE_STATUS.FAILED,
          error_message: `${errorMsg}\n\nStack: ${errorStack}`,
        });
        this.logger.warn(
          `Certificate ${certificateId} marked as FAILED: ${errorMsg}`,
        );
      } catch (updateError) {
        this.logger.error(
          'Failed to update certificate error status',
          updateError,
        );
      }

      throw error; // Re-throw to trigger retry
    }
  }

  async sendCertificateEmail(
    email: string,
    userName: string,
    courseTitle: string,
    certificateUrl: string,
  ): Promise<void> {
    const subject = this.configService.get<string>(
      'certificate.emailSubject',
      'Your Course Completion Certificate',
    );

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              <p>
                Congratulations on successfully completing <strong>${courseTitle}</strong>!
              </p>
              <p>
                We're proud of your dedication and hard work. Your certificate of completion
                is now ready and available for download.
              </p>
              <p style="text-align: center;">
                <a href="${certificateUrl}" class="button" target="_blank">
                  Download Your Certificate
                </a>
              </p>
              <p>
                You can access your certificate anytime from your dashboard or by clicking
                the link above.
              </p>
              <p>Best regards,<br>The LMS Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await sendMail({
        to: email,
        subject,
        html,
      });
      this.logger.log(`Certificate email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send certificate email to ${email}`, error);
      // Don't throw - email failure shouldn't fail the job
    }
  }
}
