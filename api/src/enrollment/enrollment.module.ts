import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentResolver } from './enrollment.resolver';
import { RazorpayProvider } from 'src/lib/razorpay.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';

@Module({
  imports: [MongooseModule.forFeature(SCHEMAS)],
  providers: [EnrollmentResolver, EnrollmentService, RazorpayProvider],
})
export class EnrollmentModule { }
