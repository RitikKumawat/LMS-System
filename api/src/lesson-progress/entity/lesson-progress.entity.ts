import { Field, Int, ObjectType } from "@nestjs/graphql";
import { LESSON_STATUS } from "src/enum/lessonStatus";


@ObjectType()
export class UnlockedLesson {
    @Field(() => String)
    lesson_id: string;

    @Field(() => LESSON_STATUS)
    status: LESSON_STATUS;
}

@ObjectType()
export class UnlockLessonsResponse {
    @Field(() => [UnlockedLesson])
    unlocked: UnlockedLesson[];

    @Field(() => Int, { nullable: true })
    count?: number;

    @Field(() => String)
    message: string;

    @Field(() => Boolean)
    alreadyCompleted: boolean;
}