import { Module } from '@nestjs/common';
import { CourseModuleService } from './course-module.service';
import { CourseModuleResolver } from './course-module.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';

@Module({
  imports: [MongooseModule.forFeature(SCHEMAS)],
  providers: [CourseModuleResolver, CourseModuleService],
})
export class CourseModuleModule {}
