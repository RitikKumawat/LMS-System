import { Flex, Text, ActionIcon } from "@mantine/core";
import { SquarePen, Trash2 } from "lucide-react";
import {
    DeleteQuizDocument,
    GetAllCourseModulesDocument,
    QuizResponse,
} from "../../generated/graphql";
import { openQuizModal } from "../modals/quiz/openQuizModal";
import { useMutation } from "@apollo/client/react";
import { notifications } from "@mantine/notifications";
import { openConfirmModal } from "../modals/confirmation-modals/ConfirmationModal";

const QuizItem = ({
    quiz,
    module_id,
}: {
    quiz: QuizResponse;
    module_id: string;
}) => {
    const [deleteQuiz, { loading }] = useMutation(DeleteQuizDocument, {
        onCompleted: () => {
            notifications.show({
                message: "Quiz Deleted Successfully",
                color: "green",
            });
        },
        onError: (error) => {
            notifications.show({
                message: error.message,
                color: "red",
            });
        },
        refetchQueries: [GetAllCourseModulesDocument],
    });

    const handleDeleteQuiz = () => {
        openConfirmModal({
            title: "Delete Quiz",
            message:
                "This will permanently delete this quiz. This action cannot be undone.",
            confirmText: "Delete",
            onConfirm: async () => {
                await deleteQuiz({
                    variables: {
                        quizId: quiz._id,
                    },
                });
            },
            loading: loading,
            loadingText: "Deleting...",
        });
    };

    return (
        <Flex
            align="center"
            justify="space-between"
            py={8}
            px={10}
            w={"100%"}
            bg={"white"}
            bdrs={"md"}
        >
            <Flex align="center" gap="sm">
                <Flex gap={"lg"} align={"center"} ml={32}>
                    {" "}
                    {/* Added Margin left to align with lesson title which has drag handle */}
                    <Text size="sm">{quiz.title}</Text>
                    <Flex gap={"5px"}>
                        <ActionIcon
                            color="green"
                            variant="light"
                            onClick={(e) => {
                                e.preventDefault();
                                openQuizModal({
                                    courseModuleId: module_id,
                                    quiz_id: quiz._id,
                                });
                            }}
                        >
                            <SquarePen size={14} style={{ cursor: "pointer" }} />
                        </ActionIcon>
                        <ActionIcon
                            color="red"
                            variant="light"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDeleteQuiz();
                            }}
                        >
                            <Trash2 size={14} color="red" />
                        </ActionIcon>
                    </Flex>
                </Flex>
            </Flex>

            <Flex align="center" gap="sm">
                <Text size="xs" c="dimmed">
                    Passing Score: {quiz.passing_score}%
                </Text>
            </Flex>
        </Flex>
    );
};

export default QuizItem;
