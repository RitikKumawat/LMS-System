import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OrderStatus } from 'src/enum/orderStatus';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
@ObjectType()
export class Order {
    @Field(() => ID)
    _id: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    @Field(() => ID)
    user_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    @Field(() => ID)
    course_id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    @Field()
    razorpay_order_id: string;

    // Stored in paise (₹499 = 49900)
    @Prop({ type: Number, required: true })
    @Field(() => Int)
    amount: number;

    @Prop({ default: 'INR' })
    @Field()
    currency: string;

    @Prop({
        type: String,
        enum: OrderStatus,
        default: OrderStatus.CREATED,
    })
    @Field(() => OrderStatus)
    status: OrderStatus;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);