import { registerEnumType } from '@nestjs/graphql';

export enum ENROLLMENT_STATUS {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
registerEnumType(ENROLLMENT_STATUS, {
  name: 'ENROLLMENT_STATUS',
});
