import { Flex, Text, Badge, ActionIcon } from "@mantine/core";
import { GripVertical, PlayCircle, SquarePen, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DeleteLessonDocument,
  GetAllCourseModulesDocument,
  LessonResponse,
} from "../../generated/graphql";
import { openLessonModal } from "../modals/lesson/openLessonModal";
import { useMutation } from "@apollo/client/react";
import { notifications } from "@mantine/notifications";
import { openConfirmModal } from "../modals/confirmation-modals/ConfirmationModal";

const SortableLessonItem = ({
  lesson,
  module_id,
}: {
  lesson: LessonResponse;
  module_id: string;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [deleteLesson, { loading }] = useMutation(DeleteLessonDocument, {
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
  const handleDeleteLesson = (lessonId: string) => {
    openConfirmModal({
      title: "Delete Lesson",
      message:
        "This will permanently delete this lesson. This action cannot be undone.",
      confirmText: "Delete",
      onConfirm: async () => {
        await deleteLesson({
          variables: {
            lessonId: lessonId,
          },
        });
      },
      loading: loading,
      loadingText: "Deleting...",
    });
  };

  return (
    <Flex
      ref={setNodeRef}
      style={style}
      align="center"
      justify="space-between"
      py={8}
      px={10}
      w={"100%"}
      bg={"white"}
      bdrs={"md"}
    >
      <Flex align="center" gap="sm">
        <div {...attributes} {...listeners}>
          <GripVertical style={{ cursor: "pointer" }} size={14} />
        </div>
        <Flex gap={"lg"} align={"center"}>
          <Text size="sm">{lesson.title}</Text>
          <Flex gap={"5px"}>
            <ActionIcon
              color="green"
              variant="light"
              onClick={(e) => {
                e.preventDefault();
                openLessonModal({
                  lesson_id: lesson._id,
                  module_id: module_id,
                });
              }}
            >
              <SquarePen size={14} style={{ cursor: "pointer" }} />
            </ActionIcon>
            <ActionIcon
              color="red"
              variant="light"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleDeleteLesson(lesson._id);
              }}
            >
              <Trash2
                style={{ cursor: "pointer" }}
                size={14}
                color="red"
              />
            </ActionIcon>
          </Flex>
        </Flex>
      </Flex>

      <Flex align="center" gap="sm">
        <Text size="xs" c="dimmed">
          {lesson.duration_minutes} min
        </Text>
        {lesson.is_preview && (
          <Badge size="xs" color="green" leftSection={<PlayCircle size={12} />}>
            Preview
          </Badge>
        )}
      </Flex>
    </Flex>
  );
};

export default SortableLessonItem;
