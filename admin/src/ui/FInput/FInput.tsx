import {
  NumberInput,
  PasswordInput,
  Select,
  Textarea,
  TextInput,
  type NumberInputProps,
  type PasswordInputProps,
  type SelectProps,
  type TextareaProps,
  type TextInputProps,
} from "@mantine/core";
import React, { memo, useState } from "react";
import classes from "./index.module.scss";
import { ChevronDown } from "lucide-react";

/* -------------------- Types -------------------- */

type FInputChangeValue = string | number | null;

interface ICustomTextInput {
  variant?: "number" | "password" | "select" | "textArea";
  label: string;
  placeholder: string;
  value?: string;
  padding?: string;
  fontSize?: string;
  formHandler?:
    | TextInputProps
    | NumberInputProps
    | PasswordInputProps
    | SelectProps
    | TextareaProps;
  disabled?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onChange?: (value: FInputChangeValue) => void;
  selectOptions?: { label: string; value: string }[];
  textColor?: string;
  textFontWigth?: string;
  withAsterik?: boolean;
  searchAble?: boolean;
  onSearchChange?: (value: string) => void;
  whiteSpace?: string;
  rows?: number;
  maxLength?: number;
  clearable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/* -------------------- Component -------------------- */

const FInput: React.FC<ICustomTextInput> = ({
  label,
  placeholder,
  formHandler,
  disabled,
  onKeyDown,
  padding,
  fontSize,
  value,
  variant,
  selectOptions,
  textColor,
  textFontWigth,
  withAsterik = false,
  searchAble,
  clearable,
  onSearchChange,
  rows,
  maxLength,
  onChange,
  className,
  style,
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  /* -------------------- Number -------------------- */
  if (variant === "number") {
    return (
      <NumberInput
      style={style}
        hideControls
        className={className}
        disabled={disabled}
        label={label}
        withAsterisk={withAsterik}
        placeholder={placeholder}
        classNames={{ input: classes.input, label: classes.label }}
        styles={{
          root: { width: "100%" },
        }}
        {...(formHandler as NumberInputProps)}
        maxLength={maxLength}
        autoComplete="off"
        onChange={(val) => {
          onChange?.(val);
        }}
      />
    );
  }

  /* -------------------- Password -------------------- */
  if (variant === "password") {
    return (
      <PasswordInput
      style={style}
        disabled={disabled}
        label={label}
        className={className}
        placeholder={placeholder}
        withAsterisk={withAsterik}
        w="100%"
        {...(formHandler as PasswordInputProps)}
        classNames={{
          input: classes.input,
          label: classes.label,
          innerInput: classes.innerInputPass,
        }}
        styles={{
          input: { padding, fontSize },
          label: { fontSize: fontSize ?? "15px" },
        }}
        autoComplete="off"
        onChange={(e) => {
          onChange?.(e.currentTarget.value);
        }}
      />
    );
  }

  /* -------------------- Select -------------------- */
  if (variant === "select") {
    return (
      <Select
      style={style}
        label={label}
        className={className}
        placeholder={placeholder}
        withAsterisk={withAsterik}
        disabled={disabled}
        clearable={clearable}
        data={selectOptions}
        searchable={searchAble}
        onSearchChange={onSearchChange}
        {...(formHandler as SelectProps)}
        allowDeselect={false}
        onDropdownOpen={() => setIsSelectOpen(true)}
        onDropdownClose={() => setIsSelectOpen(false)}
        rightSection={
          <ChevronDown
            size={18}
            style={{
              transform: isSelectOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
            color="#000000"
          />
        }
        w="100%"
        classNames={{
          input: classes.input,
          label: classes.label,
        }}
        styles={{
          input: { padding, fontSize },
          label: { fontSize: fontSize ?? "15px" },
          dropdown: {
            boxShadow: "0px 1px 4px 0px #00000026",
            border: "1px solid #e2e2ef",
            borderRadius: "10px",
          },
        }}
        autoComplete="off"
        onChange={(val) => {
          onChange?.(val);
        }}
      />
    );
  }

  /* -------------------- TextArea -------------------- */
  if (variant === "textArea") {
    return (
      <Textarea
        style={style}
        className={className}
        label={label}
        placeholder={placeholder}
        withAsterisk={withAsterik}
        autosize
        disabled={disabled}
        {...(formHandler as TextareaProps)}
        value={value}
        classNames={{
          input: classes.TextAreaInput,
          label: classes.label,
        }}
        minRows={rows}
        styles={{
          input: {
            fontSize,
            color: textColor ?? "black",
            opacity: disabled ? 1 : undefined,
            fontWeight: textFontWigth,
          },
          label: { fontSize: fontSize ?? "15px" },
        }}
        autoComplete="off"
        onChange={(e) => {
          onChange?.(e.currentTarget.value);
        }}
      />
    );
  }

  /* -------------------- Default Text -------------------- */
  return (
    <TextInput
      style={style}
      className={className}
      label={label}
      value={value ?? ""}
      placeholder={placeholder}
      withAsterisk={withAsterik}
      disabled={disabled}
      onKeyDown={onKeyDown}
      {...(formHandler as TextInputProps)}
      w="100%"
      classNames={{ input: classes.input, label: classes.label }}
      styles={{
        input: {
          padding,
          fontSize,
          color: textColor ?? "black",
          opacity: disabled ? 1 : undefined,
          fontWeight: textFontWigth,
        },
        label: { fontSize: fontSize ?? "15px" },
      }}
      autoComplete="off"
      onChange={(e) => {
        onChange?.(e.currentTarget.value);
      }}
    />
  );
};

export default memo(FInput);
