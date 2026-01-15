import { Module, OnModuleInit } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { registerEnumType } from '@nestjs/graphql';
import { ADMIN_ROLES } from 'src/enum/roles';

@Module({
  imports: [
    MongooseModule.forFeature(SCHEMAS),
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
  providers: [AdminResolver, AdminService],
  exports: [AdminService],
})
export class AdminModule implements OnModuleInit {
  constructor(private readonly adminService: AdminService) {
    registerEnumType(ADMIN_ROLES, { name: 'ADMIN_ROLES' });
  }
  async onModuleInit() {
    await this.adminService.createDefaultAdmin();
  }
}
