import { useState } from "react";
import { uploadImageFile } from "./useBackend";

export interface ImageUploadState {
  previewUrl: string | null;
  isUploading: boolean;
  uploadError: string | null;
}

export interface UseImageUploadReturn extends ImageUploadState {
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
  ) => Promise<void>;
  clearPreview: () => void;
  setPreviewUrl: (url: string | null) => void;
}

/**
 * Hook for handling image file uploads to the platform object storage.
 * Provides upload state, a local preview while uploading, and error handling.
 */
export function useImageUpload(): UseImageUploadReturn {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }

    // Show a local object URL immediately so the user sees a preview while uploading
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploadError(null);
    setIsUploading(true);

    try {
      const url = await uploadImageFile(file);
      // Replace the local blob URL with the permanent storage URL
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(url);
      onSuccess(url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setUploadError(message);
      // Keep local preview so the user can see what they selected
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    setUploadError(null);
  };

  return {
    previewUrl,
    isUploading,
    uploadError,
    handleFileChange,
    clearPreview,
    setPreviewUrl,
  };
}
