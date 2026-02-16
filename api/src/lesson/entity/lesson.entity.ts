import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { LESSON_STATUS } from 'src/enum/lessonStatus';

@ObjectType()
export class LessonResponse {
  @Field(() => ID)
  _id: string;

  @Field()
  title: string;

  @Field(() => Int)
  order: number;

  @Field({ nullable: true })
  video_url?: string;

  @Field({ nullable: true })
  pdf_url?: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => Int)
  duration_minutes: number;

  @Field()
  is_preview: boolean;
}


@ObjectType()
export class LessonForStudentResponse {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  title: string;

  @Field(() => Int)
  order: number;

  @Field(() => String, { nullable: true })
  lesson_type?: string;

  @Field(() => Int)
  duration_minutes: number;

  @Field(() => Boolean)
  isUnlocked: boolean;

  @Field(() => LESSON_STATUS, { nullable: true })
  status?: LESSON_STATUS;
}
@ObjectType()
export class LessonProgressUpdate {
  @Field(() => ID)
  _id: string;

  @Field(() => LESSON_STATUS)
  status?: LESSON_STATUS;
}


@ObjectType()
export class LessonDetails {
  @Field(() => ID)
  _id: string;

  @Field(() => LESSON_STATUS)
  status: LESSON_STATUS;

  @Field(() => LessonResponse)
  lesson: LessonResponse;
}
