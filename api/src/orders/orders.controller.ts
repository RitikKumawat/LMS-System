import { Controller, Headers, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';

@Controller('webhooks')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Public()
    @Post('razorpay')
    async handleRazorpayWebhook(
        @Req() req: Request,
        @Headers('x-razorpay-signature') signature: string,
    ) {
        if (!signature) {
            throw new UnauthorizedException('Missing Razorpay signature');
        }

        return this.ordersService.handleRazorpayEvent(
            req.body as Buffer,
            signature,
        );
    }
}
