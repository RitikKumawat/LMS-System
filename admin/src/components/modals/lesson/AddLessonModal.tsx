import { useForm } from "@mantine/form";
import { memo, useEffect } from "react";
import { INITIAL_VALUES } from "../../../form/initial-values";
import { yupResolver } from "mantine-form-yup-resolver";
import { VALIDATIONS } from "../../../form/validations";
import FInput from "../../../ui/FInput/FInput";
import { useMutation, useQuery } from "@apollo/client/react";
// import {
//   CreateLessonDocument,
//   GetLessonByIdDocument,
//   UpdateLessonDocument,
//   GetAllCourseModulesDocument
// } from "../../../generated/graphql";
import FButton from "../../../ui/FButton/FButton";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { Flex, Checkbox, Text, Box, Group, Progress } from "@mantine/core";
import FImageUploader from "../../../ui/FImageUploader/FImageUploader";
import RichTextEditorComponent from "../../../ui/RichTextEditor/RichTextEditorComponent";
import { scrollToFirstError } from "../../../utils/scrollToFirstError";
import { useVideoUpload } from "../../../hooks/useUploadVideo";
import { CheckCircle, Upload, XCircle } from "lucide-react";

interface Iprops {
  module_id: string;
  lesson_id?: string;
}

const AddLessonModal = ({ lesson_id, module_id }: Iprops) => {
  // const { data } = useQuery(GetLessonByIdDocument, {
  //   skip: !lesson_id,
  //   variables: {
  //     lessonId: lesson_id as string,
  //   },
  // });

  // const [createLesson, { loading: createLoading }] = useMutation(
  //   CreateLessonDocument,
  //   {
  //     onCompleted() {
  //       notifications.show({
  //         message: "Lesson Added Successfully",
  //         color: "green",
  //       });
  //       modals.closeAll();
  //     },
  //     onError(error) {
  //       notifications.show({
  //         message: error.message,
  //         color: "red",
  //       });
  //     },
  //     refetchQueries: [GetAllCourseModulesDocument],
  //   }
  // );

  // const [updateLesson, { loading: updateLoading }] = useMutation(
  //   UpdateLessonDocument,
  //   {
  //     onCompleted() {
  //       notifications.show({
  //         message: "Lesson Updated Successfully",
  //         color: "green",
  //       });
  //       modals.closeAll();
  //     },
  //     onError(error) {
  //       notifications.show({
  //         message: error.message,
  //         color: "red",
  //       });
  //     },
  //     refetchQueries: [GetAllCourseModulesDocument],
  //   }
  // );

  const form = useForm({
    initialValues: INITIAL_VALUES.addLesson,
    validate: yupResolver(VALIDATIONS.addLesson),
  });

  // useEffect(() => {
  //   if (lesson_id && data?.getLessonById) {
  //     const lesson = data.getLessonById;
  //     form.setValues({
  //       title: lesson.title,
  //       content: lesson.content || "",
  //       duration_minutes: lesson.duration_minutes,
  //       order: lesson.order,
  //       is_preview: lesson.is_preview,
  //       video_url: lesson.video_url || "",
  //       pdf_url: lesson.pdf_url || "",
  //       // Pre-fill file uploaders if URLs exist (display only, optional logic depending on component)
  //       video: lesson.video_url ? [lesson.video_url] : [],
  //       pdf: lesson.pdf_url ? [lesson.pdf_url] : [],
  //     });
  //   }
  // }, [lesson_id, data]);

  const handleSubmit = async () => {
    const validation = form.validate();

    if (validation.hasErrors) {
      scrollToFirstError(validation.errors);
      return;
    }
    console.log("VALUES", form.values);
    // if (lesson_id) {
    //     await updateLesson({
    //         variables: {
    //             updateLessonInput: {
    //                 id: lesson_id,
    //                 title: values.title,
    //                 content: values.content,
    //                 duration_minutes: values.duration_minutes,
    //                 order: values.order,
    //                 is_preview: values.is_preview,
    //             },
    //             video: values.video instanceof File ? values.video : undefined,
    //             pdf: values.pdf instanceof File ? values.pdf : undefined,
    //         },
    //     });
    // } else {
    //     await createLesson({
    //         variables: {
    //             createLessonInput: {
    //                 module_id: module_id,
    //                 title: values.title,
    //                 content: values.content,
    //                 duration_minutes: values.duration_minutes,
    //                 order: values.order,
    //                 is_preview: values.is_preview,
    //             },
    //             video: values.video instanceof File ? values.video : undefined,
    //             pdf: values.pdf instanceof File ? values.pdf : undefined,
    //         },
    //     });
    // }
  };
  const { uploadVideo, uploading, progress, videoUrl, error, reset } =
    useVideoUpload();

  useEffect(() => {
    if (videoUrl) {
      form.setFieldValue("video_url", videoUrl);
    }
  }, [videoUrl]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Flex direction={"column"} gap={"md"} justify={"center"}>
        <div id="title">
          <FInput
            label="Enter Lesson Title"
            placeholder="Enter Title for the Lesson"
            {...form.getInputProps("title")}
            formHandler={form.getInputProps("title")}
          />
        </div>

        <Flex gap="md" align={"flex-end"}>
          <div id="duration_minutes">
            <FInput
              label="Duration (minutes)"
              placeholder="Duration"
              variant="number"
              {...form.getInputProps("duration_minutes")}
              formHandler={form.getInputProps("duration_minutes")}
            />
          </div>
          <div id="is_preview">
            <Checkbox
              label="Is Preview?"
              styles={{ body: { display: "flex", alignItems: "center" } }}
              checked={form.values.is_preview}
              {...form.getInputProps("is_preview", { type: "checkbox" })}
            />
          </div>
        </Flex>

        <FImageUploader
          label="Lesson Video"
          accept="video/*"
          maxSize={100 * 1024 * 1024}
          value={[]}
          onChange={(files) => {
            const file = files[0];
            if (!file) return;
            uploadVideo(file as File);
          }}
          onClear={() => {
            reset();
            form.setFieldValue("video_url", "");
          }}
        />
        {uploading && (
          <Box
            mt="sm"
            p="md"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.2)",
            }}
          >
            <Group mb="xs" justify="space-between">
              <Group gap="xs">
                <Upload size={18} color="white" />
                <Text size="sm" fw={500} c="white">
                  Uploading video...
                </Text>
              </Group>
              <Text size="sm" fw={600} c="white">
                {progress}%
              </Text>
            </Group>

            <Progress
              value={progress}
              size="lg"
              radius="xl"
              styles={{
                root: {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                section: {
                  background:
                    "linear-gradient(90deg, #ffffff 0%, #f0f0f0 100%)",
                  transition: "width 0.3s ease",
                },
              }}
            />

            <Text size="xs" c="white" mt="xs" opacity={0.9}>
              Please don't close this window while uploading
            </Text>
          </Box>
        )}

        {/* Success State */}
        {videoUrl && !uploading && (
          <Box
            mt="sm"
            p="md"
            style={{
              background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(17, 153, 142, 0.2)",
            }}
          >
            <Group gap="xs">
              <CheckCircle size={18} color="white" />
              <Text size="sm" fw={500} c="white">
                Video uploaded successfully!
              </Text>
            </Group>
          </Box>
        )}

        {/* Error State */}
        {error && !uploading && (
          <Box
            mt="sm"
            p="md"
            style={{
              background: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(235, 51, 73, 0.2)",
            }}
          >
            <Group gap="xs">
              <XCircle size={18} color="white" />
              <Text size="sm" fw={500} c="white">
                Upload failed. Please try again.
              </Text>
            </Group>
          </Box>
        )}

        <FImageUploader
          label="Lesson PDF"
          accept=".pdf"
          maxSize={10 * 1024 * 1024} // 10MB
          value={
            Array.isArray(form.values.pdf)
              ? form.values.pdf
              : form.values.pdf
              ? [form.values.pdf]
              : []
          }
          onChange={(files) => form.setFieldValue("pdf", files)}
          onClear={() => {
            form.setFieldValue("pdf", null);
            form.setFieldValue("pdf_url", "");
          }}
          formError={form.errors.pdf?.toString()}
        />

        <Text fw={500} size="sm">
          Lesson Content
        </Text>
        <RichTextEditorComponent
          value={form.values.content}
          onChange={(val) => form.setFieldValue("content", val)}
        />
        {form.errors.content && (
          <Text c="red" size="xs">
            {form.errors.content}
          </Text>
        )}

        <FButton
          title={lesson_id ? "Update Lesson" : "Add Lesson"}
          variant="dark"
          type="submit"
          disabled={
            uploading || (!!form.values.video && !form.values.video_url)
          }
        />
      </Flex>
    </form>
  );
};

export default memo(AddLessonModal);
