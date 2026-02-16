import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { EnrollmentService } from '../enrollment/enrollment.service';

@Injectable()
export class EnrolledCourseGuard implements CanActivate {
    constructor(private readonly enrollmentService: EnrollmentService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const gqlCtx = GqlExecutionContext.create(context);

        const ctx = gqlCtx.getContext();
        const args = gqlCtx.getArgs();
        const user = ctx.req.user;
        const courseId = args.courseId;
        const isEnrolled =
            await this.enrollmentService.isEnrolled(
                user.id,
                courseId,
            );

        if (!isEnrolled) {
            throw new ForbiddenException(
                'You are not enrolled in this course',
            );
        }

        return true;
    }
}