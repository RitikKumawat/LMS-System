import React, { useRef, useState, useEffect } from "react";
import { CertificateElement } from "./types";
import styles from "./CertificateCanvas.module.scss";

interface CertificateCanvasProps {
    elements: CertificateElement[];
    backgroundImage?: string;
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
    onUpdateElement: (id: string, updates: Partial<CertificateElement>) => void;
}

export const CertificateCanvas: React.FC<CertificateCanvasProps> = ({
    elements,
    backgroundImage,
    selectedElementId,
    onSelectElement,
    onUpdateElement,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

    const handlePointerDown = (e: React.PointerEvent, element: CertificateElement) => {
        e.stopPropagation();
        onSelectElement(element.id);
        setIsDragging(true);
        // Setup capture to keep events firing even if cursor leaves element exactly
        (e.target as HTMLElement).setPointerCapture(e.pointerId);

        setDragStartPos({
            x: e.clientX - element.x,
            y: e.clientY - element.y,
        });
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !selectedElementId) return;

        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();

        let newX = e.clientX - dragStartPos.x;
        let newY = e.clientY - dragStartPos.y;

        // Constrain within container bounds
        newX = Math.max(0, Math.min(newX, containerRect.width - 50));
        newY = Math.max(0, Math.min(newY, containerRect.height - 20));

        onUpdateElement(selectedElementId, { x: newX, y: newY });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (isDragging) {
            setIsDragging(false);
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }
    };

    // Ensure dragging stops if something interrupts
    useEffect(() => {
        const handleMouseUpGlobal = () => setIsDragging(false);
        window.addEventListener("mouseup", handleMouseUpGlobal);
        return () => window.removeEventListener("mouseup", handleMouseUpGlobal);
    }, []);

    return (
        <div
            className={styles.canvasContainer}
            ref={containerRef}
            onClick={() => onSelectElement(null)} // Deselect on background click
            style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
                backgroundColor: backgroundImage ? "transparent" : "#fff",
            }}
        >
            {elements.map((el) => {
                const isSelected = selectedElementId === el.id;
                return (
                    <div
                        key={el.id}
                        className={`${styles.textElement} ${isSelected ? styles.selected : ""
                            }`}
                        style={{
                            left: el.x,
                            top: el.y,
                            fontSize: `${el.fontSize}px`,
                            fontFamily: el.fontFamily,
                            color: el.color,
                            position: "absolute",
                            cursor: isDragging && isSelected ? "grabbing" : "grab",
                            userSelect: "none",
                        }}
                        onPointerDown={(e) => handlePointerDown(e, el)}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                    >
                        {el.text}
                    </div>
                );
            })}
        </div>
    );
};
