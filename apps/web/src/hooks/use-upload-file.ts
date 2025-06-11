"use client";

import * as React from "react";
import { toast } from "sonner";
import { api } from "~/components/provider";

export function useUploadFile() {
  const utils = api.useUtils();
  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = React.useState(false);

  async function uploadFile(files: File[]) {
    if (isUploading) {
      return null;
    }

    setIsUploading(true);

    const result: { success: boolean; url: string | null }[] = [];

    for (const file of files) {
      try {
        const output = await utils.storage.getPresignedUrl.fetch({
          file: file.name,
        });

        const uploadUrl = output?.result?.upload;
        const publicUrl = output?.result?.public;

        if (!uploadUrl || !publicUrl) {
          toast(output?.message ?? "Failed to upload file");
          result.push({ url: null, success: false });
          continue;
        }

        const res = await fetch(uploadUrl, { body: file, method: "PUT" });

        if (!res.ok) {
          toast("Failed to upload file");
          result.push({ url: null, success: false });
          continue;
        }

        result.push({ url: publicUrl, success: true });
      } catch (error) {
        console.error(error);
        toast("Failed to upload file");
        result.push({ url: null, success: false });
      }
    }

    setIsUploading(false);
    setIsUploadSuccess(result.every((v) => v.success));

    return result;
  }

  function resetUpload() {
    setIsUploadSuccess(false);
    setIsUploading(false);
  }

  return { isUploadSuccess, isUploading, uploadFile, resetUpload };
}
