import { registerEnumType } from '@nestjs/graphql';

export enum LESSON_OPERATION {
    START = 'start',
    VISIT = 'visit',
    COMPLETED = 'complete',
}
registerEnumType(LESSON_OPERATION, {
    name: 'LESSON_OPERATION',
});
