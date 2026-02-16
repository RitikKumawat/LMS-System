import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CourseFilters, CreateCourseInput } from './dto/create-course.input';
import { Request } from 'express';
import { FileUpload } from 'graphql-upload-ts';
import { generateSlug } from 'src/utils/slug.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { validateSlugUniqueness } from 'src/utils/validateSlugUniqueness.utils';
import { generateFileUrl } from 'src/utils/generateFileUrl.util';
import { validateFileUpload } from 'src/utils/checkFileValidation';
import { Course } from 'src/schemas/course.schema';
import { PaginationInput } from 'src/category/pagination.dto';
import {
  paginateAggregate,
  PaginatedResult,
} from 'src/utils/paginate-aggregate';
import { getAllCoursePipeline } from 'src/aggregation/getAllCourse.aggregation';
import { CourseProgress, CourseResponse, CourseWithEnrollment } from './entities/course.entity';
import { ADMIN_ROLES, USER_ROLES } from 'src/enum/roles';
import { Enrollment } from 'src/schemas/enrollment.schema';
import { ENROLLMENT_STATUS } from 'src/enum/enrollmentStatus';
import { getCourseProgressPipeline } from 'src/aggregation/getCourseProgress.aggregation';
import { Lesson } from 'src/schemas/lesson.schema';
import { getUserPurchasedCourses } from 'src/aggregation/getUserCourses.aggregation';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<Lesson>,
  ) { }
  async create(
    req: Request,
    createCourseInput: CreateCourseInput,
    thumbnail?: FileUpload,
  ): Promise<Course> {
    const slug = generateSlug(createCourseInput.title);
    await validateSlugUniqueness(
      this.courseModel,
      slug,
      createCourseInput.courseId,
    );

    const courseDetails: Partial<Course> = {
      category_id: createCourseInput.category_id,
      created_by: req.user.id,
      language: createCourseInput.language,
      level: createCourseInput.level,
      price: createCourseInput.price,
      slug: slug,
      title: createCourseInput.title,
      description: createCourseInput.description,
    };
    if (thumbnail) {
      await validateFileUpload(
        thumbnail,
        ['image/jpeg', 'image/png', 'image/webp', 'image/jpg,'],
        10 * 1024 * 1024,
      );
      courseDetails.thumbnail_url = generateFileUrl(
        req,
        thumbnail,
        'course-thumbnail',
      );
    } else if (createCourseInput.thumbnail_url) {
      courseDetails.thumbnail_url = createCourseInput.thumbnail_url;
    }

    try {
      if (createCourseInput.courseId) {
        const course = await this.courseModel.findByIdAndUpdate(
          createCourseInput.courseId,
          { $set: courseDetails },
          { new: true, runValidators: true },
        );
        if (!course) {
          throw new HttpException('Course not found', 404);
        }

        return course;
      } else {
        const course = await this.courseModel.create(courseDetails);
        return course;
      }
    } catch (error) {
      throw new HttpException(
        `Failed to ${createCourseInput.courseId ? 'update' : 'create'} course: ${error.message}`,
        500,
      );
    }
  }

  async getAll(
    req: Request,
    paginationInput: PaginationInput,
    courseFilters: CourseFilters,
  ): Promise<PaginatedResult<CourseResponse>> {
    const role = req.user.roles;
    const userId = req.user.id;
    const pipeline = getAllCoursePipeline(courseFilters, role as ADMIN_ROLES, userId);
    const result = await paginateAggregate<CourseResponse>(
      this.courseModel,
      pipeline,
      paginationInput.page,
      paginationInput.limit,
    );
    return result;
  }

  async getById(courseId: string, req: Request): Promise<CourseWithEnrollment> {
    if (!courseId) {
      throw new HttpException('Course Id is required', 404);
    }

    const course = await this.courseModel.findById(courseId).lean();
    if (!course) {
      throw new HttpException('Course not found', 404);
    }

    const user = req.user;

    // Default: field not present
    let is_enrolled = false;

    if (user && user.roles === USER_ROLES.USER) {
      const enrollmentExists = await this.enrollmentModel.exists({
        user_id: new Types.ObjectId(user.id),
        course_id: course._id,
        status: ENROLLMENT_STATUS.ACTIVE,
      });
      is_enrolled = !!enrollmentExists;
    }

    return {
      ...course,
      is_enrolled,
    };
  }

  async togglePublishStatus(courseId: string): Promise<string> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    const isPublishing = !course.is_published;

    course.is_published = isPublishing;
    course.published_at = isPublishing ? new Date() : null;
    await course.save();

    return isPublishing
      ? 'Course published successfully'
      : 'Course unpublished successfully';
  }

  async getCourseProgress(courseId: string, req: Request): Promise<CourseProgress> {
    if (!courseId) {
      throw new HttpException('Course Id is required', 404);
    }

    const course = await this.courseModel.findById(courseId).lean();
    if (!course) {
      throw new HttpException('Course not found', 404);
    }

    const user = req.user;

    if (user && user.roles === USER_ROLES.USER) {
      const enrollmentExists = await this.enrollmentModel.exists({
        user_id: new Types.ObjectId(user.id),
        course_id: course._id,
        status: ENROLLMENT_STATUS.ACTIVE,
      });
      if (!enrollmentExists) {
        throw new HttpException('You are not enrolled in this course', 404);
      }
    }
    const pipeline = await getCourseProgressPipeline(courseId, user.id);
    const result = await this.lessonModel.aggregate(pipeline);

    if (!result.length) {
      return {
        totalLessons: 0,
        completedLessons: 0,
        percentage: 0,
      };
    }

    const { totalLessons, completedLessons } = result[0];

    return {
      totalLessons,
      completedLessons,
      percentage: Math.floor(
        (completedLessons / totalLessons) * 100
      ),
    };
  }

  async getUserCourses(
    paginationInput: PaginationInput,
    courseFilters: CourseFilters,
    req: Request,
  ): Promise<PaginatedResult<CourseResponse>> {
    const pipeline = getUserPurchasedCourses(courseFilters, req.user.id);
    const result = await paginateAggregate<CourseResponse>(
      this.courseModel,
      pipeline,
      paginationInput.page,
      paginationInput.limit,
    );
    return result;
  }
}
