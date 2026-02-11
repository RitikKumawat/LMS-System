import { Resolver } from '@nestjs/graphql';
import { LessonProgressService } from './lesson-progress.service';

@Resolver()
export class LessonProgressResolver {
  constructor(private readonly lessonProgressService: LessonProgressService) {}
}
