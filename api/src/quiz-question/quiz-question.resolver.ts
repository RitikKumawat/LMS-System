import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuizQuestionService } from './quiz-question.service';
import { CreateQuizQuestionInput } from './dto/create-quiz-question.dto';
import { QuizQuestion } from 'src/schemas/quiz-question.schema';

@Resolver()
export class QuizQuestionResolver {
    constructor(private readonly quizQuestionService: QuizQuestionService) { }

    @Mutation(() => QuizQuestion)
    createQuizQuestion(@Args('createQuizQuestionInput') createQuizQuestionInput: CreateQuizQuestionInput) {
        return this.quizQuestionService.create(createQuizQuestionInput);
    }

    @Query(() => [QuizQuestion], { name: 'getQuizQuestionsByQuizId' })
    findAll(@Args('quizId', { type: () => String }) quizId: string) {
        return this.quizQuestionService.findAllByQuizId(quizId);
    }

    @Query(() => QuizQuestion, { name: 'quizQuestion' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.quizQuestionService.findOne(id);
    }

    @Mutation(() => QuizQuestion)
    removeQuizQuestion(@Args('id', { type: () => String }) id: string) {
        return this.quizQuestionService.remove(id);
    }
}
