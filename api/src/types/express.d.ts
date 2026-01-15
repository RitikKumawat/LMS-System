import { USER_ROLES, ADMIN_ROLES } from '../enum/roles';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      roles: USER_ROLES | ADMIN_ROLES;
      [key: string]: any;
    };
  }
}
