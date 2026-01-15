import { PipelineStage, Types } from 'mongoose';
import { CourseFilters } from 'src/course/dto/create-course.input';

export function buildCourseMatchStage(
  filters: CourseFilters,
): PipelineStage.Match | null {
  const match: Record<string, any> = {};

  if (filters.search) {
    match.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
    ];
  }

  if (filters.level) {
    match.level = filters.level;
  }

  if (filters.categoryId) {
    match.categoryObjectId = new Types.ObjectId(filters.categoryId);
  }

  if (typeof filters.isPublished === 'boolean') {
    match.is_published = filters.isPublished;
  }

  return Object.keys(match).length ? { $match: match } : null;
}
