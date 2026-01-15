import { Accordion, Box, Flex, Text } from "@mantine/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { CourseModuleResponse } from "../../generated/graphql";
import FButton from "../../ui/FButton/FButton";
import classes from "./index.module.scss";
import { openLessonModal } from "../modals/lesson/openLessonModal";

const SortableModuleItem = ({
  module,
  lessons,
}: {
  module: CourseModuleResponse;
  lessons: string[];
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: module._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
            <Text fw={600}>{module.title}</Text>
            <Text>{module.description}</Text>
          </div>
        </Flex>
      </Accordion.Control>

      <Accordion.Panel>
        {/* Lessons go here */}
        {lessons.length > 0 ? (
          <Text size="sm" c="dimmed">
            Lessons will appear here
          </Text>
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
            <Box style={{ width: "fit-content" }}>
              <FButton
                handleClick={() =>
                  openLessonModal({ lesson_id: "", module_id: module._id })
                }
                title="Add Lesson"
                variant="dark"
              />
            </Box>
          </Flex>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default SortableModuleItem;
