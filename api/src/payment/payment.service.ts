import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from 'src/schemas/payment.schema';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    ) { }
    async findByRazorpayPaymentId(razorpayPaymentId: string) {
        return this.paymentModel.findOne({
            razorpay_payment_id: razorpayPaymentId,
        });
    }

    async create(data: Partial<Payment>) {
        const payment = new this.paymentModel(data);
        return payment.save();
    }
}
