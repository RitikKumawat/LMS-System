import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ENROLLMENT_STATUS } from 'src/enum/enrollmentStatus';

export type EnrollmentDocument = HydratedDocument<Enrollment>;

@Schema({ timestamps: { createdAt: 'enrolled_at', updatedAt: false } })
@ObjectType()
export class Enrollment {
  @Field(() => ID)
  _id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  @Field(() => String)
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Course' })
  @Field(() => String)
  course_id: Types.ObjectId;

  @Prop({
    type: String,
    enum: ENROLLMENT_STATUS,
    default: ENROLLMENT_STATUS.ACTIVE,
  })
  @Field(() => String)
  status: ENROLLMENT_STATUS; // active | cancelled | refunded

  @Prop({ type: Types.ObjectId, ref: 'Payment', default: null })
  @Field(() => String, { nullable: true })
  payment_id: Types.ObjectId;

  @Field(() => Date)
  enrolled_at: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
