import { Admin, AdminSchema } from './admin.schema';
import { Category, CategorySchema } from './category.schema';
import { Certificate, CertificateSchema } from './certificate.schema';
import { CourseModule, CourseModuleSchema } from './course-module.schema';
import { CourseReview, CourseReviewSchema } from './course-review.schema';
import { Course, CourseSchema } from './course.schema';
import { Enrollment, EnrollmentSchema } from './enrollment.schema';
import { LessonProgress, LessonProgressSchema } from './lesson-progress.schema';
import { Lesson, LessonSchema } from './lesson.schema';
import { Order, OrderSchema } from './order.schema';
import { Otp, OtpSchema } from './otp.schema';
import { Payment, PaymentSchema } from './payment.schema';
import { QuizAttempt, QuizAttemptSchema } from './quiz-attempt.schema';
import { Quiz, QuizSchema } from './quiz.schema';
import { User, UserSchema } from './user.schema';

export const SCHEMAS = [
  { name: User.name, schema: UserSchema },
  { name: Admin.name, schema: AdminSchema },
  { name: Otp.name, schema: OtpSchema },
  { name: Category.name, schema: CategorySchema },
  { name: Course.name, schema: CourseSchema },
  { name: Certificate.name, schema: CertificateSchema },
  { name: CourseModule.name, schema: CourseModuleSchema },
  { name: CourseReview.name, schema: CourseReviewSchema },
  { name: Enrollment.name, schema: EnrollmentSchema },
  { name: LessonProgress.name, schema: LessonProgressSchema },
  { name: Lesson.name, schema: LessonSchema },
  { name: QuizAttempt.name, schema: QuizAttemptSchema },
  { name: Quiz.name, schema: QuizSchema },
  { name: Order.name, schema: OrderSchema },
  { name: Payment.name, schema: PaymentSchema },
];
