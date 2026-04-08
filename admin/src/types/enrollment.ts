import { EnrollmentDetails } from "../generated/graphql";

export type AdminEnrollmentRow = EnrollmentDetails & {
  user_id: string;
  course_id: string;
  course_progress_percentage: number;
};
