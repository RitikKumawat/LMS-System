import { Box, Flex } from "@mantine/core";
import FInput from "../../ui/FInput/FInput";
import classes from "./FilterBar.module.scss";

interface FilterBarProps {
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  children: React.ReactNode;
  placeholder?: string;
}

const FilterBar = ({
  searchable,
  searchValue,
  onSearchChange,
  children,
  placeholder,
}: FilterBarProps) => {
  return (
    <Box className={classes.filterWrapper}>
      <Flex gap="md" wrap="wrap" align="center" justify="space-between">
        {/* Left section */}
        <Flex gap="md" align="center" w={"100%"}>
          {searchable && (
            <FInput
              label=""
              placeholder={placeholder ?? "Search..."}
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange?.(e as string)}
              className={classes.searchInput}

            />
          )
          }

          <Flex gap="sm" w={"50%"}>
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default FilterBar;
