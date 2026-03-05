import { Context, Args, Query, Resolver } from '@nestjs/graphql';
import { EnrollmentService } from './enrollment.service';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES } from 'src/enum/roles';
import { PaginatedEnrollments, EnrollmentFiltersInput } from './entities/enrollment-details.entity';
import { PaginationInput } from 'src/category/pagination.dto';

@Resolver()
export class EnrollmentResolver {
  constructor(private readonly enrollmentService: EnrollmentService) { }

  @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.INSTRUCTOR)
  @Query(() => PaginatedEnrollments)
  async getAllEnrollments(
    @Context() ctx,
    @Args('paginationInput', { nullable: true }) paginationInput?: PaginationInput,
    @Args('filters', { nullable: true }) filters?: EnrollmentFiltersInput,
  ) {
    const input = paginationInput || { page: 1, limit: 10 };
    return this.enrollmentService.getAllEnrollments(ctx.req, input, filters);
  }
}
