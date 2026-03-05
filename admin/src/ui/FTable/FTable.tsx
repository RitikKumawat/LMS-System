import { Table, Box, Loader, Flex, Text } from "@mantine/core";
import { SearchX } from "lucide-react";
import { TColumns } from "../../types/table";
import FPagination from "../FPagination/FPagination";
import { CONSTANT } from "../../constants";
import classes from "./FTable.module.scss";
import { COLORS } from "../../assets/colors/colors";

interface FTableProps<T> {
  columns: TColumns<T>[];
  data: T[];
  total: number;
  page: number;
  setPage: (e: number) => void;
  pageLimit?: number;
  loading: boolean;
}

const FTable = <T extends object>({
  columns,
  data,
  total,
  page,
  setPage,
  pageLimit,
  loading,
}: FTableProps<T>) => {
  return (
    <Box className={classes.tableWrapper}>
      <Table
        highlightOnHover
        horizontalSpacing="md"
        verticalSpacing="sm"
        classNames={{
          table: classes.mainTable,
          thead: classes.tableHead,
          tbody: classes.tableBody,
          tr: classes.tableRow,
        }}
      >
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th
                miw={col.minWidth}
                key={String(col.key)}
                className={classes.tableHeader}
              >
                {col.label}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {loading ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length} style={{ height: "400px" }}>
                <Flex justify="center" align="center" h="100%">
                  <Loader color={COLORS.primaryBlueDark} />
                </Flex>
              </Table.Td>
            </Table.Tr>
          ) : data.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length} style={{ height: "400px" }}>
                <Flex direction="column" justify="center" align="center" h="100%">
                  <Box mb="md" style={{ color: "#9ca3af" }}>
                    <SearchX size={52} strokeWidth={1.5} />
                  </Box>
                  <Text size="lg" fw={500} style={{ color: "#4b5563" }}>
                    No data found
                  </Text>
                  <Text size="sm" mt={4} style={{ color: "#9ca3af" }}>
                    We couldn't find any results matching your search criteria.
                  </Text>
                </Flex>
              </Table.Td>
            </Table.Tr>
          ) : (
            data.map((row, rowIndex) => (
              <Table.Tr key={rowIndex}>
                {columns.map((col) => (
                  <Table.Td key={String(col.key)} className={classes.tableCell}>
                    {col.render(row)}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {total > (pageLimit ?? CONSTANT.PAGE_LIMIT) && (
        <Box className={classes.paginationWrapper}>
          <FPagination
            total={total}
            page={page}
            pageLimit={pageLimit}
            setPage={setPage}
          />
        </Box>
      )}
    </Box>
  );
};

export default FTable;
