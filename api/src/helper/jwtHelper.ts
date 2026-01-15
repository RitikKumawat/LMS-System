import * as jwt from 'jsonwebtoken';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtHelper {
  constructor(private readonly configService: ConfigService) {}

  private readonly secretKey =
    this.configService.get<string>('jwt.secret') ?? 'fallbackSecretKey';

  validateToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new ForbiddenException({
        message: 'Invalid or expired token',
        error: 'Unauthorized',
        statusCode: 403,
      });
    }
  }
}
