import { registerEnumType } from '@nestjs/graphql';

export enum QUIZ_QUESTION_TYPE {
  SINGLE_CHOICE = 'single',
  MULTIPLE_CHOICE = 'multiple',
  TRUE_FALSE = 'true_false',
}


