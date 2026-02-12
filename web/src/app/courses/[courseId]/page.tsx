"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
    CreateCourseOrderDocument,
    FindOneCourseDocument,
    GetCourseProgressDocument,
    GetOrderDocument,
    GetProfileDataDocument,
} from "@/generated/graphql";
import {
    Container,
    Title,
    Text,
    Button,
    Image,
    Group,
    Stack,
    Loader,
    Center,
    Grid,
    Paper,
    Divider,
    Box,
    Progress,
} from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { COLORS } from "@/assets/colors/colors";
import { BarChart, Users, ArrowLeft } from "lucide-react";
import FButton from "@/components/ui/FButton";
import CourseModulesAccordion from "@/components/course/CourseModulesAccordion";
import { startRazorpayPayment } from "@/lib/razorpay/startRazorpayPayment";
import { useEffect, useMemo, useRef, useState } from "react";
import { notifications } from "@mantine/notifications";
import GlassProgressBar from "@/components/ui/GlassProgressBar";

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();

    const courseId = useMemo(
        () => (typeof params.courseId === "string" ? params.courseId : null),
        [params.courseId]
    );

    /* ===================== COURSE QUERY ===================== */

    const { data, loading, error } = useQuery(
        FindOneCourseDocument,
        {
            variables: { courseId: courseId as string },
            skip: !courseId,
            fetchPolicy: "network-only",
        }
    );

    const { data: courseProgress, loading: courseProgressLoading } = useQuery(GetCourseProgressDocument, {
        variables: { courseId: courseId as string },
        skip: !courseId,
        fetchPolicy: "network-only",
    })
    /* ===================== USER QUERY ===================== */

    const { data: userData, loading: userLoading } = useQuery(GetProfileDataDocument, {
        fetchPolicy: "network-only",
        errorPolicy: "ignore"
    });

    /* ===================== CREATE ORDER ===================== */

    const [createCourseOrder, { loading: creatingOrder }] =
        useMutation(CreateCourseOrderDocument);

    /* ===================== ORDER POLLING ===================== */

    const [pollingOrderId, setPollingOrderId] =
        useState<string | null>(null);

    const errorHandledRef = useRef(false);

    const {
        data: orderData,
        startPolling,
        stopPolling,
        error: orderError,
    } = useQuery(GetOrderDocument, {
        variables: { id: pollingOrderId as string },
        skip: !pollingOrderId,
    });

    /* ===================== HANDLE POLLING ERROR ===================== */

    useEffect(() => {
        if (!orderError || !pollingOrderId || errorHandledRef.current) return;

        errorHandledRef.current = true;

        stopPolling();
        setPollingOrderId(null);

        notifications.show({
            title: "Payment error",
            message: orderError.message,
            color: "red",
        });
    }, [orderError, pollingOrderId, stopPolling]);

    /* ===================== START / STOP POLLING ===================== */

    useEffect(() => {
        if (!pollingOrderId) return;

        errorHandledRef.current = false;
        startPolling(2000);

        return () => stopPolling();
    }, [pollingOrderId, startPolling, stopPolling]);

    /* ===================== POLLING TIMEOUT ===================== */

    useEffect(() => {
        if (!pollingOrderId) return;

        const timeout = setTimeout(() => {
            stopPolling();
            setPollingOrderId(null);

            notifications.show({
                title: "Payment pending",
                message:
                    "We couldn’t confirm the payment yet. Please refresh after some time.",
                color: "orange",
            });
        }, 2 * 60 * 1000);

        return () => clearTimeout(timeout);
    }, [pollingOrderId, stopPolling]);

    /* ===================== ORDER STATUS EFFECT ===================== */

    useEffect(() => {
        if (!orderData?.getOrder) return;

        const status = orderData.getOrder.status;

        if (status === "PAID") {
            stopPolling();
            setPollingOrderId(null);

            notifications.show({
                title: "Success",
                message: "Enrolled successfully!",
                color: "green",
            });

            router.refresh();
        }

        if (status === "FAILED") {
            stopPolling();
            setPollingOrderId(null);

            notifications.show({
                title: "Payment failed",
                message: "Your payment was not successful. Please try again.",
                color: "red",
            });
        }
    }, [orderData, stopPolling, router]);

    /* ===================== LOADING / ERROR ===================== */

    if (loading || userLoading) {
        return (
            <Center h="100vh" w="100%" style={{ backgroundColor: COLORS.background.primary }}>
                <Loader color="blue" />
            </Center>
        );
    }

    if (error || !data?.getCourseById) {
        return <Text c="red">Error loading course details</Text>;
    }

    const course = data.getCourseById;

    /* ===================== HANDLER ===================== */

    const handleEnroll = async () => {
        if (!userData?.getProfileData) {
            notifications.show({
                title: "Login required",
                message: "Please login to enroll",
                color: "red",
            });
            // Redirect to login if needed, or open login modal
            router.push("/login");
            return;
        }

        try {
            const res = await createCourseOrder({
                variables: { course_id: courseId! },
            });

            const order = res.data?.createCourseOrder;
            if (!order) return;

            setPollingOrderId(order.razorpay_order_id);

            await startRazorpayPayment({
                order: {
                    razorpay_order_id: order.razorpay_order_id,
                    amount: order.amount,
                    currency: order.currency,
                },
                course: { title: course.title as string },
                user: {
                    name: userData.getProfileData.name,
                    email: userData.getProfileData.email,
                },
                onDismiss: () => {
                    stopPolling();
                    setPollingOrderId(null);

                    notifications.show({
                        title: "Payment cancelled",
                        message: "You closed the payment window.",
                        color: "yellow",
                    });
                },
            });
        } catch (err: any) {
            stopPolling();
            setPollingOrderId(null);

            notifications.show({
                title: "Error",
                message: err.message,
                color: "red",
            });
        }
    };

    /* ===================== UI ===================== */

    const PageContent = (
        <Container size="xl" py="xl">
            <Button
                variant="subtle"
                color="gray"
                mb="md"
                leftSection={<ArrowLeft size={16} />}
                onClick={() => router.push(`/courses`)}
            >
                Back to Explore
            </Button>

            <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="lg">
                        <Title style={{ color: COLORS.text.primary }}>
                            {course.title}
                        </Title>

                        <Text
                            size="lg"
                            style={{ color: COLORS.text.secondary }}
                            dangerouslySetInnerHTML={{
                                __html: course.description as string,
                            }}
                        />

                        <Group gap={4}>
                            <Users size={16} />
                            <Text>Multi-level</Text>
                        </Group>

                        <Divider label="Course Content" labelPosition="left" />
                        <CourseModulesAccordion courseId={courseId!} />
                    </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Box pos="sticky" top={60}>
                        <Paper
                            shadow="sm"
                            p="xl"
                            radius="md"
                            style={{
                                backgroundColor: COLORS.background.secondary,
                                border: `1px solid ${COLORS.border.glass}`,
                            }}
                        >
                            <Stack gap="md">
                                <Image
                                    src={
                                        course.thumbnail_url ??
                                        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                                    }
                                    radius="md"
                                    alt={course.title}
                                />

                                {
                                    !course.is_enrolled && (
                                        <Text size="3xl" fw={700}>
                                            ₹{course.price}
                                        </Text>
                                    )
                                }
                                {
                                    course.is_enrolled && courseProgress?.getCourseProgress && courseProgress?.getCourseProgress?.percentage > 0 && (
                                        <GlassProgressBar value={courseProgress?.getCourseProgress.percentage as number} />
                                    )
                                }
                                <FButton
                                    loading={creatingOrder || !!pollingOrderId}
                                    onClick={handleEnroll}
                                    disabled={course.is_enrolled || creatingOrder || !!pollingOrderId}
                                >
                                    {course.is_enrolled ? "Continue Learning" : "Enroll Now"}
                                </FButton>
                            </Stack>
                        </Paper>
                    </Box>
                </Grid.Col>
            </Grid>
        </Container>
    );



    return (
        <>
            {PageContent}

        </>
    );
}
