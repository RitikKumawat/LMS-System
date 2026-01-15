import { Eye, EyeOff, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableActions from "./TableActions";
import { ROUTES } from "../../enum/routes";
import {
  CourseResponse,
  GetAllCoursesDocument,
  TogglePublishStatusDocument,
} from "../../generated/graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import { notifications } from "@mantine/notifications";

type Props = {
  course: CourseResponse;
};

const CourseTableActions = ({ course }: Props) => {
  const navigate = useNavigate();
  const { refetch } = useQuery(GetAllCoursesDocument, {
    variables: { courseFilters:{},paginationInput:{limit:10,page:1} },
  });
  const [togglePublish] = useMutation(TogglePublishStatusDocument, {
    onCompleted: async (data) => {
      notifications.show({
        message: data.togglePublishStatus,
        color: "green",
      });
      await refetch();
    },
    onError: (error) =>
      notifications.show({
        message: error.message,
        color: "red",
      }),
  });
  return (
    <TableActions<CourseResponse>
      row={course}
      actions={[
        {
          label: "Edit",
          icon: <SquarePen size={18} />,
          color: "blue",
          onClick: (row) => navigate(`${ROUTES.COURSES}/${row._id}`),
        },
        {
          label: course.is_published ? "Unpublish" : "Publish",
          icon: course.is_published ? <EyeOff size={18} /> : <Eye size={18} />,
          color: course.is_published ? "red" : "teal",
          onClick: (row) => {
            togglePublish({ variables: { courseId: row._id } });
          },
        },
      ]}
    />
  );
};

export default CourseTableActions;
