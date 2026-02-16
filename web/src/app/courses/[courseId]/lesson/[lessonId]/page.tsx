"use client";

import { COLORS } from '@/assets/colors/colors';
import { GetCourseModuleByCourseIdDocument, GetCourseProgressDocument, GetLessonContentDocument, Lesson_Operation, Lesson_Status, UpdateLessonProgressDocument } from '@/generated/graphql';
import { useMutation, useQuery } from '@apollo/client/react';
import { Center, Loader, Grid, Stack, Title, Text, Paper, Box, Button, Flex } from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import FButton from '@/components/ui/FButton';
import classes from "./index.module.scss";
import { notifications } from '@mantine/notifications';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
const LessonPDFViewer = dynamic(() => import('@/components/lesson/LessonPDFViewer'), { ssr: false });

const LessonPage = () => {
    const params = useParams();
    const router = useRouter();

    const lessonId = useMemo(
        () => (typeof params.lessonId === "string" ? params.lessonId : null),
        [params.lessonId]
    );

    const courseId = useMemo(
        () => (typeof params.courseId === "string" ? params.courseId : null),
        [params.courseId]
    );

    const { data, loading, error } = useQuery(GetLessonContentDocument, {
        variables: {
            lessonId: lessonId as string,
            courseId: courseId as string
        },
        skip: !lessonId,
        fetchPolicy: "network-only",
    });

    const [updateLesson, { loading: updateLessonLoading }] = useMutation(UpdateLessonProgressDocument, {
        refetchQueries: [GetLessonContentDocument, GetCourseModuleByCourseIdDocument, GetCourseProgressDocument],
        onCompleted: () => {
            router.push(`/courses/${courseId}`);
        },
        onError: (err) => {
            notifications.show({
                title: "Error",
                message: err.message,
                color: "red",
            })
        }
    })

    if (loading) {
        return <Center h="100vh" w="100%" style={{ backgroundColor: COLORS.background.primary }}>
            <Loader color="blue" />
        </Center>
    }

    if (error) {
        return <Center h="100vh" w="100%" style={{ backgroundColor: COLORS.background.primary }}>
            <Text c="red">Error loading lesson</Text>
        </Center>
    }

    const lesson = data?.getLessonContent.lesson;

    if (!lesson) {
        return <Center h="100vh" w="100%" style={{ backgroundColor: COLORS.background.primary }}>
            <Text c="dimmed">Lesson not found</Text>
        </Center>
    }

    return (
        <Box p="md" style={{ backgroundColor: COLORS.background.primary, minHeight: '100vh' }}>
            <Flex className={classes.lessonHeader}>
                <Button
                    variant="subtle"
                    color="gray"
                    leftSection={<ArrowLeft size={16} />}
                    onClick={() => router.push(`/courses/${courseId}`)}
                >
                    Back to Course
                </Button>
                <FButton
                    variant='primary'
                    loading={updateLessonLoading}
                    disabled={updateLessonLoading || data.getLessonContent.status === Lesson_Status.Completed}
                    onClick={
                        () => {

                            updateLesson({
                                variables: {
                                    lessonId: lessonId as string,
                                    operation: Lesson_Operation.Completed,
                                }
                            })
                        }
                    }
                >
                    {data.getLessonContent.status === Lesson_Status.Completed ? "Completed" : "Mark as completed"}
                </FButton>
            </Flex>

            <Grid gutter="xl" mx={"1.5rem"}>
                <Grid.Col span={{ base: 12 }}>
                    <Stack gap="lg">
                        <Title order={2} style={{ color: COLORS.text.primary }}>
                            {lesson.title}
                        </Title>

                        {lesson.video_url && (
                            <Paper p="xs" radius="md" style={{ overflow: 'hidden', backgroundColor: 'black' }}>
                                <div>
                                    <ReactPlayer
                                        src={lesson.video_url}
                                        controls
                                        width="100%"
                                        height="100%"
                                    />
                                </div>
                            </Paper>
                        )}

                        {lesson.pdf_url && (
                            <Paper p="md" radius="md" withBorder style={{ backgroundColor: COLORS.background.secondary, borderColor: COLORS.border.glass }}>
                                <Text fw={600} mb="sm" style={{ color: COLORS.text.primary }}>Lesson Documents</Text>
                                <LessonPDFViewer url={lesson.pdf_url} />
                            </Paper>
                        )}

                        {lesson.content && (
                            <Paper p="xl" radius="md" style={{ backgroundColor: COLORS.background.secondary }}>
                                <div
                                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                                    style={{ color: COLORS.text.secondary, lineHeight: 1.6 }}
                                    className="lesson-content"
                                />
                            </Paper>
                        )}
                    </Stack>
                </Grid.Col>

                {/* <Grid.Col span={{ base: 12, md: 4 }}>
                    <Box pos="sticky" top={20}>
                        <Paper p="md" radius="md" style={{ backgroundColor: COLORS.background.secondary, border: `1px solid ${COLORS.border.glass}` }}>
                            <Title order={4} mb="md" style={{ color: COLORS.text.primary }}>Course Content</Title>
                            <CourseModulesAccordion courseId={courseId as string} activeLessonId={lessonId as string} />
                        </Paper>
                    </Box>
                </Grid.Col> */}
            </Grid>
        </Box>
    );
};

export default LessonPage;