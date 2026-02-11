import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { getNextLessonsToUnlock } from 'src/aggregation/getNextLessonstoUnlock';
import { LESSON_STATUS } from 'src/enum/lessonStatus';
import { CourseModule, CourseModuleDocument } from 'src/schemas/course-module.schema';
import { Course, CourseDocument } from 'src/schemas/course.schema';
import { LessonProgress, LessonProgressDocument } from 'src/schemas/lesson-progress.schema';
import { UnlockLessonsResponse } from './entity/lesson-progress.entity';

@Injectable()
export class LessonProgressService {
    constructor(
        @InjectModel(LessonProgress.name)
        private readonly lessonProgressModel: Model<LessonProgressDocument>,

        @InjectModel(Course.name)
        private readonly courseModel: Model<CourseDocument>,

        @InjectModel(CourseModule.name)
        private readonly courseModuleModel: Model<CourseModuleDocument>,
    ) { }

    async unlockInitialLessons(user_id: string, course_id: string): Promise<UnlockLessonsResponse> {
        // 1️⃣ Validate course
        const courseExists = await this.courseModel.exists({ _id: course_id });
        if (!courseExists) {
            throw new Error('Course not found');
        }

        // 2️⃣ Run aggregation
        const result = await this.courseModuleModel.aggregate(
            getNextLessonsToUnlock(course_id, user_id)
        );

        // 3️⃣ No modules / no lessons case
        if (!result.length || !result[0]?.lessonsToUnlock?.length) {
            return {
                unlocked: [],
                message: 'No lessons available to unlock',
                alreadyCompleted: true,
            };
        }

        const lessonsToUnlock = result[0].lessonsToUnlock;

        // 4️⃣ Avoid duplicate unlocks (idempotency)
        const existingProgress = await this.lessonProgressModel.find({
            user_id,
            lesson_id: { $in: lessonsToUnlock.map(l => l.lesson_id) },
        }).select('lesson_id');

        const alreadyUnlockedIds = new Set(
            existingProgress.map(p => p.lesson_id.toString())
        );

        const newLessons = lessonsToUnlock.filter(
            l => !alreadyUnlockedIds.has(l.lesson_id.toString())
        );

        // 5️⃣ If everything is already unlocked
        if (!newLessons.length) {
            return {
                unlocked: [],
                message: 'All lessons already unlocked',
                alreadyCompleted: true,
            };
        }

        // 6️⃣ Create LessonProgress entries
        const created = await this.lessonProgressModel.insertMany(
            newLessons.map(lesson => ({
                user_id: new Types.ObjectId(user_id),
                lesson_id: lesson.lesson_id,
                status: LESSON_STATUS.NOT_STARTED,
                last_accessed_at: null,
                completed_at: null,
            }))
        );

        // 7️⃣ Return clean response
        return {
            unlocked: created.map(p => ({
                lesson_id: p.lesson_id,
                status: p.status,
            })),
            count: created.length,
            message: `${created.length} lesson(s) unlocked`,
            alreadyCompleted: false,
        };
    }
}
