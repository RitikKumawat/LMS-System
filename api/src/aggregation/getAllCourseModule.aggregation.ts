import { PipelineStage, Types } from 'mongoose';

export function getAllCourseModulePipeline(courseId: string): PipelineStage[] {
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
}
