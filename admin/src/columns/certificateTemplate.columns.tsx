import { Text } from "@mantine/core";
import { CertificateTemplateResponse } from "../generated/graphql";
import { TColumns } from "../types/table";
import CertificateListTableAction from "../components/table-action/CertificateListTableAction";

export const certificateTemplateColumns: TColumns<CertificateTemplateResponse>[] = [
    {
        key: "name",
        label: "Name",
        render: (val) => (
            <Text fw={500} size="sm" style={{ color: "#1f2937" }}>
                {val.name}
            </Text>
        ),
        minWidth: 200,
        filter: false,
    },
    {
        key: "createdAt",
        label: "Created",
        render: (value) => (
            <Text size="sm" c="dimmed">
                {new Date(value.createdAt as number).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })}
            </Text>
        ),
        minWidth: 120,
        filter: false,
    },

    {
        key: "action" as keyof CertificateTemplateResponse,
        label: "Action",
        minWidth: 120,
        render: (val) => (
            <CertificateListTableAction template={val} />
        ),
        filter: false,
    },
];

export const adminCertificateTemplateColumns: TColumns<CertificateTemplateResponse>[] =
    certificateTemplateColumns.filter((col) => col.key !== "action" as keyof CertificateTemplateResponse);