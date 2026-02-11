import { PipelineStage, Types } from 'mongoose';

export function getNextLessonsToUnlock(
    courseId: string,
    userId: string
): PipelineStage[] {
    return [
        // 1️⃣ Match modules of the course
        {
            $match: {
                course_id: new Types.ObjectId(courseId),
            },
        },

        // 2️⃣ Sort modules
        {
            $sort: { order: 1 },
        },

        // 3️⃣ Lookup lessons
        {
            $lookup: {
                from: 'lessons',
                localField: '_id',
                foreignField: 'module_id',
                as: 'lessons',
            },
        },

        // 4️⃣ Unwind lessons (flatten)
        { $unwind: '$lessons' },

        // 5️⃣ Sort lessons globally
        {
            $sort: {
                order: 1,               // module order
                'lessons.order': 1,     // lesson order
            },
        },

        // 6️⃣ Lookup lesson progress for this user
        {
            $lookup: {
                from: 'lessonprogresses',
                let: { lessonId: '$lessons._id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$lesson_id', '$$lessonId'] },
                                    { $eq: ['$user_id', new Types.ObjectId(userId)] },
                                ],
                            },
                        },
                    },
                ],
                as: 'progress',
            },
        },

        // 7️⃣ Mark whether lesson is unlocked
        {
            $addFields: {
                isUnlocked: { $gt: [{ $size: '$progress' }, 0] },
            },
        },

        // 8️⃣ Group lessons back into ordered array
        {
            $group: {
                _id: null,
                lessons: {
                    $push: {
                        lesson_id: '$lessons._id',
                        isUnlocked: '$isUnlocked',
                    },
                },
            },
        },

        // 9️⃣ Find index of last unlocked lesson
        {
            $addFields: {
                lastUnlockedIndex: {
                    $let: {
                        vars: {
                            unlockedIndexes: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: '$lessons',
                                            as: 'l',
                                            cond: { $eq: ['$$l.isUnlocked', true] },
                                        },
                                    },
                                    as: 'ul',
                                    in: { $indexOfArray: ['$lessons', '$$ul'] },
                                },
                            },
                        },
                        in: {
                            $cond: [
                                { $gt: [{ $size: '$$unlockedIndexes' }, 0] },
                                { $max: '$$unlockedIndexes' },
                                -1,
                            ],
                        },
                    },
                },
            },
        },

        // 🔟 Slice next 2 lessons to unlock
        {
            $project: {
                _id: 0,
                lessonsToUnlock: {
                    $slice: [
                        '$lessons',
                        { $add: ['$lastUnlockedIndex', 1] },
                        2,
                    ],
                },
            },
        },
    ];
}