/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: unknown; output: unknown; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: unknown; output: unknown; }
};

export enum Admin_Roles {
  Admin = 'ADMIN',
  Instructor = 'INSTRUCTOR'
}

export type AdminLoginDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type AdminResponse = {
  __typename: 'AdminResponse';
  _id: Scalars['String']['output'];
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  role: Admin_Roles;
};

export enum Course_Level {
  Advanced = 'ADVANCED',
  Beginner = 'BEGINNER',
  Intermediate = 'INTERMEDIATE'
}

export type Category = {
  __typename: 'Category';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  imageUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Course = {
  __typename: 'Course';
  _id: Scalars['ID']['output'];
  category_id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  created_by: Scalars['ID']['output'];
  description: Maybe<Scalars['String']['output']>;
  is_published: Scalars['Boolean']['output'];
  language: Scalars['String']['output'];
  level: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  published_at: Maybe<Scalars['DateTime']['output']>;
  slug: Scalars['String']['output'];
  thumbnail_url: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CourseFilters = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  isPurchased?: InputMaybe<Scalars['Boolean']['input']>;
  level?: InputMaybe<Course_Level>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type CourseModule = {
  __typename: 'CourseModule';
  _id: Scalars['ID']['output'];
  course_id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  order: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CourseModuleForStudentResponse = {
  __typename: 'CourseModuleForStudentResponse';
  _id: Scalars['ID']['output'];
  course_id: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  lessons: Array<LessonForStudentResponse>;
  order: Scalars['Int']['output'];
  quizzes: Array<QuizResponse>;
  title: Scalars['String']['output'];
};

export type CourseModuleResponse = {
  __typename: 'CourseModuleResponse';
  _id: Scalars['ID']['output'];
  course_id: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  lessons: Array<LessonResponse>;
  order: Scalars['Int']['output'];
  quizzes: Array<QuizResponse>;
  title: Scalars['String']['output'];
};

export type CourseOrderResponse = {
  __typename: 'CourseOrderResponse';
  amount: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  order_id: Scalars['ID']['output'];
  razorpay_order_id: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type CourseProgress = {
  __typename: 'CourseProgress';
  completedLessons: Scalars['Int']['output'];
  percentage: Scalars['Int']['output'];
  totalLessons: Scalars['Int']['output'];
};

export type CourseResponse = {
  __typename: 'CourseResponse';
  _id: Scalars['ID']['output'];
  category_name: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  is_published: Scalars['Boolean']['output'];
  language: Scalars['String']['output'];
  level: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  slug: Scalars['String']['output'];
  thumbnail_url: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type CourseWithEnrollment = {
  __typename: 'CourseWithEnrollment';
  _id: Scalars['ID']['output'];
  category_id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  created_by: Scalars['ID']['output'];
  description: Maybe<Scalars['String']['output']>;
  is_enrolled: Scalars['Boolean']['output'];
  is_published: Scalars['Boolean']['output'];
  language: Scalars['String']['output'];
  level: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  published_at: Maybe<Scalars['DateTime']['output']>;
  slug: Scalars['String']['output'];
  thumbnail_url: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateCategoryInput = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateCourseInput = {
  category_id: Scalars['String']['input'];
  courseId?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  language: Scalars['String']['input'];
  level: Course_Level;
  price: Scalars['Int']['input'];
  thumbnail_url?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateCourseModuleInput = {
  course_id: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
};

export type CreateInstructorDto = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CreateLessonInput = {
  content: Scalars['String']['input'];
  document_url?: InputMaybe<Scalars['String']['input']>;
  duration_minutes: Scalars['Int']['input'];
  is_preview: Scalars['Boolean']['input'];
  lesson_id?: InputMaybe<Scalars['ID']['input']>;
  module_id: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  video_url?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOptionInput = {
  is_correct: Scalars['Boolean']['input'];
  option_text: Scalars['String']['input'];
};

export type CreateQuizDto = {
  courseModuleId: Scalars['String']['input'];
  passing_score: Scalars['Int']['input'];
  quizId?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateQuizQuestionInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  options: Array<CreateOptionInput>;
  question_text: Scalars['String']['input'];
  quiz_id: Scalars['String']['input'];
  type: Quiz_Question_Type;
};

export type CreateQuizResponse = {
  __typename: 'CreateQuizResponse';
  quiz_id: Scalars['ID']['output'];
};

export type InstructorResponse = {
  __typename: 'InstructorResponse';
  _id: Scalars['String']['output'];
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  role: Admin_Roles;
};

export type InstructorSignUpDto = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export enum Lesson_Operation {
  Completed = 'COMPLETED',
  Start = 'START',
  Visit = 'VISIT'
}

export enum Lesson_Status {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  NotStarted = 'NOT_STARTED'
}

export type Lesson = {
  __typename: 'Lesson';
  _id: Scalars['ID']['output'];
  content: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  duration_minutes: Scalars['Int']['output'];
  is_preview: Scalars['Boolean']['output'];
  module_id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  pdf_url: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  video_url: Maybe<Scalars['String']['output']>;
};

export type LessonDetails = {
  __typename: 'LessonDetails';
  _id: Scalars['ID']['output'];
  lesson: LessonResponse;
  status: Lesson_Status;
};

export type LessonForStudentResponse = {
  __typename: 'LessonForStudentResponse';
  _id: Scalars['ID']['output'];
  duration_minutes: Scalars['Int']['output'];
  isUnlocked: Scalars['Boolean']['output'];
  lesson_type: Maybe<Scalars['String']['output']>;
  order: Scalars['Int']['output'];
  status: Maybe<Lesson_Status>;
  title: Scalars['String']['output'];
};

export type LessonProgressUpdate = {
  __typename: 'LessonProgressUpdate';
  _id: Scalars['ID']['output'];
  status: Lesson_Status;
};

export type LessonResponse = {
  __typename: 'LessonResponse';
  _id: Scalars['ID']['output'];
  content: Maybe<Scalars['String']['output']>;
  duration_minutes: Scalars['Int']['output'];
  is_preview: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  pdf_url: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  video_url: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename: 'Mutation';
  adminLogin: AdminResponse;
  adminLogout: Scalars['String']['output'];
  createCategory: Category;
  createCourse: Course;
  createCourseModule: CourseModule;
  createCourseOrder: CourseOrderResponse;
  createInstructor: AdminResponse;
  createLesson: Lesson;
  createQuiz: CreateQuizResponse;
  createQuizQuestion: QuizQuestion;
  deleteCourseModule: Scalars['String']['output'];
  deleteLesson: Scalars['String']['output'];
  deleteQuiz: Scalars['String']['output'];
  instructorSignUp: InstructorResponse;
  loginOtpVerify: User;
  removeQuizQuestion: QuizQuestion;
  reorderCourseModules: Scalars['Boolean']['output'];
  reorderLessons: Scalars['Boolean']['output'];
  sendOtp: Scalars['String']['output'];
  signUpOtpVerify: User;
  submitQuizAttempt: SubmitQuizAttemptResponse;
  togglePublishStatus: Scalars['String']['output'];
  updateLessonProgress: LessonProgressUpdate;
  userLogout: Scalars['String']['output'];
};


export type MutationAdminLoginArgs = {
  input: AdminLoginDto;
};


export type MutationCreateCategoryArgs = {
  image?: InputMaybe<Scalars['Upload']['input']>;
  input: CreateCategoryInput;
};


export type MutationCreateCourseArgs = {
  createCourseInput: CreateCourseInput;
  thumbnail?: InputMaybe<Scalars['Upload']['input']>;
};


export type MutationCreateCourseModuleArgs = {
  createCourseModuleInput: CreateCourseModuleInput;
};


export type MutationCreateCourseOrderArgs = {
  course_id: Scalars['String']['input'];
};


export type MutationCreateInstructorArgs = {
  input: CreateInstructorDto;
};


export type MutationCreateLessonArgs = {
  createLessonInput: CreateLessonInput;
  document?: InputMaybe<Scalars['Upload']['input']>;
};


export type MutationCreateQuizArgs = {
  createQuizInput: CreateQuizDto;
};


export type MutationCreateQuizQuestionArgs = {
  createQuizQuestionInput: CreateQuizQuestionInput;
};


export type MutationDeleteCourseModuleArgs = {
  moduleId: Scalars['String']['input'];
};


export type MutationDeleteLessonArgs = {
  lessonId: Scalars['String']['input'];
};


export type MutationDeleteQuizArgs = {
  quiz_id: Scalars['String']['input'];
};


export type MutationInstructorSignUpArgs = {
  input: InstructorSignUpDto;
};


export type MutationLoginOtpVerifyArgs = {
  data: VerifyLoginOtpInput;
};


export type MutationRemoveQuizQuestionArgs = {
  id: Scalars['String']['input'];
};


export type MutationReorderCourseModulesArgs = {
  reorderCourseModulesInput: ReorderCourseModulesInput;
};


export type MutationReorderLessonsArgs = {
  reorderLessonInput: ReorderLessonInput;
};


export type MutationSendOtpArgs = {
  email: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type MutationSignUpOtpVerifyArgs = {
  data: VerifyOtpInput;
};


export type MutationSubmitQuizAttemptArgs = {
  quizId: Scalars['String']['input'];
  score: Scalars['Int']['input'];
};


export type MutationTogglePublishStatusArgs = {
  courseId: Scalars['String']['input'];
};


export type MutationUpdateLessonProgressArgs = {
  lessonId: Scalars['String']['input'];
  operation: Lesson_Operation;
};

export type Options = {
  __typename: 'Options';
  is_correct: Scalars['Boolean']['output'];
  option_text: Scalars['String']['output'];
};

export type PaginatedCategory = {
  __typename: 'PaginatedCategory';
  docs: Array<Category>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPrevPage: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  totalDocs: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedCourse = {
  __typename: 'PaginatedCourse';
  docs: Array<CourseResponse>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPrevPage: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  totalDocs: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedCourseModule = {
  __typename: 'PaginatedCourseModule';
  docs: Array<CourseModuleResponse>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPrevPage: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  totalDocs: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedCourseModuleForStudent = {
  __typename: 'PaginatedCourseModuleForStudent';
  docs: Array<CourseModuleForStudentResponse>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPrevPage: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  totalDocs: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export enum Quiz_Question_Type {
  MultipleChoice = 'MULTIPLE_CHOICE',
  SingleChoice = 'SINGLE_CHOICE',
  TrueFalse = 'TRUE_FALSE'
}

export type Query = {
  __typename: 'Query';
  category: Category;
  getAdminData: AdminResponse;
  getAllCategories: PaginatedCategory;
  getAllCourseModules: PaginatedCourseModule;
  getAllCourses: PaginatedCourse;
  getCourseById: CourseWithEnrollment;
  getCourseModuleByCourseId: PaginatedCourseModuleForStudent;
  getCourseModuleById: CourseModuleResponse;
  getCourseProgress: CourseProgress;
  getLessonById: LessonResponse;
  getLessonContent: LessonDetails;
  getOrder: CourseOrderResponse;
  getProfileData: User;
  getPublishedCourses: PaginatedCourse;
  getQuizById: Quiz;
  getQuizForStudent: Quiz;
  getQuizQuestionsByQuizId: Array<QuizQuestion>;
  getUserCourses: PaginatedCourse;
  quizQuestion: QuizQuestion;
};


export type QueryCategoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetAllCategoriesArgs = {
  paginationInput: PaginationInput;
};


export type QueryGetAllCourseModulesArgs = {
  courseId: Scalars['String']['input'];
  paginationInput: PaginationInput;
};


export type QueryGetAllCoursesArgs = {
  courseFilters: CourseFilters;
  paginationInput: PaginationInput;
};


export type QueryGetCourseByIdArgs = {
  courseId: Scalars['String']['input'];
};


export type QueryGetCourseModuleByCourseIdArgs = {
  courseId: Scalars['String']['input'];
  paginationInput: PaginationInput;
};


export type QueryGetCourseModuleByIdArgs = {
  courseModuleId: Scalars['String']['input'];
};


export type QueryGetCourseProgressArgs = {
  courseId: Scalars['String']['input'];
};


export type QueryGetLessonByIdArgs = {
  lessonId: Scalars['String']['input'];
};


export type QueryGetLessonContentArgs = {
  courseId: Scalars['String']['input'];
  lessonId: Scalars['String']['input'];
};


export type QueryGetOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetPublishedCoursesArgs = {
  courseFilters: CourseFilters;
  paginationInput: PaginationInput;
};


export type QueryGetQuizByIdArgs = {
  quizId: Scalars['String']['input'];
};


export type QueryGetQuizForStudentArgs = {
  quizId: Scalars['String']['input'];
};


export type QueryGetQuizQuestionsByQuizIdArgs = {
  quizId: Scalars['String']['input'];
};


export type QueryGetUserCoursesArgs = {
  courseFilters: CourseFilters;
  paginationInput: PaginationInput;
};


export type QueryQuizQuestionArgs = {
  id: Scalars['String']['input'];
};

export type Quiz = {
  __typename: 'Quiz';
  _id: Scalars['ID']['output'];
  created_at: Scalars['DateTime']['output'];
  module_id: Scalars['String']['output'];
  passing_score: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type QuizQuestion = {
  __typename: 'QuizQuestion';
  _id: Scalars['ID']['output'];
  created_at: Scalars['DateTime']['output'];
  options: Array<Options>;
  question_text: Scalars['String']['output'];
  quiz_id: Scalars['String']['output'];
  type: Quiz_Question_Type;
};

export type QuizResponse = {
  __typename: 'QuizResponse';
  _id: Scalars['ID']['output'];
  created_at: Scalars['DateTime']['output'];
  passing_score: Scalars['Int']['output'];
  questionCount: Maybe<Scalars['Int']['output']>;
  score: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
};

export type ReorderCourseModulesInput = {
  courseId: Scalars['String']['input'];
  moduleIds: Array<Scalars['String']['input']>;
};

export type ReorderLessonInput = {
  lessonIds: Array<Scalars['String']['input']>;
  moduleId: Scalars['String']['input'];
};

export type SubmitQuizAttemptResponse = {
  __typename: 'SubmitQuizAttemptResponse';
  passed: Scalars['Boolean']['output'];
  score: Scalars['Int']['output'];
};

export type User = {
  __typename: 'User';
  _id: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type VerifyLoginOtpInput = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};

export type VerifyOtpInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};

export type SendOtpMutationVariables = Exact<{
  email: Scalars['String']['input'];
  type: Scalars['String']['input'];
}>;


export type SendOtpMutation = { sendOtp: string };

export type LoginOtpVerifyMutationVariables = Exact<{
  data: VerifyLoginOtpInput;
}>;


export type LoginOtpVerifyMutation = { loginOtpVerify: { __typename: 'User', _id: string, name: string, email: string, emailVerified: boolean } };

export type SignUpOtpVerifyMutationVariables = Exact<{
  data: VerifyOtpInput;
}>;


export type SignUpOtpVerifyMutation = { signUpOtpVerify: { __typename: 'User', _id: string, name: string, email: string, emailVerified: boolean } };

export type UserLogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type UserLogoutMutation = { userLogout: string };

export type GetCourseModuleByCourseIdQueryVariables = Exact<{
  courseId: Scalars['String']['input'];
  paginationInput: PaginationInput;
}>;


export type GetCourseModuleByCourseIdQuery = { getCourseModuleByCourseId: { __typename: 'PaginatedCourseModuleForStudent', totalDocs: number, limit: number, totalPages: number, page: number, hasNextPage: boolean, hasPrevPage: boolean, docs: Array<{ __typename: 'CourseModuleForStudentResponse', _id: string, title: string, description: string | null, course_id: string, order: number, createdAt: unknown, lessons: Array<{ __typename: 'LessonForStudentResponse', _id: string, title: string, order: number, lesson_type: string | null, duration_minutes: number, isUnlocked: boolean, status: Lesson_Status | null }>, quizzes: Array<{ __typename: 'QuizResponse', _id: string, title: string, passing_score: number, score: number | null }> }> } };

export type GetCourseProgressQueryVariables = Exact<{
  courseId: Scalars['String']['input'];
}>;


export type GetCourseProgressQuery = { getCourseProgress: { __typename: 'CourseProgress', totalLessons: number, completedLessons: number, percentage: number } };

export type GetUserCoursesQueryVariables = Exact<{
  paginationInput: PaginationInput;
  courseFilters: CourseFilters;
}>;


export type GetUserCoursesQuery = { getUserCourses: { __typename: 'PaginatedCourse', totalDocs: number, limit: number, totalPages: number, page: number, hasNextPage: boolean, hasPrevPage: boolean, docs: Array<{ __typename: 'CourseResponse', _id: string, title: string, slug: string, description: string | null, thumbnail_url: string | null, category_name: string | null, level: string, language: string, price: number, is_published: boolean, createdAt: unknown }> } };

export type FindAllCoursesQueryVariables = Exact<{
  paginationInput: PaginationInput;
  courseFilters: CourseFilters;
}>;


export type FindAllCoursesQuery = { getPublishedCourses: { __typename: 'PaginatedCourse', totalDocs: number, limit: number, totalPages: number, page: number, hasNextPage: boolean, hasPrevPage: boolean, docs: Array<{ __typename: 'CourseResponse', _id: string, title: string, description: string | null, price: number, thumbnail_url: string | null, category_name: string | null, level: string, language: string, is_published: boolean, createdAt: unknown }> } };

export type FindOneCourseQueryVariables = Exact<{
  courseId: Scalars['String']['input'];
}>;


export type FindOneCourseQuery = { getCourseById: { __typename: 'CourseWithEnrollment', _id: string, title: string, slug: string, description: string | null, thumbnail_url: string, category_id: string, level: string, language: string, price: number, is_published: boolean, created_by: string, published_at: unknown | null, createdAt: unknown, updatedAt: unknown, is_enrolled: boolean } };

export type UpdateLessonProgressMutationVariables = Exact<{
  lessonId: Scalars['String']['input'];
  operation: Lesson_Operation;
}>;


export type UpdateLessonProgressMutation = { updateLessonProgress: { __typename: 'LessonProgressUpdate', _id: string, status: Lesson_Status } };

export type GetLessonByIdQueryVariables = Exact<{
  lessonId: Scalars['String']['input'];
}>;


export type GetLessonByIdQuery = { getLessonById: { __typename: 'LessonResponse', _id: string, title: string, order: number, video_url: string | null, pdf_url: string | null, content: string | null, duration_minutes: number, is_preview: boolean } };

export type GetLessonContentQueryVariables = Exact<{
  lessonId: Scalars['String']['input'];
  courseId: Scalars['String']['input'];
}>;


export type GetLessonContentQuery = { getLessonContent: { __typename: 'LessonDetails', _id: string, status: Lesson_Status, lesson: { __typename: 'LessonResponse', _id: string, title: string, order: number, video_url: string | null, pdf_url: string | null, content: string | null, duration_minutes: number, is_preview: boolean } } };

export type CreateCourseOrderMutationVariables = Exact<{
  course_id: Scalars['String']['input'];
}>;


export type CreateCourseOrderMutation = { createCourseOrder: { __typename: 'CourseOrderResponse', order_id: string, amount: number, currency: string, razorpay_order_id: string, status: string } };

export type GetOrderQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetOrderQuery = { getOrder: { __typename: 'CourseOrderResponse', order_id: string, amount: number, currency: string, razorpay_order_id: string, status: string } };

export type GetQuizQuestionsByQuizIdQueryVariables = Exact<{
  quizId: Scalars['String']['input'];
}>;


export type GetQuizQuestionsByQuizIdQuery = { getQuizQuestionsByQuizId: Array<{ __typename: 'QuizQuestion', _id: string, question_text: string, type: Quiz_Question_Type, options: Array<{ __typename: 'Options', option_text: string, is_correct: boolean }> }> };

export type SubmitQuizAttemptMutationVariables = Exact<{
  quizId: Scalars['String']['input'];
  score: Scalars['Int']['input'];
}>;


export type SubmitQuizAttemptMutation = { submitQuizAttempt: { __typename: 'SubmitQuizAttemptResponse', score: number, passed: boolean } };

export type GetQuizForStudentQueryVariables = Exact<{
  quizId: Scalars['String']['input'];
}>;


export type GetQuizForStudentQuery = { getQuizForStudent: { __typename: 'Quiz', _id: string, title: string, passing_score: number, created_at: unknown } };

export type GetProfileDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileDataQuery = { getProfileData: { __typename: 'User', _id: string, name: string, email: string, emailVerified: boolean } };


export const SendOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}]}}]} as unknown as DocumentNode<SendOtpMutation, SendOtpMutationVariables>;
export const LoginOtpVerifyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginOtpVerify"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyLoginOtpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginOtpVerify"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}}]}}]}}]} as unknown as DocumentNode<LoginOtpVerifyMutation, LoginOtpVerifyMutationVariables>;
export const SignUpOtpVerifyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUpOtpVerify"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyOtpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUpOtpVerify"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}}]}}]}}]} as unknown as DocumentNode<SignUpOtpVerifyMutation, SignUpOtpVerifyMutationVariables>;
export const UserLogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserLogout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userLogout"}}]}}]} as unknown as DocumentNode<UserLogoutMutation, UserLogoutMutationVariables>;
export const GetCourseModuleByCourseIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCourseModuleByCourseId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCourseModuleByCourseId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginationInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"docs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"lesson_type"}},{"kind":"Field","name":{"kind":"Name","value":"duration_minutes"}},{"kind":"Field","name":{"kind":"Name","value":"isUnlocked"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quizzes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"passing_score"}},{"kind":"Field","name":{"kind":"Name","value":"score"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalDocs"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPrevPage"}}]}}]}}]} as unknown as DocumentNode<GetCourseModuleByCourseIdQuery, GetCourseModuleByCourseIdQueryVariables>;
export const GetCourseProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCourseProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCourseProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalLessons"}},{"kind":"Field","name":{"kind":"Name","value":"completedLessons"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]}}]} as unknown as DocumentNode<GetCourseProgressQuery, GetCourseProgressQueryVariables>;
export const GetUserCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserCourses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseFilters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CourseFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserCourses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"docs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"category_name"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalDocs"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPrevPage"}}]}}]}}]} as unknown as DocumentNode<GetUserCoursesQuery, GetUserCoursesQueryVariables>;
export const FindAllCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAllCourses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseFilters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CourseFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPublishedCourses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"docs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"category_name"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalDocs"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPrevPage"}}]}}]}}]} as unknown as DocumentNode<FindAllCoursesQuery, FindAllCoursesQueryVariables>;
export const FindOneCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindOneCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCourseById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_by"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"is_enrolled"}}]}}]}}]} as unknown as DocumentNode<FindOneCourseQuery, FindOneCourseQueryVariables>;
export const UpdateLessonProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLessonProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"operation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LESSON_OPERATION"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLessonProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}},{"kind":"Argument","name":{"kind":"Name","value":"operation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"operation"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateLessonProgressMutation, UpdateLessonProgressMutationVariables>;
export const GetLessonByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLessonById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLessonById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"video_url"}},{"kind":"Field","name":{"kind":"Name","value":"pdf_url"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"duration_minutes"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}}]}}]}}]} as unknown as DocumentNode<GetLessonByIdQuery, GetLessonByIdQueryVariables>;
export const GetLessonContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLessonContent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLessonContent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lesson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"video_url"}},{"kind":"Field","name":{"kind":"Name","value":"pdf_url"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"duration_minutes"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}}]}}]}}]}}]} as unknown as DocumentNode<GetLessonContentQuery, GetLessonContentQueryVariables>;
export const CreateCourseOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCourseOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCourseOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order_id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"razorpay_order_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateCourseOrderMutation, CreateCourseOrderMutationVariables>;
export const GetOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order_id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"razorpay_order_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetOrderQuery, GetOrderQueryVariables>;
export const GetQuizQuestionsByQuizIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQuizQuestionsByQuizId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quizId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getQuizQuestionsByQuizId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"quizId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quizId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"question_text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"option_text"}},{"kind":"Field","name":{"kind":"Name","value":"is_correct"}}]}}]}}]}}]} as unknown as DocumentNode<GetQuizQuestionsByQuizIdQuery, GetQuizQuestionsByQuizIdQueryVariables>;
export const SubmitQuizAttemptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitQuizAttempt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quizId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"score"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitQuizAttempt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"quizId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quizId"}}},{"kind":"Argument","name":{"kind":"Name","value":"score"},"value":{"kind":"Variable","name":{"kind":"Name","value":"score"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"passed"}}]}}]}}]} as unknown as DocumentNode<SubmitQuizAttemptMutation, SubmitQuizAttemptMutationVariables>;
export const GetQuizForStudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQuizForStudent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quizId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getQuizForStudent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"quizId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quizId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"passing_score"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<GetQuizForStudentQuery, GetQuizForStudentQueryVariables>;
export const GetProfileDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProfileData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProfileData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}}]}}]}}]} as unknown as DocumentNode<GetProfileDataQuery, GetProfileDataQueryVariables>;