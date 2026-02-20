import { Paper, Text, Stack, Stepper, Flex, Box, Center, Loader, List, ThemeIcon, Grid, Image, Badge, Accordion, Divider } from "@mantine/core";
import { ArrowLeft, CheckCircle2, XCircle, LayoutTemplate, PlayCircle, HelpCircle, FileQuestion, GraduationCap, Languages, DollarSign, IndianRupeeIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { GetCourseByIdDocument, GetAllCourseModulesDocument, TogglePublishStatusDocument } from "../../generated/graphql";
import { ROUTES } from "../../enum/routes";
import FButton from "../../ui/FButton/FButton";
import classes from "../add-course/index.module.scss";
import { notifications } from "@mantine/notifications";

const ReviewCourse = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Fetch Course details
    const { data: courseData, loading: courseLoading, refetch: refetchCourse } = useQuery(GetCourseByIdDocument, {
        variables: { courseId: id as string },
        fetchPolicy: "network-only",
    });

    // Fetch Curriculum details
    const { data: modulesData, loading: modulesLoading } = useQuery(GetAllCourseModulesDocument, {
        variables: {
            courseId: id as string,
            paginationInput: {
                limit: 1000,
                page: 1,
            },
        },
        fetchPolicy: "network-only",
    });

    const [togglePublish, { loading: toggleLoading }] = useMutation(TogglePublishStatusDocument, {
        onCompleted: (data) => {
            notifications.show({
                message: data.togglePublishStatus,
                color: "green",
            });
            refetchCourse();
        },
        onError: (error) => {
            notifications.show({
                title: "Error",
                message: error.message,
                color: "red",
            });
        },
    });

    const isLoading = courseLoading || modulesLoading;
    const course = courseData?.getCourseById;
    const modules = modulesData?.getAllCourseModules?.docs || [];

    // --- Statistics Calculations ---
    const totalModules = modules.length;
    let totalLessons = 0;
    let totalQuizzes = 0;
    let totalQuestions = 0;

    modules.forEach(module => {
        totalLessons += module.lessons?.length || 0;
        totalQuizzes += module.quizzes?.length || 0;
        module.quizzes?.forEach(quiz => {
            totalQuestions += quiz.questionCount || 0;
        });
    });

    // --- Validations ---
    const hasModules = totalModules > 0;

    // Check if every module has at least one lesson
    const modulesHaveLessons = modules.every((module) => {
        return module.lessons && module.lessons.length > 0;
    });

    const quizzesHaveQuestions = modules.every((module) => {
        if (!module.quizzes || module.quizzes.length === 0) return true;
        return module.quizzes.every((quiz) => (quiz.questionCount ?? 0) > 0);
    });

    const canPublish = hasModules && quizzesHaveQuestions && modulesHaveLessons;

    const handleTogglePublish = () => {
        togglePublish({ variables: { courseId: id as string } });
    };

    return (
        <div>
            {/* HEADER */}
            <Box className={classes.stepperContainer} mb="xl">
                <Flex gap="lg" align="center">
                    <FButton
                        variant="outline"
                        size="xs"
                        handleClick={() => navigate(`${ROUTES.COURSE_CURRICULUM}/${id}`)}
                        leftIcon={<ArrowLeft size={15} />}
                        title=""
                    />
                    <Text fw={600} size="24px">
                        Review & Publish
                    </Text>
                </Flex>

                <Stepper active={2} w="70%">
                    <Stepper.Step label="Course Details" />
                    <Stepper.Step label="Curriculum" />
                    <Stepper.Step label="Review & Publish" />
                </Stepper>
            </Box>

            {/* CONTENT */}
            {isLoading ? (
                <Center h="50vh">
                    <Loader size="md" />
                </Center>
            ) : (
                <Grid gutter="xl">
                    {/* LEFT COLUMN: COURSE SUMMARY & PREVIEW */}
                    <Grid.Col span={{ base: 12, lg: 8 }}>
                        <Stack gap="xl">

                            {/* Course Overview Card */}
                            <Paper shadow="sm" radius="md" p="xl" withBorder>
                                <Text size="xl" fw={600} mb="lg">Course Overview</Text>
                                <Grid>
                                    <Grid.Col span={{ base: 12, sm: 5 }}>
                                        <Image
                                            src={course?.thumbnail_url || 'https://placehold.co/600x400?text=No+Thumbnail'}
                                            radius="md"
                                            w="100%"
                                            h={200}
                                            fit="cover"
                                            fallbackSrc="https://placehold.co/600x400?text=No+Thumbnail"
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, sm: 7 }}>
                                        <Stack gap="sm">
                                            <Text size="24px" fw={700} lh={1.2}>{course?.title}</Text>

                                            <Flex gap="md" wrap="wrap" mt="sm">
                                                <Badge size="lg" variant="light" color="blue" leftSection={<GraduationCap size={14} />}>
                                                    {course?.level}
                                                </Badge>
                                                <Badge size="lg" variant="light" color="grape" leftSection={<Languages size={14} />}>
                                                    {course?.language}
                                                </Badge>
                                            </Flex>

                                            <Flex align="center" gap="sm" mt="sm">
                                                <IndianRupeeIcon size={20} color="green" />
                                                <Text size="xl" fw={600} c="green.7">
                                                    {course?.price === 0 ? "Free" : `${course?.price}`}
                                                </Text>
                                            </Flex>
                                        </Stack>
                                    </Grid.Col>
                                </Grid>

                                <Divider my="xl" />

                                {/* Course Statistics */}
                                <Text size="lg" fw={600} mb="md">Content Statistics</Text>
                                <Grid>
                                    <Grid.Col span={3}>
                                        <Box ta="center" p="md" bg="gray.0" style={{ borderRadius: 8 }}>
                                            <LayoutTemplate size={24} color="#228be6" />
                                            <Text size="xl" fw={700} mt="sm">{totalModules}</Text>
                                            <Text size="sm" c="dimmed">Modules</Text>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Box ta="center" p="md" bg="gray.0" style={{ borderRadius: 8 }}>
                                            <PlayCircle size={24} color="#fcc419" />
                                            <Text size="xl" fw={700} mt="sm">{totalLessons}</Text>
                                            <Text size="sm" c="dimmed">Lessons</Text>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Box ta="center" p="md" bg="gray.0" style={{ borderRadius: 8 }}>
                                            <HelpCircle size={24} color="#40c057" />
                                            <Text size="xl" fw={700} mt="sm">{totalQuizzes}</Text>
                                            <Text size="sm" c="dimmed">Quizzes</Text>
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Box ta="center" p="md" bg="gray.0" style={{ borderRadius: 8 }}>
                                            <FileQuestion size={24} color="#be4bdb" />
                                            <Text size="xl" fw={700} mt="sm">{totalQuestions}</Text>
                                            <Text size="sm" c="dimmed">Questions</Text>
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Paper>

                            {/* Curriculum Preview Card */}
                            <Paper shadow="sm" radius="md" p="xl" withBorder>
                                <Text size="xl" fw={600} mb="md">Curriculum Preview</Text>
                                <Text size="sm" c="dimmed" mb="xl">This is how your course structure will appear to students.</Text>

                                {modules.length === 0 ? (
                                    <Center h={100} bg="gray.0" style={{ borderRadius: 8 }}>
                                        <Text c="dimmed">No curriculum added yet.</Text>
                                    </Center>
                                ) : (
                                    <Accordion variant="separated" radius="md">
                                        {modules.map((module, index) => (
                                            <Accordion.Item key={module._id} value={module._id}>
                                                <Accordion.Control>
                                                    <Text fw={500}>Module {index + 1}: {module.title}</Text>
                                                </Accordion.Control>
                                                <Accordion.Panel>
                                                    <Stack gap="sm">
                                                        {module.lessons?.map((lesson, lIndex) => (
                                                            <Flex key={lesson._id} align="center" gap="sm" p="sm" bg="gray.0" style={{ borderRadius: 6 }}>
                                                                <PlayCircle size={16} color="gray" />
                                                                <Text size="sm">Lesson {lIndex + 1}: {lesson.title}</Text>
                                                            </Flex>
                                                        ))}
                                                        {module.quizzes?.map((quiz, qIndex) => (
                                                            <Flex key={quiz._id} align="center" gap="sm" p="sm" bg="blue.0" style={{ borderRadius: 6 }}>
                                                                <HelpCircle size={16} color="#228be6" />
                                                                <Text size="sm" c="blue.7" fw={500}>Quiz {qIndex + 1}: {quiz.title}</Text>
                                                                <Badge size="sm" variant="outline" color="blue" ml="auto">
                                                                    {quiz.questionCount ?? 0} Qs
                                                                </Badge>
                                                            </Flex>
                                                        ))}
                                                        {(!module.lessons?.length && !module.quizzes?.length) && (
                                                            <Text size="sm" c="dimmed" fs="italic" p="sm">Empty Module</Text>
                                                        )}
                                                    </Stack>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                )}
                            </Paper>
                        </Stack>
                    </Grid.Col>

                    {/* RIGHT COLUMN: PUBLISH CARD */}
                    <Grid.Col span={{ base: 12, lg: 4 }}>
                        <Stack style={{ position: 'sticky', top: 24 }}>
                            <Paper shadow="sm" radius="md" p="xl" withBorder>
                                <Stack gap="lg">
                                    <Box style={{ borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                                        <Text size="xl" fw={600}>Publish Course</Text>
                                        <Text c="dimmed" size="sm">Review the checklist before going live.</Text>
                                    </Box>

                                    <List spacing="md" size="sm" center>
                                        <List.Item
                                            icon={
                                                <ThemeIcon color={hasModules ? "teal" : "red"} size={24} radius="xl">
                                                    {hasModules ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                                </ThemeIcon>
                                            }
                                        >
                                            <Text fw={500} c={hasModules ? "" : "red.7"}>Has at least 1 module</Text>
                                        </List.Item>

                                        <List.Item
                                            icon={
                                                <ThemeIcon color={modulesHaveLessons ? "teal" : "red"} size={24} radius="xl">
                                                    {modulesHaveLessons ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                                </ThemeIcon>
                                            }
                                        >
                                            <Text fw={500} c={modulesHaveLessons ? "" : "red.7"}>Every module has a lesson</Text>
                                        </List.Item>

                                        <List.Item
                                            icon={
                                                <ThemeIcon color={quizzesHaveQuestions ? "teal" : "red"} size={24} radius="xl">
                                                    {quizzesHaveQuestions ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                                </ThemeIcon>
                                            }
                                        >
                                            <Text fw={500} c={quizzesHaveQuestions ? "" : "red.7"}>All quizzes have questions</Text>
                                        </List.Item>
                                    </List>

                                    {(!hasModules || !quizzesHaveQuestions || !modulesHaveLessons) && !course?.is_published && (
                                        <Text size="xs" c="red.6" ta="center">
                                            Please resolve the red issues in the Curriculum to publish.
                                        </Text>
                                    )}

                                    <Divider />

                                    <FButton
                                        title={course?.is_published ? "Unpublish Course" : "Publish Course"}
                                        variant={course?.is_published ? "light" : "dark"}
                                        disabled={(!canPublish && !course?.is_published) || toggleLoading}
                                        loading={toggleLoading}
                                        handleClick={handleTogglePublish}
                                    />
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid.Col>
                </Grid>
            )}
        </div>
    );
};

export default ReviewCourse;
