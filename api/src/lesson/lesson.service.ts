import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lesson, LessonDocument } from 'src/schemas/lesson.schema';
import { CreateLessonInput } from './dto/create-lesson.input';
import { Request } from 'express';
import { FileUpload } from 'graphql-upload-ts';
import { validateFileUpload } from 'src/utils/checkFileValidation';
import { generateFileUrl } from 'src/utils/generateFileUrl.util';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<LessonDocument>,
  ) {}

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
      module_id: module_id,
      duration_minutes: duration_minutes,
    };
    if (document) {
      await validateFileUpload(document, ['.pdf', '.docx'], 10 * 1024 * 1024);
      lessonData.pdf_url = generateFileUrl(req, document, 'lesson-document');
    } else if (document_url) {
      lessonData.pdf_url = document_url;
    }
    try {
      if (lesson_id) {
        const lesson = await this.lessonModel.findOneAndUpdate(
          { _id: lesson_id, module_id: module_id },
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
          module_id: new Types.ObjectId(module_id),
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
}
