import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LessonDocument = HydratedDocument<Lesson>;

@Schema({ timestamps: true })
@ObjectType()
export class Lesson {
  @Field(() => ID)
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'CourseModule', required: true })
  @Field(() => ID)
  module_id: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  title: string;

  @Prop({ type: String, default: null })
  @Field({ nullable: true })
  video_url?: string;

  @Prop({ type: String, default: null })
  @Field({ nullable: true })
  pdf_url?: string;

  @Prop({ type: String })
  @Field({ nullable: true })
  content?: string;

  @Prop({ type: Number, required: true })
  @Field(() => Int)
  order: number;

  @Prop({ type: Number, required: true })
  @Field(() => Int)
  duration_minutes: number;

  @Prop({ type: Boolean, default: false })
  @Field(() => Boolean)
  is_preview: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
