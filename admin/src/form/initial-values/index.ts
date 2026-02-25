import { addCourseModule } from "./add-course-module.initial-values";
import { addCourseInitialValues } from "./add-course.initial-values";
import { addLessonInitialValues } from "./add-lesson.initial-values";
import { loginInitialValues } from "./login.initial-values";
import { addQuizQuestionInitialValues } from "./add-quiz-question.initial-values";

export const INITIAL_VALUES = {
    login: loginInitialValues,
    addCourse: addCourseInitialValues,
    addCourseModule: addCourseModule,
    addLesson: addLessonInitialValues,
    addCourseForm: addCourseInitialValues,
    addQuizQuestion: addQuizQuestionInitialValues
}