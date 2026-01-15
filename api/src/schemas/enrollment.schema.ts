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
  user_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Course' })
  @Field(() => String)
  course_id: string;

  @Prop({
    type: String,
    enum: ENROLLMENT_STATUS,
    default: ENROLLMENT_STATUS.ACTIVE,
  })
  @Field(() => String)
  status: ENROLLMENT_STATUS; // active | completed | cancelled

  @Field(() => Date)
  enrolled_at: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
