import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { RazorpayProvider } from 'src/lib/razorpay.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';

@Module({
  imports: [MongooseModule.forFeature(SCHEMAS)],
  providers: [PaymentResolver, PaymentService, RazorpayProvider],
})
export class PaymentModule { }
