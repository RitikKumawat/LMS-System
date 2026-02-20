import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import classes from "./index.module.scss";
import AddQuizModal from "./AddQuizModal";
interface Iprops {
    courseModuleId: string;
    quiz_id?: string;
}
export const openQuizModal = ({ courseModuleId, quiz_id }: Iprops) => {
    modals.open({
        modalId: "quiz-modal",
        title: (
            <Text>Quiz Details</Text>
        ),
        centered: true,
        children: (
            <AddQuizModal courseModuleId={courseModuleId} quiz_id={quiz_id} />
        ),
        size: 550,
        classNames: { content: classes.container, header: classes.headerModal },
    });
};