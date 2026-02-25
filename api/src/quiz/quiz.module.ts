import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizResolver } from './quiz.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';

import { LessonProgressService } from 'src/lesson-progress/lesson-progress.service';

@Module({
  imports: [MongooseModule.forFeature(SCHEMAS)],
  providers: [QuizResolver, QuizService, LessonProgressService],
})
export class QuizModule { }
