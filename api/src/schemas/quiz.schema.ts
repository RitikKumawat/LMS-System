import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
@ObjectType()
export class Quiz {
  @Field(() => ID)
  _id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'CourseModule' })
  @Field(() => String)
  module_id: string;

  @Prop({ required: true })
  @Field(() => String)
  title: string;

  @Prop({ required: true })
  @Field(() => Int)
  passing_score: number;

  @Field(() => Date)
  created_at: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
