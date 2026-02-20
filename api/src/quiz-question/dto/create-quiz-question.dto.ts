import { Field, InputType } from "@nestjs/graphql";
import { QUIZ_QUESTION_TYPE } from "src/enum/quizQuestionType";

@InputType()
class CreateOptionInput {
    @Field(() => String)
    option_text: string;

    @Field(() => Boolean)
    is_correct: boolean;
}

@InputType()
export class CreateQuizQuestionInput {
    @Field(() => String)
    quiz_id: string;

    @Field(() => String)
    question_text: string;

    @Field(() => String)
    type: QUIZ_QUESTION_TYPE;

    @Field(() => [CreateOptionInput])
    options: CreateOptionInput[];
}
