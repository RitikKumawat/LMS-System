import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { LessonResponse } from 'src/lesson/entity/lesson.entity';
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
}

@ObjectType()
export class PaginatedCourseModule extends Paginated(CourseModuleResponse) {}
