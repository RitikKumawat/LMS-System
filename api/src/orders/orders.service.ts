import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'src/schemas/order.schema';
import mongoose, { Model, Types } from 'mongoose';
import { Course } from 'src/schemas/course.schema';
import { CourseOrderResponse } from './entity/course-order.entity';
import { Request } from 'express';
import { OrderStatus } from 'src/enum/orderStatus';
import * as crypto from 'crypto';
import { PaymentService } from 'src/payment/payment.service';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { PaymentStatus } from 'src/enum/paymentStatus';
import Razorpay from 'razorpay';
@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<Order>,
        @InjectModel(Course.name) private readonly courseModel: Model<Course>,

        private readonly paymentService: PaymentService,
        private readonly enrollmentService: EnrollmentService,

        @Inject('RAZORPAY')
        private readonly razorpay: Razorpay,
    ) { }

    async create(
        req: Request,
        course_id: string,
    ): Promise<CourseOrderResponse> {
        const session = await this.orderModel.db.startSession();
        session.startTransaction();

        try {
            const user = req.user;

            /* ===================== 1️⃣ Validate course ===================== */

            const course = await this.courseModel
                .findById(course_id)
                .session(session);

            if (!course) {
                throw new Error('Course not found');
            }

            if (course.price <= 0) {
                throw new Error('Free course should not create Razorpay order');
            }

            /* ===================== 2️⃣ Check existing DB order ===================== */

            const existingOrder = await this.orderModel.findOne({
                user_id: user.id,
                course_id: course._id,
                status: OrderStatus.CREATED,
            }).session(session);

            if (existingOrder) {
                try {
                    // 🔍 Check Razorpay-side truth
                    const rpOrder = await this.razorpay.orders.fetch(
                        existingOrder.razorpay_order_id,
                    );

                    // ✅ Safe to reuse ONLY if Razorpay says "created"
                    if (rpOrder.status === 'created') {
                        await session.commitTransaction();

                        return {
                            order_id: existingOrder._id,
                            amount: existingOrder.amount,
                            currency: existingOrder.currency,
                            razorpay_order_id: existingOrder.razorpay_order_id,
                            status: existingOrder.status,
                        };
                    }

                    // ❌ Not reusable → expire DB order
                    await this.orderModel.updateOne(
                        { _id: existingOrder._id },
                        { status: OrderStatus.EXPIRED },
                        { session },
                    );
                } catch {
                    // Razorpay order not found / invalid → expire DB order
                    await this.orderModel.updateOne(
                        { _id: existingOrder._id },
                        { status: OrderStatus.EXPIRED },
                        { session },
                    );
                }
            }

            /* ===================== 3️⃣ Create NEW Razorpay order ===================== */

            const razorpayOrder = await this.razorpay.orders.create({
                amount: Math.round(Number(course.price) * 100), // paise
                currency: 'INR',
                receipt: `order_${Date.now()}`,
                notes: {
                    user_id: user.id,
                    course_id: course._id,
                },
            });

            /* ===================== 4️⃣ Persist new order ===================== */

            const [order] = await this.orderModel.create(
                [
                    {
                        user_id: user.id,
                        course_id: course._id,
                        amount: razorpayOrder.amount,
                        currency: razorpayOrder.currency,
                        status: OrderStatus.CREATED,
                        razorpay_order_id: razorpayOrder.id,
                    },
                ],
                { session },
            );

            await session.commitTransaction();

            return {
                order_id: order._id,
                amount: order.amount,
                currency: order.currency,
                razorpay_order_id: order.razorpay_order_id,
                status: order.status,
            };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async findByRazorpayOrderId(razorpayOrderId: string) {
        return this.orderModel.findOne({
            razorpay_order_id: razorpayOrderId,
        });
    }

    async findById(id: string) {
        return this.orderModel.findById(id);
    }

    async updateStatus(orderId: Types.ObjectId, status: OrderStatus) {
        return this.orderModel.updateOne(
            { _id: orderId },
            { status },
        );
    }

    async updateByRazorpayOrderId(
        razorpayOrderId: string,
        status: OrderStatus,
    ) {
        return this.orderModel.updateOne(
            { razorpay_order_id: razorpayOrderId },
            { status },
        );
    }


    async handleRazorpayEvent(rawBody: Buffer, signature: string) {
        this.verifySignature(rawBody, signature);

        const payload = JSON.parse(rawBody.toString());
        const event = payload.event;

        switch (event) {
            case 'payment.captured':
                await this.handlePaymentCaptured(payload);
                break;

            case 'payment.failed':
                await this.handlePaymentFailed(payload);
                break;
        }

        return { received: true };
    }

    private verifySignature(rawBody: Buffer, signature: string) {
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(rawBody)
            .digest('hex');

        if (expectedSignature !== signature) {
            throw new UnauthorizedException('Invalid Razorpay signature');
        }
    }

    private async handlePaymentCaptured(payload: any) {
        const paymentEntity = payload.payload.payment.entity;

        const razorpayPaymentId = paymentEntity.id;
        const razorpayOrderId = paymentEntity.order_id;

        // prevent duplicate webhook processing
        const existingPayment =
            await this.paymentService.findByRazorpayPaymentId(
                razorpayPaymentId,
            );

        if (existingPayment) return;

        const order = await this.findByRazorpayOrderId(
            razorpayOrderId,
        );

        if (!order) return;

        const payment = await this.paymentService.create({
            order_id: new mongoose.Types.ObjectId(order._id),
            razorpay_payment_id: razorpayPaymentId,
            amount: paymentEntity.amount,
            method: paymentEntity.method,
            status: PaymentStatus.SUCCESS,
            raw_payload: payload,
            paid_at: new Date(paymentEntity.created_at * 1000),
        });

        await this.updateStatus(
            new mongoose.Types.ObjectId(order._id),
            OrderStatus.PAID,
        );

        await this.enrollmentService.create({
            user_id: order.user_id,
            course_id: order.course_id,
            payment_id: new mongoose.Types.ObjectId(payment._id),
        });
    }

    private async handlePaymentFailed(payload: any) {
        const paymentEntity = payload.payload.payment.entity;

        await this.updateByRazorpayOrderId(
            paymentEntity.order_id,
            OrderStatus.FAILED,
        );
    }
}
