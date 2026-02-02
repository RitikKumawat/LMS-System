"use client";

import { useQuery } from "@apollo/client/react";
import { FindAllCoursesDocument } from "@/generated/graphql";
import { Container, Grid, Title, Text, Card, Image, Badge, Group, Button, Pagination, Center, Loader, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { COLORS } from "@/assets/colors/colors";
import FCard from "@/components/ui/FCard";
import classes from "./index.module.scss";
export default function ExplorePage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const limit = 9;

    const { data, loading, error } = useQuery(FindAllCoursesDocument, {
        variables: {
            paginationInput: { page, limit },
            courseFilters: {},
        },
    });

    if (loading) {
        return (
            <Center h="100%" w="100%">
                <Loader color="blue" />
            </Center>
        )
    }

    if (error) {
        return <Text c="red">Error loading courses: {error.message}</Text>;
    }

    const courses = data?.getPublishedCourses?.docs || [];
    const meta = data?.getPublishedCourses;

    return (
        <Container size="xl" py="xl">
            <Stack gap="lg">
                <Title order={2} style={{ color: COLORS.text.primary }}>Explore Courses</Title>

                <Grid>
                    {courses.map((course) => (
                        <Grid.Col key={course._id} span={{ base: 12, sm: 6, md: 4 }}>
                            <FCard glass animate3d className={classes.card}>
                                <Card
                                    style={{
                                        backgroundColor: COLORS.background.secondary,
                                        borderColor: COLORS.border.glass,
                                        cursor: "pointer",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                    onClick={() => router.push(`/explore/${course._id}`)}
                                >
                                    <Card.Section>
                                        <Image
                                            src={course.thumbnail_url ? `${course.thumbnail_url}` : "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"}
                                            height={160}
                                            alt={course.title}
                                        />
                                    </Card.Section>

                                    <Stack justify="space-between" mt="md" gap="xs" style={{ flex: 1 }}>
                                        <div>
                                            <Group justify="space-between" mb="xs">
                                                <Badge color="blue" variant="light">
                                                    {course.category_name || "General"}
                                                </Badge>
                                                <Text size="sm" c="dimmed">{course.level}</Text>
                                            </Group>

                                            <Text fw={500} lineClamp={2} style={{ color: COLORS.text.primary }}>{course.title}</Text>
                                            <Text size="sm" c="dimmed" lineClamp={3} mt="xs" dangerouslySetInnerHTML={{ __html: course.description as string }}>

                                            </Text>
                                        </div>

                                        <Group justify="space-between" mt="md">
                                            <Text fw={700} size="xl" style={{ color: COLORS.text.primary }}>
                                                ₹{course.price}
                                            </Text>
                                            <Button variant="light" color="blue" radius="md">
                                                View Details
                                            </Button>
                                        </Group>
                                    </Stack>
                                </Card>
                            </FCard>
                        </Grid.Col>
                    ))}
                </Grid>

                {meta && meta.totalPages > 1 && (
                    <Center mt="xl">
                        <Pagination
                            total={meta.totalPages}
                            value={page}
                            onChange={setPage}
                            color="blue"
                        />
                    </Center>
                )}
            </Stack>
        </Container>
    );
}
