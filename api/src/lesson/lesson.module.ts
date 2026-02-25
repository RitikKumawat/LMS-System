import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { LessonProgressService } from 'src/lesson-progress/lesson-progress.service';

@Module({
  imports: [MongooseModule.forFeature(SCHEMAS)],
  providers: [LessonResolver, LessonService, EnrollmentService, LessonProgressService],
})
export class LessonModule { }
