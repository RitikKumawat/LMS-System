import { Group, Text, Title, Container } from "@mantine/core";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { ROUTES } from "../../enum/routes";
import { Admin_Roles, GetAdminDataDocument, GetAllCertificateTemplatesDocument } from "../../generated/graphql";
import FButton from "../../ui/FButton/FButton";
import FTable from "../../ui/FTable/FTable";
import { adminCertificateTemplateColumns, certificateTemplateColumns } from "../../columns/certificateTemplate.columns";
import { CONSTANT } from "../../constants";
import { useState } from "react";

const CertificateTemplatesList = () => {
    const navigate = useNavigate();
    const { data: adminData } = useQuery(GetAdminDataDocument, {
        fetchPolicy: "network-only",
    })
    const [page, setPage] = useState(1);
    const { data, loading } = useQuery(GetAllCertificateTemplatesDocument, {
        variables: {
            paginationInput: {
                limit: CONSTANT.PAGE_LIMIT,
                page: page,
            }
        },
        fetchPolicy: "network-only",
    });

    if (loading) return <Text p="md">Loading templates...</Text>;

    const templates = data?.getAllCertificateTemplates.docs || [];

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <Title order={2}>Certificate Templates</Title>
                <FButton
                    variant="dark"
                    title="Create Template"
                    leftIcon={<Plus size={16} />}
                    handleClick={() => navigate(ROUTES.CERTIFICATE_TEMPLATE_EDITOR)}
                />
            </Group>

            <FTable
                columns={adminData?.getAdminData.role === Admin_Roles.Admin ? adminCertificateTemplateColumns : certificateTemplateColumns}
                data={templates}
                page={page}
                setPage={setPage}
                total={data?.getAllCertificateTemplates.totalPages as number}
                pageLimit={data?.getAllCertificateTemplates.limit}
                loading={loading}
            />
        </Container>
    );
};

export default CertificateTemplatesList;
