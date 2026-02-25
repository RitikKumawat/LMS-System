"use client";


import { Container, Title, Text, Stack, Card, Group, Radio, Checkbox, Paper, Center, Loader, Badge, Progress } from "@mantine/core";
import FButton from "@/components/ui/FButton";
import { GetQuizForStudentDocument } from "@/generated/graphql";
import { GetQuizQuestionsByQuizIdDocument } from "@/generated/graphql";
import { SubmitQuizAttemptDocument } from "@/generated/graphql";
import { Quiz_Question_Type } from "@/generated/graphql";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { COLORS } from "@/assets/colors/colors";
import { useMutation, useQuery } from "@apollo/client/react";

interface QuizTakingUIProps {
    courseId: string;
    quizId: string;
    basePath: string;
}

export default function QuizTakingUI({ courseId, quizId, basePath }: QuizTakingUIProps) {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState<{ score: number, passed: boolean } | null>(null);

    const { data: quizData, loading: quizLoading } = useQuery(GetQuizForStudentDocument, {
        variables: { quizId: quizId }
    });

    const { data: questionsData, loading: questionsLoading } = useQuery(GetQuizQuestionsByQuizIdDocument, {
        variables: { quizId: quizId }
    });

    const [submitAttempt, { loading: submitting }] = useMutation(SubmitQuizAttemptDocument);

    const quiz = quizData?.getQuizForStudent;
    const questions = questionsData?.getQuizQuestionsByQuizId || [];

    // Automatically grade frontend
    const calculateScore = () => {
        if (!questions.length) return 0;
        let correctCount = 0;

        questions.forEach((question: any) => {
            const userAnswers = answers[question._id] || [];
            const correctIndices = question.options
                .map((o: any, idx: number) => o.is_correct ? idx.toString() : null)
                .filter((v: any) => v !== null);

            if (question.type === Quiz_Question_Type.MultipleChoice) {
                if (userAnswers.length === correctIndices.length && userAnswers.every(ans => correctIndices.includes(ans))) {
                    correctCount++;
                }
            } else {
                if (userAnswers.length > 0 && correctIndices.includes(userAnswers[0])) {
                    correctCount++;
                }
            }
        });

        return Math.round((correctCount / questions.length) * 100);
    }

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        const score = calculateScore();
        try {
            const { data } = await submitAttempt({
                variables: {
                    quizId: quizId,
                    score: score,
                }
            });
            if (data?.submitQuizAttempt) {
                setResult(data.submitQuizAttempt);
                setIsSubmitted(true);
            }
        } catch (error) {
            notifications.show({
                title: "Error",
                message: "Failed to submit quiz attempt",
                color: "red"
            });
        }
    };

    if (quizLoading || questionsLoading) {
        return <Center h={400}><Loader /></Center>;
    }

    if (!quiz || !questions.length) {
        return <Center h={400}><Text c="dimmed" mt="xl">Quiz not found or has no questions.</Text></Center>;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isSubmitted && result) {
        return (
            <Container size="sm" py="xl">
                <Paper shadow="sm" radius="md" p="xl" withBorder style={{ backgroundColor: COLORS.background.secondary, textAlign: "center", borderColor: COLORS.border.glass }}>
                    {result.passed ? (
                        <CheckCircle size={64} color="var(--mantine-color-green-6)" style={{ margin: "0 auto" }} />
                    ) : (
                        <XCircle size={64} color="var(--mantine-color-red-6)" style={{ margin: "0 auto" }} />
                    )}
                    <Title order={3} mt="md" c="white">{result.passed ? "Congratulations! You passed!" : "You did not pass the quiz."}</Title>
                    <Text c="dimmed" mt="xs">Your Score: {result.score}% (Passing: {quiz.passing_score}%)</Text>
                    <Group justify="center" mt="xl">
                        <FButton variant="secondary" onClick={() => router.push(basePath)}>Return to Course</FButton>
                        {!result.passed && (
                            <FButton onClick={() => {
                                setIsSubmitted(false);
                                setResult(null);
                                setCurrentQuestionIndex(0);
                                setAnswers({});
                            }}>Retake Quiz</FButton>
                        )}
                    </Group>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="md" py="xl">
            <Title order={2} c="white" mb="xs">{quiz.title}</Title>
            <Group justify="space-between" mb="xl">
                <Text c="dimmed">Passing Score: {quiz.passing_score}%</Text>
                <Badge variant="light" color="blue">Question {currentQuestionIndex + 1} of {questions.length}</Badge>
            </Group>

            <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} mb="xl" color="blue" />

            <Card shadow="sm" radius="lg" p="xl" style={{ backgroundColor: COLORS.background.secondary, border: `1px solid ${COLORS.border.glass}` }}>
                <Title order={4} c="white" mb="lg" dangerouslySetInnerHTML={{ __html: currentQuestion.question_text }} />

                {currentQuestion.type === Quiz_Question_Type.MultipleChoice ? (
                    <Checkbox.Group
                        value={answers[currentQuestion._id] || []}
                        onChange={(value) => setAnswers({ ...answers, [currentQuestion._id]: value })}
                    >
                        <Stack gap="md">
                            {currentQuestion.options.map((option, idx) => (
                                <Checkbox
                                    key={idx}
                                    value={idx.toString()}
                                    label={<div dangerouslySetInnerHTML={{ __html: option.option_text }} style={{ color: 'white', pointerEvents: 'none' }} />}
                                    styles={{ label: { display: "block", width: "100%", cursor: "pointer" }, body: { alignItems: 'center' } }}
                                />
                            ))}
                        </Stack>
                    </Checkbox.Group>
                ) : (
                    <Radio.Group
                        value={(answers[currentQuestion._id] && answers[currentQuestion._id][0]) || ''}
                        onChange={(value) => setAnswers({ ...answers, [currentQuestion._id]: [value] })}
                    >
                        <Stack gap="md">
                            {currentQuestion.options.map((option, idx) => (
                                <Radio
                                    key={idx}
                                    value={idx.toString()}
                                    label={<div dangerouslySetInnerHTML={{ __html: option.option_text }} style={{ color: 'white', pointerEvents: 'none' }} />}
                                    styles={{ label: { display: "block", width: "100%", cursor: "pointer" }, body: { alignItems: 'center' } }}
                                />
                            ))}
                        </Stack>
                    </Radio.Group>
                )}

                <Group justify="space-between" mt={40}>
                    <FButton
                        variant="secondary"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                    >
                        <ArrowLeft size={16} /> Previous
                    </FButton>

                    {isLastQuestion ? (
                        <FButton
                            onClick={handleSubmit}
                            loading={submitting}
                        >
                            Submit Quiz
                        </FButton>
                    ) : (
                        <FButton
                            onClick={handleNext}
                        >
                            Next <ArrowRight size={16} />
                        </FButton>
                    )}
                </Group>
            </Card>
        </Container>
    );
}
