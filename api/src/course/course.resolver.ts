import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { CourseService } from './course.service';
import {
  CourseFilters,
  CreateCourseInput,
  PaginatedCourse,
} from './dto/create-course.input';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES, USER_ROLES } from 'src/enum/roles';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { Course } from 'src/schemas/course.schema';
import { PaginationInput } from 'src/category/pagination.dto';
import { Public } from 'src/decorators/public.decorator';
import { CourseProgress, CourseWithEnrollment } from './entities/course.entity';
import { UseGuards } from '@nestjs/common';
import { OptionalAuthGuard } from 'src/auth/optionalAuth.guard';

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) { }

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

  @Roles(ADMIN_ROLES.INSTRUCTOR, ADMIN_ROLES.ADMIN)
  @Query(() => PaginatedCourse)
  getAllCourses(
    @Context() ctx,
    @Args('paginationInput') paginationInput: PaginationInput,
    @Args('courseFilters') courseFilters: CourseFilters,
  ) {
    return this.courseService.getAll(ctx.req, paginationInput, courseFilters);
  }

  @Public()
  @UseGuards(OptionalAuthGuard)
  @Query(() => CourseWithEnrollment)
  getCourseById(@Args('courseId') courseId: string,
    @Context() ctx,) {
    return this.courseService.getById(courseId, ctx.req);
  }

  @Mutation(() => String)
  @Roles(ADMIN_ROLES.INSTRUCTOR, ADMIN_ROLES.ADMIN)
  togglePublishStatus(@Args('courseId') courseId: string) {
    return this.courseService.togglePublishStatus(courseId);
  }

  @Public()
  @UseGuards(OptionalAuthGuard)
  @Query(() => PaginatedCourse)
  getPublishedCourses(
    @Args('paginationInput') paginationInput: PaginationInput,
    @Args('courseFilters') courseFilters: CourseFilters,
    @Context() ctx,
  ) {
    courseFilters.isPublished = true;
    return this.courseService.getAll(ctx.req, paginationInput, courseFilters);
  }

  @Roles(USER_ROLES.USER)
  @Query(() => CourseProgress)
  getCourseProgress(@Args('courseId') courseId: string,
    @Context() ctx,) {
    return this.courseService.getCourseProgress(courseId, ctx.req);
  }

  @Roles(USER_ROLES.USER)
  @Query(() => PaginatedCourse)
  getUserCourses(
    @Args('paginationInput') paginationInput: PaginationInput,
    @Args('courseFilters') courseFilters: CourseFilters,
    @Context() ctx,
  ) {
    return this.courseService.getUserCourses(paginationInput, courseFilters, ctx.req);
  }
}
