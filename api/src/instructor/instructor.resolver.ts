import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InstructorService } from './instructor.service';

import { Admin } from 'src/schemas/admin.schema';
import { InstructorResponse } from './entity/instructor.entity';
import { InstructorSignUpDto } from './dto/instructor.dto';

@Resolver(() => Admin)
export class InstructorResolver {
  constructor(private readonly instructorService: InstructorService) {}

  @Mutation(() => InstructorResponse)
  async instructorSignUp(
    @Args('input') input: InstructorSignUpDto,
  ): Promise<Omit<Admin, 'password'>> {
    return this.instructorService.instructorSignUp(input);
  }
}
