import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lesson, LessonDocument } from 'src/schemas/lesson.schema';
import { CreateLessonInput } from './dto/create-lesson.input';
import { Request } from 'express';
import { FileUpload } from 'graphql-upload-ts';
import { validateFileUpload } from 'src/utils/checkFileValidation';
import { generateFileUrl } from 'src/utils/generateFileUrl.util';
import { LessonDetails, LessonProgressUpdate, LessonResponse } from './entity/lesson.entity';
import { LessonProgress, LessonProgressDocument } from 'src/schemas/lesson-progress.schema';
import { LESSON_STATUS } from 'src/enum/lessonStatus';
import { LESSON_OPERATION } from 'src/enum/lessonOperation';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<LessonDocument>,

    @InjectModel(LessonProgress.name)
    private readonly lessonProgressModel: Model<LessonProgressDocument>,
  ) { }

  async create(
    req: Request,
    createLessonInput: CreateLessonInput,
    document?: FileUpload,
  ): Promise<Lesson> {
    const {
      content,
      is_preview,
      lesson_id,
      module_id,
      title,
      video_url,
      document_url,
      duration_minutes,
    } = createLessonInput;

    const lessonData: Partial<Lesson> = {
      title: title,
      content: content,
      video_url: video_url,
      is_preview: is_preview,
      module_id: new Types.ObjectId(module_id),
      duration_minutes: duration_minutes,
    };
    if (document) {
      await validateFileUpload(document, ['application/pdf'], 10 * 1024 * 1024);
      lessonData.pdf_url = generateFileUrl(req, document, 'lesson-document');
    } else if (document_url) {
      lessonData.pdf_url = document_url;
    }
    try {
      if (lesson_id) {
        const lesson = await this.lessonModel.findOneAndUpdate(
          {
            _id: new Types.ObjectId(lesson_id),
            module_id: new Types.ObjectId(module_id),
          },
          { $set: lessonData },
          { new: true, runValidators: true },
        );
        if (!lesson) {
          throw new HttpException('Lesson not found', 404);
        }

        return lesson;
      } else {
        const lastLesson = await this.lessonModel
          .findOne({ module_id: new Types.ObjectId(module_id) })
          .sort({ order: -1 })
          .select({ order: 1 })
          .lean();

        const nextOrder = lastLesson ? lastLesson.order + 1 : 1;
        const lesson = await this.lessonModel.create({
          ...lessonData,
          order: nextOrder,
        });
        return lesson;
      }
    } catch (error) {
      throw new HttpException(
        `Failed to ${lesson_id ? 'update' : 'create'} lesson: ${error.message}`,
        500,
      );
    }
  }

  async reorderLessons(moduleId: string, lessonIds: string[]) {
    if (!moduleId || !lessonIds) {
      throw new HttpException('Please provide all the fields', 400);
    }
    const bulkOps = lessonIds.map((lessonId, index) => ({
      updateOne: {
        filter: {
          _id: lessonId,
          module_id: new Types.ObjectId(moduleId),
        },
        update: {
          $set: { order: index + 1 },
        },
      },
    }));
    try {
      await this.lessonModel.bulkWrite(bulkOps);
    } catch (error) {
      console.log('error', error);
      throw new HttpException('Something went wrong', 500);
    }

    return true;
  }

  async getLessonById(lessonId: string): Promise<LessonResponse> {
    if (!lessonId) {
      throw new HttpException('Please provide lesson id', 404);
    }
    const lesson = await this.lessonModel.findById(lessonId); //
    if (!lesson) {
      throw new HttpException('Lesson does not exists', 404);
    }
    return lesson;
  }

  async deleteLesson(lessonId: string) {
    if (!lessonId) {
      throw new HttpException('Please provide lesson id', 404);
    }
    try {
      await this.lessonModel.findByIdAndDelete(lessonId);
      return 'Lesson deleted successfully';
    } catch (error) {
      console.error('Error deleting the Lesson', error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  private readonly operationHandlers: Record<
    LESSON_OPERATION,
    (lesson: Lesson, progress: LessonProgress, req: Request) => Promise<any>
  > = {
      [LESSON_OPERATION.START]: this.handleStart.bind(this),
      [LESSON_OPERATION.COMPLETED]: this.handleComplete.bind(this),
      [LESSON_OPERATION.VISIT]: this.handleVisit.bind(this),
    };

  private async handleStart(lesson: Lesson, progress: LessonProgress, req: Request) {
    progress.status = LESSON_STATUS.IN_PROGRESS;
    progress.last_accessed_at = new Date();
  }
  private async handleComplete(lesson: Lesson, progress: LessonProgress, req: Request) {
    progress.status = LESSON_STATUS.COMPLETED;
    progress.completed_at = new Date();
  }
  private async handleVisit(lesson: Lesson, progress: LessonProgress, req: Request) {
    progress.last_accessed_at = new Date();
  }
  async updateLessonProgress(lessonId: string, req: Request, operation: LESSON_OPERATION): Promise<LessonProgressUpdate> {
    try {
      if (!lessonId) {
        throw new HttpException('Please provide lesson id', 404);
      }
      const lesson = await this.lessonModel.findById(lessonId);
      if (!lesson) {
        throw new HttpException('Lesson does not exists', 404);
      }
      const lesson_progress = await this.lessonProgressModel.findOne({
        lesson_id: new Types.ObjectId(lessonId),
        user_id: new Types.ObjectId(req.user.id),
      });
      if (!lesson_progress) {
        throw new HttpException('Lesson progress does not exists', 404);
      }
      const handler = this.operationHandlers[operation];
      if (!handler) {
        throw new HttpException('Invalid operation', 400);
      }
      await handler(lesson, lesson_progress, req);
      await lesson_progress.save();

      return {
        _id: lesson._id,
        status: lesson_progress.status
      }
    } catch (error) {
      console.error('Error starting the lesson', error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  async getLessonForUserById(lessonId: string, req: Request): Promise<LessonDetails> {
    try {
      if (!lessonId) {
        throw new HttpException('Please provide lesson id', 404);
      }
      const lesson = await this.lessonModel.exists({ _id: lessonId });
      if (!lesson) {
        throw new HttpException('Lesson does not exists', 404);
      }
      const lessonDetails = await this.lessonProgressModel.aggregate([
        {
          $match: {
            lesson_id: lesson._id,
            user_id: new Types.ObjectId(req.user.id),
          }
        },
        {
          $lookup: {
            from: "lessons",
            localField: "lesson_id",
            foreignField: "_id",
            as: "lesson"
          }
        },
        {
          $unwind: "$lesson"
        },
        {
          $project: {
            _id: 1,
            status: 1,
            lesson: 1,
          }
        }
      ])
      if (!lessonDetails) {
        throw new HttpException('Lesson progress does not exists', 404);
      }
      return {
        _id: lessonDetails[0]._id,
        status: lessonDetails[0].status,
        lesson: lessonDetails[0].lesson,
      };
    } catch (error) {
      console.error('Error getting the lesson', error);
      throw new HttpException('Something went wrong', 500);
    }
  }
}
