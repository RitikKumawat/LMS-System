"use client";

import { Badge, Box, Button, Group, Image, Stack, Text, Tooltip } from "@mantine/core";
import FCard from "@/components/ui/FCard";
import { COLORS } from "@/assets/colors/colors";
import GlassProgressBar from "../ui/GlassProgressBar";
import classes from "./CourseListCard.module.scss";
import { CourseResponse } from "@/generated/graphql";

interface CourseListCardProps {
    course: CourseResponse;
    onViewDetails: () => void;
}

export default function CourseListCard({ course, onViewDetails }: CourseListCardProps) {
    return (
        <FCard glass className={classes.card}>
            <div className={classes.cardContent}>
                <div className={classes.imageWrapper}>
                    <Image
                        src={course.thumbnail_url || "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"}
                        alt={course.title}
                        className={classes.image}
                    />
                </div>

                <Stack className={classes.info} gap="xs">
                    <Group justify="space-between" align="flex-start">
                        <Stack gap={4}>
                            <Group gap={8}>
                                <Badge color="blue" variant="light" size="sm">
                                    {course.category_name || "General"}
                                </Badge>
                                <Badge color="orange" variant="light" size="sm">
                                    {course.level}
                                </Badge>
                            </Group>
                            <Text fw={600} size="lg" className={classes.title} lineClamp={1}>
                                {course.title}
                            </Text>
                        </Stack>
                    </Group>

                    <Text size="sm" c="dimmed" lineClamp={2} className={classes.description} dangerouslySetInnerHTML={{ __html: course.description || "" }} />

                    {/* <Box mt="auto">
                        <GlassProgressBar value={course.progress || 0} showLabel={true} size="md" />
                    </Box> */}
                </Stack>

                <Stack className={classes.actions} justify="center" gap="md">
                    {/* <Text fw={700} size="xl" style={{ color: COLORS.text.primary }} ta="center">
                        {course.price > 0 ? `₹${course.price}` : "Free"}
                    </Text> */}
                    <Button
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'cyan' }}
                        onClick={onViewDetails}
                        fullWidth
                    >
                        View Details
                    </Button>
                </Stack>
            </div>
        </FCard>
    );
}
