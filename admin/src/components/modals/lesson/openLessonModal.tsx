import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import classes from "./index.module.scss";
import AddLessonModal from "./AddLessonModal";
interface Iprops{
  lesson_id?:string;
  module_id:string;
}
export const openLessonModal = ({lesson_id,module_id}:Iprops) => {
  modals.open({
    modalId: "module-lesson-modal",
    title: (
      <Text>Course Module Details</Text>
    ),
    centered: true,
    trapFocus: false,        // 🔥 prevents focus scroll
    returnFocus: false,     // 🔥 prevents jump back 
    children: (
      <AddLessonModal lesson_id={lesson_id as string} module_id={module_id} />
    ),
    size: 700,
    classNames: { content: classes.container, header: classes.headerModal },
  });
};