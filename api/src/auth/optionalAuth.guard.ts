import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { JwtHelper } from 'src/helper/jwtHelper';
import { CONSTANTS } from 'src/constants/index.constants';

// This auth guard is used for routes that can be accessed by both authenticated and unauthenticated users.
// If the user is authenticated, the user object will be attached to the request.
// If the user is not authenticated, the user object will not be attached to the request.

//for example in the getCourseById we need a field is_enrolled to determine the user is enrolled or not 
@Injectable()
export class OptionalAuthGuard implements CanActivate {
    constructor(
        private readonly jwtHelper: JwtHelper,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx: Request =
            context.getType() === 'http'
                ? context.switchToHttp().getRequest()
                : context.getType() === 'ws'
                    ? context.switchToWs().getClient().handshake
                    : GqlExecutionContext.create(context).getContext().req;

        try {
            const panelRole = ctx.headers?.['x-panel-role'];
            if (!panelRole) return true; // 👈 guest

            const panel = atob(panelRole.toString());
            let token: string | undefined;

            switch (panel) {
                case 'admin':
                    token = ctx.cookies?.[CONSTANTS.ADMIN_TOKEN];
                    break;
                case 'user':
                    token = ctx.cookies?.[CONSTANTS.USER_TOKEN];
                    break;
                default:
                    return true; // unknown panel → treat as guest
            }

            if (!token) return true; // guest

            // ✅ Validate token and ATTACH user
            const user = this.jwtHelper.validateToken(token);
            ctx.user = user;
        } catch {
            // ❌ swallow all errors → guest mode
        }

        return true;
    }
}