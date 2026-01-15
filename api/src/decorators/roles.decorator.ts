import { SetMetadata } from '@nestjs/common';
import { ADMIN_ROLES, USER_ROLES } from 'src/enum/roles';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ADMIN_ROLES[] | USER_ROLES[]) =>
  SetMetadata(ROLES_KEY, roles);
