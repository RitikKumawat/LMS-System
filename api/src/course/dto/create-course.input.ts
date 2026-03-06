import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { COURSE_LEVEL } from 'src/enum/courseLevel';
import { Paginated } from 'src/utils/pagination.util';
import { CourseResponse } from '../entities/course.entity';

@InputType()
export class CreateCourseInput {
  @Field(() => Int)
  price: number;

  @Field(() => String, { nullable: true })
  courseId: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  thumbnail_url?: string;

  @Field(() => String)
  description: string;

  @Field(() => COURSE_LEVEL)
  level: COURSE_LEVEL;

  @Field(() => String)
  language: string;

  @Field(() => String)
  category_id: string;
}

@ObjectType()
export class PaginatedCourse extends Paginated(CourseResponse) { }

@InputType()
export class CourseFilters {
  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => COURSE_LEVEL, { nullable: true })
  level?: COURSE_LEVEL;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => Boolean, { nullable: true })
  isPublished?: boolean;

  @Field(() => Boolean, { nullable: true })
  isPurchased?: boolean;
}
