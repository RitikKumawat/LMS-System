import { Progress, ProgressProps, Box, Group, Text } from "@mantine/core";
import { COLORS } from "@/assets/colors/colors";

interface GlassProgressBarProps extends ProgressProps {
    height?: number;
    showLabel?: boolean;
}

export default function GlassProgressBar({
    value,
    height = 12,
    showLabel = true,
    ...props
}: GlassProgressBarProps) {
    return (
        <Box>
            {showLabel && (
                <Group justify="space-between" mb={8}>
                    <Text size="xs" fw={600} style={{ color: COLORS.text.secondary }}>Course Progress</Text>
                    <Text size="xs" fw={700} style={{ color: COLORS.primary.main }}>{Math.round(value || 0)}%</Text>
                </Group>
            )}
            <Box pos={"relative"}>
                <Progress
                    value={value}
                    size="lg" // Slightly bigger than default but not xl unless needed
                    radius="xl"
                    styles={{
                        root: {
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: `1px solid ${COLORS.border.glass}`,
                        },
                        section: {
                            backgroundImage: `linear-gradient(90deg, ${COLORS.primary.main} 0%, ${COLORS.accent.blue} 100%)`,
                            boxShadow: `0 0 15px ${COLORS.primary.main}60`,
                        }
                    }}
                    {...props}
                />
            </Box>
        </Box>
    );
}
