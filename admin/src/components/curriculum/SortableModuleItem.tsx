import { Accordion, ActionIcon, Box, Flex, Text } from "@mantine/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, SquarePen, Trash2 } from "lucide-react";
import {
  CourseModuleResponse,
  DeleteCourseModuleDocument,
  GetAllCourseModulesDocument,
  LessonResponse,
  QuizResponse,
  ReorderLessonsDocument,
} from "../../generated/graphql";
import FButton from "../../ui/FButton/FButton";
import classes from "./index.module.scss";
import { openLessonModal } from "../modals/lesson/openLessonModal";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import SortableLessonItem from "./SortableLessonItem";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { openCourseModuleModal } from "../modals/course-module/openCourseModuleModal";
import { useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { openConfirmModal } from "../modals/confirmation-modals/ConfirmationModal";
import { openQuizModal } from "../modals/quiz/openQuizModal";
import QuizItem from "./QuizItem";

const SortableModuleItem = ({
  module,
  lessons,
  quizzes,
}: {
  module: CourseModuleResponse;
  lessons: LessonResponse[];
  quizzes: QuizResponse[];
}) => {
  const { id } = useParams<{ id: string }>();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: module._id });
  const [stateLessons, setStateLessons] = useState<LessonResponse[]>([]);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStateLessons(lessons);
  }, [lessons]);
  const [reorderLessons] = useMutation(ReorderLessonsDocument);
  const [deleteModule, { loading }] = useMutation(DeleteCourseModuleDocument, {
    onCompleted: () => {
      notifications.show({
        message: "Module Deleted Successfully",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        message: error.message,
        color: "red",
      });
    },
    refetchQueries: [GetAllCourseModulesDocument],
  });
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setStateLessons((items) => {
      const oldIndex = items.findIndex((i) => i._id === active.id);
      const newIndex = items.findIndex((i) => i._id === over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);

      reorderLessons({
        variables: {
          reorderLessonInput: {
            lessonIds: reordered.map((m) => m._id),
            moduleId: module._id,
          },
        },
      });
      return reordered;
    });
  };
  const handleDeleteModule = (moduleId: string) => {
    openConfirmModal({
      title: "Delete Module",
      message:
        "This will permanently delete this module and all its lessons. This action cannot be undone.",
      confirmText: "Delete",
      onConfirm: async () => {
        await deleteModule({
          variables: {
            moduleId,
          },
        });
      },
      loading: loading,
      loadingText: "Deleting...",
    });
  };
  return (
    <Accordion.Item
      ref={setNodeRef}
      value={module._id}
      style={style}
      classNames={{ item: classes.accordionItem }}
    >
      <Accordion.Control>
        <Flex align="center" gap="sm">
          {/* Drag Handle */}
          <div {...attributes} {...listeners}>
            <GripVertical size={16} />
          </div>
          <div>
            <Flex align={"center"} gap={"lg"}>
              <Text fw={600}>{module.title}</Text>
              <Flex gap={"5px"}>
                <ActionIcon
                  component="div"
                  color="green"
                  variant="light"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    openCourseModuleModal({
                      course_id: id as string,
                      courseModuleId: module._id,
                    });
                  }}
                >
                  <SquarePen size={14} color="green" />
                </ActionIcon>
                <ActionIcon
                  component="div"
                  color="red"
                  variant="light"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDeleteModule(module._id);
                  }}
                >
                  <Trash2 size={14} color="red" />
                </ActionIcon>
              </Flex>
            </Flex>
            <Text>{module.description}</Text>
          </div>
        </Flex>
      </Accordion.Control>

      <Accordion.Panel>
        {/* Lessons go here */}
        <Flex direction={"column"} align={"center"} gap={"lg"}>
          {stateLessons.length > 0 ? (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={stateLessons.map((m) => m._id)}
                strategy={verticalListSortingStrategy}
              >
                <Accordion
                  multiple
                  classNames={{ root: classes.accordionRoot }}
                >
                  {stateLessons.map((lesson) => (
                    <SortableLessonItem
                      key={lesson._id}
                      lesson={lesson}
                      module_id={module._id}
                    />
                  ))}
                </Accordion>
              </SortableContext>
            </DndContext>
          ) : (
            <Flex
              gap={"md"}
              direction={"column"}
              justify={"center"}
              align={"center"}
              w={"fit-content"}
              style={{ margin: "0 auto" }}
            >
              <Text size="sm" c="dimmed">
                No lesson added in this module
              </Text>
            </Flex>
          )}

          {quizzes && quizzes.length > 0 && (
            <Flex direction={"column"} gap={"sm"} w={"100%"}>
              <Text size="sm" fw={600} c="dimmed">Quizzes</Text>
              {quizzes.map((quiz) => (
                <QuizItem key={quiz._id} quiz={quiz} module_id={module._id} />
              ))}
            </Flex>
          )}
          <Flex gap={"lg"} align={"center"} style={{ width: "fit-content" }}>
            <FButton
              handleClick={() =>
                openLessonModal({ lesson_id: "", module_id: module._id })
              }
              title="Add Lesson"
              variant="dark"
            />
            {
              stateLessons.length > 0 && (
                <FButton
                  handleClick={() =>
                    openQuizModal({ courseModuleId: module._id, quiz_id: "" })
                  }
                  title="Add Quiz"
                  variant="outline"
                />
              )
            }
          </Flex>
        </Flex>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default SortableModuleItem;
