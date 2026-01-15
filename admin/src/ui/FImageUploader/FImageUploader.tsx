import { useState, useEffect } from "react";
import {
  FileButton,
  Button,
  Group,
  Text,
  CloseButton,
  Stack,
  Paper,
  Badge,
  Box,
  Alert,
} from "@mantine/core";

interface FileUploaderProps {
  value?: (File | string)[]; // initial files or URLs
  onChange: (files: (File | string)[]) => void;
  accept?: string; // MIME types
  label?: string;
  multiple?: boolean;
  maxSize?: number; // optional max size in bytes
  formError?: string; // ✅ ADD
  onClear?: () => void; // ✅ NEW

}

const FImageUploader = ({
  value = [],
  onChange,
  accept,
  label,
  multiple = false,
  maxSize,
  formError,
  onClear,
}: FileUploaderProps) => {
  const [files, setFiles] = useState<(File | string)[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFiles(value);
  }, [value]);

  const handleAddFile = (payload: File | File[] | null) => {
    if (!payload) return;
    setError(null);
    const newFiles = Array.isArray(payload) ? payload : [payload];

    // Validate file sizes
    const oversizedFiles: string[] = [];
    const filteredFiles = newFiles.filter((f) => {
      if (f instanceof File && maxSize && f.size > maxSize) {
        oversizedFiles.push(f.name);
        return false;
      }
      return true;
    });

    // Show error if any files were rejected
    if (oversizedFiles.length > 0) {
      const maxSizeMB = (maxSize! / 1024 / 1024).toFixed(0);
      setError(
        `${
          oversizedFiles.length
        } file(s) exceeded the ${maxSizeMB} MB limit: ${oversizedFiles.join(
          ", "
        )}`
      );
    }

    // If no valid files, don't update
    if (filteredFiles.length === 0) return;

    const updated = multiple ? [...files, ...filteredFiles] : filteredFiles;
    setFiles(updated);
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    setError(null);
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
    onChange(updated);

    if (updated.length === 0) {
      onClear?.(); // ✅ notify parent
    }

  };

  const getFileIcon = (file: File | string) => {
    const isString = typeof file === "string";
    const fileName = isString ? file : file.name;
    const ext = fileName.split(".").pop()?.toLowerCase();

    if (ext && ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
      return "🖼️";
    } else if (ext && ["pdf"].includes(ext)) {
      return "📄";
    } else if (ext && ["doc", "docx"].includes(ext)) {
      return "📝";
    } else if (ext && ["zip", "rar", "7z"].includes(ext)) {
      return "📦";
    }
    return "📎";
  };

  const getFileType = (file: File | string) => {
    const isString = typeof file === "string";
    const fileName = isString ? file : file.name;
    const ext = fileName.split(".").pop()?.toUpperCase();
    return ext || "FILE";
  };

  return (
    <Stack gap="md">
      {label && (
        <Text size="sm" fw={500}>
          {label}
        </Text>
      )}

      {error && (
        <Alert
          color="red"
          title="Upload Error"
          withCloseButton
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      {formError && (
        <Text size="sm" c="red" mt={4}>
          {formError}
        </Text>
      )}

      {files.length === 0 ? (
        <Paper
          withBorder
          p="md"
          radius="md"
          style={{
            borderStyle: "dashed",
            borderWidth: 2,
            background: "transparent",
            transition: "all 0.2s ease",
          }}
        >
          <Stack gap="sm" align="center">
            <Box style={{ fontSize: 40 }}>📁</Box>
            <Text size="sm" c="dimmed" ta="center">
              {multiple ? "Upload files" : "Upload a file"}
            </Text>
            <FileButton
              onChange={handleAddFile}
              accept={accept}
              multiple={multiple}
            >
              {(props) => (
                <Button
                  {...props}
                  size="sm"
                  variant="light"
                  leftSection={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  }
                >
                  Choose {multiple ? "Files" : "File"}
                </Button>
              )}
            </FileButton>
            {maxSize && (
              <Text size="xs" c="dimmed">
                Max size: {(maxSize / 1024 / 1024).toFixed(0)} MB
              </Text>
            )}
          </Stack>
        </Paper>
      ) : (
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              {files.length} {files.length === 1 ? "file" : "files"} selected
            </Text>
            {multiple && (
              <FileButton
                onChange={handleAddFile}
                accept={accept}
                multiple={multiple}
              >
                {(props) => (
                  <Button {...props} size="xs" variant="subtle">
                    + Add More
                  </Button>
                )}
              </FileButton>
            )}
          </Group>

          {files.map((file, idx) => {
            const isString = typeof file === "string";
            const name = isString ? file.split("/").pop() : file.name;
            const sizeText =
              file instanceof File
                ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                : "";
            const fileType = getFileType(file);
            const icon = getFileIcon(file);

            return (
              <Paper
                key={idx}
                p="sm"
                withBorder
                radius="md"
                style={{
                  transition: "all 0.2s ease",
                  cursor: "default",
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
                    <Box style={{ fontSize: 24, flexShrink: 0 }}>{icon}</Box>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="sm" fw={500} lineClamp={1}>
                        {name}
                      </Text>
                      <Group gap="xs" mt={4}>
                        <Badge size="xs" variant="light" color="blue">
                          {fileType}
                        </Badge>
                        {sizeText && (
                          <Text size="xs" c="dimmed">
                            {sizeText}
                          </Text>
                        )}
                      </Group>
                    </Box>
                  </Group>
                  <CloseButton
                    size="sm"
                    onClick={() => handleRemove(idx)}
                    style={{ flexShrink: 0 }}
                  />
                </Group>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default FImageUploader;
