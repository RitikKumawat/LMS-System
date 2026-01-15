import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import AddCourseModuleModal from "./AddCourseModuleModal";
import classes from "./index.module.scss";
interface Iprops{
  courseModuleId?:string;
  course_id:string;
}
export const openCourseModuleModal = ({course_id,courseModuleId}:Iprops) => {
  modals.open({
    modalId: "course-module-modal",
    title: (
      <Text>Course Module Details</Text>
    ),
    centered: true,
    children: (
      <AddCourseModuleModal courseModuleId={courseModuleId} course_id={course_id} />
    ),
    size: 550,
    classNames: { content: classes.container, header: classes.headerModal },
  });
};