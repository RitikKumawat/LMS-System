import { PipelineStage, Types } from "mongoose";

export function getAllCourseModuleForStudentPipeline(
    courseId: string,
    userId?: string | null,
): PipelineStage[] {
    const pipeline: PipelineStage[] = [
        {
            $match: {
                course_id: new Types.ObjectId(courseId),
            },
        },
        { $sort: { order: 1 } },

        {
            $lookup: {
                from: 'lessons',
                localField: '_id',
                foreignField: 'module_id',
                as: 'lessons',
            },
        },

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
    ];

    // 👤 USER-SPECIFIC PART (only if logged in)
    if (userId) {
        pipeline.push(
            {
                $lookup: {
                    from: 'lessonprogresses',
                    let: { lessonIds: '$lessons._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ['$lesson_id', '$$lessonIds'] },
                                        { $eq: ['$user_id', new Types.ObjectId(userId)] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'lessonProgress',
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

                                isUnlocked: {
                                    $gt: [
                                        {
                                            $size: {
                                                $filter: {
                                                    input: '$lessonProgress',
                                                    as: 'lp',
                                                    cond: {
                                                        $eq: ['$$lp.lesson_id', '$$lesson._id'],
                                                    },
                                                },
                                            },
                                        },
                                        0,
                                    ],
                                },

                                status: {
                                    $let: {
                                        vars: {
                                            progress: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: '$lessonProgress',
                                                            as: 'lp',
                                                            cond: {
                                                                $eq: ['$$lp.lesson_id', '$$lesson._id'],
                                                            },
                                                        },
                                                    },
                                                    0,
                                                ],
                                            },
                                        },
                                        in: '$$progress.status',
                                    },
                                },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    lessonProgress: 0,
                },
            },
        );
    } else {
        pipeline.push({
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
                            isUnlocked: false,
                            status: null,
                        },
                    },
                },
            },
        });
    }

    return pipeline;
}