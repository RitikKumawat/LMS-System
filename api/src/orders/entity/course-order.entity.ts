import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CourseOrderResponse {
    @Field(() => ID)
    order_id: string;

    @Field(() => Number)
    amount: number;

    @Field(() => String)
    currency: string;

    @Field(() => String)
    razorpay_order_id: string;

    @Field(() => String)
    status: string;
}