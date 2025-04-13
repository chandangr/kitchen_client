import { supabase } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
    if (!file.type.startsWith("image/")) {
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

export const uploadFileToSupabase = async (
  file: File,
  bucket: string = "dish-images",
  folder: string = "dishes"
): Promise<FileUploadResponse | null> => {
  try {
    // Optimize the image before uploading
    const optimizedFile = await optimizeImage(file);

    // Create a unique file name
    const fileExt = optimizedFile.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload the optimized file to Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, optimizedFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
      return null;
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      path: filePath,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Error in file upload:", error);
    toast.error("Failed to upload file");
    return null;
  }
};

export const deleteFileFromSupabase = async (
  path: string,
  bucket: string = "dish-images"
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in file deletion:", error);
    toast.error("Failed to delete file");
    return false;
  }
};
