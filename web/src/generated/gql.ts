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
    "mutation SendOtp($email: String!, $type: String!) {\n  sendOtp(email: $email, type: $type)\n}\n\nmutation LoginOtpVerify($data: VerifyLoginOtpInput!) {\n  loginOtpVerify(data: $data) {\n    _id\n    name\n    email\n    emailVerified\n  }\n}\n\nmutation SignUpOtpVerify($data: VerifyOtpInput!) {\n  signUpOtpVerify(data: $data) {\n    _id\n    name\n    email\n    emailVerified\n  }\n}\n\nmutation UserLogout {\n  userLogout\n}": typeof types.SendOtpDocument,
    "query GetCourseModuleByCourseId($courseId: String!, $paginationInput: PaginationInput!) {\n  getCourseModuleByCourseId(\n    courseId: $courseId\n    paginationInput: $paginationInput\n  ) {\n    docs {\n      _id\n      title\n      description\n      course_id\n      order\n      createdAt\n      lessons {\n        _id\n        title\n        order\n        lesson_type\n        duration_minutes\n        isUnlocked\n        status\n      }\n      quizzes {\n        _id\n        title\n        passing_score\n      }\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}": typeof types.GetCourseModuleByCourseIdDocument,
    "query GetCourseProgress($courseId: String!) {\n  getCourseProgress(courseId: $courseId) {\n    totalLessons\n    completedLessons\n    percentage\n  }\n}": typeof types.GetCourseProgressDocument,
    "query GetUserCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getUserCourses(paginationInput: $paginationInput, courseFilters: $courseFilters) {\n    docs {\n      _id\n      title\n      slug\n      description\n      thumbnail_url\n      category_name\n      level\n      language\n      price\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}": typeof types.GetUserCoursesDocument,
    "query FindAllCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getPublishedCourses(\n    paginationInput: $paginationInput\n    courseFilters: $courseFilters\n  ) {\n    docs {\n      _id\n      title\n      description\n      price\n      thumbnail_url\n      category_name\n      level\n      language\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}\n\nquery FindOneCourse($courseId: String!) {\n  getCourseById(courseId: $courseId) {\n    _id\n    title\n    slug\n    description\n    thumbnail_url\n    category_id\n    level\n    language\n    price\n    is_published\n    created_by\n    published_at\n    createdAt\n    updatedAt\n    is_enrolled\n  }\n}": typeof types.FindAllCoursesDocument,
    "mutation UpdateLessonProgress($lessonId: String!, $operation: LESSON_OPERATION!) {\n  updateLessonProgress(lessonId: $lessonId, operation: $operation) {\n    _id\n    status\n  }\n}": typeof types.UpdateLessonProgressDocument,
    "query GetLessonById($lessonId: String!) {\n  getLessonById(lessonId: $lessonId) {\n    _id\n    title\n    order\n    video_url\n    pdf_url\n    content\n    duration_minutes\n    is_preview\n  }\n}": typeof types.GetLessonByIdDocument,
    "query GetLessonContent($lessonId: String!, $courseId: String!) {\n  getLessonContent(lessonId: $lessonId, courseId: $courseId) {\n    _id\n    status\n    lesson {\n      _id\n      title\n      order\n      video_url\n      pdf_url\n      content\n      duration_minutes\n      is_preview\n    }\n  }\n}": typeof types.GetLessonContentDocument,
    "mutation CreateCourseOrder($course_id: String!) {\n  createCourseOrder(course_id: $course_id) {\n    order_id\n    amount\n    currency\n    razorpay_order_id\n    status\n  }\n}": typeof types.CreateCourseOrderDocument,
    "query GetOrder($id: String!) {\n  getOrder(id: $id) {\n    order_id\n    amount\n    currency\n    razorpay_order_id\n    status\n  }\n}": typeof types.GetOrderDocument,
    "query GetProfileData {\n  getProfileData {\n    _id\n    name\n    email\n    emailVerified\n  }\n}": typeof types.GetProfileDataDocument,
};
const documents: Documents = {
    "mutation SendOtp($email: String!, $type: String!) {\n  sendOtp(email: $email, type: $type)\n}\n\nmutation LoginOtpVerify($data: VerifyLoginOtpInput!) {\n  loginOtpVerify(data: $data) {\n    _id\n    name\n    email\n    emailVerified\n  }\n}\n\nmutation SignUpOtpVerify($data: VerifyOtpInput!) {\n  signUpOtpVerify(data: $data) {\n    _id\n    name\n    email\n    emailVerified\n  }\n}\n\nmutation UserLogout {\n  userLogout\n}": types.SendOtpDocument,
    "query GetCourseModuleByCourseId($courseId: String!, $paginationInput: PaginationInput!) {\n  getCourseModuleByCourseId(\n    courseId: $courseId\n    paginationInput: $paginationInput\n  ) {\n    docs {\n      _id\n      title\n      description\n      course_id\n      order\n      createdAt\n      lessons {\n        _id\n        title\n        order\n        lesson_type\n        duration_minutes\n        isUnlocked\n        status\n      }\n      quizzes {\n        _id\n        title\n        passing_score\n      }\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}": types.GetCourseModuleByCourseIdDocument,
    "query GetCourseProgress($courseId: String!) {\n  getCourseProgress(courseId: $courseId) {\n    totalLessons\n    completedLessons\n    percentage\n  }\n}": types.GetCourseProgressDocument,
    "query GetUserCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getUserCourses(paginationInput: $paginationInput, courseFilters: $courseFilters) {\n    docs {\n      _id\n      title\n      slug\n      description\n      thumbnail_url\n      category_name\n      level\n      language\n      price\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}": types.GetUserCoursesDocument,
    "query FindAllCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getPublishedCourses(\n    paginationInput: $paginationInput\n    courseFilters: $courseFilters\n  ) {\n    docs {\n      _id\n      title\n      description\n      price\n      thumbnail_url\n      category_name\n      level\n      language\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}\n\nquery FindOneCourse($courseId: String!) {\n  getCourseById(courseId: $courseId) {\n    _id\n    title\n    slug\n    description\n    thumbnail_url\n    category_id\n    level\n    language\n    price\n    is_published\n    created_by\n    published_at\n    createdAt\n    updatedAt\n    is_enrolled\n  }\n}": types.FindAllCoursesDocument,
    "mutation UpdateLessonProgress($lessonId: String!, $operation: LESSON_OPERATION!) {\n  updateLessonProgress(lessonId: $lessonId, operation: $operation) {\n    _id\n    status\n  }\n}": types.UpdateLessonProgressDocument,
    "query GetLessonById($lessonId: String!) {\n  getLessonById(lessonId: $lessonId) {\n    _id\n    title\n    order\n    video_url\n    pdf_url\n    content\n    duration_minutes\n    is_preview\n  }\n}": types.GetLessonByIdDocument,
    "query GetLessonContent($lessonId: String!, $courseId: String!) {\n  getLessonContent(lessonId: $lessonId, courseId: $courseId) {\n    _id\n    status\n    lesson {\n      _id\n      title\n      order\n      video_url\n      pdf_url\n      content\n      duration_minutes\n      is_preview\n    }\n  }\n}": types.GetLessonContentDocument,
    "mutation CreateCourseOrder($course_id: String!) {\n  createCourseOrder(course_id: $course_id) {\n    order_id\n    amount\n    currency\n    razorpay_order_id\n    status\n  }\n}": types.CreateCourseOrderDocument,
    "query GetOrder($id: String!) {\n  getOrder(id: $id) {\n    order_id\n    amount\n    currency\n    razorpay_order_id\n    status\n  }\n}": types.GetOrderDocument,
    "query GetProfileData {\n  getProfileData {\n    _id\n    name\n    email\n    emailVerified\n  }\n}": types.GetProfileDataDocument,
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
export function graphql(source: "mutation SendOtp($email: String!, $type: String!) {\n  sendOtp(email: $email, type: $type)\n}\n\nmutation LoginOtpVerify($data: VerifyLoginOtpInput!) {\n  loginOtpVerify(data: $data) {\n    _id\n    name\n    email\n    emailVerified\n  }\n}\n\nmutation SignUpOtpVerify($data: VerifyOtpInput!) {\n  signUpOtpVerify(data: $data) {\n    _id\n    name\n    email\n    emailVerified\n  }\n}\n\nmutation UserLogout {\n  userLogout\n}"): (typeof documents)["mutation SendOtp($email: String!, $type: String!) {\n  sendOtp(email: $email, type: $type)\n}\n\nmutation LoginOtpVerify($data: VerifyLoginOtpInput!) {\n  loginOtpVerify(data: $data) {\n    _id\n    name\n    email\n    emailVerified\n  }\n}\n\nmutation SignUpOtpVerify($data: VerifyOtpInput!) {\n  signUpOtpVerify(data: $data) {\n    _id\n    name\n    email\n    emailVerified\n  }\n}\n\nmutation UserLogout {\n  userLogout\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetCourseModuleByCourseId($courseId: String!, $paginationInput: PaginationInput!) {\n  getCourseModuleByCourseId(\n    courseId: $courseId\n    paginationInput: $paginationInput\n  ) {\n    docs {\n      _id\n      title\n      description\n      course_id\n      order\n      createdAt\n      lessons {\n        _id\n        title\n        order\n        lesson_type\n        duration_minutes\n        isUnlocked\n        status\n      }\n      quizzes {\n        _id\n        title\n        passing_score\n      }\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}"): (typeof documents)["query GetCourseModuleByCourseId($courseId: String!, $paginationInput: PaginationInput!) {\n  getCourseModuleByCourseId(\n    courseId: $courseId\n    paginationInput: $paginationInput\n  ) {\n    docs {\n      _id\n      title\n      description\n      course_id\n      order\n      createdAt\n      lessons {\n        _id\n        title\n        order\n        lesson_type\n        duration_minutes\n        isUnlocked\n        status\n      }\n      quizzes {\n        _id\n        title\n        passing_score\n      }\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetCourseProgress($courseId: String!) {\n  getCourseProgress(courseId: $courseId) {\n    totalLessons\n    completedLessons\n    percentage\n  }\n}"): (typeof documents)["query GetCourseProgress($courseId: String!) {\n  getCourseProgress(courseId: $courseId) {\n    totalLessons\n    completedLessons\n    percentage\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetUserCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getUserCourses(paginationInput: $paginationInput, courseFilters: $courseFilters) {\n    docs {\n      _id\n      title\n      slug\n      description\n      thumbnail_url\n      category_name\n      level\n      language\n      price\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}"): (typeof documents)["query GetUserCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getUserCourses(paginationInput: $paginationInput, courseFilters: $courseFilters) {\n    docs {\n      _id\n      title\n      slug\n      description\n      thumbnail_url\n      category_name\n      level\n      language\n      price\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FindAllCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getPublishedCourses(\n    paginationInput: $paginationInput\n    courseFilters: $courseFilters\n  ) {\n    docs {\n      _id\n      title\n      description\n      price\n      thumbnail_url\n      category_name\n      level\n      language\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}\n\nquery FindOneCourse($courseId: String!) {\n  getCourseById(courseId: $courseId) {\n    _id\n    title\n    slug\n    description\n    thumbnail_url\n    category_id\n    level\n    language\n    price\n    is_published\n    created_by\n    published_at\n    createdAt\n    updatedAt\n    is_enrolled\n  }\n}"): (typeof documents)["query FindAllCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getPublishedCourses(\n    paginationInput: $paginationInput\n    courseFilters: $courseFilters\n  ) {\n    docs {\n      _id\n      title\n      description\n      price\n      thumbnail_url\n      category_name\n      level\n      language\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}\n\nquery FindOneCourse($courseId: String!) {\n  getCourseById(courseId: $courseId) {\n    _id\n    title\n    slug\n    description\n    thumbnail_url\n    category_id\n    level\n    language\n    price\n    is_published\n    created_by\n    published_at\n    createdAt\n    updatedAt\n    is_enrolled\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateLessonProgress($lessonId: String!, $operation: LESSON_OPERATION!) {\n  updateLessonProgress(lessonId: $lessonId, operation: $operation) {\n    _id\n    status\n  }\n}"): (typeof documents)["mutation UpdateLessonProgress($lessonId: String!, $operation: LESSON_OPERATION!) {\n  updateLessonProgress(lessonId: $lessonId, operation: $operation) {\n    _id\n    status\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetLessonById($lessonId: String!) {\n  getLessonById(lessonId: $lessonId) {\n    _id\n    title\n    order\n    video_url\n    pdf_url\n    content\n    duration_minutes\n    is_preview\n  }\n}"): (typeof documents)["query GetLessonById($lessonId: String!) {\n  getLessonById(lessonId: $lessonId) {\n    _id\n    title\n    order\n    video_url\n    pdf_url\n    content\n    duration_minutes\n    is_preview\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetLessonContent($lessonId: String!, $courseId: String!) {\n  getLessonContent(lessonId: $lessonId, courseId: $courseId) {\n    _id\n    status\n    lesson {\n      _id\n      title\n      order\n      video_url\n      pdf_url\n      content\n      duration_minutes\n      is_preview\n    }\n  }\n}"): (typeof documents)["query GetLessonContent($lessonId: String!, $courseId: String!) {\n  getLessonContent(lessonId: $lessonId, courseId: $courseId) {\n    _id\n    status\n    lesson {\n      _id\n      title\n      order\n      video_url\n      pdf_url\n      content\n      duration_minutes\n      is_preview\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateCourseOrder($course_id: String!) {\n  createCourseOrder(course_id: $course_id) {\n    order_id\n    amount\n    currency\n    razorpay_order_id\n    status\n  }\n}"): (typeof documents)["mutation CreateCourseOrder($course_id: String!) {\n  createCourseOrder(course_id: $course_id) {\n    order_id\n    amount\n    currency\n    razorpay_order_id\n    status\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetOrder($id: String!) {\n  getOrder(id: $id) {\n    order_id\n    amount\n    currency\n    razorpay_order_id\n    status\n  }\n}"): (typeof documents)["query GetOrder($id: String!) {\n  getOrder(id: $id) {\n    order_id\n    amount\n    currency\n    razorpay_order_id\n    status\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetProfileData {\n  getProfileData {\n    _id\n    name\n    email\n    emailVerified\n  }\n}"): (typeof documents)["query GetProfileData {\n  getProfileData {\n    _id\n    name\n    email\n    emailVerified\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;