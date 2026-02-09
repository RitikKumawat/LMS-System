import { Progress, ProgressProps, Box } from "@mantine/core";
import { COLORS } from "@/assets/colors/colors";

interface GlassProgressBarProps extends ProgressProps {
    height?: number;
}

export default function GlassProgressBar({
    value,
    height = 12,
    ...props
}: GlassProgressBarProps) {
    return (
        <Box pos={"relative"}>
            <Progress.Root size={"xl"}>
                <Progress.Section value={value}>

                </Progress.Section>
            </Progress.Root>
        </Box>
    );
}
