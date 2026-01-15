import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { CourseService } from './course.service';
import {
  CourseFilters,
  CreateCourseInput,
  PaginatedCourse,
} from './dto/create-course.input';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES } from 'src/enum/roles';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { Course } from 'src/schemas/course.schema';
import { PaginationInput } from 'src/category/pagination.dto';

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation(() => Course)
  @Roles(ADMIN_ROLES.INSTRUCTOR)
  createCourse(
    @Context() ctx,
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
    @Args('thumbnail', { type: () => GraphQLUpload, nullable: true })
    thumbnail?: FileUpload,
  ): Promise<Course> {
    return this.courseService.create(ctx.req, createCourseInput, thumbnail);
  }

  @Query(() => PaginatedCourse)
  getAllCourses(
    @Args('paginationInput') paginationInput: PaginationInput,
    @Args('courseFilters') courseFilters: CourseFilters,
  ) {
    return this.courseService.getAll(paginationInput, courseFilters);
  }

  @Query(() => Course)
  getCourseById(@Args('courseId') courseId: string) {
    return this.courseService.getById(courseId);
  }

  @Mutation(() => String)
  @Roles(ADMIN_ROLES.INSTRUCTOR, ADMIN_ROLES.ADMIN)
  togglePublishStatus(@Args('courseId') courseId: string) {
    return this.courseService.togglePublishStatus(courseId);
  }
}
