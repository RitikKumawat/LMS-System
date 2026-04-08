import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Box, Group, Stack, Text, Select, ActionIcon, Tooltip, ColorInput, NumberInput } from "@mantine/core";
import { Type, Image as ImageIcon, Trash2, Copy, Upload } from "lucide-react";
import FButton from "../../ui/FButton/FButton";

interface CertificateDesignerProps {
    initialFabricJson?: string;
    onSave: (fabricJson: string) => void;
    isLoading?: boolean;
}

const PLACEDHOLDERS = [
    { label: "Student Name", value: "{{student_name}}" },
    { label: "Course Title", value: "{{course_title}}" },
    { label: "Date of Issue", value: "{{issue_date}}" },
];

const CertificateDesigner = ({ initialFabricJson, onSave, isLoading }: CertificateDesignerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
    const [selectedPlaceholder, setSelectedPlaceholder] = useState<string | null>(null);

    // Active object styling state
    const [activeFontFamily, setActiveFontFamily] = useState<string>("Arial");
    const [activeFontSize, setActiveFontSize] = useState<number>(24);
    const [activeFillColor, setActiveFillColor] = useState<string>("#000000");
    const [hasTextSelection, setHasTextSelection] = useState<boolean>(false);

    useEffect(() => {
        if (canvasRef.current && !fabricCanvas) {
            const initCanvas = new fabric.Canvas(canvasRef.current, {
                height: 595,
                width: 842,
                backgroundColor: "#f8f9fa",
            });

            if (initialFabricJson) {
                initCanvas.loadFromJSON(initialFabricJson, () => {
                    initCanvas.renderAll();
                });
            }

            setFabricCanvas(initCanvas);

            // Add event listeners for selection
            initCanvas.on("selection:created", handleSelection);
            initCanvas.on("selection:updated", handleSelection);
            initCanvas.on("selection:cleared", () => setHasTextSelection(false));
        }

        return () => {
            if (fabricCanvas) {
                fabricCanvas.off("selection:created", handleSelection);
                fabricCanvas.off("selection:updated", handleSelection);
                fabricCanvas.off("selection:cleared");
                fabricCanvas.dispose();
            }
        };
    }, [canvasRef]);

    const handleSelection = (e: fabric.IEvent) => {
        const activeObj = e.selected?.[0];
        if (activeObj && (activeObj.type === "i-text" || activeObj.type === "text")) {
            const textObj = activeObj as fabric.IText;
            setHasTextSelection(true);
            setActiveFontFamily(textObj.fontFamily || "Arial");
            setActiveFontSize(textObj.fontSize || 24);
            setActiveFillColor((textObj.fill as string) || "#000000");
        } else {
            setHasTextSelection(false);
        }
    };

    const updateActiveTextProperty = (property: keyof fabric.IText, value: any) => {
        if (!fabricCanvas) return;
        const activeObj = fabricCanvas.getActiveObject() as fabric.IText;
        if (activeObj && (activeObj.type === "i-text" || activeObj.type === "text")) {
            activeObj.set(property, value);
            fabricCanvas.renderAll();
        }
    };

    const addText = () => {
        if (!fabricCanvas) return;
        const text = new fabric.IText("Double click to edit", {
            left: 100,
            top: 100,
            fontFamily: "Arial",
            fontSize: 24,
            fill: "#000000",
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        fabricCanvas.renderAll();
    };

    const addPlaceholder = () => {
        if (!fabricCanvas || !selectedPlaceholder) return;
        const text = new fabric.IText(selectedPlaceholder, {
            left: 100,
            top: 150,
            fontFamily: "Arial",
            fontSize: 24,
            fill: "#228be6",
            fontWeight: "bold",
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        fabricCanvas.renderAll();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && fabricCanvas) {
            const reader = new FileReader();
            reader.onload = (f) => {
                const dataUrl = f.target?.result as string;
                fabric.Image.fromURL(dataUrl, (img) => {
                    img.scaleToWidth(200);
                    fabricCanvas.add(img);
                    fabricCanvas.setActiveObject(img);
                    fabricCanvas.renderAll();
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const setBackgroundImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && fabricCanvas) {
            const reader = new FileReader();
            reader.onload = (f) => {
                const dataUrl = f.target?.result as string;
                fabric.Image.fromURL(dataUrl, (img) => {
                    // Calculate scale to cover canvas
                    const scaleX = fabricCanvas.width! / img.width!;
                    const scaleY = fabricCanvas.height! / img.height!;
                    const scale = Math.max(scaleX, scaleY);

                    img.set({
                        scaleX: scale,
                        scaleY: scale,
                        originX: "center",
                        originY: "center",
                        left: fabricCanvas.width! / 2,
                        top: fabricCanvas.height! / 2,
                    });

                    fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const deleteSelected = () => {
        if (!fabricCanvas) return;
        const activeObjects = fabricCanvas.getActiveObjects();
        if (activeObjects.length) {
            fabricCanvas.discardActiveObject();
            activeObjects.forEach((obj) => {
                fabricCanvas.remove(obj);
            });
        }
    };

    const cloneSelected = () => {
        const activeObject = fabricCanvas?.getActiveObject();

        if (!activeObject || !fabricCanvas) return;

        activeObject.clone((cloned: fabric.Object) => {
            cloned.set({
                left: (cloned.left ?? 0) + 20,
                top: (cloned.top ?? 0) + 20,
            });

            fabricCanvas.add(cloned);
            fabricCanvas.setActiveObject(cloned);
            fabricCanvas.renderAll();
        });
    };

    const handleSave = () => {
        if (!fabricCanvas) return;
        const json = JSON.stringify(fabricCanvas.toJSON());
        onSave(json);
    };

    return (
        <Stack gap="md">
            <Group justify="space-between" align="flex-end">
                <Group>
                    <FButton
                        variant="outline"
                        leftIcon={<Type size={16} />}
                        handleClick={addText}
                        title="Add Text"
                    />
                    <Stack gap={4}>
                        <Text size="xs" fw={500}>Add Dynamic Placeholder</Text>
                        <Group gap="xs">
                            <Select
                                placeholder="Select Placeholder"
                                data={PLACEDHOLDERS}
                                value={selectedPlaceholder}
                                onChange={setSelectedPlaceholder}
                                styles={{ input: { height: 36 } }}
                            />
                            <FButton
                                variant="outline"
                                handleClick={addPlaceholder}
                                title="Insert"
                                disabled={!selectedPlaceholder}
                            />
                        </Group>
                    </Stack>

                    {/* Font Styling Controls (Visible only when text is selected) */}
                    {hasTextSelection && (
                        <Stack gap={4}>
                            <Text size="xs" fw={500}>Text Styling</Text>
                            <Group gap="xs">
                                <Select
                                    data={[
                                        "Arial", "Helvetica", "Times New Roman", "Courier New", "Verdana",
                                        "Georgia", "Palatino", "Garamond", "Impact"
                                    ]}
                                    value={activeFontFamily}
                                    onChange={(val) => {
                                        setActiveFontFamily(val || "Arial");
                                        updateActiveTextProperty("fontFamily", val);
                                    }}
                                    styles={{ input: { height: 36, width: 120 } }}
                                />
                                <NumberInput
                                    value={activeFontSize}
                                    onChange={(val) => {
                                        setActiveFontSize(Number(val) || 24);
                                        updateActiveTextProperty("fontSize", Number(val));
                                    }}
                                    styles={{ input: { height: 36, width: 80 } }}
                                    min={8}
                                    max={120}
                                />
                                <ColorInput
                                    value={activeFillColor}
                                    onChange={(val) => {
                                        setActiveFillColor(val);
                                        updateActiveTextProperty("fill", val);
                                    }}
                                    styles={{ input: { height: 36, width: 100 } }}
                                />
                            </Group>
                        </Stack>
                    )}

                    <Stack gap={4}>
                        <Text size="xs" fw={500}>Add Media</Text>
                        <Group gap="xs">
                            <label style={{ display: "flex", gap: "8px", cursor: "pointer", border: "1px solid #dee2e6", padding: "6px 16px", borderRadius: "8px", alignItems: "center" }}>
                                <ImageIcon size={16} />
                                <Text size="sm" fw={500}>Add Image</Text>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: "none" }}
                                />
                            </label>
                            <label style={{ display: "flex", gap: "8px", cursor: "pointer", border: "1px solid #dee2e6", padding: "6px 16px", borderRadius: "8px", alignItems: "center" }}>
                                <Upload size={16} />
                                <Text size="sm" fw={500}>Set Background</Text>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={setBackgroundImage}
                                    style={{ display: "none" }}
                                />
                            </label>
                        </Group>
                    </Stack>
                </Group>

                <Group>
                    <Tooltip label="Clone Selected">
                        <ActionIcon variant="light" color="blue" onClick={cloneSelected} size="lg">
                            <Copy size={16} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete Selected">
                        <ActionIcon variant="light" color="red" onClick={deleteSelected} size="lg">
                            <Trash2 size={16} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>

            <Box style={{
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                overflow: "hidden",
                display: "inline-block",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
                background: "#fff",
                width: "fit-content",
            }}>
                <canvas ref={canvasRef} />
            </Box>

            <Group justify="flex-end">
                <FButton
                    variant="dark"
                    handleClick={handleSave}
                    loading={isLoading}
                    disabled={isLoading}
                    title="Save Template"
                />
            </Group>
        </Stack>
    );
};

export default CertificateDesigner;
