import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CourseFilters, CreateCourseInput } from './dto/create-course.input';
import { Request } from 'express';
import { FileUpload } from 'graphql-upload-ts';
import { generateSlug } from 'src/utils/slug.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
import { CourseResponse } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
  ) {}
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
    paginationInput: PaginationInput,
    courseFilters: CourseFilters,
  ): Promise<PaginatedResult<CourseResponse>> {
    const pipeline = getAllCoursePipeline(courseFilters);
    const result = await paginateAggregate<CourseResponse>(
      this.courseModel,
      pipeline,
      paginationInput.page,
      paginationInput.limit,
    );
    return result;
  }

  async getById(courseId: string): Promise<Course> {
    if (!courseId) {
      throw new HttpException('Course Id is required', 404);
    }
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new HttpException('Course not found', 404);
    }
    return course;
  }

  async togglePublishStatus(courseId: string): Promise<string> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    const isPublishing = !course.is_published;

    course.is_published = isPublishing;
    course.published_at = isPublishing ? new Date() : null;
    console.log('Course published', course.published_at);
    await course.save();

    return isPublishing
      ? 'Course published successfully'
      : 'Course unpublished successfully';
  }
}
