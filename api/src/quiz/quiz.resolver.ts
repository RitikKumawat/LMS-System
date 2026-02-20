import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuizResponse } from './entity/quiz.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES } from 'src/enum/roles';
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
}
