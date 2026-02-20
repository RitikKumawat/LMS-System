import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from 'src/schemas/quiz.schema';
import { Model, Types } from 'mongoose';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuizResponse } from './entity/quiz.entity';

@Injectable()
export class QuizService {
    constructor(
        @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    ) { }
    async createQuiz(args: CreateQuizDto): Promise<CreateQuizResponse> {
        const { title, passing_score, courseModuleId, quizId } = args;
        if (quizId) {
            const updatedQuiz = await this.quizModel.findByIdAndUpdate(quizId, {
                $set: {
                    title,
                    passing_score,
                }
            }, { new: true });
            return {
                quiz_id: updatedQuiz._id
            };
        }
        const quiz = new this.quizModel({
            title,
            passing_score,
            module_id: new Types.ObjectId(courseModuleId),
        });
        await quiz.save();
        return {
            quiz_id: quiz._id,
        }
    }

    async getQuizById(quizId: string): Promise<Quiz> {
        if (!quizId) {
            throw new Error("Quiz Id is required");
        }
        const quiz = await this.quizModel.findById(quizId);
        if (!quiz) {
            throw new Error("Quiz not found");
        }
        return quiz;
    }

    async deleteQuiz(quiz_id: string): Promise<string> {
        if (!quiz_id) {
            throw new Error("Quiz Id is required");
        }
        const quiz = await this.quizModel.findByIdAndDelete(quiz_id);
        if (!quiz) {
            throw new Error("Quiz not found");
        }
        return "Quiz deleted successfully";
    }
}
