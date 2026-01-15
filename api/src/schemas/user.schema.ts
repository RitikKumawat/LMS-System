import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true, unique: true })
  @Field(() => String)
  email: string;

  @Prop({ default: false, type: Boolean })
  @Field(() => Boolean)
  emailVerified: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
