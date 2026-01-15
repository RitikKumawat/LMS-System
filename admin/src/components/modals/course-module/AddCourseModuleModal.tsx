import { useForm } from "@mantine/form";
import { memo, useEffect } from "react";
import { INITIAL_VALUES } from "../../../form/initial-values";
import { yupResolver } from "mantine-form-yup-resolver";
import { VALIDATIONS } from "../../../form/validations";
import FInput from "../../../ui/FInput/FInput";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CreateCourseModuleDocument,
  GetAllCourseModulesDocument,
  GetCourseModuleByIdDocument,
} from "../../../generated/graphql";
import FButton from "../../../ui/FButton/FButton";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { Flex } from "@mantine/core";
interface Iprops {
  courseModuleId?: string;
  course_id:string
}
const AddCourseModuleModal = ({ courseModuleId,course_id }: Iprops) => {
  const { data } = useQuery(GetCourseModuleByIdDocument, {
    variables: {
      courseModuleId: courseModuleId as string,
    },
  });
  const [createCourseModule, { loading }] = useMutation(
    CreateCourseModuleDocument,
    {
      onCompleted() {
        notifications.show({
          message: "Course Module Details Added",
          color: "green",
        });
        modals.close('course-module-modal');
      },
      onError(error) {
        notifications.show({
          message: error.message,
          color: "red",
        });
      },
      refetchQueries:[GetAllCourseModulesDocument]
    },
  );

  const form = useForm({
    initialValues: INITIAL_VALUES.addCourseModule,
    validate: yupResolver(VALIDATIONS.addCourseModule),
  });

  useEffect(() => {
    if (courseModuleId && data?.getCourseModuleById) {
      form.setValues({
        title: data.getCourseModuleById.title,
        description: data.getCourseModuleById.description as string,
      });
    }
  });
  const handleSubmit = async (values: typeof form.values) => {
    await createCourseModule({
      variables: {
        createCourseModuleInput: {
          course_id: course_id,
          title: values.title,
          description: values.description,
          id: courseModuleId,
        },
      },
    });
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Flex direction={'column'} gap={"md"} justify={"center"}>
        <FInput
        label="Enter Module's Title"
        placeholder="Enter Title for the Module"
        {...form.getInputProps("title")}
        formHandler={form.getInputProps("title")}
      />
      <FInput
        label="Enter Module's Description"
        placeholder="Enter Description for the Module"
        {...form.getInputProps("description")}
        formHandler={form.getInputProps("description")}
      />
      <FButton
        title={courseModuleId ? "Update Course Module" : "Add Course Module"}
        variant="dark"
        type="submit"
        disabled={loading}
        loading={loading}
      />
      </Flex>
    </form>
  );
};

export default memo(AddCourseModuleModal);
