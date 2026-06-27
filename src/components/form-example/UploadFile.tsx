"use client";

import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { useUploadFilesMutation } from "@/services/upload";

export function FileUploadFillProgressDemo() {
  // uploadfile hook
  const [uploadMutiFiles] = useUploadFilesMutation();

  const [files, setFiles] = React.useState<File[]>([]);

  const onUpload = React.useCallback(
    async (
      files: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onProgress: (file: File, progress: number) => void;
        onSuccess: (file: File) => void;
        onError: (file: File, error: Error) => void;
      },
    ) => {
      try {
        // 1. Prepare FormData containing all files for the "upload-multiple" endpoint
        const formData = new FormData();
        files.forEach((file) => {
          // Note: Change "files" to whatever key your backend expects (e.g., "file" or "images")
          formData.append("files", file);
        });

        // 2. Start the progress simulation for all files in parallel
        const progressPromises = files.map(async (file) => {
          const totalChunks = 10;
          let uploadedChunks = 0;

          for (let i = 0; i < totalChunks; i++) {
            await new Promise((resolve) =>
              setTimeout(resolve, Math.random() * 150 + 50),
            );
            uploadedChunks++;
            const progress = (uploadedChunks / totalChunks) * 100;
            onProgress(file, progress);
          }
        });

        // 3. Trigger the actual network request using FormData
        // unwrap() ensures that if the server returns an error, it throws into the catch block
        const uploadPromise = uploadMutiFiles(formData).unwrap();

        // 4. Wait for both the network request and the UI progress animation to finish
        await Promise.all([...progressPromises, uploadPromise]);

        // 5. Trigger success for all files if everything went well
        files.forEach((file) => onSuccess(file));
      } catch (error) {
        console.error("Upload failed:", error);
        // Trigger error UI for the files
        files.forEach((file) => {
          onError(
            file,
            error instanceof Error ? error : new Error("Upload failed"),
          );
        });
      }
    },
    [uploadMutiFiles], // Add hook dependency here
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      maxFiles={10}
      maxSize={5 * 1024 * 1024}
      className="w-full max-w-md"
      onUpload={onUpload}
      onFileReject={onFileReject}
      multiple
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max 10 files, up to 5MB each)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList orientation="horizontal">
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file} className="p-0">
            <FileUploadItemPreview className="size-20">
              <FileUploadItemProgress variant="fill" />
            </FileUploadItemPreview>

            <FileUploadItemMetadata className="sr-only" />
            <FileUploadItemDelete asChild>
              <Button
                variant="secondary"
                size="icon"
                className="absolute -top-1 -right-1 size-5 rounded-full"
              >
                <X className="size-3" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
