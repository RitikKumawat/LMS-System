import { PipelineStage, Types } from 'mongoose';

export function getAllCourseModuleForStudentPipeline(courseId: string): PipelineStage[] {
    return [
        {
            $match: {
                course_id: new Types.ObjectId(courseId),
            },
        },
        {
            $sort: { order: 1 },
        },

        // 🔥 Join lessons
        {
            $lookup: {
                from: 'lessons', // Mongo collection name
                localField: '_id', // module _id
                foreignField: 'module_id', // lesson.module_id
                as: 'lessons',
            },
        },

        // 🔥 Sort lessons inside each module
        {
            $addFields: {
                lessons: {
                    $sortArray: {
                        input: '$lessons',
                        sortBy: { order: 1 },
                    },
                },
            },
        },
        {
            $project: {
                _id: 1,
                course_id: 1,
                title: 1,
                description: 1,
                order: 1,
                lessons: 1,
                createdAt: 1,
            },
        },
        {
            $addFields: {
                lessons: {
                    $map: {
                        input: '$lessons',
                        as: 'lesson',
                        in: {
                            _id: '$$lesson._id',
                            title: '$$lesson.title',
                            order: '$$lesson.order',
                            duration_minutes: '$$lesson.duration_minutes',
                            lesson_type: '$$lesson.lesson_type',
                        },
                    },
                },
            },
        },
    ];
}
