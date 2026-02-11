import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LESSON_STATUS } from 'src/enum/lessonStatus';

export type LessonProgressDocument = HydratedDocument<LessonProgress>;

@Schema({ timestamps: { createdAt: false, updatedAt: false } })
@ObjectType()
export class LessonProgress {
  @Field(() => ID)
  _id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Lesson' })
  @Field(() => String)
  lesson_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  @Field(() => String)
  user_id: string;

  @Prop({
    type: String,
    enum: LESSON_STATUS,
    default: LESSON_STATUS.NOT_STARTED,
  })
  @Field(() => String)
  status: LESSON_STATUS;

  @Prop({ type: Date, default: null })
  @Field(() => Date, { nullable: true })
  completed_at: Date | null;

  @Prop({ type: Date, default: null })
  @Field(() => Date, { nullable: true })
  last_accessed_at: Date | null;
}

export const LessonProgressSchema =
  SchemaFactory.createForClass(LessonProgress);
