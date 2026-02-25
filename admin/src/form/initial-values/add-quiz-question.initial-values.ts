import { Quiz_Question_Type } from "../../generated/graphql";

export const addQuizQuestionInitialValues = {
    question_text: "",
    type: Quiz_Question_Type.SingleChoice,
    options: [
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
    ],
};
