import * as Yup from "yup";
export const addCourseModuleSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3)
    .max(100),

  description: Yup.string()
    .required("Description is required")
    .min(10)
    .max(1000),
});