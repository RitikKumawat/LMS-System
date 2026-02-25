import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from 'src/schemas/quiz.schema';
import { Model, Types } from 'mongoose';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuizResponse } from './entity/quiz.entity';

import { LessonProgressService } from 'src/lesson-progress/lesson-progress.service';

@Injectable()
export class QuizService {
    constructor(
        @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
        private readonly lessonProgressService: LessonProgressService,
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

    async submitQuizAttempt(req: any, quizId: string, score: number): Promise<CreateQuizResponse & { passed: boolean, score: number }> {
        if (!quizId) {
            throw new Error("Quiz Id is required");
        }
        const quiz = await this.quizModel.findById(quizId);
        if (!quiz) {
            throw new Error("Quiz not found");
        }

        // We do not have a QuizAttempt model imported here, but we can access it if we inject it or use mongoose.model.
        // Wait, MongooseModule.forFeature([ ... ]) doesn't have QuizAttempt here. 
        // We must dispatch the attempt creation. Let's use generic mongoose model to save it to avoid circular dependency or import issues.
        const QuizAttemptModel = this.quizModel.db.model('QuizAttempt');

        // Find previous attempts
        const previousAttemptsCount = await QuizAttemptModel.countDocuments({
            quiz_id: new Types.ObjectId(quizId),
            user_id: new Types.ObjectId(req.user.id),
        });

        const attempt = new QuizAttemptModel({
            quiz_id: new Types.ObjectId(quizId),
            user_id: new Types.ObjectId(req.user.id),
            score,
            attempt_number: previousAttemptsCount + 1,
            started_at: new Date(),
            completed_at: new Date(),
        });

        await attempt.save();
        const passed = score >= quiz.passing_score;

        if (passed) {
            await this.lessonProgressService.unlockNextLessonsByModuleId(req.user.id, quiz.module_id.toString());
        }

        return {
            quiz_id: quizId,
            score,
            passed,
        };
    }
}
