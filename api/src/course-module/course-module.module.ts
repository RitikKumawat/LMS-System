import { Module } from '@nestjs/common';
import { CourseModuleService } from './course-module.service';
import { CourseModuleResolver } from './course-module.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature(SCHEMAS), AuthModule],
  providers: [CourseModuleResolver, CourseModuleService],
})
export class CourseModuleModule { }
