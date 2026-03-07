import { useState, useEffect } from "react";
import { Container, TextInput, Title, Group, Paper, Text } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { ROUTES } from "../../enum/routes";
import { notifications } from "@mantine/notifications";
import CertificateDesigner from "../../components/CertificateDesigner";
import FButton from "../../ui/FButton/FButton";
import {
    GetCertificateTemplateByIdDocument,
    CreateCertificateTemplateDocument,
    UpdateCertificateTemplateDocument
} from "../../generated/graphql";

const CertificateTemplateEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [name, setName] = useState("New Certificate Template");
    const [fabricJson, setFabricJson] = useState<string | null>(null);

    const { data: queryData, loading: loadingQuery } = useQuery(GetCertificateTemplateByIdDocument, {
        variables: { id: id as string },
        skip: !id,
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if (queryData?.getCertificateTemplateById) {
            setName(queryData.getCertificateTemplateById.name);
            setFabricJson(queryData.getCertificateTemplateById.fabric_json);
        }
    }, [queryData]);

    const [createTemplate, { loading: creating }] = useMutation(CreateCertificateTemplateDocument, {
        onCompleted: () => {
            notifications.show({ title: "Success", message: "Template created successfully", color: "green" });
            navigate(ROUTES.CERTIFICATE_TEMPLATES);
        },
        onError: (error: any) => notifications.show({ title: "Error", message: error.message, color: "red" }),
    });

    const [updateTemplate, { loading: updating }] = useMutation(UpdateCertificateTemplateDocument, {
        onCompleted: () => {
            notifications.show({ title: "Success", message: "Template updated successfully", color: "green" });
            navigate(ROUTES.CERTIFICATE_TEMPLATES);
        },
        onError: (error: any) => notifications.show({ title: "Error", message: error.message, color: "red" }),
    });

    const handleSaveWorkspace = (json: string) => {
        // Basic validation to find placeholders within the JSON
        const placeholdersInUse: string[] = [];
        if (json.includes("{{student_name}}")) placeholdersInUse.push("{{student_name}}");
        if (json.includes("{{course_title}}")) placeholdersInUse.push("{{course_title}}");
        if (json.includes("{{issue_date}}")) placeholdersInUse.push("{{issue_date}}");

        if (id) {
            updateTemplate({
                variables: {
                    updateCertificateTemplateInput: {
                        templateId: id,
                        name,
                        fabric_json: json,
                        placeholders: placeholdersInUse,
                    }
                }
            });
        } else {
            createTemplate({
                variables: {
                    createCertificateTemplateInput: {
                        name,
                        fabric_json: json,
                        placeholders: placeholdersInUse,
                    }
                }
            });
        }
    };

    if (id && loadingQuery) return <Text p="md">Loading designer workspace...</Text>;

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <Group>
                    <FButton
                        variant="outline"
                        leftIcon={<ArrowLeft size={16} />}
                        handleClick={() => navigate(ROUTES.CERTIFICATE_TEMPLATES)}
                        title="Back"
                    />
                    <Title order={3}>{id ? "Edit" : "Create"} Template</Title>
                </Group>
            </Group>

            <Paper shadow="sm" radius="md" p="xl" withBorder mb="lg">
                <TextInput
                    label="Template Name"
                    placeholder="e.g. Masterclass Distinction"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    required
                    w={{ base: "100%", sm: "50%" }}
                />
            </Paper>

            {(!id || fabricJson) && (
                <CertificateDesigner
                    initialFabricJson={fabricJson || undefined}
                    onSave={handleSaveWorkspace}
                    isLoading={creating || updating}
                />
            )}
        </Container>
    );
};

export default CertificateTemplateEditor;
