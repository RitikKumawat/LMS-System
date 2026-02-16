"use client";
import { useQuery } from "@apollo/client/react";
import { FindAllCoursesDocument, GetUserCoursesDocument } from "@/generated/graphql";
import { Container, Grid, Title, Text, Card, Image, Badge, Group, Button, Pagination, Center, Loader, Stack, Box } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { COLORS } from "@/assets/colors/colors";
import CourseListCard from "@/components/course/CourseListCard";
import classes from "./index.module.scss";

export default function MyCourses() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const limit = 9;

    const { data, loading, error } = useQuery(GetUserCoursesDocument, {
        variables: {
            paginationInput: { page, limit },
            courseFilters: {
                isPurchased: true,
            },
        },
    });

    if (loading) {
        return (
            <Center h="100vh" w="100%" style={{ backgroundColor: COLORS.background.primary }}>
                <Loader color="blue" />
            </Center>
        )
    }

    if (error) {
        return <Text c="red">Error loading courses: {error.message}</Text>;
    }

    const courses = data?.getUserCourses?.docs || [];
    const meta = data?.getUserCourses;

    const PageContent = (
        <Container size="xl" py="xl">
            <Stack gap="lg">
                <Title order={2} style={{ color: COLORS.text.primary }}>My Courses</Title>

                <Stack gap="md">
                    {courses.map((course) => (
                        <CourseListCard
                            key={course._id}
                            course={course}
                            onViewDetails={() => router.push(`/my-courses/${course._id}`)}
                        />
                    ))}
                </Stack>

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



    return (
        <>
            {PageContent}

        </>
    );
}
