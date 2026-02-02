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
    "query FindAllCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getPublishedCourses(\n    paginationInput: $paginationInput\n    courseFilters: $courseFilters\n  ) {\n    docs {\n      _id\n      title\n      description\n      price\n      thumbnail_url\n      category_name\n      level\n      language\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}\n\nquery FindOneCourse($courseId: String!) {\n  getCourseById(courseId: $courseId) {\n    _id\n    title\n    description\n    price\n    thumbnail_url\n    category_id\n    level\n    language\n    is_published\n    created_by\n    published_at\n    createdAt\n    updatedAt\n  }\n}": typeof types.FindAllCoursesDocument,
    "query GetProfileData {\n  getProfileData {\n    _id\n    name\n    email\n    emailVerified\n  }\n}": typeof types.GetProfileDataDocument,
};
const documents: Documents = {
    "mutation SendOtp($email: String!, $type: String!) {\n  sendOtp(email: $email, type: $type)\n}\n\nmutation LoginOtpVerify($data: VerifyLoginOtpInput!) {\n  loginOtpVerify(data: $data) {\n    _id\n    name\n    email\n    emailVerified\n  }\n}\n\nmutation SignUpOtpVerify($data: VerifyOtpInput!) {\n  signUpOtpVerify(data: $data) {\n    _id\n    name\n    email\n    emailVerified\n  }\n}\n\nmutation UserLogout {\n  userLogout\n}": types.SendOtpDocument,
    "query FindAllCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getPublishedCourses(\n    paginationInput: $paginationInput\n    courseFilters: $courseFilters\n  ) {\n    docs {\n      _id\n      title\n      description\n      price\n      thumbnail_url\n      category_name\n      level\n      language\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}\n\nquery FindOneCourse($courseId: String!) {\n  getCourseById(courseId: $courseId) {\n    _id\n    title\n    description\n    price\n    thumbnail_url\n    category_id\n    level\n    language\n    is_published\n    created_by\n    published_at\n    createdAt\n    updatedAt\n  }\n}": types.FindAllCoursesDocument,
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
export function graphql(source: "query FindAllCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getPublishedCourses(\n    paginationInput: $paginationInput\n    courseFilters: $courseFilters\n  ) {\n    docs {\n      _id\n      title\n      description\n      price\n      thumbnail_url\n      category_name\n      level\n      language\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}\n\nquery FindOneCourse($courseId: String!) {\n  getCourseById(courseId: $courseId) {\n    _id\n    title\n    description\n    price\n    thumbnail_url\n    category_id\n    level\n    language\n    is_published\n    created_by\n    published_at\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query FindAllCourses($paginationInput: PaginationInput!, $courseFilters: CourseFilters!) {\n  getPublishedCourses(\n    paginationInput: $paginationInput\n    courseFilters: $courseFilters\n  ) {\n    docs {\n      _id\n      title\n      description\n      price\n      thumbnail_url\n      category_name\n      level\n      language\n      is_published\n      createdAt\n    }\n    totalDocs\n    limit\n    totalPages\n    page\n    hasNextPage\n    hasPrevPage\n  }\n}\n\nquery FindOneCourse($courseId: String!) {\n  getCourseById(courseId: $courseId) {\n    _id\n    title\n    description\n    price\n    thumbnail_url\n    category_id\n    level\n    language\n    is_published\n    created_by\n    published_at\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetProfileData {\n  getProfileData {\n    _id\n    name\n    email\n    emailVerified\n  }\n}"): (typeof documents)["query GetProfileData {\n  getProfileData {\n    _id\n    name\n    email\n    emailVerified\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;