import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CertificateDocument = HydratedDocument<Certificate>;

export enum CERTIFICATE_STATUS {
  PENDING = 'pending',
  ISSUED = 'issued',
  FAILED = 'failed',
}

registerEnumType(CERTIFICATE_STATUS, {
  name: 'CERTIFICATE_STATUS',
});

@Schema({ timestamps: true })
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

  @Prop({ type: String, default: '' })
  @Field(() => String)
  certificate_url: string;

  @Prop({
    type: String,
    enum: CERTIFICATE_STATUS,
    default: CERTIFICATE_STATUS.PENDING,
  })
  @Field(() => String)
  status: CERTIFICATE_STATUS;

  @Prop({ type: Date, default: null })
  @Field(() => Date, { nullable: true })
  issued_at: Date | null;

  @Prop({ type: String, default: null })
  @Field(() => String, { nullable: true })
  error_message: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);

// Partial unique index: at most ONE pending/issued certificate per user-course pair
CertificateSchema.index(
  { user_id: 1, course_id: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: [CERTIFICATE_STATUS.PENDING, CERTIFICATE_STATUS.ISSUED] },
    },
  },
);
