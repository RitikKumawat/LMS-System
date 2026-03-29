import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ENROLLMENT_STATUS } from 'src/enum/enrollmentStatus';
import { PaymentStatus } from 'src/enum/paymentStatus';

@ObjectType()
export class EnrollmentDetails {
    @Field(() => ID)
    user_id: string;

    @Field(() => ID)
    course_id: string;

    @Field()
    student_email: string;

    @Field()
    student_name: string;

    @Field()
    course_name: string;

    @Field(() => ENROLLMENT_STATUS)
    status: ENROLLMENT_STATUS;

    @Field(() => Date)
    enrolled_at: Date;

    @Field(() => PaymentStatus, { nullable: true })
    payment_status?: PaymentStatus;

    @Field({ nullable: true })
    method?: string;

    @Field(() => ID, { nullable: true })
    payment_id?: string;

    @Field(() => Int)
    course_progress_percentage: number;
}

import { InputType } from '@nestjs/graphql';

@InputType()
export class EnrollmentFiltersInput {
    @Field({ nullable: true })
    search?: string;

    @Field(() => PaymentStatus, { nullable: true })
    payment_status?: PaymentStatus;

    @Field(() => ENROLLMENT_STATUS, { nullable: true })
    enrollment_status?: ENROLLMENT_STATUS;
}

@ObjectType()
export class PaginatedEnrollments {
    @Field(() => [EnrollmentDetails])
    docs: EnrollmentDetails[];

    @Field(() => Int)
    totalDocs: number;

    @Field(() => Int)
    limit: number;

    @Field(() => Int)
    totalPages: number;

    @Field(() => Int)
    page: number;

    @Field(() => Boolean)
    hasNextPage: boolean;

    @Field(() => Boolean)
    hasPrevPage: boolean;
}
