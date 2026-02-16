import { Button } from "@mantine/core";
import classes from "./index.module.scss";
import React, { memo } from "react";
import { COLORS } from "../../assets/colors/colors";

interface FButtonProps {
  variant: "light" | "dark" | "outline";
  title: string;
  radius?: "sm" | "md" | "lg" | "xl" | "xs" | string | number;
  size?: "sm" | "md" | "lg" | "xl" | "xs" | string;
  type?: "button" | "reset" | "submit";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  handleClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  minWidth?: string;
}

const getColor = (variant: FButtonProps["variant"]) => {
  switch (variant) {
    case "dark":
      return COLORS.primaryBlueLight;
    case "light":
      return COLORS.primaryBlueDark;
    case "outline":
      return "black";
    default:
      return COLORS.primaryBlueLight;
  }
};
const getBgColor = (variant: FButtonProps["variant"]) => {
  switch (variant) {
    case "dark":
      return COLORS.primaryBlueDark;
    case "light":
      return COLORS.primaryBlueLight;
    case "outline":
      return "transparent";
    default:
      return COLORS.primaryBlueDark;
  }
};

const FButton = ({
  className,
  leftIcon,
  radius,
  rightIcon,
  size,
  title,
  variant,
  type,
  handleClick,
  loading,
  disabled,
  minWidth
}: FButtonProps) => {
  return (
    <Button
      type={type}
      miw={minWidth}
      variant={variant === "outline" ? "outline" : ""}
      c={getColor(variant)}
      bg={getBgColor(variant)}
      className={`${className}`}
      classNames={{
        root: `${variant === "dark" || variant === "light" ? classes.btn : ""}`,
      }}
      loading={loading}
      disabled={disabled}
      radius={radius ?? "md"}
      size={size ?? "md"}
      onClick={handleClick}
    >
      {leftIcon}
      {title}
      {rightIcon}
    </Button>
  );
};

export default memo(FButton);
