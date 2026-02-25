import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { QUIZ_QUESTION_TYPE } from 'src/enum/quizQuestionType';

export type QuizQuestionDocument = HydratedDocument<QuizQuestion>;

@ObjectType()
class Options {
  @Field(() => String)
  option_text: string;

  @Field(() => Boolean)
  is_correct: boolean;
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
@ObjectType()
export class QuizQuestion {
  @Field(() => ID)
  _id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Quiz' })
  @Field(() => String)
  quiz_id: string;

  @Prop({ required: true })
  @Field(() => String)
  question_text: string;

  @Prop({ required: true, enum: QUIZ_QUESTION_TYPE })
  @Field(() => QUIZ_QUESTION_TYPE)
  type: QUIZ_QUESTION_TYPE; // e.g., "single", "multiple", "true_false"

  @Prop({ type: [Object], required: true })
  @Field(() => [Options])
  options: Options[];

  @Field(() => Date)
  created_at: Date;
}

export const QuizQuestionSchema = SchemaFactory.createForClass(QuizQuestion);
