import { ObjectType, Field, ID } from '@nestjs/graphql';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AUTH_TYPE } from 'src/enum/authType';

export type OtpDocument = HydratedDocument<Otp>;
@Schema({ timestamps: true })
@ObjectType()
export class Otp {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  otp: string;

  @Prop({ required: true })
  @Field()
  email: string;

  @Prop({ required: true, enum: AUTH_TYPE })
  @Field(() => AUTH_TYPE)
  type: AUTH_TYPE;

  @Prop({ type: Date })
  @Field(() => Date)
  updateTime: Date;

  @Field(() => Date)
  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
