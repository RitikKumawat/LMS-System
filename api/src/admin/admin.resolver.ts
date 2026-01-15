import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES } from 'src/enum/roles';
import { AdminLoginDto, CreateInstructorDto } from './dto/admin.dto';
import { Admin } from 'src/schemas/admin.schema';
import { Request, Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { AdminResponse } from './entity/admin.entity';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => AdminResponse)
  @Roles(ADMIN_ROLES.ADMIN)
  async createInstructor(
    @Args('input') input: CreateInstructorDto,
  ): Promise<Omit<Admin, 'password'>> {
    return this.adminService.createInstructor(input);
  }

  @Mutation(() => AdminResponse)
  @Public()
  async adminLogin(
    @Args('input') input: AdminLoginDto,
    @Context() context: { res: Response },
  ): Promise<Omit<Admin, 'password'>> {
    return this.adminService.adminLogin(input, context.res);
  }

  @Query(() => AdminResponse)
  @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.INSTRUCTOR)
  async getAdminData(
    @Context() context: { req: Request },
  ): Promise<Omit<Admin, 'password'>> {
    return this.adminService.getAdminData(context.req.user.id);
  }

  @Mutation(() => String)
  @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.INSTRUCTOR)
  async adminLogout(@Context() context: { res: Response }): Promise<string> {
    return this.adminService.adminLogout(context.res);
  }
}
