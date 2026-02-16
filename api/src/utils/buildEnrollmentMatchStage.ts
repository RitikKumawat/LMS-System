import { PipelineStage, Types } from 'mongoose';
import { CourseFilters } from 'src/course/dto/create-course.input';

export function buildEnrollmentCourseMatchStage(
    filters: CourseFilters,
): PipelineStage.Match | null {
    const match: Record<string, any> = {};
    if (typeof filters.isPublished === 'boolean') {
        match.is_published = filters.isPublished;
    }

    return Object.keys(match).length ? { $match: match } : null;
}
