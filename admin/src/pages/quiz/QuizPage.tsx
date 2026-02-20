import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Title,
    Group,
    Button,
    Stack,
    Text,
    Badge,
    ActionIcon,
    Loader,
} from '@mantine/core';
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';
import {
    CreateQuizQuestionDocument,
    GetQuizQuestionsByQuizIdDocument,
    RemoveQuizQuestionDocument,
} from '../../generated/graphql';
import QuestionForm from '../../components/quiz/QuestionForm';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useMutation, useQuery } from '@apollo/client/react';

const QuizPage = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const [isAddingMode, setIsAddingMode] = useState(false);
    // Add editing feature later if needed because update mutation is missing in graphql schema yet.

    const { data, loading, error } = useQuery(GetQuizQuestionsByQuizIdDocument, {
        variables: { quizId: quizId as string },
        skip: !quizId,
    });

    const [createQuestion, { loading: creating }] = useMutation(CreateQuizQuestionDocument, {
        refetchQueries: [
            {
                query: GetQuizQuestionsByQuizIdDocument,
                variables: { quizId: quizId as string },
            },
        ],
        onCompleted: () => {
            notifications.show({
                title: 'Success',
                message: 'Question added successfully',
                color: 'green',
            });
            setIsAddingMode(false);
        },
        onError: (err) => {
            notifications.show({
                title: 'Error',
                message: err.message,
                color: 'red',
            });
        },
    });

    const [deleteQuestion] = useMutation(RemoveQuizQuestionDocument, {
        refetchQueries: [
            {
                query: GetQuizQuestionsByQuizIdDocument,
                variables: { quizId: quizId as string },
            },
        ],
    });

    const handleDelete = (id: string) => {
        modals.openConfirmModal({
            title: 'Delete Question',
            children: (
                <Text size="sm">
                    Are you sure you want to delete this question? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                try {
                    await deleteQuestion({ variables: { id } });
                    notifications.show({
                        title: 'Success',
                        message: 'Question deleted successfully',
                        color: 'green',
                    });
                } catch (error: any) {
                    notifications.show({
                        title: 'Error',
                        message: error.message,
                        color: 'red',
                    });
                }
            },
        });
    };

    const handleCreateSubmit = async (values: any) => {
        if (!quizId) return;
        await createQuestion({
            variables: {
                createQuizQuestionInput: {
                    ...values,
                    quiz_id: quizId,
                },
            },
        });
    };

    if (!quizId) {
        return (
            <Container>
                <Text>Quiz ID not provided.</Text>
            </Container>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Stack gap="lg">
                <Group justify="space-between">
                    <Group>
                        <ActionIcon variant="light" onClick={() => navigate(-1)}>
                            <ArrowLeft size={18} />
                        </ActionIcon>
                        <Title order={2}>Quiz Questions</Title>
                    </Group>
                    {!isAddingMode && (
                        <Button leftSection={<Plus size={16} />} onClick={() => setIsAddingMode(true)}>
                            Add Question
                        </Button>
                    )}
                </Group>

                {isAddingMode ? (
                    <Paper p="md" shadow="sm" radius="md" withBorder>
                        <Title order={4} mb="md">
                            Add New Question
                        </Title>
                        <QuestionForm
                            onSubmit={handleCreateSubmit}
                            onCancel={() => setIsAddingMode(false)}
                            loading={creating}
                        />
                    </Paper>
                ) : (
                    <Stack gap="md">
                        {loading && <Loader />}
                        {error && <Text c="red">Failed to load questions: {error.message}</Text>}
                        {data?.getQuizQuestionsByQuizId?.length === 0 && !loading && (
                            <Paper p="xl" withBorder style={{ textAlign: 'center' }}>
                                <Text c="dimmed">No questions added yet.</Text>
                                <Button mt="md" variant="light" onClick={() => setIsAddingMode(true)}>
                                    Add your first question
                                </Button>
                            </Paper>
                        )}

                        {data?.getQuizQuestionsByQuizId?.map((question: any, index: number) => (
                            <Paper key={question._id} p="md" shadow="sm" radius="md" withBorder>
                                <Group justify="space-between" align="flex-start" wrap="nowrap">
                                    <Stack gap="xs" style={{ flex: 1 }}>
                                        <Group gap="xs">
                                            <Badge color="blue">Question {index + 1}</Badge>
                                            <Badge color="violet" variant="outline">
                                                {question.type.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </Group>
                                        <div dangerouslySetInnerHTML={{ __html: question.question_text }} />
                                        <Stack gap={4} mt="xs">
                                            <Text size="sm" fw={500}>
                                                Options:
                                            </Text>
                                            {question.options.map((opt: any, i: number) => (
                                                <Group key={i} gap="xs">
                                                    {opt.is_correct ? (
                                                        <Badge color="green" size="xs">
                                                            Correct
                                                        </Badge>
                                                    ) : (
                                                        <Badge color="gray" size="xs" variant="light">
                                                            Incorrect
                                                        </Badge>
                                                    )}
                                                    <Text size="sm">{opt.option_text}</Text>
                                                </Group>
                                            ))}
                                        </Stack>
                                    </Stack>
                                    <Group gap="xs">
                                        {/* Add edit button later if needed */}
                                        <ActionIcon
                                            color="red"
                                            variant="light"
                                            onClick={() => handleDelete(question._id)}
                                        >
                                            <Trash2 size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Group>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Container>
    );
};

export default QuizPage;