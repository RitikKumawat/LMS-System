/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation AdminLogout {\n  adminLogout\n}\n\nmutation AdminLogin($input: AdminLoginDto!) {\n  adminLogin(input: $input) {\n    _id\n    name\n    email\n    role\n  }\n}\n\nmutation InstructorSignUp($input: InstructorSignUpDto!) {\n  instructorSignUp(input: $input) {\n    _id\n    name\n    email\n    role\n  }\n}": typeof types.AdminLogoutDocument,
    "mutation CreateCourseModule($createCourseModuleInput: CreateCourseModuleInput!) {\n  createCourseModule(createCourseModuleInput: $createCourseModuleInput) {\n    _id\n    course_id\n    title\n    description\n    order\n    createdAt\n    updatedAt\n  }\n}": typeof types.CreateCourseModuleDocument,
    "mutation DeleteCourseModule($moduleId: String!) {\n  deleteCourseModule(moduleId: $moduleId)\n}": typeof types.DeleteCourseModuleDocument,
    "mutation ReorderCourseModules($reorderCourseModulesInput: ReorderCourseModulesInput!) {\n  reorderCourseModules(reorderCourseModulesInput: $reorderCourseModulesInput)\n}": typeof types.ReorderCourseModulesDocument,
    "mutation CreateCourse($createCourseInput: CreateCourseInput!, $thumbnail: Upload) {\n  createCourse(createCourseInput: $createCourseInput, thumbnail: $thumbnail) {\n    _id\n    title\n    slug\n    description\n    thumbnail_url\n    category_id\n    level\n    language\n    price\n    is_published\n    created_by\n    createdAt\n    updatedAt\n  }\n}": typeof types.CreateCourseDocument,
    "mutation TogglePublishStatus($courseId: String!) {\n  togglePublishStatus(courseId: $courseId)\n}": typeof types.TogglePublishStatusDocument,
    "mutation CreateLesson($createLessonInput: CreateLessonInput!, $document: Upload) {\n  createLesson(createLessonInput: $createLessonInput, document: $document) {\n    _id\n    module_id\n    title\n    video_url\n    pdf_url\n    content\n    order\n    duration_minutes\n    is_preview\n    createdAt\n    updatedAt\n  }\n}": typeof types.CreateLessonDocument,
    "mutation DeleteLesson($lessonId: String!) {\n  deleteLesson(lessonId: $lessonId)\n}": typeof types.DeleteLessonDocument,
    "mutation ReorderLessons($reorderLessonInput: ReorderLessonInput!) {\n  reorderLessons(reorderLessonInput: $reorderLessonInput)\n}": typeof types.ReorderLessonsDocument,
    "query GetAllCategories($paginationInput: PaginationInput!) {\n  getAllCategories(paginationInput: $paginationInput) {\n    docs {\n      _id\n      name\n      slug\n      imageUrl\n      updatedAt\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}": typeof types.GetAllCategoriesDocument,
    "query GetAllCourseModules($courseId: String!, $paginationInput: PaginationInput!) {\n  getAllCourseModules(courseId: $courseId, paginationInput: $paginationInput) {\n    docs {\n      _id\n      title\n      description\n      course_id\n      order\n      createdAt\n      lessons {\n        _id\n        title\n        order\n        video_url\n        pdf_url\n        content\n        duration_minutes\n        is_preview\n      }\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}": typeof types.GetAllCourseModulesDocument,
    "query GetCourseModuleById($courseModuleId: String!) {\n  getCourseModuleById(courseModuleId: $courseModuleId) {\n    _id\n    title\n    description\n    course_id\n    order\n    createdAt\n  }\n}": typeof types.GetCourseModuleByIdDocument,
    "query GetAllCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getAllCourses(paginationInput: $paginationInput, courseFilters: $courseFilters) {\n    docs {\n      _id\n      title\n      slug\n      description\n      thumbnail_url\n      category_name\n      level\n      language\n      price\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}": typeof types.GetAllCoursesDocument,
    "query GetCourseById($courseId: String!) {\n  getCourseById(courseId: $courseId) {\n    _id\n    title\n    slug\n    description\n    thumbnail_url\n    category_id\n    level\n    language\n    price\n    is_published\n    created_by\n    createdAt\n    updatedAt\n  }\n}": typeof types.GetCourseByIdDocument,
    "query GetLessonById($lessonId: String!) {\n  getLessonById(lessonId: $lessonId) {\n    _id\n    title\n    order\n    video_url\n    pdf_url\n    content\n    duration_minutes\n    is_preview\n  }\n}": typeof types.GetLessonByIdDocument,
    "query GetAdminData {\n  getAdminData {\n    _id\n    name\n    email\n    role\n  }\n}": typeof types.GetAdminDataDocument,
};
const documents: Documents = {
    "mutation AdminLogout {\n  adminLogout\n}\n\nmutation AdminLogin($input: AdminLoginDto!) {\n  adminLogin(input: $input) {\n    _id\n    name\n    email\n    role\n  }\n}\n\nmutation InstructorSignUp($input: InstructorSignUpDto!) {\n  instructorSignUp(input: $input) {\n    _id\n    name\n    email\n    role\n  }\n}": types.AdminLogoutDocument,
    "mutation CreateCourseModule($createCourseModuleInput: CreateCourseModuleInput!) {\n  createCourseModule(createCourseModuleInput: $createCourseModuleInput) {\n    _id\n    course_id\n    title\n    description\n    order\n    createdAt\n    updatedAt\n  }\n}": types.CreateCourseModuleDocument,
    "mutation DeleteCourseModule($moduleId: String!) {\n  deleteCourseModule(moduleId: $moduleId)\n}": types.DeleteCourseModuleDocument,
    "mutation ReorderCourseModules($reorderCourseModulesInput: ReorderCourseModulesInput!) {\n  reorderCourseModules(reorderCourseModulesInput: $reorderCourseModulesInput)\n}": types.ReorderCourseModulesDocument,
    "mutation CreateCourse($createCourseInput: CreateCourseInput!, $thumbnail: Upload) {\n  createCourse(createCourseInput: $createCourseInput, thumbnail: $thumbnail) {\n    _id\n    title\n    slug\n    description\n    thumbnail_url\n    category_id\n    level\n    language\n    price\n    is_published\n    created_by\n    createdAt\n    updatedAt\n  }\n}": types.CreateCourseDocument,
    "mutation TogglePublishStatus($courseId: String!) {\n  togglePublishStatus(courseId: $courseId)\n}": types.TogglePublishStatusDocument,
    "mutation CreateLesson($createLessonInput: CreateLessonInput!, $document: Upload) {\n  createLesson(createLessonInput: $createLessonInput, document: $document) {\n    _id\n    module_id\n    title\n    video_url\n    pdf_url\n    content\n    order\n    duration_minutes\n    is_preview\n    createdAt\n    updatedAt\n  }\n}": types.CreateLessonDocument,
    "mutation DeleteLesson($lessonId: String!) {\n  deleteLesson(lessonId: $lessonId)\n}": types.DeleteLessonDocument,
    "mutation ReorderLessons($reorderLessonInput: ReorderLessonInput!) {\n  reorderLessons(reorderLessonInput: $reorderLessonInput)\n}": types.ReorderLessonsDocument,
    "query GetAllCategories($paginationInput: PaginationInput!) {\n  getAllCategories(paginationInput: $paginationInput) {\n    docs {\n      _id\n      name\n      slug\n      imageUrl\n      updatedAt\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}": types.GetAllCategoriesDocument,
    "query GetAllCourseModules($courseId: String!, $paginationInput: PaginationInput!) {\n  getAllCourseModules(courseId: $courseId, paginationInput: $paginationInput) {\n    docs {\n      _id\n      title\n      description\n      course_id\n      order\n      createdAt\n      lessons {\n        _id\n        title\n        order\n        video_url\n        pdf_url\n        content\n        duration_minutes\n        is_preview\n      }\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}": types.GetAllCourseModulesDocument,
    "query GetCourseModuleById($courseModuleId: String!) {\n  getCourseModuleById(courseModuleId: $courseModuleId) {\n    _id\n    title\n    description\n    course_id\n    order\n    createdAt\n  }\n}": types.GetCourseModuleByIdDocument,
    "query GetAllCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getAllCourses(paginationInput: $paginationInput, courseFilters: $courseFilters) {\n    docs {\n      _id\n      title\n      slug\n      description\n      thumbnail_url\n      category_name\n      level\n      language\n      price\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}": types.GetAllCoursesDocument,
    "query GetCourseById($courseId: String!) {\n  getCourseById(courseId: $courseId) {\n    _id\n    title\n    slug\n    description\n    thumbnail_url\n    category_id\n    level\n    language\n    price\n    is_published\n    created_by\n    createdAt\n    updatedAt\n  }\n}": types.GetCourseByIdDocument,
    "query GetLessonById($lessonId: String!) {\n  getLessonById(lessonId: $lessonId) {\n    _id\n    title\n    order\n    video_url\n    pdf_url\n    content\n    duration_minutes\n    is_preview\n  }\n}": types.GetLessonByIdDocument,
    "query GetAdminData {\n  getAdminData {\n    _id\n    name\n    email\n    role\n  }\n}": types.GetAdminDataDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AdminLogout {\n  adminLogout\n}\n\nmutation AdminLogin($input: AdminLoginDto!) {\n  adminLogin(input: $input) {\n    _id\n    name\n    email\n    role\n  }\n}\n\nmutation InstructorSignUp($input: InstructorSignUpDto!) {\n  instructorSignUp(input: $input) {\n    _id\n    name\n    email\n    role\n  }\n}"): (typeof documents)["mutation AdminLogout {\n  adminLogout\n}\n\nmutation AdminLogin($input: AdminLoginDto!) {\n  adminLogin(input: $input) {\n    _id\n    name\n    email\n    role\n  }\n}\n\nmutation InstructorSignUp($input: InstructorSignUpDto!) {\n  instructorSignUp(input: $input) {\n    _id\n    name\n    email\n    role\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateCourseModule($createCourseModuleInput: CreateCourseModuleInput!) {\n  createCourseModule(createCourseModuleInput: $createCourseModuleInput) {\n    _id\n    course_id\n    title\n    description\n    order\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation CreateCourseModule($createCourseModuleInput: CreateCourseModuleInput!) {\n  createCourseModule(createCourseModuleInput: $createCourseModuleInput) {\n    _id\n    course_id\n    title\n    description\n    order\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteCourseModule($moduleId: String!) {\n  deleteCourseModule(moduleId: $moduleId)\n}"): (typeof documents)["mutation DeleteCourseModule($moduleId: String!) {\n  deleteCourseModule(moduleId: $moduleId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ReorderCourseModules($reorderCourseModulesInput: ReorderCourseModulesInput!) {\n  reorderCourseModules(reorderCourseModulesInput: $reorderCourseModulesInput)\n}"): (typeof documents)["mutation ReorderCourseModules($reorderCourseModulesInput: ReorderCourseModulesInput!) {\n  reorderCourseModules(reorderCourseModulesInput: $reorderCourseModulesInput)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateCourse($createCourseInput: CreateCourseInput!, $thumbnail: Upload) {\n  createCourse(createCourseInput: $createCourseInput, thumbnail: $thumbnail) {\n    _id\n    title\n    slug\n    description\n    thumbnail_url\n    category_id\n    level\n    language\n    price\n    is_published\n    created_by\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation CreateCourse($createCourseInput: CreateCourseInput!, $thumbnail: Upload) {\n  createCourse(createCourseInput: $createCourseInput, thumbnail: $thumbnail) {\n    _id\n    title\n    slug\n    description\n    thumbnail_url\n    category_id\n    level\n    language\n    price\n    is_published\n    created_by\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation TogglePublishStatus($courseId: String!) {\n  togglePublishStatus(courseId: $courseId)\n}"): (typeof documents)["mutation TogglePublishStatus($courseId: String!) {\n  togglePublishStatus(courseId: $courseId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateLesson($createLessonInput: CreateLessonInput!, $document: Upload) {\n  createLesson(createLessonInput: $createLessonInput, document: $document) {\n    _id\n    module_id\n    title\n    video_url\n    pdf_url\n    content\n    order\n    duration_minutes\n    is_preview\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation CreateLesson($createLessonInput: CreateLessonInput!, $document: Upload) {\n  createLesson(createLessonInput: $createLessonInput, document: $document) {\n    _id\n    module_id\n    title\n    video_url\n    pdf_url\n    content\n    order\n    duration_minutes\n    is_preview\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteLesson($lessonId: String!) {\n  deleteLesson(lessonId: $lessonId)\n}"): (typeof documents)["mutation DeleteLesson($lessonId: String!) {\n  deleteLesson(lessonId: $lessonId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ReorderLessons($reorderLessonInput: ReorderLessonInput!) {\n  reorderLessons(reorderLessonInput: $reorderLessonInput)\n}"): (typeof documents)["mutation ReorderLessons($reorderLessonInput: ReorderLessonInput!) {\n  reorderLessons(reorderLessonInput: $reorderLessonInput)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetAllCategories($paginationInput: PaginationInput!) {\n  getAllCategories(paginationInput: $paginationInput) {\n    docs {\n      _id\n      name\n      slug\n      imageUrl\n      updatedAt\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}"): (typeof documents)["query GetAllCategories($paginationInput: PaginationInput!) {\n  getAllCategories(paginationInput: $paginationInput) {\n    docs {\n      _id\n      name\n      slug\n      imageUrl\n      updatedAt\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetAllCourseModules($courseId: String!, $paginationInput: PaginationInput!) {\n  getAllCourseModules(courseId: $courseId, paginationInput: $paginationInput) {\n    docs {\n      _id\n      title\n      description\n      course_id\n      order\n      createdAt\n      lessons {\n        _id\n        title\n        order\n        video_url\n        pdf_url\n        content\n        duration_minutes\n        is_preview\n      }\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}"): (typeof documents)["query GetAllCourseModules($courseId: String!, $paginationInput: PaginationInput!) {\n  getAllCourseModules(courseId: $courseId, paginationInput: $paginationInput) {\n    docs {\n      _id\n      title\n      description\n      course_id\n      order\n      createdAt\n      lessons {\n        _id\n        title\n        order\n        video_url\n        pdf_url\n        content\n        duration_minutes\n        is_preview\n      }\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetCourseModuleById($courseModuleId: String!) {\n  getCourseModuleById(courseModuleId: $courseModuleId) {\n    _id\n    title\n    description\n    course_id\n    order\n    createdAt\n  }\n}"): (typeof documents)["query GetCourseModuleById($courseModuleId: String!) {\n  getCourseModuleById(courseModuleId: $courseModuleId) {\n    _id\n    title\n    description\n    course_id\n    order\n    createdAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetAllCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getAllCourses(paginationInput: $paginationInput, courseFilters: $courseFilters) {\n    docs {\n      _id\n      title\n      slug\n      description\n      thumbnail_url\n      category_name\n      level\n      language\n      price\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}"): (typeof documents)["query GetAllCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getAllCourses(paginationInput: $paginationInput, courseFilters: $courseFilters) {\n    docs {\n      _id\n      title\n      slug\n      description\n      thumbnail_url\n      category_name\n      level\n      language\n      price\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetCourseById($courseId: String!) {\n  getCourseById(courseId: $courseId) {\n    _id\n    title\n    slug\n    description\n    thumbnail_url\n    category_id\n    level\n    language\n    price\n    is_published\n    created_by\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query GetCourseById($courseId: String!) {\n  getCourseById(courseId: $courseId) {\n    _id\n    title\n    slug\n    description\n    thumbnail_url\n    category_id\n    level\n    language\n    price\n    is_published\n    created_by\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetLessonById($lessonId: String!) {\n  getLessonById(lessonId: $lessonId) {\n    _id\n    title\n    order\n    video_url\n    pdf_url\n    content\n    duration_minutes\n    is_preview\n  }\n}"): (typeof documents)["query GetLessonById($lessonId: String!) {\n  getLessonById(lessonId: $lessonId) {\n    _id\n    title\n    order\n    video_url\n    pdf_url\n    content\n    duration_minutes\n    is_preview\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetAdminData {\n  getAdminData {\n    _id\n    name\n    email\n    role\n  }\n}"): (typeof documents)["query GetAdminData {\n  getAdminData {\n    _id\n    name\n    email\n    role\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;