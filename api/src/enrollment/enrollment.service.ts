import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ENROLLMENT_STATUS } from 'src/enum/enrollmentStatus';
import { Enrollment } from 'src/schemas/enrollment.schema';
import { getAllEnrollmentsAggregation } from 'src/aggregation/getAllEnrollments.aggregation';
import { paginateAggregate } from 'src/utils/paginate-aggregate';

@Injectable()
export class EnrollmentService {

    constructor(
        @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<Enrollment>,
    ) { }

    async create(data: {
        user_id: Types.ObjectId;
        course_id: Types.ObjectId;
        payment_id?: Types.ObjectId | null;
    }) {
        // prevent duplicate enrollment
        const existing = await this.enrollmentModel.findOne({
            user_id: data.user_id,
            course_id: data.course_id,
        });

        if (existing) return existing;

        const enrollment = new this.enrollmentModel({
            user_id: data.user_id,
            course_id: data.course_id,
            payment_id: data.payment_id ?? null,
            status: ENROLLMENT_STATUS.ACTIVE,
        });

        return enrollment.save();
    }

    async isEnrolled(userId: string, courseId: string): Promise<boolean> {
        const enrollment = await this.enrollmentModel.findOne({
            user_id: new Types.ObjectId(userId),
            course_id: new Types.ObjectId(courseId),
            status: ENROLLMENT_STATUS.ACTIVE,
        });

        return !!enrollment;
    }

    async getAllEnrollments(req: any, paginationInput: any, filters?: any) {
        const { page = 1, limit = 10 } = paginationInput;
        const user = req.user;

        const basePipeline = getAllEnrollmentsAggregation(user, filters?.search, filters);

        const result = await paginateAggregate(
            this.enrollmentModel,
            basePipeline,
            page,
            limit
        );

        return result;
    }
}
