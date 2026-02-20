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

export type CreateQuizDto = {
  courseModuleId: Scalars['String']['input'];
  passing_score: Scalars['Int']['input'];
  quizId?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
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
  deleteCourseModule: Scalars['String']['output'];
  deleteLesson: Scalars['String']['output'];
  deleteQuiz: Scalars['String']['output'];
  instructorSignUp: InstructorResponse;
  loginOtpVerify: User;
  reorderCourseModules: Scalars['Boolean']['output'];
  reorderLessons: Scalars['Boolean']['output'];
  sendOtp: Scalars['String']['output'];
  signUpOtpVerify: User;
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


export type MutationTogglePublishStatusArgs = {
  courseId: Scalars['String']['input'];
};


export type MutationUpdateLessonProgressArgs = {
  lessonId: Scalars['String']['input'];
  operation: Lesson_Operation;
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
  getUserCourses: PaginatedCourse;
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


export type QueryGetUserCoursesArgs = {
  courseFilters: CourseFilters;
  paginationInput: PaginationInput;
};

export type Quiz = {
  __typename: 'Quiz';
  _id: Scalars['ID']['output'];
  created_at: Scalars['DateTime']['output'];
  module_id: Scalars['String']['output'];
  passing_score: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type QuizResponse = {
  __typename: 'QuizResponse';
  _id: Scalars['ID']['output'];
  created_at: Scalars['DateTime']['output'];
  passing_score: Scalars['Int']['output'];
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

export type AdminLogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type AdminLogoutMutation = { adminLogout: string };

export type AdminLoginMutationVariables = Exact<{
  input: AdminLoginDto;
}>;


export type AdminLoginMutation = { adminLogin: { __typename: 'AdminResponse', _id: string, name: string, email: string, role: Admin_Roles } };

export type InstructorSignUpMutationVariables = Exact<{
  input: InstructorSignUpDto;
}>;


export type InstructorSignUpMutation = { instructorSignUp: { __typename: 'InstructorResponse', _id: string, name: string, email: string, role: Admin_Roles } };

export type CreateCourseModuleMutationVariables = Exact<{
  createCourseModuleInput: CreateCourseModuleInput;
}>;


export type CreateCourseModuleMutation = { createCourseModule: { __typename: 'CourseModule', _id: string, course_id: string, title: string, description: string | null, order: number, createdAt: unknown, updatedAt: unknown } };

export type DeleteCourseModuleMutationVariables = Exact<{
  moduleId: Scalars['String']['input'];
}>;


export type DeleteCourseModuleMutation = { deleteCourseModule: string };

export type ReorderCourseModulesMutationVariables = Exact<{
  reorderCourseModulesInput: ReorderCourseModulesInput;
}>;


export type ReorderCourseModulesMutation = { reorderCourseModules: boolean };

export type CreateCourseMutationVariables = Exact<{
  createCourseInput: CreateCourseInput;
  thumbnail?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type CreateCourseMutation = { createCourse: { __typename: 'Course', _id: string, title: string, slug: string, description: string | null, thumbnail_url: string, category_id: string, level: string, language: string, price: number, is_published: boolean, created_by: string, createdAt: unknown, updatedAt: unknown } };

export type TogglePublishStatusMutationVariables = Exact<{
  courseId: Scalars['String']['input'];
}>;


export type TogglePublishStatusMutation = { togglePublishStatus: string };

export type CreateLessonMutationVariables = Exact<{
  createLessonInput: CreateLessonInput;
  document?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type CreateLessonMutation = { createLesson: { __typename: 'Lesson', _id: string, module_id: string, title: string, video_url: string | null, pdf_url: string | null, content: string | null, order: number, duration_minutes: number, is_preview: boolean, createdAt: unknown, updatedAt: unknown } };

export type DeleteLessonMutationVariables = Exact<{
  lessonId: Scalars['String']['input'];
}>;


export type DeleteLessonMutation = { deleteLesson: string };

export type ReorderLessonsMutationVariables = Exact<{
  reorderLessonInput: ReorderLessonInput;
}>;


export type ReorderLessonsMutation = { reorderLessons: boolean };

export type CreateQuizMutationVariables = Exact<{
  createQuizInput: CreateQuizDto;
}>;


export type CreateQuizMutation = { createQuiz: { __typename: 'CreateQuizResponse', quiz_id: string } };

export type DeleteQuizMutationVariables = Exact<{
  quizId: Scalars['String']['input'];
}>;


export type DeleteQuizMutation = { deleteQuiz: string };

export type GetAllCategoriesQueryVariables = Exact<{
  paginationInput: PaginationInput;
}>;


export type GetAllCategoriesQuery = { getAllCategories: { __typename: 'PaginatedCategory', totalDocs: number, limit: number, totalPages: number, page: number, hasNextPage: boolean, hasPrevPage: boolean, docs: Array<{ __typename: 'Category', _id: string, name: string, slug: string, imageUrl: string, updatedAt: unknown, createdAt: unknown }> } };

export type GetAllCourseModulesQueryVariables = Exact<{
  courseId: Scalars['String']['input'];
  paginationInput: PaginationInput;
}>;


export type GetAllCourseModulesQuery = { getAllCourseModules: { __typename: 'PaginatedCourseModule', totalDocs: number, limit: number, totalPages: number, page: number, hasNextPage: boolean, hasPrevPage: boolean, docs: Array<{ __typename: 'CourseModuleResponse', _id: string, title: string, description: string | null, course_id: string, order: number, createdAt: unknown, lessons: Array<{ __typename: 'LessonResponse', _id: string, title: string, order: number, video_url: string | null, pdf_url: string | null, content: string | null, duration_minutes: number, is_preview: boolean }>, quizzes: Array<{ __typename: 'QuizResponse', _id: string, title: string, passing_score: number, created_at: unknown }> }> } };

export type GetCourseModuleByIdQueryVariables = Exact<{
  courseModuleId: Scalars['String']['input'];
}>;


export type GetCourseModuleByIdQuery = { getCourseModuleById: { __typename: 'CourseModuleResponse', _id: string, title: string, description: string | null, course_id: string, order: number, createdAt: unknown } };

export type GetAllCoursesQueryVariables = Exact<{
  paginationInput: PaginationInput;
  courseFilters: CourseFilters;
}>;


export type GetAllCoursesQuery = { getAllCourses: { __typename: 'PaginatedCourse', totalDocs: number, limit: number, totalPages: number, page: number, hasNextPage: boolean, hasPrevPage: boolean, docs: Array<{ __typename: 'CourseResponse', _id: string, title: string, slug: string, description: string | null, thumbnail_url: string | null, category_name: string | null, level: string, language: string, price: number, is_published: boolean, createdAt: unknown }> } };

export type GetCourseByIdQueryVariables = Exact<{
  courseId: Scalars['String']['input'];
}>;


export type GetCourseByIdQuery = { getCourseById: { __typename: 'CourseWithEnrollment', _id: string, title: string, slug: string, description: string | null, thumbnail_url: string, category_id: string, level: string, language: string, price: number, is_published: boolean, created_by: string, published_at: unknown | null, createdAt: unknown, updatedAt: unknown, is_enrolled: boolean } };

export type GetLessonByIdQueryVariables = Exact<{
  lessonId: Scalars['String']['input'];
}>;


export type GetLessonByIdQuery = { getLessonById: { __typename: 'LessonResponse', _id: string, title: string, order: number, video_url: string | null, pdf_url: string | null, content: string | null, duration_minutes: number, is_preview: boolean } };

export type GetAdminDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminDataQuery = { getAdminData: { __typename: 'AdminResponse', _id: string, name: string, email: string, role: Admin_Roles } };

export type GetQuizByIdQueryVariables = Exact<{
  quizId: Scalars['String']['input'];
}>;


export type GetQuizByIdQuery = { getQuizById: { __typename: 'Quiz', _id: string, module_id: string, title: string, passing_score: number, created_at: unknown } };


export const AdminLogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdminLogout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminLogout"}}]}}]} as unknown as DocumentNode<AdminLogoutMutation, AdminLogoutMutationVariables>;
export const AdminLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdminLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdminLoginDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<AdminLoginMutation, AdminLoginMutationVariables>;
export const InstructorSignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InstructorSignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InstructorSignUpDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instructorSignUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<InstructorSignUpMutation, InstructorSignUpMutationVariables>;
export const CreateCourseModuleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCourseModule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createCourseModuleInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCourseModuleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCourseModule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createCourseModuleInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createCourseModuleInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateCourseModuleMutation, CreateCourseModuleMutationVariables>;
export const DeleteCourseModuleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCourseModule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moduleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCourseModule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"moduleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moduleId"}}}]}]}}]} as unknown as DocumentNode<DeleteCourseModuleMutation, DeleteCourseModuleMutationVariables>;
export const ReorderCourseModulesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReorderCourseModules"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reorderCourseModulesInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderCourseModulesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reorderCourseModules"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reorderCourseModulesInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reorderCourseModulesInput"}}}]}]}}]} as unknown as DocumentNode<ReorderCourseModulesMutation, ReorderCourseModulesMutationVariables>;
export const CreateCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createCourseInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCourseInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"thumbnail"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createCourseInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createCourseInput"}}},{"kind":"Argument","name":{"kind":"Name","value":"thumbnail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"thumbnail"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_by"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateCourseMutation, CreateCourseMutationVariables>;
export const TogglePublishStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TogglePublishStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"togglePublishStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}]}]}}]} as unknown as DocumentNode<TogglePublishStatusMutation, TogglePublishStatusMutationVariables>;
export const CreateLessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createLessonInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLessonInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"document"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createLessonInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createLessonInput"}}},{"kind":"Argument","name":{"kind":"Name","value":"document"},"value":{"kind":"Variable","name":{"kind":"Name","value":"document"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"module_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"video_url"}},{"kind":"Field","name":{"kind":"Name","value":"pdf_url"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"duration_minutes"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateLessonMutation, CreateLessonMutationVariables>;
export const DeleteLessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}]}]}}]} as unknown as DocumentNode<DeleteLessonMutation, DeleteLessonMutationVariables>;
export const ReorderLessonsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReorderLessons"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reorderLessonInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderLessonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reorderLessons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reorderLessonInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reorderLessonInput"}}}]}]}}]} as unknown as DocumentNode<ReorderLessonsMutation, ReorderLessonsMutationVariables>;
export const CreateQuizDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateQuiz"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createQuizInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateQuizDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createQuiz"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createQuizInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createQuizInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quiz_id"}}]}}]}}]} as unknown as DocumentNode<CreateQuizMutation, CreateQuizMutationVariables>;
export const DeleteQuizDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteQuiz"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quizId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteQuiz"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"quiz_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quizId"}}}]}]}}]} as unknown as DocumentNode<DeleteQuizMutation, DeleteQuizMutationVariables>;
export const GetAllCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCategories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"docs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalDocs"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPrevPage"}}]}}]}}]} as unknown as DocumentNode<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>;
export const GetAllCourseModulesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCourseModules"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCourseModules"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginationInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"docs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"video_url"}},{"kind":"Field","name":{"kind":"Name","value":"pdf_url"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"duration_minutes"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quizzes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"passing_score"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalDocs"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPrevPage"}}]}}]}}]} as unknown as DocumentNode<GetAllCourseModulesQuery, GetAllCourseModulesQueryVariables>;
export const GetCourseModuleByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCourseModuleById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseModuleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCourseModuleById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseModuleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseModuleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetCourseModuleByIdQuery, GetCourseModuleByIdQueryVariables>;
export const GetAllCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCourses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseFilters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CourseFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCourses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"docs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"category_name"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalDocs"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPrevPage"}}]}}]}}]} as unknown as DocumentNode<GetAllCoursesQuery, GetAllCoursesQueryVariables>;
export const GetCourseByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCourseById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCourseById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_by"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"is_enrolled"}}]}}]}}]} as unknown as DocumentNode<GetCourseByIdQuery, GetCourseByIdQueryVariables>;
export const GetLessonByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLessonById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLessonById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"video_url"}},{"kind":"Field","name":{"kind":"Name","value":"pdf_url"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"duration_minutes"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}}]}}]}}]} as unknown as DocumentNode<GetLessonByIdQuery, GetLessonByIdQueryVariables>;
export const GetAdminDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAdminData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetAdminDataQuery, GetAdminDataQueryVariables>;
export const GetQuizByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQuizById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quizId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getQuizById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"quizId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quizId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"module_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"passing_score"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<GetQuizByIdQuery, GetQuizByIdQueryVariables>;