import React from "react";
import { Button, ButtonProps, Loader } from "@mantine/core";
import styles from "./ui.module.scss";

type NativeButtonProps = React.ComponentPropsWithoutRef<"button">;

type FButtonProps =
    NativeButtonProps & {
        variant?: "primary" | "secondary" | "ghost";
        loading?: boolean;
        fullWidth?: boolean;
    };

export default function FButton({
    children,
    variant = "primary",
    className = "",
    loading = false,
    fullWidth = false,
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
        <button
            className={`${styles.btn} ${variantClass} ${loading ? styles.loading : ""} ${className}`}
            style={{
                width: fullWidth ? "100%" : undefined,
                ...style,
            }}
            disabled={loading}
            {...props}
        >
            {/* Keeps width */}
            <span className={styles.content}>{children}</span>

            {/* Loader overlay */}
            {loading && (
                <span className={styles.loader}>
                    <Loader color="white" size={16} />
                </span>
            )}
        </button>
    );
}