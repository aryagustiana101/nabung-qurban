"use client";

import { FileIcon, GripVerticalIcon, UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Dropzone, { type Accept } from "react-dropzone";
import { toast } from "sonner";
import {
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableRoot,
} from "~/components/sortable";
import { Button } from "~/components/ui/button";
import { useUploadFile } from "~/hooks/use-upload-file";
import { cn } from "~/lib/utils";

export function FileInput({
  accept,
  children,
  maxFiles = 1,
  onValueChange,
  onUploadStart,
  value: _value,
  onUploadFinish,
  asChild = false,
  maxSize = 1024 * 1024 * 10,
  disabled: _disabled = false,
}: React.PropsWithChildren<{
  accept: Accept;
  maxSize?: number;
  asChild?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  value?: string[] | null;
  onUploadStart?: (files: File[]) => void;
  onValueChange?: (value: string[]) => void;
  onUploadFinish?: (output: {
    files: File[];
    result: { url: string | null; success: boolean }[] | null;
  }) => void;
}>) {
  const [remaining, setRemaining] = React.useState(maxFiles);
  const { uploadFile, isUploading, resetUpload } = useUploadFile();
  const [value, setValue] = React.useState<string[] | null | undefined>(_value);

  React.useEffect(() => {
    setValue(_value);
  }, [_value]);

  const disabled = React.useMemo(
    () => _disabled || isUploading,
    [_disabled, isUploading],
  );

  async function onDrop(files: File[]) {
    onUploadStart?.(files);

    const result = await uploadFile(files);

    if (!result) {
      toast("Please try again in a few moments");
    }

    if (result) {
      const urls = result.reduce((acc, curr) => {
        return curr.success && curr.url ? [...(acc ?? []), curr.url] : acc;
      }, [] as string[]);

      const newValue = value ? [...(value ?? []), ...(urls ?? [])] : urls;

      setValue(newValue);
      onValueChange?.(newValue);
      setRemaining((prev) => Math.max(0, prev - newValue.length));
    }

    onUploadFinish?.({ files, result });
    resetUpload();
  }

  return asChild ? (
    <DropzoneField
      accept={accept}
      onDrop={onDrop}
      maxSize={maxSize}
      maxFiles={remaining}
      disabled={disabled || remaining <= 0}
    >
      {children}
    </DropzoneField>
  ) : (
    <div className="flex w-full flex-col gap-2 rounded-md border p-2 text-sm">
      <div className="w-full">
        <DropzoneField
          accept={accept}
          onDrop={onDrop}
          maxSize={maxSize}
          maxFiles={remaining}
          disabled={disabled || remaining <= 0}
        >
          <Button
            size="sm"
            type="button"
            variant="outline"
            className="w-full"
            isLoading={isUploading}
            disabled={disabled || remaining <= 0}
          >
            <div className="flex items-center justify-center gap-2">
              <UploadIcon className="size-4" />
              <span>Upload</span>
            </div>
          </Button>
        </DropzoneField>
      </div>
      {value && value.length > 0 ? (
        <React.Fragment>
          <SortableRoot
            value={value}
            orientation="vertical"
            onValueChange={(urls) => {
              setValue(urls);
              onValueChange?.(urls);
            }}
          >
            <SortableContent className="flex flex-col gap-2">
              {value.map((url, i) => {
                const isImage = [".png", ".jpg", ".jpeg", ".gif"].some((ext) =>
                  url.toLowerCase().endsWith(ext),
                );

                return (
                  <SortableItem key={i} value={url} asChild>
                    <div className="flex items-center gap-2 rounded-md border p-2">
                      <div className="flex flex-1 items-center gap-2">
                        <SortableItemHandle asChild>
                          <Button
                            size="icon"
                            type="button"
                            variant="ghost"
                            className="size-8"
                            disabled={disabled}
                          >
                            <GripVerticalIcon className="size-4" />
                          </Button>
                        </SortableItemHandle>
                        <div
                          className={cn(
                            "relative size-8 rounded-sm border bg-muted",
                            isImage
                              ? "p-0"
                              : "flex items-center justify-center p-2",
                          )}
                        >
                          {isImage ? (
                            <Image
                              fill
                              priority
                              src={url}
                              alt={url}
                              sizes="50vw"
                              quality={100}
                              className="object-contain"
                            />
                          ) : (
                            <FileIcon className="size-6" />
                          )}
                        </div>
                        <p className="line-clamp-1">
                          <Link
                            href={url}
                            target="_blank"
                            className="line-clamp-1 text-sm underline hover:opacity-80"
                          >
                            {url}
                          </Link>
                        </p>
                      </div>
                      <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        className="size-8"
                        disabled={disabled}
                        onClick={() => {
                          const urls = value.filter((_, j) => j !== i);

                          setValue(urls);
                          onValueChange?.(urls);
                          setRemaining((prev) => prev + 1);
                        }}
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  </SortableItem>
                );
              })}
            </SortableContent>
          </SortableRoot>
        </React.Fragment>
      ) : null}
    </div>
  );
}

function DropzoneField({
  accept,
  onDrop,
  children,
  maxFiles = 1,
  disabled = false,
  maxSize = 1024 * 1024 * 10,
}: React.PropsWithChildren<{
  accept: Accept;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  onDrop: (files: File[]) => void;
}>) {
  return (
    <Dropzone
      onDrop={onDrop}
      accept={accept}
      onDropRejected={() => {
        toast.error("Failed to upload file. Please try again.");
      }}
      maxSize={maxSize}
      disabled={disabled}
      maxFiles={maxFiles}
      multiple={maxFiles > 1}
    >
      {({ getRootProps, getInputProps }) => {
        return (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {children}
          </div>
        );
      }}
    </Dropzone>
  );
}
