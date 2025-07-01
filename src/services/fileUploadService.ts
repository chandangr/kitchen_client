import { getAuthHeaders } from "./auth";
import { getBackendApiUrl } from "@/utils/environment";

export interface FileUploadResponse {
  path: string;
  url: string;
}

/**
 * Optimizes an image file by resizing and compressing it
 * @param file The original image file
 * @param maxWidth Maximum width in pixels (default: 1200)
 * @param maxHeight Maximum height in pixels (default: 1200)
 * @param quality JPEG quality (0-1, default: 0.8)
 * @returns Promise with the optimized image as a File object
 */
export const optimizeImage = async (
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Skip optimization for non-image files
    if (!file?.type?.startsWith("image/")) {
      resolve(file);
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(img.src);

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      // Create canvas and resize image
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Apply better quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw the image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not create blob"));
            return;
          }

          // Create a new file with the optimized blob
          const optimizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });

          resolve(optimizedFile);
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
  });
};

// export const uploadFileToSupabase = async (file: File, bucket: string = "dish-images", folder: string = "dishes"): Promise<FileUploadResponse | null> => {
//   ...
//   // Supabase upload logic
// };

export const uploadFileToBackend = async (file: File): Promise<FileUploadResponse | null> => {
  const formData = new FormData();
  formData.append('logo', file);
  const headers = await getAuthHeaders();
  // Remove Content-Type for FormData
  const { Authorization } = headers;
  const response = await fetch(`${getBackendApiUrl()}/api/upload/logo`, {
    method: 'POST',
    headers: { Authorization },
    body: formData,
  });
  if (!response.ok) return null;
  const data = await response.json();
  return { path: '', url: data.url };
};

// export const deleteFileFromSupabase = async (path: string, bucket: string = "dish-images"): Promise<boolean> => {
//   ...
//   // Supabase delete logic
// };

export const deleteFileFromBackend = async (path: string, bucket: string = "dish-images"): Promise<boolean> => {
  const response = await fetch(`${getBackendApiUrl()}/api/file/delete`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ path, bucket }),
  });
  return response.ok;
};
