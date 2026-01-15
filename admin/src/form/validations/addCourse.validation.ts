import * as Yup from "yup";

export const addCourseSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3)
    .max(100),

  description: Yup.string()
    .required("Description is required")
    .min(10)
    .max(1000),

  level: Yup.string().required("Level is required"),

  language: Yup.string().required("Language is required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .min(0)
    .required("Price is required"),

  thumbnail_url: Yup.string().nullable(),

  thumbnail: Yup.mixed<File | string>()
    .when("thumbnail_url", {
      is: (url: string | undefined) => !url,
      then: (schema) =>
        schema
          .required("Thumbnail is required")
          .test("fileOrUrl", "Unsupported file format", (value) => {
            if (!value) return false;
            if (typeof value === "string") return true;
            if (value instanceof File) {
              return ["image/jpeg", "image/png", "image/webp"].includes(
                value.type
              );
            }
            return false;
          })
          .test("fileSize", "File too large (max 5MB)", (value) => {
            if (!value || typeof value === "string") return true;
            return value.size <= 5 * 1024 * 1024;
          }),
      otherwise: (schema) => schema.notRequired(),
    }),
});
