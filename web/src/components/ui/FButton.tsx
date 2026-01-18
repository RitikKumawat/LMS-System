"use client";

import React from "react";
import styles from "./ui.module.scss";

interface FButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    fullWidth?: boolean;
}

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
        <button
            className={`${styles.btn} ${variantClass} ${className}`}
            style={{ ...widthStyle, ...style }}
            {...props}
        >
            {children}
        </button>
    );
}
