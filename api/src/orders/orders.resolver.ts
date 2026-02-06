import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { USER_ROLES } from 'src/enum/roles';
import { Roles } from 'src/decorators/roles.decorator';
import { CourseOrderResponse } from './entity/course-order.entity';
import { Types } from 'mongoose';

@Resolver()
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) { }

  @Mutation(() => CourseOrderResponse)
  @Roles(USER_ROLES.USER)
  createCourseOrder(
    @Context() ctx,
    @Args('course_id') course_id: string,
  ): Promise<CourseOrderResponse> {
    return this.ordersService.create(ctx.req, course_id);
  }

  @Query(() => CourseOrderResponse)
  @Roles(USER_ROLES.USER)
  async getOrder(
    @Args('id') id: string,
  ): Promise<CourseOrderResponse> {
    // Try finding by Razorpay Order ID first
    let order = await this.ordersService.findByRazorpayOrderId(id);

    // If not found and id looks like a MongoID, try finding by internal ID
    if (!order && Types.ObjectId.isValid(id)) {
      order = await this.ordersService.findById(id);
    }

    if (!order) {
      throw new Error("Order not found");
    }

    return {
      order_id: order._id,
      amount: order.amount,
      currency: order.currency,
      razorpay_order_id: order.razorpay_order_id,
      status: order.status
    };
  }
}
