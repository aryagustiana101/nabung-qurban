"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  PRODUCT_ATTRIBUTE_KEYS,
  PRODUCT_STATUSES,
  convertCase,
} from "@repo/common";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { FileInput } from "~/components/file-input";
import { type RouterOutput, api } from "~/components/provider";
import { CategorySelector } from "~/components/record-selector";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { type FormSchema, formSchema } from "~/schemas/product-schema";

type Product = NonNullable<RouterOutput["product"]["getSingle"]["result"]>;

export function CreateProductForm() {
  const router = useRouter();
  const utils = api.useUtils();
  const [isLoading, setIsLoading] = React.useState(false);

  const mutation = api.product.create.useMutation({
    onSuccess: (output) => {
      toast(output.message ?? "Please try again in a few moments");

      if (output.success) {
        utils.product.invalidate();
        router.push("/dashboard/products");
        return;
      }

      mutation.reset();
    },
    onError: (error) => {
      console.error(error);
      toast("Please try again in a few moments");
      mutation.reset();
    },
  });

  const disabled = React.useMemo(
    () => isLoading || mutation.isPending || mutation.isSuccess,
    [isLoading, mutation.isPending, mutation.isSuccess],
  );

  return (
    <ProductForm
      disabled={disabled}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      onSubmit={(input) => {
        mutation.mutate(input);
      }}
    />
  );
}

export function UpdateProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const utils = api.useUtils();
  const [isLoading, setIsLoading] = React.useState(false);

  const mutation = api.product.update.useMutation({
    onSuccess: (output) => {
      toast(output.message ?? "Please try again in a few moments");

      if (output.success) {
        utils.product.invalidate();
        router.push("/dashboard/products");
        return;
      }

      mutation.reset();
    },
    onError: (error) => {
      console.error(error);
      toast("Please try again in a few moments");
      mutation.reset();
    },
  });

  const disabled = React.useMemo(
    () => isLoading || mutation.isPending || mutation.isSuccess,
    [isLoading, mutation.isPending, mutation.isSuccess],
  );

  return (
    <ProductForm
      record={product}
      disabled={disabled}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      onSubmit={(input) => {
        mutation.mutate({ ...input, id: product.id });
      }}
    />
  );
}

export function ProductForm({
  record,
  setIsLoading,
  disabled = false,
  isLoading = false,
  onSubmit: _onSubmit,
}: {
  record?: Product;
  disabled?: boolean;
  isLoading?: boolean;
  onSubmit?: (input: FormSchema["product"]) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<FormSchema["product"]>({
    disabled,
    resolver: zodResolver(formSchema.product),
    defaultValues: {
      name: record?.name ?? "",
      status: record?.status ?? "draft",
      thumbnail: record?.thumbnail,
      images: record?.images ?? [],
      attributes:
        record?.attributes ??
        PRODUCT_ATTRIBUTE_KEYS.map((key) => ({ key, title: "", value: "" })),
      categories: record?.categories ?? [],
    },
  });

  function onSubmit(input: FormSchema["product"]) {
    _onSubmit?.(input);
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-6 lg:grid-cols-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Status</FormLabel>
                      <Select
                        disabled={field.disabled}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRODUCT_STATUSES.map((v, i) => (
                            <SelectItem key={i} value={v}>
                              {convertCase(v)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                name="thumbnail"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <FileInput
                        maxFiles={1}
                        disabled={field.disabled}
                        value={field.value ? [field.value] : []}
                        accept={{
                          "image/png": [".png"],
                          "image/jpeg": [".jpg", ".jpeg"],
                        }}
                        onUploadStart={() => {
                          setIsLoading(true);
                        }}
                        onUploadFinish={() => {
                          setIsLoading(false);
                        }}
                        onValueChange={(value) => {
                          field.onChange(value[0]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="images"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileInput
                        maxFiles={10}
                        value={field.value}
                        disabled={field.disabled}
                        onValueChange={field.onChange}
                        accept={{
                          "image/png": [".png"],
                          "image/jpeg": [".jpg", ".jpeg"],
                        }}
                        onUploadStart={() => {
                          setIsLoading(true);
                        }}
                        onUploadFinish={() => {
                          setIsLoading(false);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ProductAttributeField />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="flex flex-col gap-6">
              <FormField
                name="categories"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <CategorySelector
                        limit={1}
                        value={field.value}
                        disabled={field.disabled}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-full">
          <Button type="submit" disabled={disabled} isLoading={isLoading}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}

function ProductAttributeField() {
  const form = useFormContext<FormSchema["product"]>();
  const entry = useFieldArray({ name: "attributes", control: form.control });

  return (
    <div className="grid gap-2">
      <FormLabel>Attributes</FormLabel>
      <div className="grid rounded-md border">
        {entry.fields.map((field, i) => {
          const prefix = convertCase(field.key);
          const isLast = i === entry.fields.length - 1;

          return (
            <div
              key={i}
              className={cn(
                "flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center",
                isLast ? "border-none" : "border-b",
              )}
            >
              <FormField
                control={form.control}
                name={`attributes.${i}.title`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{`${prefix} - Title`}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`attributes.${i}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{`${prefix} - Value`}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
