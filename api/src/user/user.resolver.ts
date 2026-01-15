import { Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from 'src/schemas/user.schema';
import { Roles } from 'src/decorators/roles.decorator';
import { USER_ROLES } from 'src/enum/roles';
import { Request, Response } from 'express';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @Roles(USER_ROLES.USER)
  async getProfileData(@Context() context: { req: Request }) {
    console.log('CONTEXT', context.req.user);
    return this.userService.getProfileData(context.req.user.id);
  }
  @Mutation(() => String)
  @Roles(USER_ROLES.USER)
  async userLogout(@Context() context: { res: Response }): Promise<string> {
    return this.userService.userLogout(context.res);
  }
}
