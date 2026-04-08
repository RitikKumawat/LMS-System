export interface CertificateJobPayload {
  userId: string;
  courseId: string;
  certificateId: string;
}

export interface CompletionCandidate {
  userId: string;
  courseId: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  completedAt: Date;
}
