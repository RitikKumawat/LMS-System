import * as yup from "yup";

export const signupValidationSchema = (step: "details" | "otp") =>
  yup.object({
    name:
      step === "details"
        ? yup
            .string()
            .min(2, "Name must be at least 2 characters")
            .required("Name is required")
        : yup.string().notRequired(),

    email: yup.string().email("Invalid email").required("Email is required"),

    otp:
      step === "otp"
        ? yup
            .string()
            .length(6, "OTP must be 6 digits")
            .required("OTP is required")
        : yup.string().notRequired(),
  });
