import { registerEnumType } from '@nestjs/graphql';

export enum COURSE_LEVEL {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}
registerEnumType(COURSE_LEVEL, {
  name: 'COURSE_LEVEL',
});
