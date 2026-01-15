import { Flex, Text, Badge } from "@mantine/core";
import { GripVertical, PlayCircle } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableLessonItem = ({ lesson }: { lesson: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Flex
      ref={setNodeRef}
      style={style}
      align="center"
      justify="space-between"
      py={8}
      px={10}
    >
      <Flex align="center" gap="sm">
        <div {...attributes} {...listeners}>
          <GripVertical size={14} />
        </div>
        <Text size="sm">
          {lesson.order}. {lesson.title}
        </Text>
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
