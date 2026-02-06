import { registerEnumType } from '@nestjs/graphql';

export enum ENROLLMENT_STATUS {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}
registerEnumType(ENROLLMENT_STATUS, {
  name: 'ENROLLMENT_STATUS',
});
