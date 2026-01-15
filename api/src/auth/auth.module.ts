import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthGuard } from './auth.guard';
import { JwtHelper } from 'src/helper/jwtHelper';

import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';
import { InstructorModule } from 'src/instructor/instructor.module';

@Module({
  imports: [UserModule, AdminModule, InstructorModule],
  providers: [AuthResolver, AuthService, AuthGuard, JwtHelper],
  exports: [JwtHelper, AuthGuard],
})
export class AuthModule {}
