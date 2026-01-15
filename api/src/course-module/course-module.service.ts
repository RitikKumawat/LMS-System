import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Connection, Model, Types } from 'mongoose';
import { CourseModule } from 'src/schemas/course-module.schema';
import { CreateCourseModuleInput } from './dto/course-module.dto';
import { PaginationInput } from 'src/category/pagination.dto';
import {
  paginateAggregate,
  PaginatedResult,
} from 'src/utils/paginate-aggregate';
import { CourseModuleResponse } from './entity/course-module.entity';
import { getAllCourseModulePipeline } from 'src/aggregation/getAllCourseModule.aggregation';
import { Lesson } from 'src/schemas/lesson.schema';

@Injectable()
export class CourseModuleService {
  constructor(
    @InjectModel(CourseModule.name)
    private readonly courseModuleModel: Model<CourseModule>,

    @InjectConnection()
    private readonly connection: Connection,

    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<Lesson>,
  ) {}
  async createCourseModule(
    req: Request,
    createCourseModuleInput: CreateCourseModuleInput,
  ): Promise<CourseModule> {
    const { id, course_id, title, description } = createCourseModuleInput;

    if (id) {
      const updatedModule = await this.courseModuleModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          course_id: new Types.ObjectId(course_id),
        },
        {
          $set: {
            title,
            description,
          },
        },
        {
          new: true,
        },
      );

      if (!updatedModule) {
        throw new Error('Course module not found');
      }

      return updatedModule;
    }

    const lastModule = await this.courseModuleModel
      .findOne({ course_id: new Types.ObjectId(course_id) })
      .sort({ order: -1 })
      .select({ order: 1 })
      .lean();

    const nextOrder = lastModule ? lastModule.order + 1 : 1;

    const module = new this.courseModuleModel({
      course_id: new Types.ObjectId(course_id),
      title,
      description,
      order: nextOrder,
    });

    return module.save();
  }

  async getAllCourseModules(
    courseId: string,
    paginationInput: PaginationInput,
  ): Promise<PaginatedResult<CourseModuleResponse>> {
    const pipeline = getAllCourseModulePipeline(courseId);
    const result = await paginateAggregate<CourseModuleResponse>(
      this.courseModuleModel,
      pipeline,
      paginationInput.page,
      paginationInput.limit,
    );
    return result;
  }
  async getCourseModuleById(
    courseModuleId: string,
  ): Promise<CourseModuleResponse> {
    if (!courseModuleId) {
      throw new HttpException('Please provide course module id', 404);
    }
    const module = await this.courseModuleModel.findById(courseModuleId).lean(); //
    if (!module) {
      throw new HttpException('Course Module does not exists', 404);
    }
    return {
      ...module,
      _id: module._id.toString(),
      course_id: module.course_id.toString(),
    };
  }

  async reorderCourseModules(courseId: string, moduleIds: string[]) {
    if (!courseId || !moduleIds) {
      throw new HttpException('Please provide all the fields', 400);
    }
    const bulkOps = moduleIds.map((moduleId, index) => ({
      updateOne: {
        filter: {
          _id: moduleId,
          course_id: new Types.ObjectId(courseId),
        },
        update: {
          $set: { order: index + 1 },
        },
      },
    }));
    try {
      await this.courseModuleModel.bulkWrite(bulkOps);
    } catch (error) {
      console.log('error', error);
      throw new HttpException('Something went wrong', 500);
    }

    return true;
  }

  async deleteCourseModule(moduleId: string) {
    if (!moduleId) {
      throw new HttpException('Please provide module id', 404);
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // 1️⃣ Check module exists
      const module = await this.courseModuleModel
        .findById(moduleId)
        .session(session);

      if (!module) {
        throw new HttpException('Module not found', 404);
      }

      await this.lessonModel.deleteMany({ module_id: module._id }, { session });

      await this.courseModuleModel.deleteOne({ _id: module._id }, { session });

      await session.commitTransaction();
      session.endSession();

      return 'Module and its lessons deleted successfully';
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
