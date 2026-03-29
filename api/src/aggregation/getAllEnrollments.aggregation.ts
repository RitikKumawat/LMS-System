import { PipelineStage } from 'mongoose';
import { EnrollmentFiltersInput } from 'src/enrollment/entities/enrollment-details.entity';
import { LESSON_STATUS } from 'src/enum/lessonStatus';
import { ADMIN_ROLES, USER_ROLES } from 'src/enum/roles';

export const getAllEnrollmentsAggregation = (
  user: {
    id: string;
    email: string;
    roles: ADMIN_ROLES | USER_ROLES;
  },
  search?: string,
  filters?: EnrollmentFiltersInput,
): PipelineStage[] => {
  const pipeline: PipelineStage[] = [];

  const matchStage: Record<string, unknown> = {};

  // enrollment status filter
  if (filters?.enrollment_status) {
    matchStage.status = filters.enrollment_status;
  }

  if (Object.keys(matchStage).length) {
    pipeline.push({ $match: matchStage });
  }

  /*
    --------------------------------
    COURSE LOOKUP
    --------------------------------
    */
  pipeline.push({
    $lookup: {
      from: 'courses',
      let: { courseId: '$course_id' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$courseId'] },
          },
        },
        {
          $project: {
            title: 1,
            created_by: 1,
          },
        },
      ],
      as: 'course',
    },
  });

  pipeline.push({
    $unwind: {
      path: '$course',
      preserveNullAndEmptyArrays: false,
    },
  });

  /*
    --------------------------------
    INSTRUCTOR FILTER
    --------------------------------
    */
  if (user.roles === 'instructor') {
    pipeline.push({
      $match: {
        'course.created_by': user.id,
      },
    });
  }

  /*
    --------------------------------
    USER LOOKUP
    --------------------------------
    */
  pipeline.push({
    $lookup: {
      from: 'users',
      let: { userId: '$user_id' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$userId'] },
          },
        },
        {
          $project: {
            name: 1,
            email: 1,
          },
        },
      ],
      as: 'student',
    },
  });

  pipeline.push({
    $unwind: {
      path: '$student',
      preserveNullAndEmptyArrays: false,
    },
  });

  /*
    --------------------------------
    COURSE PROGRESS LOOKUP
    --------------------------------
    */
  pipeline.push({
    $lookup: {
      from: 'coursemodules',
      let: { courseId: '$course_id' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$course_id', '$$courseId'] },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ],
      as: 'modules',
    },
  });

  pipeline.push({
    $lookup: {
      from: 'lessons',
      let: { moduleIds: '$modules._id' },
      pipeline: [
        {
          $match: {
            $expr: { $in: ['$module_id', '$$moduleIds'] },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ],
      as: 'lessons',
    },
  });

  pipeline.push({
    $lookup: {
      from: 'lessonprogresses',
      let: {
        lessonIds: '$lessons._id',
        userId: '$user_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $in: ['$lesson_id', '$$lessonIds'] },
                { $eq: ['$user_id', '$$userId'] },
                { $eq: ['$status', LESSON_STATUS.COMPLETED] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ],
      as: 'completedLessons',
    },
  });

  pipeline.push({
    $addFields: {
      totalLessons: { $size: '$lessons' },
      completedLessonsCount: { $size: '$completedLessons' },
    },
  });

  pipeline.push({
    $addFields: {
      course_progress_percentage: {
        $cond: [
          { $gt: ['$totalLessons', 0] },
          {
            $floor: {
              $multiply: [
                {
                  $divide: ['$completedLessonsCount', '$totalLessons'],
                },
                100,
              ],
            },
          },
          0,
        ],
      },
    },
  });

  /*
    --------------------------------
    PAYMENT LOOKUP
    --------------------------------
    */
  pipeline.push({
    $lookup: {
      from: 'payments',
      let: { paymentId: '$payment_id' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$paymentId'] },
          },
        },
        {
          $project: {
            status: 1,
            method: 1,
            razorpay_payment_id: 1,
          },
        },
      ],
      as: 'payment',
    },
  });

  pipeline.push({
    $unwind: {
      path: '$payment',
      preserveNullAndEmptyArrays: true,
    },
  });

  /*
    --------------------------------
    PAYMENT STATUS FILTER
    --------------------------------
    */
  if (filters?.payment_status) {
    pipeline.push({
      $match: {
        'payment.status': filters.payment_status,
      },
    });
  }

  /*
    --------------------------------
    SEARCH
    --------------------------------
    */
  if (search?.trim()) {
    const regex = new RegExp(search.trim(), 'i');

    pipeline.push({
      $match: {
        $or: [
          { 'student.name': regex },
          { 'student.email': regex },
          { 'course.title': regex },
        ],
      },
    });
  }

  /*
    --------------------------------
    SORT
    --------------------------------
    */
  pipeline.push({
    $sort: { enrolled_at: -1 },
  });

  /*
    --------------------------------
    FINAL RESPONSE SHAPE
    --------------------------------
    */
  pipeline.push({
    $project: {
      _id: 0,
      user_id: { $toString: '$user_id' },
      course_id: { $toString: '$course_id' },
      student_name: '$student.name',
      student_email: '$student.email',
      course_name: '$course.title',
      status: '$status',
      enrolled_at: '$enrolled_at',
      payment_status: '$payment.status',
      method: '$payment.method',
      payment_id: { $toString: '$payment.razorpay_payment_id' },
      course_progress_percentage: '$course_progress_percentage',
    },
  });

  return pipeline;
};
