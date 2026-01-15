import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { ReactNode } from "react";

export type TableActionItem<T> = {
  label: string;
  icon: ReactNode;
  color?: string;
  variant?: "light" | "filled" | "outline" | "subtle";
  disabled?: boolean;
  onClick: (row: T) => void;
};

type TableActionsProps<T> = {
  row: T;
  actions: TableActionItem<T>[];
};

function TableActions<T>({ row, actions }: TableActionsProps<T>) {
  return (
    <Group gap="xs" wrap="nowrap">
      {actions.map((action, index) => (
        <Tooltip key={index} label={action.label}>
          <ActionIcon
            variant={action.variant ?? "light"}
            color={action.color}
            disabled={action.disabled}
            onClick={() => action.onClick(row)}
          >
            {action.icon}
          </ActionIcon>
        </Tooltip>
      ))}
    </Group>
  );
}

export default TableActions;
