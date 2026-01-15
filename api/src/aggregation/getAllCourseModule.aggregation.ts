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
  ];
}
