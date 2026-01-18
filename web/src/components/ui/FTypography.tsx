"use client";

import React from "react";
import styles from "./ui.module.scss";

interface FTypographyProps {
    children: React.ReactNode;
    variant?: "h1" | "h2" | "h3" | "body" | "caption";
    gradient?: boolean;
    className?: string;
    color?: string; // hex or css var
    align?: "left" | "center" | "right";
}

export default function FTypography({
    children,
    variant = "body",
    gradient = false,
    className = "",
    color,
    align,
}: FTypographyProps) {
    const Component = variant === "body" || variant === "caption" ? "p" : variant;

    const gradientClass = gradient ? styles.gradientText : "";

    const baseStyle: React.CSSProperties = {
        textAlign: align,
        color: color,
        margin: 0,
    };

    if (variant === "caption") {
        baseStyle.fontSize = "0.875rem";
        baseStyle.color = color || "var(--text-secondary)"; // fallback
    }

    return (
        <Component
            className={`${gradientClass} ${className}`}
            style={baseStyle}
        >
            {children}
        </Component>
    );
}
