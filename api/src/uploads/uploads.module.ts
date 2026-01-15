import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { UploadsGateway } from './uploads.gateway';

import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';
import { InstructorModule } from 'src/instructor/instructor.module';
import { AuthModule } from 'src/auth/auth.module';
import { WsAuthGuard } from './uploads.gurad';

@Module({
  imports: [UserModule, AdminModule, InstructorModule, AuthModule],
  controllers: [UploadsController],
  providers: [UploadsService, UploadsGateway, WsAuthGuard],
})
export class UploadsModule {}
