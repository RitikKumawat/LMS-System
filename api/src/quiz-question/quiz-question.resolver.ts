import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuizQuestionService } from './quiz-question.service';
import { CreateQuizQuestionInput } from './dto/create-quiz-question.dto';
import { QuizQuestion } from 'src/schemas/quiz-question.schema';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES } from 'src/enum/roles';
import { Public } from 'src/decorators/public.decorator';

@Resolver()
export class QuizQuestionResolver {
    constructor(private readonly quizQuestionService: QuizQuestionService) { }

    @Roles(ADMIN_ROLES.INSTRUCTOR)
    @Mutation(() => QuizQuestion)
    createQuizQuestion(@Args('createQuizQuestionInput') createQuizQuestionInput: CreateQuizQuestionInput) {
        return this.quizQuestionService.create(createQuizQuestionInput);
    }

    @Public()
    @Query(() => [QuizQuestion], { name: 'getQuizQuestionsByQuizId' })
    findAll(@Args('quizId', { type: () => String }) quizId: string) {
        return this.quizQuestionService.findAllByQuizId(quizId);
    }

    @Public()
    @Query(() => QuizQuestion, { name: 'quizQuestion' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.quizQuestionService.findOne(id);
    }

    @Roles(ADMIN_ROLES.INSTRUCTOR)
    @Mutation(() => QuizQuestion)
    removeQuizQuestion(@Args('id', { type: () => String }) id: string) {
        return this.quizQuestionService.remove(id);
    }
}
