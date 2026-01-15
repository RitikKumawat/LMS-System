import { Button, Flex, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  loadingText?: string;
  loading:boolean;
}

export function openConfirmModal({
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  loading,
  loadingText,
}: ConfirmModalProps) {
  const modalId = modals.open({
    title,
    centered: true,
    size: "md",
    children: (
      <Flex direction="column" gap="md">
        <Flex direction={"column"} align="center" gap="sm">
          <AlertTriangle size={36} color="red" />
          <Text ta={"center"}>{message}</Text>
        </Flex>

        <Flex justify="flex-end" gap="sm" mt="md">
          <Button
            variant="default"
            onClick={() => modals.close(modalId)}
          >
            {cancelText}
          </Button>

          <Button
            color="red"
            onClick={async () => {
              await onConfirm();
              modals.close(modalId);
            }}
            loading={loading}
            disabled={loading}
          >
            {loading ? loadingText?? "Processing..." : confirmText}
          </Button>
        </Flex>
      </Flex>
    ),
  });
}
