import { Send } from "lucide-react";
import TableActions from "./TableActions";
import { openConfirmModal } from "../modals/confirmation-modals/ConfirmationModal";
import { memo } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { notifications } from "@mantine/notifications";
import { AdminEnrollmentRow } from "../../types/enrollment";

const SEND_CERTIFICATE_MUTATION = gql`
  mutation SendCertificate($userId: String, $courseId: String) {
    sendCertificate(userId: $userId, courseId: $courseId)
  }
`;

type Props = {
  enrollment: AdminEnrollmentRow;
};

type SendCertificateMutationData = {
  sendCertificate: string;
};

const EnrollmentTableActions = ({ enrollment }: Props) => {
  const [sendCertificate] =
    useMutation<SendCertificateMutationData>(SEND_CERTIFICATE_MUTATION);
  const isDisabled = enrollment.course_progress_percentage < 100;

  return (
    <TableActions<AdminEnrollmentRow>
      row={enrollment}
      actions={[
        {
          label: "Resend Certificate",
          icon: <Send size={18} />,
          color: "green",
          disabled: isDisabled,
          onClick: () => {
            openConfirmModal({
              title: "Resend Certificate",
              message:
                "Are you sure you want to resend the certificate to the student?",
              confirmText: "Yes, Resend",
              cancelText: "No, Cancel",
              onConfirm: async () => {
                try {
                  const { data } = await sendCertificate({
                    variables: {
                      userId: enrollment.user_id,
                      courseId: enrollment.course_id,
                    },
                  });

                  notifications.show({
                    message:
                      data?.sendCertificate ??
                      "Certificate resend request submitted successfully.",
                    color: "green",
                  });
                } catch (error: unknown) {
                  const message =
                    error instanceof Error
                      ? error.message
                      : "Failed to resend certificate.";
                  notifications.show({
                    message,
                    color: "red",
                  });
                }
              },
              loading: false,
              loadingText: "Sending......",
            });
          },
        },
      ]}
    />
  );
};

export default memo(EnrollmentTableActions);
