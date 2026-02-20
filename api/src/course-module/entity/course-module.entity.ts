import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { LessonForStudentResponse, LessonResponse } from 'src/lesson/entity/lesson.entity';
import { QuizResponse } from 'src/quiz/entity/quiz.entity';
import { Paginated } from 'src/utils/pagination.util';

@ObjectType()
export class CourseModuleResponse {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String)
  course_id: string;

  @Field(() => Int)
  order: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => [LessonResponse])
  lessons?: LessonResponse[];

  @Field(() => [QuizResponse])
  quizzes?: QuizResponse[];
}

@ObjectType()
export class PaginatedCourseModule extends Paginated(CourseModuleResponse) { }


@ObjectType()
export class CourseModuleForStudentResponse {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String)
  course_id: string;

  @Field(() => Int)
  order: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => [LessonForStudentResponse])
  lessons?: LessonForStudentResponse[];

  @Field(() => [QuizResponse])
  quizzes?: QuizResponse[];
}

@ObjectType()
export class PaginatedCourseModuleForStudent extends Paginated(CourseModuleForStudentResponse) { }
