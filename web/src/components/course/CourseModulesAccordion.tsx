"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { GetCourseModuleByCourseIdDocument, Lesson, Lesson_Operation, Lesson_Status, LessonForStudentResponse, UpdateLessonProgressDocument } from "@/generated/graphql";
import { Accordion, Text, Loader, Center, Stack, ThemeIcon, Group, Paper, Button, Flex } from "@mantine/core";
import { COLORS } from "@/assets/colors/colors";
import { PlayCircle, FileText, CheckCircle, Lock } from "lucide-react";
import React, { useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

interface CourseModulesAccordionProps {
    courseId: string;
    activeLessonId?: string;
    isEnrolled?: boolean;
}

export default function CourseModulesAccordion({ courseId, activeLessonId, isEnrolled }: CourseModulesAccordionProps) {
    const path = usePathname();
    const { data, loading, error } = useQuery(GetCourseModuleByCourseIdDocument, {
        variables: {
            courseId,
            paginationInput: { page: 1, limit: 100 } // Fetch all modules, adjust limit if needed
        },
        skip: !courseId,
        fetchPolicy: "network-only"
    });
    const router = useRouter();
    const [loadingLessonId, setLoadingLessonId] = useState<string | null>(null);

    const [updateLessonProgress, { loading: updateLessonProgressLoading }] = useMutation(UpdateLessonProgressDocument, {
        onCompleted: (data) => {
            setLoadingLessonId(null);
            const myCoursesPath = path.includes("my-courses");
            router.push(myCoursesPath ? `/my-courses/${courseId}/lesson/${data.updateLessonProgress._id}` : `/courses/${courseId}/lesson/${data.updateLessonProgress._id}`);
        },
        onError: (error) => {
            setLoadingLessonId(null);
            notifications.show({
                title: "Error",
                message: error.message,
                color: "red"
            })
        }
    })

    if (loading) {
        return (
            <Center p="xl">
                <Loader size="sm" color="blue" />
            </Center>
        );
    }

    if (error) {
        return <Text c="red" size="sm">Error loading modules</Text>;
    }

    const modules = data?.getCourseModuleByCourseId?.docs || [];

    if (modules.length === 0) {
        return <Text c="dimmed" size="sm" ta="center" py="md">No modules found for this course.</Text>;
    }

    let lastItemCompleted = true; // The first item is always sequentially unlocked.
    const computedModules = modules.map(module => {
        const computedLessons = (module.lessons || []).map(lesson => {
            const sequentialUnlock = lastItemCompleted || lesson.isUnlocked;
            const isActuallyUnlocked = !!isEnrolled && sequentialUnlock;
            lastItemCompleted = lesson.status?.toLowerCase() === Lesson_Status.Completed.toLowerCase();
            return { ...lesson, isUnlocked: isActuallyUnlocked };
        });

        const computedQuizzes = (module.quizzes || []).map(quiz => {
            const sequentialUnlock = lastItemCompleted;
            const isActuallyUnlocked = !!isEnrolled && sequentialUnlock;
            lastItemCompleted = (quiz.score !== null && quiz.score !== undefined && quiz.score >= quiz.passing_score);
            return { ...quiz, isUnlocked: isActuallyUnlocked };
        });

        return { ...module, lessons: computedLessons, quizzes: computedQuizzes };
    });

    const handleLessonClick = (lesson: LessonForStudentResponse) => {
        if (lesson.isUnlocked) {
            setLoadingLessonId(lesson._id);
            updateLessonProgress({
                variables: {
                    lessonId: lesson._id,
                    operation: lesson.status === Lesson_Status.NotStarted ? Lesson_Operation.Start : Lesson_Operation.Visit
                }
            })
        }
    }
    return (
        <Accordion variant="separated" radius="md">
            {computedModules.map((module, index) => (
                <Accordion.Item key={module._id} value={module._id} mb="sm" style={{ border: `1px solid ${COLORS.border.glass}`, backgroundColor: COLORS.background.secondary }}>
                    <Accordion.Control icon={
                        <ThemeIcon variant="light" color="blue" size="sm" radius="xl">
                            <Text size="xs" fw={700}>{index + 1}</Text>
                        </ThemeIcon>
                    } styles={{ control: { color: "white" } }}>
                        <Text fw={600} style={{ color: COLORS.text.primary }}>{module.title}</Text>
                        {module.description && <Text size="xs" c="dimmed" lineClamp={1}>{module.description}</Text>}
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Stack gap="xs">
                            {module.lessons?.map((lesson) => (
                                <Paper
                                    key={lesson._id}
                                    p="sm"
                                    radius="sm"
                                    withBorder
                                    style={{
                                        borderColor: lesson._id === activeLessonId ? COLORS.primary.light : COLORS.border.glass,
                                        backgroundColor: lesson._id === activeLessonId ? "rgba(59, 130, 246, 0.1)" : "rgba(255,255,255,0.02)"
                                    }}
                                >
                                    <Group justify="space-between">
                                        <Group gap="sm">

                                            <PlayCircle size={16} color={lesson._id === activeLessonId ? COLORS.primary.main : COLORS.text.primary} />

                                            <Text
                                                size="sm"
                                                style={{
                                                    color: lesson._id === activeLessonId ? COLORS.accent.blue : COLORS.text.secondary,
                                                    fontWeight: lesson._id === activeLessonId ? 700 : 400
                                                }}
                                            >
                                                {lesson.title}
                                            </Text>
                                        </Group>
                                        {/* <Text size="xs" c="dimmed">{lesson.lesson_type}</Text> */}
                                        <Flex align="center" gap="sm">

                                            <Text size="xs" c="dimmed">{lesson.duration_minutes} minutes</Text>
                                            {
                                                lesson.isUnlocked ? (
                                                    <Button
                                                        variant={"transparent"}
                                                        loading={updateLessonProgressLoading && loadingLessonId === lesson._id}
                                                        disabled={updateLessonProgressLoading || lesson._id === activeLessonId}
                                                        size="xs"
                                                        leftSection={<PlayCircle size={14} />}
                                                        onClick={() => handleLessonClick(lesson)}
                                                        color={lesson._id === activeLessonId ? "blue" : "gray"}
                                                    >
                                                        {lesson._id === activeLessonId ? "Playing" : lesson.status?.toLowerCase() === Lesson_Status.NotStarted.toLowerCase() ? "Start Lesson" : lesson.status?.toLowerCase() === Lesson_Status.InProgress.toLowerCase() ? "Continue Lesson" : "View Lesson"}
                                                    </Button>

                                                ) : lesson.isUnlocked === false ? (
                                                    <ThemeIcon variant="light" color="gray" size="sm" radius="xl" style={{ opacity: 0.5 }}>
                                                        <Lock size={12} />
                                                    </ThemeIcon>
                                                ) : null
                                            }
                                        </Flex>
                                    </Group>
                                </Paper>
                            ))}
                            {(!module.lessons || module.lessons.length === 0) && (
                                <Text size="xs" c="dimmed" fs="italic">No lessons in this module.</Text>
                            )}

                            {module.quizzes?.map((quiz) => (
                                <Paper
                                    key={quiz._id}
                                    p="sm"
                                    radius="sm"
                                    withBorder
                                    style={{
                                        borderColor: COLORS.border.glass,
                                        backgroundColor: "rgba(255,255,255,0.02)"
                                    }}
                                >
                                    <Group justify="space-between">
                                        <Group gap="sm">
                                            <FileText size={16} color={COLORS.text.primary} />
                                            <Text
                                                size="sm"
                                                style={{
                                                    color: COLORS.text.secondary,
                                                    fontWeight: 400
                                                }}
                                            >
                                                {quiz.title}
                                            </Text>
                                        </Group>
                                        <Flex align="center" gap="sm">
                                            <Text size="xs" c="dimmed">Passing Score: {quiz.passing_score}%</Text>
                                            {
                                                quiz.isUnlocked ? (
                                                    <Button
                                                        variant="transparent"
                                                        size="xs"
                                                        leftSection={<PlayCircle size={14} />}
                                                        onClick={() => {
                                                            const basePath = path.includes("my-courses") ? `/my-courses/${courseId}` : `/courses/${courseId}`;
                                                            router.push(`${basePath}/quiz/${quiz._id}`);
                                                        }}
                                                    >
                                                        {quiz.score !== null && quiz.score !== undefined && quiz.score >= quiz.passing_score ? "Retake Quiz" : "Start Quiz"}
                                                    </Button>
                                                ) : quiz.isUnlocked === false ? (
                                                    <ThemeIcon variant="light" color="gray" size="sm" radius="xl" style={{ opacity: 0.5 }}>
                                                        <Lock size={12} />
                                                    </ThemeIcon>
                                                ) : null
                                            }
                                        </Flex>
                                    </Group>
                                </Paper>
                            ))}
                        </Stack>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}
