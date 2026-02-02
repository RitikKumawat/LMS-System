"use client";
import { COLORS } from '@/assets/colors/colors';
import Navbar from '@/components/navbar/Navbar';
import FCard from '@/components/ui/FCard';
import { FindAllCoursesDocument } from '@/generated/graphql';
import { useQuery } from '@apollo/client/react';
import { Badge, Box, Button, Card, Center, Container, Flex, Grid, Group, Image, Loader, Pagination, Stack, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import classes from "./index.module.scss";
import FContainer from '@/ui/FContainer/FContainer';
const page = () => {
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
                <Navbar />
                <Loader color="blue" />
            </Center>
        )
    }

    if (error) {
        return <Center h={"100%"} w={"100%"}>
            <Navbar />
            <Text c="red">Error loading courses: {error.message}</Text>
        </Center>;
    }

    const courses = data?.getPublishedCourses?.docs || [];
    const meta = data?.getPublishedCourses;

    return (
        <>
            <Navbar />
            <FContainer>
                <Box mt={"10rem"}>
                    <Title order={2} style={{ color: COLORS.text.primary }}>Explore Courses</Title>

                    <Flex gap={"md"} wrap={"wrap"} mt={"1rem"}>
                        {courses.map((course) => (
                            <Box key={course._id} w={"30%"}>
                                <FCard glass className={classes.card}>
                                    <Card
                                        style={{
                                            backgroundColor: COLORS.background.secondary,
                                            borderColor: COLORS.border.glass,
                                            cursor: "pointer",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column"
                                        }}
                                        onClick={() => router.push(`/courses/${course._id}`)}
                                    >
                                        <Card.Section>
                                            <Image
                                                src={course.thumbnail_url ? `${course.thumbnail_url}` : "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"}
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
                            </Box>
                        ))}
                    </Flex>

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
                </Box>
            </FContainer>
        </>
    );
};

export default page;