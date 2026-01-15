import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

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

  @Prop({ default: false })
  @Field(() => Boolean)
  is_completed: boolean;

  @Prop({ type: Date, default: null })
  @Field(() => Date, { nullable: true })
  completed_at: Date | null;
}

export const LessonProgressSchema =
  SchemaFactory.createForClass(LessonProgress);
