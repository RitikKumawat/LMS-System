import { Field, ID, Float, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { COURSE_LEVEL } from 'src/enum/courseLevel';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
@ObjectType()
export class Course {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  title: string;

  @Prop({ required: true, unique: true })
  @Field()
  slug: string;

  @Prop({ type: String })
  @Field({ nullable: true })
  description?: string;

  @Prop({ type: String })
  @Field()
  thumbnail_url: string;

  // Category reference
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  @Field(() => ID)
  category_id: string;

  @Prop({
    type: String,
    enum: COURSE_LEVEL,
    default: COURSE_LEVEL.BEGINNER,
  })
  @Field(() => String)
  level: COURSE_LEVEL;

  @Prop({ type: String })
  @Field()
  language: string;

  @Prop({ type: Number, default: 0 })
  @Field(() => Float)
  price: number;

  @Prop({ type: Boolean, default: false })
  @Field(() => Boolean)
  is_published: boolean;

  // FK: User who created the course
  @Prop({ type: Types.ObjectId, ref: 'Admin', required: true })
  @Field(() => ID)
  created_by: string;

  @Prop({ type: Date, default: null })
  @Field(() => Date, { nullable: true })
  published_at: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
