import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ENROLLMENT_STATUS } from 'src/enum/enrollmentStatus';
import { Enrollment } from 'src/schemas/enrollment.schema';

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
            user_id: userId,
            course_id: courseId,
            status: ENROLLMENT_STATUS.ACTIVE,
        });

        return !!enrollment;
    }
}
