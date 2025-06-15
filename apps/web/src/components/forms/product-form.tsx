"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  COUPON_PRODUCT_ATTRIBUTES,
  LIVESTOCK_PRODUCT_ATTRIBUTES,
  PRODUCT_ATTRIBUTE_KEYS,
  PRODUCT_INVENTORY_TRACKERS,
  PRODUCT_STATUSES,
  PRODUCT_VARIANT_RULES_YEARS,
  PRODUCT_VARIANT_STATUSES,
  type ProductScope,
  convertCase,
} from "@repo/common";
import {
  ChevronsUpDownIcon,
  GripVerticalIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { FileInput } from "~/components/file-input";
import { type RouterOutput, api } from "~/components/provider";
import {
  AttributeSelector,
  CategorySelector,
  DiscountSelector,
  EntrantSelector,
  ProductVariantRuleYearSelector,
  ServiceSelector,
  WarehouseSelector,
} from "~/components/record-selector";
import {
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableRoot,
} from "~/components/sortable";
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
import { Input, NumberInput } from "~/components/ui/input";
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
  const { isLoading, setIsLoading } = useLoading();

  const mutation = api.product.create.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
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
  const { isLoading, setIsLoading } = useLoading();

  const mutation = api.product.update.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: (output) => {
      toast(output.message ?? "Please try again in a few moments");

      if (output.success) {
        utils.product.invalidate();
        router.refresh();
        window.scrollTo(0, 0);
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
  const defaultValue = getFormDefaultValue(scope);

  const form = useForm<FormSchema["product"]>({
    disabled,
    resolver: zodResolver(formSchema.product),
    defaultValues: {
      scope,
      name: record?.name ?? "",
      status: record?.status ?? "draft",
      thumbnail: record?.thumbnail,
      images: record?.images ?? [],
      attributes: record?.attributes ?? defaultValue.attributes,
      services: record?.services ?? [],
      categories: record?.categories ?? [],
      inventories: record?.inventories ?? defaultValue.inventories,
      warehouses: record?.warehouses ?? [],
      entrants: record?.entrants ?? [],
      variants: record?.variants ?? defaultValue.variants,
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
          <ProductInventoryField />
          <ProductVariantField />
          <ProductAttributeField />
        </div>
        <div className="hidden flex-col gap-6 lg:flex">
          <ProductConfigurationField />
        </div>
        <div className="lg:col-span-full">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={form.formState.disabled}
          >
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

function ProductInventoryField() {
  const form = useFormContext<FormSchema["product"]>();
  const entry = useFieldArray({ name: "inventories", control: form.control });

  return (
    <CollapsibleCard title="Inventory">
      <div className="flex flex-col gap-6">
        {entry.fields.map((_, i) => {
          return (
            <div key={i} className="flex flex-col gap-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <FormField
                  control={form.control}
                  name={`inventories.${i}.sku`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`inventories.${i}.tracker`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Tracker</FormLabel>
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
                          {PRODUCT_INVENTORY_TRACKERS.map((v, i) => (
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
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <FormField
                  control={form.control}
                  name={`inventories.${i}.stock`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <NumberInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`inventories.${i}.weight`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <NumberInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleCard>
  );
}

function ProductVariantField() {
  const form = useFormContext<FormSchema["product"]>();
  const entry = useFieldArray({ name: "variants", control: form.control });

  const scope = form.watch("scope");
  const defaultValue = getFormDefaultValue(scope);

  return (
    <Collapsible defaultOpen>
      <Card>
        <CardHeader className="flex items-center">
          <div className="flex flex-1 items-center gap-2">
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
            <CardTitle>Variant</CardTitle>
          </div>
          <CardAction>
            <Button
              size="icon"
              type="button"
              variant="outline"
              className="size-8"
              disabled={form.formState.disabled}
              onClick={() => {
                entry.append(defaultValue.variants[0]);
              }}
            >
              <PlusIcon />
            </Button>
          </CardAction>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <SortableRoot
              value={entry.fields}
              orientation="vertical"
              getItemValue={(value) => value.id}
              onMove={({ activeIndex, overIndex }) => {
                entry.move(activeIndex, overIndex);
              }}
            >
              <SortableContent className="flex flex-col gap-6">
                {entry.fields.map((item, i) => {
                  const name = form.watch(`variants.${i}.name`) ?? item.name;

                  return (
                    <SortableItem key={item.id} value={item.id} asChild>
                      <div className="flex items-center gap-4">
                        <Collapsible
                          defaultOpen
                          className="flex flex-1 flex-col gap-4 rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-4">
                            <p className="line-clamp-1 flex-1 font-semibold text-sm leading-none">
                              {name && name.length > 0 ? name : `#${i + 1}`}
                            </p>
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
                          </div>
                          <CollapsibleContent className="grid gap-6 lg:grid-cols-2">
                            <FormField
                              control={form.control}
                              name={`variants.${i}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`variants.${i}.label`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Label</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`variants.${i}.price`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price</FormLabel>
                                  <FormControl>
                                    <NumberInput {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`variants.${i}.status`}
                              render={({ field }) => (
                                <FormItem>
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
                                      {PRODUCT_VARIANT_STATUSES.map((v, i) => (
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
                            <FormField
                              control={form.control}
                              name={`variants.${i}.rule.year`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Rule - Year</FormLabel>
                                  <FormControl>
                                    <ProductVariantRuleYearSelector
                                      limit={1}
                                      value={[field.value]}
                                      disabled={field.disabled}
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
                              control={form.control}
                              name={`variants.${i}.attributes`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Attributes</FormLabel>
                                  <FormControl>
                                    <AttributeSelector
                                      value={field.value}
                                      disabled={field.disabled}
                                      onValueChange={field.onChange}
                                      filter={{
                                        scopes: [scope],
                                        statuses: ["active"],
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`variants.${i}.discount`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Discount</FormLabel>
                                  <FormControl>
                                    <DiscountSelector
                                      limit={1}
                                      disabled={field.disabled}
                                      filter={{ levels: ["product_variant"] }}
                                      value={field.value ? [field.value] : []}
                                      onValueChange={(value) => {
                                        field.onChange(value[0] ?? null);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CollapsibleContent>
                        </Collapsible>
                        <div className="flex items-center gap-2">
                          <SortableItemHandle asChild>
                            <Button
                              size="icon"
                              type="button"
                              variant="ghost"
                              className="size-8"
                              disabled={form.formState.disabled}
                            >
                              <GripVerticalIcon />
                            </Button>
                          </SortableItemHandle>
                          <Button
                            size="icon"
                            type="button"
                            variant="ghost"
                            className="size-8"
                            disabled={
                              form.formState.disabled ||
                              entry.fields.length <= 1
                            }
                            onClick={() => {
                              entry.remove(item.id);
                            }}
                          >
                            <XIcon />
                          </Button>
                        </div>
                      </div>
                    </SortableItem>
                  );
                })}
              </SortableContent>
            </SortableRoot>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
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
                  value={field.value}
                  disabled={field.disabled}
                  onValueChange={field.onChange}
                  filter={{
                    scopes: [scope],
                    levels: ["main"],
                    statuses: ["active"],
                  }}
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
        <FormField
          name="warehouses"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warehouses</FormLabel>
              <FormControl>
                <WarehouseSelector
                  limit={1}
                  value={field.value}
                  disabled={field.disabled}
                  onValueChange={field.onChange}
                  filter={{ statuses: ["active"] }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="entrants"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entrants</FormLabel>
              <FormControl>
                <EntrantSelector
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
    <CollapsibleCard title="Attribute" defaultOpen={false}>
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

function getFormDefaultValue(scope: ProductScope) {
  return {
    inventories: [
      { sku: "", stock: 0, weight: 0, tracker: "inactive" as const },
    ],
    attributes:
      {
        coupon: COUPON_PRODUCT_ATTRIBUTES,
        livestock: LIVESTOCK_PRODUCT_ATTRIBUTES,
      }?.[scope] ??
      PRODUCT_ATTRIBUTE_KEYS.map((key) => ({ key, title: "", value: "" })),
    variants: [
      {
        name: "",
        label:
          {
            livestock: "Tahun Qurban",
            coupon: "Jenis Hewan Qurban",
          }[scope] ?? "",
        price: 0,
        status: "active" as const,
        rule: {
          year:
            PRODUCT_VARIANT_RULES_YEARS.find(
              (v) => v.max && v.max === new Date().getFullYear(),
            ) ?? PRODUCT_VARIANT_RULES_YEARS[0],
        },
        attributes: [],
      },
    ],
  };
}
