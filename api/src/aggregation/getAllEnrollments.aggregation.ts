import { PipelineStage, Types } from 'mongoose';
import { ENROLLMENT_STATUS } from 'src/enum/enrollmentStatus';
import { PaymentStatus } from 'src/enum/paymentStatus';

export const getAllEnrollmentsAggregation = (
    user: any,
    search?: string,
    filters?: {
        payment_status?: PaymentStatus;
        enrollment_status?: ENROLLMENT_STATUS;
    }
): PipelineStage[] => {
    const pipeline: PipelineStage[] = [];

    // 1. Lookup Course
    pipeline.push({
        $lookup: {
            from: 'courses',
            localField: 'course_id',
            foreignField: '_id',
            as: 'course'
        }
    });

    pipeline.push({
        $unwind: '$course'
    });

    // 2. Filter by Instructor ID if role is INSTRUCTOR
    if (user.roles === 'instructor') {
        pipeline.push({
            $match: {
                'course.created_by': user.id
            }
        });
    }

    // 3. Lookup User
    pipeline.push({
        $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'student'
        }
    });

    pipeline.push({
        $unwind: '$student'
    });

    // 4. Lookup Payment
    pipeline.push({
        $lookup: {
            from: 'payments',
            localField: 'payment_id',
            foreignField: '_id',
            as: 'payment'
        }
    });

    pipeline.push({
        $unwind: {
            path: '$payment',
            preserveNullAndEmptyArrays: true
        }
    });

    // 5. Apply filters
    if (filters?.enrollment_status) {
        pipeline.push({
            $match: {
                status: filters.enrollment_status
            }
        });
    }

    if (filters?.payment_status) {
        pipeline.push({
            $match: {
                'payment.status': filters.payment_status
            }
        });
    }

    // 6. Apply search
    if (search) {
        pipeline.push({
            $match: {
                $or: [
                    { 'student.email': { $regex: search, $options: 'i' } },
                    { 'course.title': { $regex: search, $options: 'i' } }
                ]
            }
        });
    }

    // 7. Sort
    pipeline.push({
        $sort: { enrolled_at: -1 }
    });

    // 8. Project
    pipeline.push({
        $project: {
            _id: 0,
            student_email: '$student.email',
            course_name: '$course.title',
            status: '$status',
            enrolled_at: '$enrolled_at',
            payment_status: '$payment.status',
            method: '$payment.method',
            payment_id: { $toString: '$payment.razorpay_payment_id' }
        }
    });

    return pipeline;
};
