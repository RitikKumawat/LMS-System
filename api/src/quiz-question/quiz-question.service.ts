import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateQuizQuestionInput } from './dto/create-quiz-question.dto';
import { QuizQuestion } from 'src/schemas/quiz-question.schema';

@Injectable()
export class QuizQuestionService {
    constructor(
        @InjectModel(QuizQuestion.name)
        private quizQuestionModel: Model<QuizQuestion>,
    ) { }

    async create(createQuizQuestionInput: CreateQuizQuestionInput) {
        if (createQuizQuestionInput.id) {
            return this.quizQuestionModel.findByIdAndUpdate(
                createQuizQuestionInput.id,
                {
                    quiz_id: new Types.ObjectId(createQuizQuestionInput.quiz_id),
                    question_text: createQuizQuestionInput.question_text,
                    type: createQuizQuestionInput.type,
                    options: createQuizQuestionInput.options,
                },
                { new: true }
            );
        }

        const createdQuestion = new this.quizQuestionModel({
            quiz_id: new Types.ObjectId(createQuizQuestionInput.quiz_id),
            question_text: createQuizQuestionInput.question_text,
            type: createQuizQuestionInput.type,
            options: createQuizQuestionInput.options,
        });
        return createdQuestion.save();
    }

    async findAllByQuizId(quizId: string) {
        return this.quizQuestionModel.find({ quiz_id: new Types.ObjectId(quizId) }).exec();
    }

    async findOne(id: string) {
        return this.quizQuestionModel.findById(id).exec();
    }

    async update(id: string, updateQuizQuestionInput: Partial<QuizQuestion>) { // Define UpdateDTO if needed
        return this.quizQuestionModel.findByIdAndUpdate(id, updateQuizQuestionInput, { new: true }).exec();
    }

    async remove(id: string) {
        return this.quizQuestionModel.findByIdAndDelete(id).exec();
    }
}
