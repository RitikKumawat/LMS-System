"use client";

import { useQuery } from "@apollo/client/react";
import { FindOneCourseDocument } from "@/generated/graphql";
import { Container, Title, Text, Button, Image, Group, Stack, Badge, Loader, Center, Grid, Paper, Divider, Avatar } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { COLORS } from "@/assets/colors/colors";
import { Clock, BarChart, Users, Star, ArrowLeft } from "lucide-react";
import FButton from "@/components/ui/FButton";

export default function CourseDetailPage() {
    const { courseId } = useParams();
    const router = useRouter();

    const { data, loading, error } = useQuery(FindOneCourseDocument, {
        variables: { courseId: courseId as string },
        skip: !courseId,
    });

    if (loading) {
        return (
            <Center h="100%" w="100%">
                <Loader color="blue" />
            </Center>
        )
    }

    if (error || !data?.getCourseById) {
        return <Text c="red">Error loading course details: {error?.message || "Course not found"}</Text>;
    }

    const course = data.getCourseById;

    return (
        <Container size="xl" py="xl">
            <Button
                variant="subtle"
                color="gray"
                mb="md"
                leftSection={<ArrowLeft size={16} />}
                onClick={() => router.back()}
            >
                Back to Explore
            </Button>

            <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="lg">
                        <Title style={{ color: COLORS.text.primary }}>{course.title}</Title>
                        <Text size="lg" style={{ color: COLORS.text.secondary }} dangerouslySetInnerHTML={{ __html: course.description as string }} />

                        <Group gap="md">
                            {/* Category ID is available, typically would fetch name, but showing ID or hiding for now if name unavailable */}
                            {/* <Badge color="blue" size="lg">{course.category_id}</Badge> */}
                            <Group gap={4}>
                                <Users size={16} />
                                <Text>Multi-level</Text>
                            </Group>
                        </Group>



                        {/* Removed What you will learn and Requirements as they are not in the schema */}
                    </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack gap="md">
                        <Paper shadow="sm" p="xl" radius="md" style={{ backgroundColor: COLORS.background.secondary, border: `1px solid ${COLORS.border.glass}` }}>
                            <Stack gap="md">
                                <Image
                                    src={course.thumbnail_url ? `${course.thumbnail_url}` : "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"}
                                    radius="md"
                                    alt={course.title}
                                />
                                <Group justify="space-between" align="center">
                                    <Text size="3xl" fw={700} style={{ color: COLORS.text.primary }}>₹{course.price}</Text>
                                </Group>
                                <FButton variant="primary" >Enroll Now</FButton>
                                <Text size="xs" ta="center" c="dimmed">30-day money-back guarantee</Text>

                                <Divider label="Course Features" labelPosition="center" />

                                <Stack gap="xs">
                                    <Group>
                                        <BarChart size={18} />
                                        <Text>{course.level || "All Levels"}</Text>
                                    </Group>
                                    <Group>
                                        <Text size="sm" c="dimmed">Language: {course.language}</Text>
                                    </Group>
                                </Stack>
                            </Stack>
                        </Paper>

                        <Paper shadow="sm" p="lg" radius="md" style={{ backgroundColor: COLORS.background.secondary, border: `1px solid ${COLORS.border.glass}` }}>
                            <Title order={4} mb="md" style={{ color: COLORS.text.primary }}>Instructor</Title>
                            {/* Instructor details are not directly available in the Course object, only ID */}
                            <Text fw={500} style={{ color: COLORS.text.primary }}>Instructor ID: {course.created_by}</Text>
                        </Paper>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
