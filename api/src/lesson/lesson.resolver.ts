import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LessonService } from './lesson.service';
import { Lesson } from 'src/schemas/lesson.schema';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES } from 'src/enum/roles';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { CreateLessonInput } from './dto/create-lesson.input';

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
}
