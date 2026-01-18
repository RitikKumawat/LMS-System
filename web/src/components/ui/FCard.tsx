"use client";

import React, { useRef, useState } from "react";
import styles from "./ui.module.scss";

interface FCardProps {
    children: React.ReactNode;
    animate3d?: boolean;
    glass?: boolean;
    className?: string;
    // Optional ref for GSAP or other external consumers
}

export default function FCard({
    children,
    animate3d = false,
    glass = false,
    className = "",
}: FCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!animate3d || !cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
        const rotateY = ((x - centerX) / centerX) * 10;

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseEnter = () => {
        if (animate3d) setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (animate3d) {
            setIsHovered(false);
            setRotation({ x: 0, y: 0 });
        }
    };

    const baseClasses = `${styles.cardBase} ${glass ? styles.cardGlass : ""} ${className}`;
    const wrapperClass = animate3d ? styles.cardTiltWrapper : "";

    // If animating 3d, we need a wrapper to establish perspective, or we apply it to the card itself + parent
    // In previous TiltCard, we styled the div directly. 
    // Here, we'll wrap the logic.

    // Actually, to keep it simple and reusable as a single element:
    // We apply the transform styles directly to the div.
    // The perspective usually needs to be on the PARENT, but we can fake it or require a wrapper.
    // Implementation strategy: if animate3d, wrap in a perspective div OR assume parent has it.
    // Better: The component returns the card, which has transform.
    // We'll wrap it in a div that provides perspective.

    const cardContent = (
        <div
            ref={cardRef}
            className={baseClasses}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={
                animate3d
                    ? {
                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.02 : 1
                            })`,
                        transition: isHovered
                            ? "transform 0.1s ease-out"
                            : "transform 0.5s ease-out",
                        transformStyle: "preserve-3d",
                    }
                    : {}
            }
        >
            {children}
        </div>
    );

    if (animate3d) {
        return <div className={styles.cardTiltWrapper}>{cardContent}</div>;
    }

    return cardContent;
}
