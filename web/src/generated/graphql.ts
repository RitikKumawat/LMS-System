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

export type CreateInstructorDto = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type InstructorLoginDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
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

export type Mutation = {
  __typename: 'Mutation';
  adminLogin: AdminResponse;
  adminLogout: Scalars['String']['output'];
  createInstructor: AdminResponse;
  instructorLogin: InstructorResponse;
  instructorLogout: Scalars['String']['output'];
  instructorSignUp: InstructorResponse;
  loginOtpVerify: User;
  sendOtp: Scalars['String']['output'];
  signUpOtpVerify: User;
  userLogout: Scalars['String']['output'];
};


export type MutationAdminLoginArgs = {
  input: AdminLoginDto;
};


export type MutationCreateInstructorArgs = {
  input: CreateInstructorDto;
};


export type MutationInstructorLoginArgs = {
  input: InstructorLoginDto;
};


export type MutationInstructorSignUpArgs = {
  input: InstructorSignUpDto;
};


export type MutationLoginOtpVerifyArgs = {
  data: VerifyLoginOtpInput;
};


export type MutationSendOtpArgs = {
  email: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type MutationSignUpOtpVerifyArgs = {
  data: VerifyOtpInput;
};

export type Query = {
  __typename: 'Query';
  getAdminData: AdminResponse;
  getInstructorData: InstructorResponse;
  getProfileData: User;
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


export const SendOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}]}}]} as unknown as DocumentNode<SendOtpMutation, SendOtpMutationVariables>;
export const LoginOtpVerifyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginOtpVerify"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyLoginOtpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginOtpVerify"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}}]}}]}}]} as unknown as DocumentNode<LoginOtpVerifyMutation, LoginOtpVerifyMutationVariables>;
export const SignUpOtpVerifyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUpOtpVerify"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyOtpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUpOtpVerify"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}}]}}]}}]} as unknown as DocumentNode<SignUpOtpVerifyMutation, SignUpOtpVerifyMutationVariables>;