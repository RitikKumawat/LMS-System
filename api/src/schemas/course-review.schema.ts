import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CourseReviewDocument = HydratedDocument<CourseReview>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
@ObjectType()
export class CourseReview {
  @Field(() => ID)
  _id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  @Field(() => String)
  user_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Course' })
  @Field(() => String)
  course_id: string;

  @Prop({ type: Number, min: 1, max: 5, required: true })
  @Field(() => Int)
  rating: number;

  @Prop({ required: false })
  @Field(() => String, { nullable: true })
  comment?: string;

  @Field(() => Date)
  created_at: Date;
}

export const CourseReviewSchema = SchemaFactory.createForClass(CourseReview);
