import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PaymentStatus } from 'src/enum/paymentStatus';

export type PaymentDocument = HydratedDocument<Payment>;


@Schema({ timestamps: true })
@ObjectType()
export class Payment {
    @Field(() => ID)
    _id: string;

    @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
    @Field(() => ID)
    order_id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    @Field()
    razorpay_payment_id: string;

    @Prop({ required: false })
    @Field(() => String, { nullable: true })
    razorpay_signature?: string;

    @Prop({ type: Number, required: true })
    @Field(() => Int)
    amount: number;

    @Prop({ type: String })
    @Field({ nullable: true })
    method?: string; // UPI, CARD, NETBANKING

    @Prop({
        type: String,
        enum: PaymentStatus,
        required: true,
    })
    @Field(() => PaymentStatus)
    status: PaymentStatus;

    @Prop({ type: Object })
    raw_payload: Record<string, any>;

    @Prop({ type: Date })
    @Field({ nullable: true })
    paid_at?: Date;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);