import { Pagination } from "@mantine/core";
import { CONSTANT } from "../../constants";
import classes from "./index.module.scss";
import { memo } from "react";
interface FPaginationProps {
  total: number;
  page: number;
  pageLimit?: number;
  setPage: (e: number) => void;
}

const FPagination = ({ total, page, pageLimit, setPage }: FPaginationProps) => {
  const limit = pageLimit && pageLimit !== 0 ? pageLimit : CONSTANT.PAGE_LIMIT;
  console.log("limit",limit);
  console.log("TOTAL",total);
  console.log("PAGE",page);
  if (total && total <= limit) {
    return null;
  }
  return (
    <Pagination
      w={"fit-content"}
      style={{margin:"0 auto"}}
      withEdges
      value={page}
      siblings={0}
      boundaries={2}
      onChange={(p) => setPage(p)}
      size={"sm"}
      total={total}
      radius="sm"
      mt={20}
      c={"gray"}
      classNames={{ control: classes.control, root: classes.pagination }}
    />
  );
};

export default memo(FPagination);
