// src/lib/razorpay.provider.ts
import Razorpay from 'razorpay';
import { ConfigService } from '@nestjs/config';

export const RazorpayProvider = {
    provide: 'RAZORPAY',
    useFactory: (configService: ConfigService): Razorpay => {
        const keyId = configService.get<string>('RAZORPAY_KEY_ID');
        const keySecret = configService.get<string>('RAZORPAY_KEY_SECRET');

        if (!keyId || !keySecret) {
            throw new Error('Razorpay keys are missing');
        }

        return new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
    },
    inject: [ConfigService],
};