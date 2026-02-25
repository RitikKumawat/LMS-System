import * as Yup from "yup";

export const addQuizQuestionSchema = Yup.object().shape({
    question_text: Yup.string()
        .required("Question text is required")
        .test("not-empty-html", "Question text cannot be empty", (value) => {
            if (!value) return false;
            const strippedString = value.replace(/(<([^>]+)>)/gi, "").trim();
            return strippedString.length > 0;
        }),
    type: Yup.string().required("Question type is required"),
    options: Yup.array()
        .of(
            Yup.object().shape({
                option_text: Yup.string().required("Option text is required"),
                is_correct: Yup.boolean().required(),
            })
        )
        .min(2, "At least two options are required")
        .test(
            "has-correct-option",
            "At least one correct option must be selected",
            (options) => {
                if (!options) return false;
                return options.some((opt) => opt.is_correct);
            }
        ),
});
