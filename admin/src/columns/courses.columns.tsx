import { Text, Badge } from "@mantine/core";
import { CourseResponse } from "../generated/graphql";
import { TColumns } from "../types/table";
import CourseTableActions from "../components/table-action/CourseTableAction";

export const courseColumns: TColumns<CourseResponse>[] = [
  {
    key: "title",
    label: "Title",
    render: (val) => (
      <Text fw={500} size="sm" style={{ color: "#1f2937" }}>
        {val.title}
      </Text>
    ),
    minWidth: 200,
    filter:false,
  },
  {
    key: "category_name",
    label: "Category",
    render: (val) => (
      <Badge
        variant="light"
        color="blue"
        size="md"
        radius="md"
        style={{ textTransform: "none", fontWeight: 500 }}
      >
        {val?.category_name && val.category_name.length > 0 ? val.category_name : "N/A"}
      </Badge>
    ),
    minWidth: 120,
    filter:true,
  },
  {
    key: "level",
    label: "Level",
    render: (val) => {
      const levelColors = {
        Beginner: "green",
        Intermediate: "yellow",
        Advanced: "red",
      };
      return (
        <Badge
          variant="dot"
          color={levelColors[val.level as keyof typeof levelColors] || "gray"}
          size="lg"
          radius="md"
          style={{ textTransform: "capitalize", fontWeight: 500 }}
        >
          {val.level}
        </Badge>
      );
    },
    minWidth: 120,
    filter:true,
  },
  {
    key: "language",
    label: "Language",
    render: (val) => (
      <Text size="sm" c="dimmed" tt="capitalize">
        {val.language}
      </Text>
    ),
    minWidth: 100,
    filter:false,
  },
  {
    key: "price",
    label: "Price",
    render: (value) => (
      <Text fw={600} size="sm" style={{ color: "#059669" }}>
        ₹{value.price.toLocaleString("en-IN")}
      </Text>
    ),
    minWidth: 100,
    filter:false,
  },
  {
    key: "is_published",
    label: "Status",
    render: (value) => (
      <Badge
        variant="filled"
        color={value.is_published ? "teal" : "gray"}
        size="md"
        radius="md"
        style={{
          textTransform: "none",
          fontWeight: 500,
        }}
      >
        {value.is_published ? "Published" : "Draft"}
      </Badge>
    ),
    minWidth: 110,
    filter:true,
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
    filter:false,
  },

  {
    key: "action" as keyof CourseResponse,
    label: "Action",
    minWidth: 120,
    render: (course) => <CourseTableActions course={course} />,
    filter:false,
  },
];
