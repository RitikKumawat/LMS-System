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

export type CourseModuleResponse = {
  __typename: 'CourseModuleResponse';
  _id: Scalars['ID']['output'];
  course_id: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  lessons: Array<LessonResponse>;
  order: Scalars['Int']['output'];
  title: Scalars['String']['output'];
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
  createInstructor: AdminResponse;
  createLesson: Lesson;
  deleteCourseModule: Scalars['String']['output'];
  deleteLesson: Scalars['String']['output'];
  instructorSignUp: InstructorResponse;
  loginOtpVerify: User;
  reorderCourseModules: Scalars['Boolean']['output'];
  reorderLessons: Scalars['Boolean']['output'];
  sendOtp: Scalars['String']['output'];
  signUpOtpVerify: User;
  togglePublishStatus: Scalars['String']['output'];
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


export type MutationCreateInstructorArgs = {
  input: CreateInstructorDto;
};


export type MutationCreateLessonArgs = {
  createLessonInput: CreateLessonInput;
  document?: InputMaybe<Scalars['Upload']['input']>;
};


export type MutationDeleteCourseModuleArgs = {
  moduleId: Scalars['String']['input'];
};


export type MutationDeleteLessonArgs = {
  lessonId: Scalars['String']['input'];
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
  getCourseById: Course;
  getCourseModuleById: CourseModuleResponse;
  getLessonById: LessonResponse;
  getProfileData: User;
  getPublishedCourses: PaginatedCourse;
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


export type QueryGetCourseModuleByIdArgs = {
  courseModuleId: Scalars['String']['input'];
};


export type QueryGetLessonByIdArgs = {
  lessonId: Scalars['String']['input'];
};


export type QueryGetPublishedCoursesArgs = {
  courseFilters: CourseFilters;
  paginationInput: PaginationInput;
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

export type FindAllCoursesQueryVariables = Exact<{
  paginationInput: PaginationInput;
  courseFilters: CourseFilters;
}>;


export type FindAllCoursesQuery = { getPublishedCourses: { __typename: 'PaginatedCourse', totalDocs: number, limit: number, totalPages: number, page: number, hasNextPage: boolean, hasPrevPage: boolean, docs: Array<{ __typename: 'CourseResponse', _id: string, title: string, description: string | null, price: number, thumbnail_url: string | null, category_name: string | null, level: string, language: string, is_published: boolean, createdAt: unknown }> } };

export type FindOneCourseQueryVariables = Exact<{
  courseId: Scalars['String']['input'];
}>;


export type FindOneCourseQuery = { getCourseById: { __typename: 'Course', _id: string, title: string, description: string | null, price: number, thumbnail_url: string, category_id: string, level: string, language: string, is_published: boolean, created_by: string, published_at: unknown | null, createdAt: unknown, updatedAt: unknown } };

export type GetProfileDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileDataQuery = { getProfileData: { __typename: 'User', _id: string, name: string, email: string, emailVerified: boolean } };


export const SendOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}]}}]} as unknown as DocumentNode<SendOtpMutation, SendOtpMutationVariables>;
export const LoginOtpVerifyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginOtpVerify"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyLoginOtpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginOtpVerify"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}}]}}]}}]} as unknown as DocumentNode<LoginOtpVerifyMutation, LoginOtpVerifyMutationVariables>;
export const SignUpOtpVerifyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUpOtpVerify"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyOtpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUpOtpVerify"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}}]}}]}}]} as unknown as DocumentNode<SignUpOtpVerifyMutation, SignUpOtpVerifyMutationVariables>;
export const UserLogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserLogout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userLogout"}}]}}]} as unknown as DocumentNode<UserLogoutMutation, UserLogoutMutationVariables>;
export const FindAllCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAllCourses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseFilters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CourseFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPublishedCourses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationInput"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"docs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"category_name"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalDocs"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPrevPage"}}]}}]}}]} as unknown as DocumentNode<FindAllCoursesQuery, FindAllCoursesQueryVariables>;
export const FindOneCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindOneCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCourseById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"category_id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_by"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<FindOneCourseQuery, FindOneCourseQueryVariables>;
export const GetProfileDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProfileData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProfileData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}}]}}]}}]} as unknown as DocumentNode<GetProfileDataQuery, GetProfileDataQueryVariables>;