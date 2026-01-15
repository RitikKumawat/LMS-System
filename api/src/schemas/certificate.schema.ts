import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CertificateDocument = HydratedDocument<Certificate>;

@Schema({ timestamps: { createdAt: 'issued_at', updatedAt: false } })
@ObjectType()
export class Certificate {
  @Field(() => ID)
  _id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  @Field(() => String)
  user_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Course' })
  @Field(() => String)
  course_id: string;

  @Prop({ required: true })
  @Field(() => String)
  certificate_url: string;

  @Field(() => Date)
  issued_at: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
