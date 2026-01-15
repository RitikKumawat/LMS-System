import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class CreateLessonInput {
  @Field(() => ID)
  module_id: Types.ObjectId;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  document_url?: string;

  @Field(() => String)
  content: string;

  @Field(() => String, { nullable: true })
  video_url: string;

  @Field(() => ID, { nullable: true })
  lesson_id: string;

  @Field(() => Boolean)
  is_preview: boolean;

  @Field(() => Int)
  duration_minutes: number;
}

@InputType()
export class ReorderLessonInput {
  @Field(() => String)
  moduleId: string;

  @Field(() => [String])
  lessonIds: string[];
}
