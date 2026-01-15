import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CourseModuleDocument = HydratedDocument<CourseModule>;

@Schema({ timestamps: true })
@ObjectType()
export class CourseModule {
  @Field(() => ID)
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  @Field(() => ID)
  course_id: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  title: string;

  @Prop({ type: String })
  @Field({ nullable: true })
  description?: string;

  @Prop({ type: Number, required: true })
  @Field(() => Int)
  order: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const CourseModuleSchema = SchemaFactory.createForClass(CourseModule);
