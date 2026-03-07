import { SquarePen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableActions from "./TableActions";
import { ROUTES } from "../../enum/routes";
import {
    CertificateTemplateResponse,
    GetAllCertificateTemplatesDocument,
    RemoveCertificateTemplateDocument,
} from "../../generated/graphql";
import { useMutation } from "@apollo/client/react";
import { notifications } from "@mantine/notifications";
import { openConfirmModal } from "../modals/confirmation-modals/ConfirmationModal";

type Props = {
    template: CertificateTemplateResponse;
};

const CertificateListTableAction = ({ template }: Props) => {
    const navigate = useNavigate();

    const [deleteTemplate, { loading }] = useMutation(RemoveCertificateTemplateDocument, {
        onCompleted: async () => {
            notifications.show({
                message: "Template deleted successfully",
                color: "green",
            });

        },
        refetchQueries: [GetAllCertificateTemplatesDocument],
        onError: (error) =>
            notifications.show({
                message: error.message,
                color: "red",
            }),
    });
    return (
        <TableActions<CertificateTemplateResponse>
            row={template}
            actions={[
                {
                    label: "Edit",
                    icon: <SquarePen size={18} />,
                    color: "blue",
                    onClick: (row) => navigate(`${ROUTES.CERTIFICATE_TEMPLATE_EDITOR}/${row._id}`),
                },
                {
                    label: "Delete",
                    icon: <Trash2 size={16} />,
                    color: "red",
                    onClick: (row) => {
                        openConfirmModal({
                            title: "Delete Template",
                            message: "Are you sure you want to delete the template?",
                            confirmText: "Yes",
                            cancelText: "No",
                            loading: loading,
                            onConfirm: () => {
                                deleteTemplate({ variables: { id: row._id } });
                            }
                        })
                    },
                },
            ]}
        />
    );
};

export default CertificateListTableAction;
