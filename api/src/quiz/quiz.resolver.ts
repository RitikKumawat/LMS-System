import { Args, Mutation, Query, Resolver, Context, Int } from '@nestjs/graphql';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuizResponse, SubmitQuizAttemptResponse } from './entity/quiz.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES, USER_ROLES } from 'src/enum/roles';
import { Quiz } from 'src/schemas/quiz.schema';

@Resolver()
export class QuizResolver {
  constructor(private readonly quizService: QuizService) { }

  @Mutation(() => CreateQuizResponse)
  @Roles(ADMIN_ROLES.INSTRUCTOR)
  createQuiz(@Args('createQuizInput') args: CreateQuizDto): Promise<CreateQuizResponse> {
    return this.quizService.createQuiz(args);
  }

  @Query(() => Quiz)
  @Roles(ADMIN_ROLES.INSTRUCTOR, ADMIN_ROLES.ADMIN)
  getQuizById(@Args('quizId') quizId: string): Promise<Quiz> {
    return this.quizService.getQuizById(quizId);
  }

  @Mutation(() => String)
  @Roles(ADMIN_ROLES.INSTRUCTOR)
  deleteQuiz(
    @Args('quiz_id')
    quiz_id: string,
  ) {
    return this.quizService.deleteQuiz(quiz_id);
  }

  @Query(() => Quiz)
  @Roles(USER_ROLES.USER)
  getQuizForStudent(@Args('quizId') quizId: string): Promise<Quiz> {
    return this.quizService.getQuizById(quizId);
  }

  @Mutation(() => SubmitQuizAttemptResponse)
  @Roles(USER_ROLES.USER)
  submitQuizAttempt(
    @Context() ctx,
    @Args('quizId') quizId: string,
    @Args('score', { type: () => Int }) score: number,
  ): Promise<SubmitQuizAttemptResponse> {
    return this.quizService.submitQuizAttempt(ctx.req, quizId, score);
  }
}
