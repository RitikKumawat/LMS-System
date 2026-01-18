import { loginValidationSchema } from "./login.validation";
import { signupValidationSchema } from "./signup.validation";

export const VALIDATIONS ={
    login:loginValidationSchema,
    signup:signupValidationSchema,
}