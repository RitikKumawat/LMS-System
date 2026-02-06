import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { COURSE_LEVEL } from 'src/enum/courseLevel';
import { Course } from 'src/schemas/course.schema';

@ObjectType()
export class CourseResponse {
  @Field(() => ID)
  _id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  thumbnail_url?: string;

  @Field({ nullable: true })
  category_name?: string; // ✅ flattened field

  @Field(() => String)
  level: COURSE_LEVEL;

  @Field()
  language: string;

  @Field(() => Float)
  price: number;

  @Field(() => Boolean)
  is_published: boolean;

  @Field(() => Date)
  createdAt: Date;
}


@ObjectType()
export class CourseWithEnrollment extends Course {
  @Field(() => Boolean)
  is_enrolled: boolean;
}
