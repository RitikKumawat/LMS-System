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
        {
            $lookup: {
                from: 'quizzes',
                let: { moduleId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$module_id', '$$moduleId'] }
                        }
                    },
                    {
                        $project: {
                            module_id: 0,
                        }
                    },
                    {
                        $sort: { createdAt: 1 }
                    }
                ],
                as: 'quizzes'
            }
        },
        {
            $addFields: {
                quizzes: {
                    $sortArray: {
                        input: '$quizzes',
                        sortBy: { createdAt: 1 },
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
                $lookup: {
                    from: 'quizattempts',
                    let: { quizIds: '$quizzes._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ['$quiz_id', '$$quizIds'] },
                                        { $eq: ['$user_id', new Types.ObjectId(userId)] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'quizAttempts',
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
                    quizzes: {
                        $map: {
                            input: '$quizzes',
                            as: 'quiz',
                            in: {
                                _id: '$$quiz._id',
                                title: '$$quiz.title',
                                passing_score: '$$quiz.passing_score',
                                created_at: '$$quiz.created_at',
                                score: {
                                    $let: {
                                        vars: {
                                            attemptsForQuiz: {
                                                $filter: {
                                                    input: '$quizAttempts',
                                                    as: 'qa',
                                                    cond: { $eq: ['$$qa.quiz_id', '$$quiz._id'] }
                                                }
                                            }
                                        },
                                        in: {
                                            $max: '$$attemptsForQuiz.score'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            },
            {
                $project: {
                    lessonProgress: 0,
                    quizAttempts: 0,
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
                quizzes: {
                    $map: {
                        input: '$quizzes',
                        as: 'quiz',
                        in: {
                            _id: '$$quiz._id',
                            title: '$$quiz.title',
                            passing_score: '$$quiz.passing_score',
                            created_at: '$$quiz.created_at',
                            score: null,
                        }
                    }
                }
            },
        });
    }

    return pipeline;
}