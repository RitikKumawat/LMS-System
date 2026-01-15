import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_PUBLIC_BASE_URL;

export function useVideoUpload() {
  const socketRef = useRef<Socket | null>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadVideo(file: File) {
    try {
      setUploading(true);
      setProgress(0);
      setVideoUrl(null);
      setError(null);

      const res = await fetch(`${API_URL}/uploads/start`, {
        method: "POST",
        credentials: "include",
        headers: {
          "x-panel-role": btoa("admin"),
        },
      });

      const { uploadId, uploadUrl } = await res.json();

      const socket = io(API_URL, {
        withCredentials: true,
        extraHeaders: {
          "x-panel-role": btoa("admin"),
        },
      });

      socketRef.current = socket;

      socket.emit("join-upload", uploadId);

      socket.on("upload-progress", (data) => {
        setProgress(data.progress);

        if (data.videoUrl) {
          setVideoUrl(data.videoUrl);
          setUploading(false);
          socket.disconnect();
          socketRef.current = null;
        }
      });

      socket.on("connect_error", () => {
        setError("WebSocket connection failed");
        setUploading(false);
      });

      await fetch(`${API_URL}${uploadUrl}`, {
        method: "POST",
        body: file,
        credentials: "include",
        headers: {
          "x-panel-role": btoa("admin"),
        },
      });
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message || "Upload failed");
      } else {
        setError("Upload failed");
      }

      setUploading(false);
    }
  }

  function reset() {
    setProgress(0);
    setUploading(false);
    setVideoUrl(null);
    setError(null);
    socketRef.current?.disconnect();
  }

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return {
    uploadVideo,
    uploading,
    progress,
    videoUrl,
    error,
    reset,
  };
}
