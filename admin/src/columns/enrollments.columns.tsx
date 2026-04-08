import { Text, Badge } from "@mantine/core";
import { Enrollment_Status, PaymentStatus } from "../generated/graphql";
import { TColumns } from "../types/table";
import EnrollmentTableActions from "../components/table-action/EnrollmentTableActions";
import { AdminEnrollmentRow } from "../types/enrollment";

export const enrollmentColumns: TColumns<AdminEnrollmentRow>[] = [
    {
        key: "student_name",
        label: "Student Name",
        render: (val) => (
            <Text fw={500} size="sm" style={{ color: "#1f2937" }}>
                {val.student_name}
            </Text>
        ),
        minWidth: 200,
        filter: false,
    },
    {
        key: "student_email",
        label: "Student Email",
        render: (val) => (
            <Text fw={500} size="sm" style={{ color: "#1f2937" }}>
                {val.student_email}
            </Text>
        ),
        minWidth: 200,
        filter: false,
    },
    {
        key: "course_name",
        label: "Course Name",
        render: (val) => (
            <Badge
                variant="light"
                color="blue"
                size="md"
                radius="md"
                style={{ textTransform: "none", fontWeight: 500 }}
            >
                {val.course_name}
            </Badge>
        ),
        minWidth: 120,
        filter: true,
    },
    {
        key: "status",
        label: "Enrollment Status",
        render: (val) => {
            const levelColors = {
                [Enrollment_Status.Active]: "green",
                [Enrollment_Status.Cancelled]: "yellow",
                [Enrollment_Status.Refunded]: "red",
            };
            return (
                <Badge
                    variant="dot"
                    size="lg"
                    radius="md"
                    color={levelColors[val.status] || "gray"}
                    style={{ textTransform: "capitalize", fontWeight: 500 }}
                >
                    {val.status}
                </Badge>
            );
        },
        minWidth: 120,
        filter: true,
    },
    {
        key: "payment_status",
        label: "Payment Status",
        render: (value) => (
            <Badge
                variant="filled"
                color={value.payment_status === PaymentStatus.Success ? "teal" : "gray"}
                size="md"
                radius="md"
                style={{
                    textTransform: "none",
                    fontWeight: 500,
                }}
            >
                {value.payment_status}
            </Badge>
        ),
        minWidth: 110,
        filter: true,
    },
    {
        key: "course_progress_percentage",
        label: "Course Progress",
        render: (value) => (
            <Text fw={600} size="sm" style={{ color: "#0f766e" }}>
                {value.course_progress_percentage}%
            </Text>
        ),
        minWidth: 120,
        filter: false,
    },
    {
        key: "method",
        label: "Payment Method",
        render: (value) => (
            <Text fw={600} size="sm" style={{ color: "#059669" }}>
                {value.method}
            </Text>
        ),
        minWidth: 100,
        filter: false,
    },
    {
        key: "enrolled_at",
        label: "Enrollment Date",
        render: (value) => (
            <Text size="sm" c="dimmed">
                {new Date(value.enrolled_at as number).toLocaleDateString("en-IN", {
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
        key: "payment_id",
        label: "Payment ID",
        render: (val) => (
            <Text size="sm" c="dimmed" tt="capitalize">
                {val.payment_id}
            </Text>
        ),
        minWidth: 100,
        filter: false,
    },
    {
                key: "action" as keyof AdminEnrollmentRow,
        label: "Action",
        minWidth: 120,
        render: (enrollment) => <EnrollmentTableActions enrollment={enrollment} />,
        filter:false,
      },
];
