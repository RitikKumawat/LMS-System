import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizResolver } from './quiz.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';

@Module({
  imports: [MongooseModule.forFeature(SCHEMAS)],
  providers: [QuizResolver, QuizService],
})
export class QuizModule { }
