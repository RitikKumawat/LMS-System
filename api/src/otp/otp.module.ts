import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpResolver } from './otp.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AUTH_TYPE } from 'src/enum/authType';
import { registerEnumType } from '@nestjs/graphql';

@Module({
  imports: [
    MongooseModule.forFeature(SCHEMAS),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret') ?? 'fallbackSecretKey',
        signOptions: {
          expiresIn: '365d',
        },
      }),
    }),
  ],
  providers: [OtpResolver, OtpService],
})
export class OtpModule {
  constructor() {
    registerEnumType(AUTH_TYPE, { name: 'AUTH_TYPE' });
  }
}
