import { Module } from '@nestjs/common';
import { QuizQuestionResolver } from './quiz-question.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';
import { QuizQuestionService } from './quiz-question.service';
import { registerEnumType } from '@nestjs/graphql';
import { QUIZ_QUESTION_TYPE } from 'src/enum/quizQuestionType';

@Module({
    imports: [
        MongooseModule.forFeature(SCHEMAS),
    ],
    providers: [QuizQuestionResolver, QuizQuestionService],
})
export class QuizQuestionModule {
    constructor() {
        registerEnumType(QUIZ_QUESTION_TYPE, {
            name: 'QUIZ_QUESTION_TYPE',
        });
    }
}
