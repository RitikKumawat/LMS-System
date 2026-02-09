"use client";

import { useQuery } from "@apollo/client/react";
import { GetCourseModuleByCourseIdDocument } from "@/generated/graphql";
import { Accordion, Text, Loader, Center, Stack, ThemeIcon, Group, Paper } from "@mantine/core";
import { COLORS } from "@/assets/colors/colors";
import { PlayCircle, FileText, CheckCircle } from "lucide-react";

interface CourseModulesAccordionProps {
    courseId: string;
}

export default function CourseModulesAccordion({ courseId }: CourseModulesAccordionProps) {
    const { data, loading, error } = useQuery(GetCourseModuleByCourseIdDocument, {
        variables: {
            courseId,
            paginationInput: { page: 1, limit: 100 } // Fetch all modules, adjust limit if needed
        },
        skip: !courseId,
    });

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

    // Sort modules by order if needed, assuming API returns sorted or we sort here
    // modules.sort((a, b) => a.order - b.order);

    return (
        <Accordion variant="separated" radius="md">
            {modules.map((module, index) => (
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
                            {module.lessons?.map((lesson: any) => (
                                <Paper key={lesson._id} p="sm" radius="sm" withBorder style={{ borderColor: COLORS.border.glass, backgroundColor: "rgba(255,255,255,0.02)" }}>
                                    <Group justify="space-between">
                                        <Group gap="sm">
                                            <PlayCircle size={16} color={COLORS.text.primary} />
                                            <Text size="sm" style={{ color: COLORS.text.secondary }}>{lesson.title}</Text>
                                        </Group>
                                        <Text size="xs" c="dimmed">{lesson.lesson_type}</Text>
                                        <Text size="xs" c="dimmed">{lesson.duration_minutes} minutes</Text>
                                    </Group>
                                </Paper>
                            ))}
                            {(!module.lessons || module.lessons.length === 0) && (
                                <Text size="xs" c="dimmed" fs="italic">No lessons in this module.</Text>
                            )}
                        </Stack>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}
