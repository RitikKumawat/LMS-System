import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { ADMIN_ROLES } from 'src/enum/roles';

@ObjectType()
export class AdminResponse {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => ADMIN_ROLES)
  role: ADMIN_ROLES;

  @HideField()
  password: string;
}
