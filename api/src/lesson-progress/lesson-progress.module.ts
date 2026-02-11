import { Module } from '@nestjs/common';
import { LessonProgressService } from './lesson-progress.service';
import { LessonProgressResolver } from './lesson-progress.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from 'src/schemas';

@Module({
  imports: [MongooseModule.forFeature(SCHEMAS)],
  providers: [LessonProgressResolver, LessonProgressService],
})
export class LessonProgressModule { }
