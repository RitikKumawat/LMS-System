import { PipelineStage } from 'mongoose';
import { CourseFilters } from 'src/course/dto/create-course.input';
import { buildCourseMatchStage } from 'src/utils/buildCourseMatchStage';

export function getAllCoursePipeline(filters: CourseFilters): PipelineStage[] {
  const matchStage = buildCourseMatchStage(filters);
  return [
    {
      $addFields: {
        categoryObjectId: { $toObjectId: '$category_id' },
      },
    },
    ...(matchStage ? [matchStage] : []),
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryObjectId',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: {
        path: '$category',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        title: 1,
        slug: 1,
        description: 1,
        thumbnail_url: 1,
        level: 1,
        language: 1,
        price: 1,
        is_published: 1,
        createdAt: 1,
        category_name: '$category.name',
      },
    },
  ];
}
