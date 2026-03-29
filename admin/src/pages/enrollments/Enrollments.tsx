import { Box, Flex } from "@mantine/core";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  Enrollment_Status,
  EnrollmentFiltersInput,
  PaymentStatus,
} from "../../generated/graphql";
import { useMemo, useState } from "react";
import FTable from "../../ui/FTable/FTable";
import { CONSTANT } from "../../constants";
import FilterBar from "../../components/FilterBar/FilterBar";
import FInput from "../../ui/FInput/FInput";
import { useDebouncedValue } from "@mantine/hooks";
import { enrollmentColumns } from "../../columns/enrollments.columns";
import { AdminEnrollmentRow } from "../../types/enrollment";

const GET_ALL_ENROLLMENTS = gql`
  query GetAllEnrollments(
    $paginationInput: PaginationInput
    $filters: EnrollmentFiltersInput
  ) {
    getAllEnrollments(paginationInput: $paginationInput, filters: $filters) {
      docs {
        user_id
        course_id
        student_name
        student_email
        course_name
        status
        enrolled_at
        payment_status
        method
        payment_id
        course_progress_percentage
      }
      totalDocs
      limit
      totalPages
      page
      hasNextPage
      hasPrevPage
    }
  }
`;

type GetAllEnrollmentsResponse = {
  getAllEnrollments: {
    docs: AdminEnrollmentRow[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

const Enrollments = () => {
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<EnrollmentFiltersInput>({});
  const [debouncedFilterSearch] = useDebouncedValue(filters.search, 500);

  const { data, loading } = useQuery<GetAllEnrollmentsResponse>(GET_ALL_ENROLLMENTS, {
    variables: {
      paginationInput: {
        limit: CONSTANT.PAGE_LIMIT,
        page,
      },
      filters: {
        enrollment_status: filters.enrollment_status,
        payment_status: filters.payment_status,
        search: debouncedFilterSearch,
      },
    },
  });

  const enrollmentData = useMemo(() => {
    if (!loading && data?.getAllEnrollments?.docs) {
      return data.getAllEnrollments.docs;
    }
    return [];
  }, [data, loading]);

  /* -------------------- Handlers -------------------- */
  const updateFilter = <K extends keyof EnrollmentFiltersInput>(
    key: K,
    value: EnrollmentFiltersInput[K],
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
        searchValue={filters.search as string}
        onSearchChange={(val) => updateFilter("search", val)}
        placeholder="Search by student or course..."
      >
        <Flex gap={"md"} align={"center"}>
          <FInput
            label=""
            variant="select"
            placeholder="Enrollment Status"
            value={filters.enrollment_status as string}
            selectOptions={[
              { label: "Active", value: Enrollment_Status.Active },
              { label: "Cancelled", value: Enrollment_Status.Cancelled },
              { label: "Refunded", value: Enrollment_Status.Refunded },
            ]}
            clearable
            onChange={(val) =>
              updateFilter("enrollment_status", val as Enrollment_Status)
            }
          />

          <FInput
            label=""
            variant="select"
            placeholder="Payemnt Status"
            value={filters.payment_status as string}
            selectOptions={[
              { label: "Success", value: PaymentStatus.Success },
              { label: "Failed", value: PaymentStatus.Failed },
            ]}
            clearable
            onChange={(val) =>
              updateFilter("payment_status", val as PaymentStatus)
            }
          />
        </Flex>
      </FilterBar>

      {/* Table */}
      <Box mt="lg" style={{ overflowX: "auto" }}>
        <FTable
          columns={enrollmentColumns}
          data={enrollmentData}
          page={page}
          setPage={setPage}
          total={data?.getAllEnrollments.totalPages as number}
          pageLimit={data?.getAllEnrollments.limit}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default Enrollments;
