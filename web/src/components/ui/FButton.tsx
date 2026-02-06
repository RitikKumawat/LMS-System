import React from "react";
import { Button, ButtonProps } from "@mantine/core";
import styles from "./ui.module.scss";

type NativeButtonProps = React.ComponentPropsWithoutRef<"button">;

type FButtonProps = ButtonProps &
    NativeButtonProps & {
        variant?: "primary" | "secondary" | "ghost";
    };

export default function FButton({
    children,
    variant = "primary",
    fullWidth = false,
    className = "",
    style,
    ...props
}: FButtonProps) {
    const variantClass =
        variant === "primary"
            ? styles.btnPrimary
            : variant === "secondary"
                ? styles.btnSecondary
                : styles.btnGhost;

    const widthStyle = fullWidth ? { width: "100%", display: "flex" } : {};

    return (
        <Button
            className={`${styles.btn} ${variantClass} ${className}`}
            style={{ ...widthStyle, ...style }}
            {...props}
        >
            {children}
        </Button>
    );
}