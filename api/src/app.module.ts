import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { envSchema } from './config/schema';
import { MongooseModule } from '@nestjs/mongoose';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { OtpModule } from './otp/otp.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtHelper } from './helper/jwtHelper';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AdminModule } from './admin/admin.module';
import { InstructorModule } from './instructor/instructor.module';
import { CategoryModule } from './category/category.module';
// import { CommonModule } from './common/common.module';
import { CourseModule } from './course/course.module';
import { CourseModuleModule } from './course-module/course-module.module';
import { LessonModule } from './lesson/lesson.module';
import { UploadsGateway } from './uploads/uploads.gateway';
import { UploadsModule } from './uploads/uploads.module';
import { OrdersModule } from './orders/orders.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { PaymentModule } from './payment/payment.module';
import { LessonProgressModule } from './lesson-progress/lesson-progress.module';
import { QuizModule } from './quiz/quiz.module';
import { QuizQuestionModule } from './quiz-question/quiz-question.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: envSchema,
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get('database.url'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: true, // needed for sandbox
      playground: false,
      csrfPrevention: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }) => ({ req, res }),
    }),
    OtpModule,
    UserModule,
    AuthModule,
    AdminModule,
    InstructorModule,
    CategoryModule,
    CourseModule,
    CourseModuleModule,
    LessonModule,
    UploadsModule,
    OrdersModule,
    EnrollmentModule,
    PaymentModule,
    LessonProgressModule,
    QuizModule,
    QuizQuestionModule,
    // CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtHelper,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UploadsGateway,
  ],
})
export class AppModule { }
