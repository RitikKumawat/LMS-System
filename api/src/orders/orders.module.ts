import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';
import { RazorpayProvider } from 'src/lib/razorpay.provider';
import { PaymentService } from 'src/payment/payment.service';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { OrdersController } from './orders.controller';
import { LessonProgressService } from 'src/lesson-progress/lesson-progress.service';

@Module({
  imports: [MongooseModule.forFeature(SCHEMAS)],
  providers: [OrdersResolver, OrdersService, RazorpayProvider, PaymentService, EnrollmentService, LessonProgressService],
  controllers: [OrdersController]
})
export class OrdersModule { }
