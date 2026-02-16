import { PipelineStage, Types } from 'mongoose';
import { CourseFilters } from 'src/course/dto/create-course.input';
import { ENROLLMENT_STATUS } from 'src/enum/enrollmentStatus';
import { buildCourseMatchStage } from 'src/utils/buildCourseMatchStage';

export function getUserPurchasedCourses(filters: CourseFilters, userId: string): PipelineStage[] {
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
            $lookup: {
                from: 'enrollments',
                localField: '_id',
                foreignField: 'course_id',
                as: 'enrollment',
            },
        },
        {
            $match: filters.isPurchased ? {
                'enrollment.user_id': new Types.ObjectId(userId),
                'enrollment.status': ENROLLMENT_STATUS.ACTIVE,
            } : {}
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
