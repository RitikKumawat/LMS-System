import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CourseModuleService } from './course-module.service';
import { CourseModule } from 'src/schemas/course-module.schema';
import { ADMIN_ROLES } from 'src/enum/roles';
import { Roles } from 'src/decorators/roles.decorator';
import {
  CreateCourseModuleInput,
  ReorderCourseModulesInput,
} from './dto/course-module.dto';
import {
  CourseModuleResponse,
  PaginatedCourseModule,
  PaginatedCourseModuleForStudent,
} from './entity/course-module.entity';
import { PaginationInput } from 'src/category/pagination.dto';
import { Public } from 'src/decorators/public.decorator';

@Resolver()
export class CourseModuleResolver {
  constructor(private readonly courseModuleService: CourseModuleService) { }

  @Mutation(() => CourseModule)
  @Roles(ADMIN_ROLES.INSTRUCTOR)
  createCourseModule(
    @Context() ctx,
    @Args('createCourseModuleInput')
    createCourseModuleInput: CreateCourseModuleInput,
  ): Promise<CourseModule> {
    return this.courseModuleService.createCourseModule(
      ctx.req,
      createCourseModuleInput,
    );
  }

  @Query(() => PaginatedCourseModule)
  getAllCourseModules(
    @Args('courseId') courseId: string,
    @Args('paginationInput') paginationInput: PaginationInput,
  ) {
    return this.courseModuleService.getAllCourseModules(
      courseId,
      paginationInput,
    );
  }

  @Query(() => CourseModuleResponse)
  @Roles(ADMIN_ROLES.INSTRUCTOR)
  getCourseModuleById(@Args('courseModuleId') courseModuleId: string) {
    return this.courseModuleService.getCourseModuleById(courseModuleId);
  }

  @Mutation(() => Boolean)
  @Roles(ADMIN_ROLES.INSTRUCTOR)
  reorderCourseModules(
    @Args('reorderCourseModulesInput')
    input: ReorderCourseModulesInput,
  ) {
    return this.courseModuleService.reorderCourseModules(
      input.courseId,
      input.moduleIds,
    );
  }
  @Mutation(() => String)
  @Roles(ADMIN_ROLES.INSTRUCTOR)
  deleteCourseModule(
    @Args('moduleId')
    moduleId: string,
  ) {
    return this.courseModuleService.deleteCourseModule(moduleId);
  }

  @Public()
  @Query(() => PaginatedCourseModuleForStudent)
  getCourseModuleByCourseId(@Args('courseId') courseId: string,
    @Args('paginationInput') paginationInput: PaginationInput,) {
    return this.courseModuleService.getCourseModuleByCourseId(courseId, paginationInput);
  }
}
