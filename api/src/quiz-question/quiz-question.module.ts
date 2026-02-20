import { Module } from '@nestjs/common';
import { QuizQuestionResolver } from './quiz-question.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';
import { QuizQuestionService } from './quiz-question.service';

@Module({
    imports: [
        MongooseModule.forFeature(SCHEMAS),
    ],
    providers: [QuizQuestionResolver, QuizQuestionService],
})
export class QuizQuestionModule { }
