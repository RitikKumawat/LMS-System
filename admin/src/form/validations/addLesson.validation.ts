import * as Yup from "yup";

export const addLessonSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  duration_minutes: Yup.number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 minute"),
  // order: Yup.number().required("Order is required"),
  is_preview: Yup.boolean(),
  content: Yup.string().required("Content is required"),
  // video: Yup.mixed().when("video_url", {
  //   is: (value: string) => !value,
  //   then: (schema) => schema.required("Video is required"),
  //   otherwise: (schema) => schema.nullable(),
  // }),
  // pdf: Yup.mixed().nullable(),
});
