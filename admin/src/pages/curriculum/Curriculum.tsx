import {
  Accordion,
  Box,
  Center,
  Flex,
  Loader,
  Stepper,
  Text,
  Paper,
} from "@mantine/core";
import FButton from "../../ui/FButton/FButton";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "../../enum/routes";
import classes from "../add-course/index.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CourseModuleResponse,
  GetAllCourseModulesDocument,
  ReorderCourseModulesDocument,
} from "../../generated/graphql";
import { CONSTANT } from "../../constants";
import { COLORS } from "../../assets/colors/colors";
import { useEffect, useRef, useState } from "react";

import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableModuleItem from "../../components/curriculum/SortableModuleItem";
import { openCourseModuleModal } from "../../components/modals/course-module/openCourseModuleModal";

const PAGE_LIMIT = CONSTANT.PAGE_LIMIT;

const Curriculum = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  /* ----------------------------- GRAPHQL QUERY ----------------------------- */
  const { data, loading, fetchMore } = useQuery(
    GetAllCourseModulesDocument,
    {
      variables: {
        courseId: id as string,
        paginationInput: {
          limit: PAGE_LIMIT,
          page: 1,
        },
      },
      fetchPolicy: "network-only"
    }
  );

  /* ----------------------------- LOCAL STATE ----------------------------- */
  const [modules, setModules] = useState<CourseModuleResponse[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /* -------------------- SYNC API DATA → LOCAL STATE -------------------- */
  useEffect(() => {
    if (!loading && data?.getAllCourseModules?.docs) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModules(data.getAllCourseModules.docs);
      setHasMore(data.getAllCourseModules.hasNextPage);
      setPage(1);
    }
  }, [loading, data]);

  const [reorderModules] = useMutation(ReorderCourseModulesDocument);

  /* --------------------------- INFINITE SCROLL --------------------------- */
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;

        const nextPage = page + 1;

        const result = await fetchMore({
          variables: {
            paginationInput: {
              limit: PAGE_LIMIT,
              page: nextPage,
            },
          },
        });

        const newDocs =
          result.data?.getAllCourseModules?.docs ?? [];

        if (newDocs.length === 0) {
          setHasMore(false);
          return;
        }

        setModules((prev) => [...prev, ...newDocs]);
        setPage(nextPage);
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [page, hasMore, loading, fetchMore]);

  /* ------------------------------- DND HANDLER ------------------------------- */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setModules((items) => {
      const oldIndex = items.findIndex(
        (i) => i._id === active.id
      );
      const newIndex = items.findIndex(
        (i) => i._id === over.id
      );
      const reordered = arrayMove(items, oldIndex, newIndex);
      reorderModules({
        variables: {
          reorderCourseModulesInput: {
            courseId: id as string,
            moduleIds: reordered.map((m) => m._id),
          },
        },
      });
      return reordered;
    });
  };

  /* ---------------------------------- UI ---------------------------------- */
  return (
    <div>
      {/* ------------------------------ HEADER ------------------------------ */}
      <Box className={classes.stepperContainer}>
        <Flex gap="lg" align="center">
          <FButton
            variant="outline"
            size="xs"
            handleClick={() =>
              navigate(ROUTES.COURSES + `/${id}`)
            }
            leftIcon={<ArrowLeft size={15} />}
            title=""
          />
          <Text fw={600} size="24px">
            Add Curriculum Details
          </Text>
        </Flex>

        <Stepper active={1} w="70%">
          <Stepper.Step label="Course Details" />
          <Stepper.Step label="Curriculum" />
          <Stepper.Step label="Review & Publish" />
        </Stepper>
      </Box>

      {/* ------------------------------ CONTENT ------------------------------ */}
      <Paper shadow="sm" radius="md" p="xl" withBorder mt="xl">
        {loading && modules.length === 0 ? (
          <Center h="50vh">
            <Loader size="md" color={COLORS.primaryBlueDark} />
          </Center>
        ) : modules.length === 0 ? (
          /* --------------------------- EMPTY STATE --------------------------- */
          <Center h="50vh">
            <Flex direction="column" gap="md" align="center">
              <Text c="dimmed" size="lg" fw={500}>No modules created yet</Text>
              <Text c="dimmed" size="sm" mb="md">Start building your course by adding your first module.</Text>
              <FButton
                variant="dark"
                title="Add Your First Module"
                handleClick={() => {
                  openCourseModuleModal({ course_id: id as string });
                }}
              />
            </Flex>
          </Center>
        ) : (
          <>
            {/* ------------------------ ADD MODULE CTA ------------------------ */}
            <Flex justify="space-between" align="center" mb="xl" pb="md" style={{ borderBottom: '1px solid #eee' }}>
              <Text fw={600} size="lg">Course Modules</Text>
              <FButton
                variant="dark"
                title="+ Add Module"
                size="sm"
                handleClick={() => {
                  console.log("ADD MODULE CLICKED")
                  openCourseModuleModal({ course_id: id as string });
                }}
              />
            </Flex>

            {/* -------------------------- DND + LIST -------------------------- */}
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={modules.map((m) => m._id)}
                strategy={verticalListSortingStrategy}
              >
                <Accordion multiple classNames={{ root: classes.accordionRoot }}>
                  {modules.map((module) => (
                    <SortableModuleItem
                      key={module._id}
                      module={module}
                      lessons={module.lessons}
                      quizzes={module.quizzes}
                    />
                  ))}
                </Accordion>
              </SortableContext>
            </DndContext>

            {/* ----------------------- INFINITE SCROLL ----------------------- */}
            <div ref={observerRef} />

            {hasMore && (
              <Center mt="md">
                <Loader size="sm" />
              </Center>
            )}

            {/* Next Button */}
            <Flex justify="flex-end" mt="xl" pt="md" style={{ borderTop: '1px solid #eee' }}>
              <FButton
                title="Next: Review"
                variant="dark"
                handleClick={() => navigate(ROUTES.COURSE_REVIEW + `/${id}`)}
              />
            </Flex>
          </>
        )}
      </Paper>
    </div>
  );
};

export default Curriculum;
