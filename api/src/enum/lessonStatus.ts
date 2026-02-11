import { registerEnumType } from '@nestjs/graphql';

export enum LESSON_STATUS {
    NOT_STARTED = 'not_started',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}
registerEnumType(LESSON_STATUS, {
    name: 'LESSON_STATUS',
});
