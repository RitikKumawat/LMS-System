import { Field, ObjectType, ID, Int } from "@nestjs/graphql";

@ObjectType()
export class CreateQuizResponse {
    @Field(() => ID)
    quiz_id: string;
}

@ObjectType()
export class QuizResponse {
    @Field(() => ID)
    _id: string;

    // @Field(() => ID)
    // module_id: string;

    @Field(() => String)
    title: string;

    @Field(() => Int)
    passing_score: number;

    @Field(() => Date)
    created_at: Date;
}
