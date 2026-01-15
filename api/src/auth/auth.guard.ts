import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { AdminService } from 'src/admin/admin.service';
import { CONSTANTS } from 'src/constants/index.constants';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES, USER_ROLES } from 'src/enum/roles';
import { JwtHelper } from 'src/helper/jwtHelper';
import { InstructorService } from 'src/instructor/instructor.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly instructorService: InstructorService,
    private readonly reflector: Reflector,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    const ctx: Request =
      context.getType() === 'http'
        ? context.switchToHttp().getRequest()
        : context.getType() === 'ws'
          ? context.switchToWs().getClient().handshake
          : GqlExecutionContext.create(context).getContext().req;
    if (isPublic) {
      return true;
    }
    const panelRole = ctx.headers?.['x-panel-role'];
    if (!panelRole) {
      throw new ForbiddenException({
        message: 'Unauthorized access',
        error: 'Unauthorized',
        statusCode: 403,
      });
    }
    const panel = atob(panelRole.toString());
    let token: string;

    switch (panel) {
      case 'admin':
        token = ctx.cookies[CONSTANTS.ADMIN_TOKEN];
        break;
      case 'user':
        token = ctx.cookies[CONSTANTS.USER_TOKEN];
        break;
      // case 'instructor':
      //   token = ctx.cookies[CONSTANTS.INSTRUCTOR_TOKEN];
      //   break;
      default:
        throw new ForbiddenException('Unauthorized access');
    }

    if (!token) {
      throw new ForbiddenException({
        message: 'Unauthorized user',
        error: 'Unauthorized',
        statusCode: 403,
      });
    }
    const roles = this.reflector.get<USER_ROLES[] | ADMIN_ROLES[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    try {
      const user = this.jwtHelper.validateToken(token);

      ctx.user = user;

      if (roles && roles.length > 0) {
        const hasRole = roles.some(
          (role: ADMIN_ROLES | USER_ROLES) => user.roles === role,
        );
        if (!hasRole) {
          throw new ForbiddenException({
            message: 'Unauthorized role',
            error: 'Forbidden',
            statusCode: 403,
          });
        }
      }

      if (user.roles === USER_ROLES.USER) {
        const userData = await this.userService.getProfileData(user.id);

        if (!userData) {
          throw new ForbiddenException({
            message: 'Unauthorized role',
            error: 'Forbidden',
            statusCode: 403,
          });
        }
      }

      if (user.roles === ADMIN_ROLES.INSTRUCTOR) {
        const userData = await this.adminService.getAdminData(user.id);

        if (!userData) {
          throw new ForbiddenException({
            message: 'Unauthorized role',
            error: 'Forbidden',
            statusCode: 403,
          });
        }
      }
      if (user.roles === ADMIN_ROLES.ADMIN) {
        const userData = await this.adminService.getAdminData(user.id);

        if (!userData) {
          throw new ForbiddenException({
            message: 'Unauthorized role',
            error: 'Forbidden',
            statusCode: 403,
          });
        }
      }
      return true;
    } catch (error) {
      console.error('Invalid Token:', error.message);
      throw new ForbiddenException({
        message: error.message,
        error: 'Unauthorized',
        statusCode: 403,
      });
    }
  }
}
