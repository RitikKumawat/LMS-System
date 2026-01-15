import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuizAttemptDocument = HydratedDocument<QuizAttempt>;

@Schema({ timestamps: false })
@ObjectType()
export class QuizAttempt {
  @Field(() => ID)
  _id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Quiz' })
  @Field(() => String)
  quiz_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  @Field(() => String)
  user_id: string;

  @Prop({ type: Number, required: true })
  @Field(() => Int)
  score: number;

  @Prop({ type: Number, required: true })
  @Field(() => Int)
  attempt_number: number;

  @Prop({ type: Date, required: true })
  @Field(() => Date)
  started_at: Date;

  @Prop({ type: Date, required: true })
  @Field(() => Date)
  completed_at: Date;
}

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);
