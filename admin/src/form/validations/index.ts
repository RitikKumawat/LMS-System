import { addCourseSchema } from "./addCourse.validation";
import { addCourseModuleSchema } from "./addCourseModule.validation";
import { addLessonSchema } from "./addLesson.validation";
import { loginFormValidationSchema } from "./loginForm.validation";

export const VALIDATIONS = {
    loginForm:loginFormValidationSchema,
    addCourse:addCourseSchema,
    addCourseModule:addCourseModuleSchema,
    addLesson:addLessonSchema
}