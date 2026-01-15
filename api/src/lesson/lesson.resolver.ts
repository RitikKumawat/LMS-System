import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LessonService } from './lesson.service';
import { Lesson } from 'src/schemas/lesson.schema';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES } from 'src/enum/roles';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import {
  CreateLessonInput,
  ReorderLessonInput,
} from './dto/create-lesson.input';
import { LessonResponse } from './entity/lesson.entity';

@Resolver()
export class LessonResolver {
  constructor(private readonly lessonService: LessonService) {}

  @Mutation(() => Lesson)
  @Roles(ADMIN_ROLES.INSTRUCTOR)
  createLesson(
    @Context() ctx,
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
    @Args('document', { type: () => GraphQLUpload, nullable: true })
    document?: FileUpload,
  ): Promise<Lesson> {
    return this.lessonService.create(ctx.req, createLessonInput, document);
  }

  @Query(() => LessonResponse)
  @Roles(ADMIN_ROLES.INSTRUCTOR)
  getLessonById(@Args('lessonId') lessonId: string): Promise<LessonResponse> {
    return this.lessonService.getLessonById(lessonId);
  }

  @Mutation(() => Boolean)
  @Roles(ADMIN_ROLES.INSTRUCTOR)
  reorderLessons(
    @Args('reorderLessonInput')
    input: ReorderLessonInput,
  ) {
    return this.lessonService.reorderLessons(input.moduleId, input.lessonIds);
  }
  @Mutation(() => String)
  @Roles(ADMIN_ROLES.INSTRUCTOR)
  deleteLesson(
    @Args('lessonId')
    lessonId: string,
  ) {
    return this.lessonService.deleteLesson(lessonId);
  }
}
