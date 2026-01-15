import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCourseModuleInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => ID)
  course_id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;
}

@InputType()
export class ReorderCourseModulesInput {
  @Field(() => String)
  courseId: string;

  @Field(() => [String])
  moduleIds: string[];
}
