import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly authGuard: AuthGuard) {}

  async canActivate(context: ExecutionContext) {
    try {
      return await this.authGuard.canActivate(context);
    } catch (err: any) {
      throw new WsException(err.message || 'Unauthorized');
    }
  }
}
