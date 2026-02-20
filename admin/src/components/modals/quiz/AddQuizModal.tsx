import { Flex } from "@mantine/core";
import FInput from "../../../ui/FInput/FInput";
import FButton from "../../../ui/FButton/FButton";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import * as yup from "yup";
import { useMutation, useQuery } from "@apollo/client/react";
import { CreateQuizDocument, GetQuizByIdDocument } from "../../../generated/graphql";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../enum/routes";
import { modals } from "@mantine/modals";
import { useEffect } from "react";
interface Iprops {
    courseModuleId: string;
    quiz_id?: string
}
const AddQuizModal = ({ courseModuleId, quiz_id }: Iprops) => {
    const navigate = useNavigate();
    const { data } = useQuery(GetQuizByIdDocument, {
        variables: {
            quizId: quiz_id as string,
        },
    });
    const [createQuiz, { loading: createQuizLoading }] = useMutation(CreateQuizDocument, {
        onCompleted: (data) => {
            notifications.show({
                message: "Quiz Created Successfully",
                color: "green"
            })
            form.reset();
            modals.close('quiz-modal');
            navigate(`${ROUTES.COURSE_CURRICULUM}/${courseModuleId}/quiz/${data.createQuiz.quiz_id}`);
        },
        onError: (error) => {
            notifications.show({
                title: error.name,
                message: error.message,
                color: "red"
            })
        }
    })
    const form = useForm({
        initialValues: {
            title: "",
            passing_score: 0,
        },
        validate: yupResolver(yup.object().shape({
            title: yup.string().required("Title is required"),
            passing_score: yup
                .number()
                .transform((v, o) => (o === "" ? undefined : v))
                .typeError("Enter a valid number")
                .required("Passing score is required")
                .min(0, "Passing score must be at least 0")
                .max(100, "Passing score must be at most 100"),
        }))
    })

    useEffect(() => {
        if (quiz_id && data?.getQuizById) {
            form.setValues({
                title: data.getQuizById.title,
                passing_score: data.getQuizById.passing_score
            });
        }
    }, [quiz_id, data?.getQuizById]);
    const handleSubmit = async (values: typeof form.values) => {
        await createQuiz({
            variables: {
                createQuizInput: {
                    courseModuleId: courseModuleId,
                    title: values.title,
                    passing_score: values.passing_score,
                    quizId: quiz_id
                }
            }
        })
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Flex direction={'column'} gap={"md"} justify={"center"}>
                <FInput
                    label="Enter Quiz Title"
                    placeholder="Enter Title for the Quiz"
                    {...form.getInputProps("title")}
                    formHandler={form.getInputProps("title")}
                />
                <FInput
                    label="Enter Passing Score (in percentage)"
                    variant="number"
                    placeholder="Enter Passing Score"
                    {...form.getInputProps("passing_score")}
                    formHandler={form.getInputProps("passing_score")}
                />
                <FButton
                    title={quiz_id ? "Update Quiz Settings" : "Add Quiz"}
                    variant="dark"
                    type="submit"
                    disabled={createQuizLoading}
                    loading={createQuizLoading}
                />
                {quiz_id && (
                    <FButton
                        title="Update Quiz Questions"
                        variant="light"
                        handleClick={() => {
                            modals.close('quiz-modal');
                            navigate(`${ROUTES.COURSE_CURRICULUM}/${courseModuleId}/quiz/${quiz_id}`);
                        }}
                    />
                )}
            </Flex>
        </form>
    );
};

export default AddQuizModal;