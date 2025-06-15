"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  COUPON_PRODUCT_ATTRIBUTES,
  LIVESTOCK_PRODUCT_ATTRIBUTES,
  PRODUCT_ATTRIBUTE_KEYS,
  PRODUCT_STATUSES,
  type ProductScope,
  convertCase,
} from "@repo/common";
import { ChevronsUpDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { FileInput } from "~/components/file-input";
import { type RouterOutput, api } from "~/components/provider";
import {
  CategorySelector,
  ServiceSelector,
} from "~/components/record-selector";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
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
import { Textarea } from "~/components/ui/textarea";
import { useLoading } from "~/hooks/use-loading";
import { cn } from "~/lib/utils";
import { type FormSchema, formSchema } from "~/schemas/product-schema";

type Product = NonNullable<RouterOutput["product"]["getSingle"]["result"]>;

export function CreateProductForm({ scope }: { scope: ProductScope }) {
  const router = useRouter();
  const utils = api.useUtils();
  const { isLoading } = useLoading();

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
      scope={scope}
      disabled={disabled}
      onSubmit={(input) => {
        mutation.mutate(input);
      }}
    />
  );
}

export function UpdateProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const utils = api.useUtils();
  const { isLoading } = useLoading();

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
      scope={product.scope}
      onSubmit={(input) => {
        mutation.mutate({ ...input, id: product.id });
      }}
    />
  );
}

export function ProductForm({
  scope,
  record,
  disabled = false,
  onSubmit: _onSubmit,
}: {
  record?: Product;
  disabled?: boolean;
  scope: ProductScope;
  onSubmit?: (input: FormSchema["product"]) => void;
}) {
  const { isLoading } = useLoading();

  const form = useForm<FormSchema["product"]>({
    disabled,
    resolver: zodResolver(formSchema.product),
    defaultValues: {
      scope,
      name: record?.name ?? "",
      status: record?.status ?? "draft",
      thumbnail: record?.thumbnail,
      images: record?.images ?? [],
      attributes:
        record?.attributes ??
        {
          coupon: COUPON_PRODUCT_ATTRIBUTES,
          livestock: LIVESTOCK_PRODUCT_ATTRIBUTES,
        }?.[scope] ??
        PRODUCT_ATTRIBUTE_KEYS.map((key) => ({ key, title: "", value: "" })),
      services: record?.services ?? [],
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
          <ProductInformationField />
          <div className="lg:hidden">
            <ProductConfigurationField />
          </div>
          <ProductAttributeField />
        </div>
        <div className="hidden flex-col gap-6 lg:flex">
          <ProductConfigurationField />
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

function ProductInformationField() {
  const { setIsLoading } = useLoading();
  const form = useFormContext<FormSchema["product"]>();

  return (
    <CollapsibleCard title="Information">
      <div className="flex flex-col gap-6">
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
      </div>
    </CollapsibleCard>
  );
}

function ProductConfigurationField() {
  const form = useFormContext<FormSchema["product"]>();

  const scope = form.watch("scope");

  return (
    <CollapsibleCard title="Configuration">
      <div className="flex flex-col gap-6">
        <FormField
          name="services"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Services</FormLabel>
              <FormControl>
                <ServiceSelector
                  scopes={[scope]}
                  value={field.value}
                  disabled={field.disabled}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
      </div>
    </CollapsibleCard>
  );
}

function ProductAttributeField() {
  const form = useFormContext<FormSchema["product"]>();
  const entry = useFieldArray({ name: "attributes", control: form.control });

  const scope = form.watch("scope");

  return (
    <CollapsibleCard title="Attributes" defaultOpen={false}>
      <div className="flex flex-col gap-6">
        {entry.fields.map((item, i) => {
          const prefix = convertCase(item.key);
          const isTextarea = [
            "important_info",
            ...(scope === "livestock" ? ["transaction_info"] : []),
          ].includes(item.key);

          return (
            <div
              key={i}
              className={cn(
                "flex flex-col gap-4 rounded-md border p-4",
                isTextarea ? "lg:flex-col" : "lg:flex-row lg:items-center",
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
                      {isTextarea ? (
                        <Textarea className="resize-none" {...field} />
                      ) : (
                        <Input {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          );
        })}
      </div>
    </CollapsibleCard>
  );
}

function CollapsibleCard({
  title,
  children,
  defaultOpen = true,
}: React.PropsWithChildren<{ title?: string; defaultOpen?: boolean }>) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <Card>
        <CardHeader className="flex items-center">
          <CardTitle className="flex-1">{title}</CardTitle>
          <CardAction>
            <CollapsibleTrigger asChild>
              <Button
                size="icon"
                type="button"
                variant="ghost"
                className="size-8"
              >
                <ChevronsUpDownIcon />
              </Button>
            </CollapsibleTrigger>
          </CardAction>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
