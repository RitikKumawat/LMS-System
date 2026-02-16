import { Box, Flex } from "@mantine/core";
import FButton from "../../ui/FButton/FButton";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../enum/routes";
import { useQuery } from "@apollo/client/react";
import {
  Admin_Roles,
  Course_Level,
  GetAdminDataDocument,
  GetAllCategoriesDocument,
  GetAllCoursesDocument,
} from "../../generated/graphql";
import { useMemo, useState } from "react";
import FTable from "../../ui/FTable/FTable";
import { courseColumns } from "../../columns/courses.columns";
import { CONSTANT } from "../../constants";
import FilterBar from "../../components/FilterBar/FilterBar";
import FInput from "../../ui/FInput/FInput";
import { useDebouncedValue } from "@mantine/hooks";
import { adminCourseColumns } from "../../columns/adminCourses.columns";

type CourseFilters = {
  search?: string;
  level?: Course_Level;
  categoryId?: string;
  isPublished?: boolean;
};

const Courses = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<CourseFilters>({});
  const [debouncedFilterSearch] = useDebouncedValue(filters.search, 500);
  const { data: adminData } = useQuery(GetAdminDataDocument)
  /* -------------------- Categories -------------------- */
  const { data: categories } = useQuery(GetAllCategoriesDocument, {
    variables: { paginationInput: { limit: 100, page: 1 } },
  });

  const categoryOptions =
    categories?.getAllCategories?.docs?.map((c) => ({
      label: c.name,
      value: c._id,
    })) ?? [];

  /* -------------------- Courses Query -------------------- */
  const { data, loading } = useQuery(GetAllCoursesDocument, {
    variables: {
      paginationInput: {
        limit: CONSTANT.PAGE_LIMIT,
        page,
      },
      courseFilters: {
        categoryId: filters.categoryId,
        isPublished: filters.isPublished,
        level: filters.level,
        search: debouncedFilterSearch,
      }
    },
  });

  const coursesData = useMemo(() => {
    if (!loading && data?.getAllCourses?.docs) {
      return data.getAllCourses.docs;
    }
    return [];
  }, [data, loading]);

  /* -------------------- Handlers -------------------- */
  const updateFilter = <K extends keyof CourseFilters>(
    key: K,
    value: CourseFilters[K]
  ) => {
    setPage(1); // reset pagination on filter change
    setFilters((prev) => ({
      ...prev,
      [key]: value ?? undefined,
    }));
  };


  return (
    <Box>
      {/* Header */}


      {/* Filters */}
      <FilterBar
        searchable
        searchValue={filters.search}
        onSearchChange={(val) => updateFilter("search", val)}
      >
        <Flex gap={"md"} align={"center"}>
          <FInput
            label=""

            variant="select"
            placeholder="Level"
            value={filters.level}
            selectOptions={[
              { label: "Beginner", value: Course_Level.Beginner },
              { label: "Intermediate", value: Course_Level.Intermediate },
              { label: "Advanced", value: Course_Level.Advanced },
            ]}
            clearable
            onChange={(val) => updateFilter("level", val as Course_Level)}
          />

          <FInput
            label=""
            variant="select"
            placeholder="Category"
            value={filters.categoryId}
            selectOptions={categoryOptions}
            clearable
            onChange={(val) => updateFilter("categoryId", val as string)}
          />

          <FInput
            label=""
            variant="select"
            placeholder="Status"
            value={
              filters.isPublished !== undefined
                ? String(filters.isPublished)
                : undefined
            }
            selectOptions={[
              { label: "Published", value: "true" },
              { label: "Draft", value: "false" },
            ]}
            clearable
            onChange={(val) =>
              updateFilter(
                "isPublished",
                val === "true" ? true : val === "false" ? false : undefined
              )
            }

          />

          {adminData?.getAdminData.role === Admin_Roles.Instructor && (

            <FButton
              title="Add Course"
              variant="dark"
              minWidth="130px"
              handleClick={() => navigate(ROUTES.ADD_COURSE)}
            />
          )}
        </Flex>
      </FilterBar>

      {/* Table */}
      <Box mt="lg" style={{ overflowX: "auto" }}>
        <FTable
          columns={adminData?.getAdminData.role === Admin_Roles.Admin ? adminCourseColumns : courseColumns}
          data={coursesData}
          page={page}
          setPage={setPage}
          total={data?.getAllCourses.totalPages as number}
          pageLimit={data?.getAllCourses.limit}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default Courses;
