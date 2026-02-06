import { Resolver } from '@nestjs/graphql';
import { EnrollmentService } from './enrollment.service';

@Resolver()
export class EnrollmentResolver {
  constructor(private readonly enrollmentService: EnrollmentService) {}
}
