import { PipelineStage, Types } from 'mongoose';
import { CourseFilters } from 'src/course/dto/create-course.input';
import { ADMIN_ROLES } from 'src/enum/roles';

export function buildCourseMatchStage(
  filters: CourseFilters,
  role?: ADMIN_ROLES,
  userId?: string,
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
  if (role === ADMIN_ROLES.INSTRUCTOR) {
    match.created_by = userId;
  }

  return Object.keys(match).length ? { $match: match } : null;
}
