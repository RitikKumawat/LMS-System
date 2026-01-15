import { ObjectType, Field, ID } from '@nestjs/graphql';
import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CategoryDocument = HydratedDocument<Category>;
@Schema({ timestamps: true })
@ObjectType()
export class Category {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  @Field()
  slug: string;

  @Prop({ required: true })
  @Field()
  imageUrl: string;

  @Prop({ type: Date })
  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date)
  createdAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
