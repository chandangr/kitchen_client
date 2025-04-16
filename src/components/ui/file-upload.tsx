import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Trash2 as RemoveIcon, X } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DropzoneOptions,
  DropzoneState,
  FileRejection,
  useDropzone,
} from "react-dropzone";
import { toast } from "sonner";

type DirectionOptions = "rtl" | "ltr" | undefined;
type FileSize = "sm" | "md" | "lg";

// Define a type for file items that can be either File objects or URLs
export type FileItem = File | string;

// Helper function to check if an item is a File object
export const isFile = (item: FileItem): item is File => {
  return item instanceof File;
};

type FileUploaderContextType = {
  dropzoneState: DropzoneState;
  isLOF: boolean;
  isFileTooBig: boolean;
  removeFileFromSet: (index: number) => void;
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  orientation: "horizontal" | "vertical";
  direction: DirectionOptions;
  size: FileSize;
};

const FileUploaderContext = createContext<FileUploaderContextType | null>(null);

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUploaderProvider");
  }
  return context;
};

type FileUploaderProps = {
  value: FileItem[] | null;
  reSelect?: boolean;
  onValueChange: (value: FileItem[] | null) => void;
  dropzoneOptions: DropzoneOptions;
  orientation?: "horizontal" | "vertical";
  size?: FileSize;
  showPreview?: boolean;
  initialValue?: string | null;
  onDelete?: (file: FileItem) => void;
};

const sizeClasses = {
  sm: {
    container: "p-0",
    icon: "w-4 h-4",
    text: "text-xs",
    preview: "h-8 w-8",
    input: "h-9",
    wrapper: "flex items-center gap-2",
  },
  md: {
    container: "p-4",
    icon: "w-8 h-8",
    text: "text-base",
    preview: "h-24 w-24",
    input: "h-10",
    wrapper: "grid gap-4",
  },
  lg: {
    container: "p-6",
    icon: "w-10 h-10",
    text: "text-lg",
    preview: "h-32 w-32",
    input: "h-12",
    wrapper: "grid gap-4",
  },
};

/**
 * File upload Docs: {@link: https://localhost:3000/docs/file-upload}
 */

export const FileUploader = forwardRef<
  HTMLDivElement,
  FileUploaderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      dropzoneOptions,
      value,
      onValueChange,
      reSelect,
      orientation = "vertical",
      size = "md",
      showPreview = true,
      initialValue,
      onDelete,
      children,
      dir,
      ...props
    },
    ref
  ) => {
    const [isFileTooBig, setIsFileTooBig] = useState(false);
    const [isLOF, setIsLOF] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const dropzoneRef = useRef<HTMLInputElement | null>(null);
    const {
      accept = {
        "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      },
      maxFiles = 1,
      maxSize = 4 * 1024 * 1024,
      multiple = true,
    } = dropzoneOptions;

    const reSelectAll = maxFiles === 1 ? true : reSelect;
    const direction: DirectionOptions = dir === "rtl" ? "rtl" : "ltr";

    // Initialize with initialValue if provided
    useEffect(() => {
      if (initialValue && !value) {
        onValueChange([initialValue]);
      }
    }, [initialValue, value, onValueChange]);

    // Update value when initialValue changes
    useEffect(() => {
      if (initialValue && value && value.length === 0) {
        onValueChange([initialValue]);
      }
    }, [initialValue, value, onValueChange]);

    const removeFileFromSet = useCallback(
      (i: number) => {
        if (!value) return;
        const fileToRemove = value[i];
        const newFiles = value.filter((_, index) => index !== i);
        onValueChange(newFiles.length > 0 ? newFiles : null);
        setActiveIndex(-1);
        setIsLOF(false);

        // Call onDelete if provided
        if (onDelete) {
          onDelete(fileToRemove);
        }

        // Reset dropzone state to allow re-uploading the same file
        if (dropzoneRef.current) {
          dropzoneRef.current.value = "";
        }
      },
      [value, onValueChange, activeIndex, isLOF, onDelete]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!value) return;

        const moveNext = () => {
          const nextIndex = activeIndex + 1;
          setActiveIndex(nextIndex > value.length - 1 ? 0 : nextIndex);
        };

        const movePrev = () => {
          const nextIndex = activeIndex - 1;
          setActiveIndex(nextIndex < 0 ? value.length - 1 : nextIndex);
        };

        const prevKey =
          orientation === "horizontal"
            ? direction === "ltr"
              ? "ArrowLeft"
              : "ArrowRight"
            : "ArrowUp";

        const nextKey =
          orientation === "horizontal"
            ? direction === "ltr"
              ? "ArrowRight"
              : "ArrowLeft"
            : "ArrowDown";

        if (e.key === nextKey) {
          moveNext();
        } else if (e.key === prevKey) {
          movePrev();
        } else if (e.key === "Enter" || e.key === "Space") {
          if (activeIndex === -1) {
            dropzoneRef.current?.click();
          }
        } else if (e.key === "Delete" || e.key === "Backspace") {
          if (activeIndex !== -1) {
            removeFileFromSet(activeIndex);
            if (value.length - 1 === 0) {
              setActiveIndex(-1);
              return;
            }
            movePrev();
          }
        } else if (e.key === "Escape") {
          setActiveIndex(-1);
        }
      },
      [value, activeIndex, removeFileFromSet, orientation, direction]
    );

    const onDrop = useCallback(
      (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        const files = acceptedFiles;

        if (!files) {
          toast.error("file error , probably too big");
          return;
        }

        const newValues: FileItem[] = value ? [...value] : [];

        if (reSelectAll) {
          newValues.splice(0, newValues.length);
        }

        files.forEach((file) => {
          if (newValues.length < maxFiles) {
            newValues.push(file);
          }
        });

        onValueChange(newValues);

        if (rejectedFiles.length > 0) {
          for (let i = 0; i < rejectedFiles.length; i++) {
            if (rejectedFiles[i].errors[0]?.code === "file-too-large") {
              toast.error(
                `File is too large. Max size is ${maxSize / 1024 / 1024}MB`
              );
              break;
            }
            if (rejectedFiles[i].errors[0]?.message) {
              toast.error(rejectedFiles[i].errors[0].message);
              break;
            }
          }
        }
      },
      [reSelectAll, value, maxFiles, onValueChange, maxSize]
    );

    useEffect(() => {
      if (!value) return;
      if (value.length === maxFiles) {
        setIsLOF(true);
        return;
      }
      setIsLOF(false);
    }, [value, maxFiles]);

    const opts = dropzoneOptions
      ? dropzoneOptions
      : { accept, maxFiles, maxSize, multiple };

    const dropzoneState = useDropzone({
      ...opts,
      onDrop,
      onDropRejected: () => setIsFileTooBig(true),
      onDropAccepted: () => setIsFileTooBig(false),
    });

    // Store the input ref in our ref
    useEffect(() => {
      dropzoneRef.current = dropzoneState.inputRef.current;
    }, [dropzoneState.inputRef.current]);

    return (
      <FileUploaderContext.Provider
        value={{
          dropzoneState,
          isLOF,
          isFileTooBig,
          removeFileFromSet,
          activeIndex,
          setActiveIndex,
          orientation,
          direction,
          size,
        }}
      >
        <div
          ref={ref}
          tabIndex={0}
          onKeyDownCapture={handleKeyDown}
          className={cn(
            size === "sm" ? sizeClasses.sm.wrapper : "grid w-full",
            "focus:outline-none overflow-hidden",
            className
          )}
          dir={dir}
          {...props}
        >
          {children}
          {showPreview && value && value.length > 0 && size !== "sm" && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {value.map((file, index) => (
                <div key={index} className="flex flex-col">
                  <div
                    className={cn(
                      "relative group rounded-lg overflow-hidden border",
                      sizeClasses[size].preview
                    )}
                  >
                    {!isFile(file) ? (
                      <img
                        src={file}
                        alt="Uploaded image"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span
                          className={cn(
                            "text-gray-500",
                            sizeClasses[size].text
                          )}
                        >
                          {file.name.split(".").pop()?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFileFromSet(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out transform group-hover:scale-90"
                    >
                      <X className={cn("w-4 h-4", sizeClasses[size].icon)} />
                    </button>
                  </div>
                  {(size === "md" || size === "lg") && (
                    <div className="mt-1 text-center truncate">
                      <span
                        className={cn(
                          "text-gray-600 text-xs",
                          sizeClasses[size].text
                        )}
                      >
                        {!isFile(file)
                          ? file.split("/").pop() || "Image"
                          : file.name}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {showPreview && value && value.length > 0 && size === "sm" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 truncate max-w-[200px]">
                {!isFile(value[0])
                  ? value[0].split("/").pop() || "Image"
                  : value[0].name}
              </span>
              <button
                type="button"
                onClick={() => removeFileFromSet(0)}
                className="p-1 text-red-500 hover:text-red-600 transition-all duration-200 ease-in-out transform hover:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </FileUploaderContext.Provider>
    );
  }
);

FileUploader.displayName = "FileUploader";

export const FileUploaderContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { orientation } = useFileUpload();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn("w-full px-1")}
      ref={containerRef}
      aria-description="content file holder"
    >
      <div
        {...props}
        ref={ref}
        className={cn(
          "flex rounded-xl gap-1",
          orientation === "horizontal" ? "flex-raw flex-wrap" : "flex-col",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
});

FileUploaderContent.displayName = "FileUploaderContent";

export const FileUploaderItem = forwardRef<
  HTMLDivElement,
  { index: number } & React.HTMLAttributes<HTMLDivElement>
>(({ className, index, children, ...props }, ref) => {
  const { removeFileFromSet, activeIndex, direction, size } = useFileUpload();
  const isSelected = index === activeIndex;
  return (
    <div
      ref={ref}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "h-6 p-1 justify-between cursor-pointer relative",
        className,
        isSelected ? "bg-muted" : ""
      )}
      {...props}
    >
      <div className="font-medium leading-none tracking-tight flex items-center gap-1.5 h-full w-full">
        {children}
      </div>
      <button
        type="button"
        className={cn(
          "absolute",
          direction === "rtl" ? "top-1 left-1" : "top-1 right-1"
        )}
        onClick={() => removeFileFromSet(index)}
      >
        <span className="sr-only">remove item {index}</span>
        <RemoveIcon
          className={cn(
            "w-4 h-4 hover:stroke-destructive duration-200 ease-in-out",
            sizeClasses[size].icon
          )}
        />
      </button>
    </div>
  );
});

FileUploaderItem.displayName = "FileUploaderItem";

export const FileInput = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { dropzoneState, isFileTooBig, isLOF, size } = useFileUpload();
  const rootProps = isLOF ? {} : dropzoneState.getRootProps();
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "relative w-full",
        isLOF ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <div
        className={cn(
          "w-full rounded-lg duration-300 ease-in-out",
          sizeClasses[size].container,
          {
            "border-green-500": dropzoneState.isDragAccept,
            "border-red-500": dropzoneState.isDragReject || isFileTooBig,
            "border-gray-300":
              !dropzoneState.isDragAccept &&
              !dropzoneState.isDragReject &&
              !isFileTooBig,
          },
          className
        )}
        {...rootProps}
      >
        {children}
      </div>
      <Input
        ref={dropzoneState.inputRef}
        disabled={isLOF}
        {...dropzoneState.getInputProps()}
        className={cn(
          isLOF ? "cursor-not-allowed" : "",
          sizeClasses[size].input,
          "hidden"
        )}
      />
    </div>
  );
});

FileInput.displayName = "FileInput";
