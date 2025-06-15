import {
  ACTIVE_MAIN_SERVICE_CODES,
  FIELD,
  PAGINATION_TYPES,
  PRODUCT_ATTRIBUTE_KEYS,
  PRODUCT_SCOPES,
  PRODUCT_STATUSES,
  __,
} from "@repo/common";
import { z } from "zod";
import { categorySchema } from "~/schemas/category-schema";
import { serviceSchema } from "~/schemas/service-schema";

export const routerSchema = {
  getMultiple: z.object({
    page: z.number().nullish(),
    limit: z.number().nullish(),
    cursor: z.number().nullish(),
    keyword: z.string().nullish(),
    categories: z.string().array().nullish(),
    pagination: z.enum(PAGINATION_TYPES).nullish(),
    scopes: FIELD.ARRAY_TEXT_ENUM(PRODUCT_SCOPES).nullish(),
    statuses: FIELD.ARRAY_TEXT_ENUM(PRODUCT_STATUSES).nullish(),
    services: FIELD.ARRAY_TEXT_ENUM(ACTIVE_MAIN_SERVICE_CODES).nullish(),
  }),
  getSingle: z.object({ id: FIELD.NUMBER("id") }),
  create: z.object({
    name: FIELD.TEXT("name"),
    scope: FIELD.ENUM(PRODUCT_SCOPES, "scope"),
    status: FIELD.ENUM(PRODUCT_STATUSES, "status"),
    thumbnail: FIELD.TEXT_URL("thumbnail"),
    images: FIELD.ARRAY_TEXT_URL("images", "image"),
    attributes: z
      .object({
        key: z.enum(PRODUCT_ATTRIBUTE_KEYS),
        title: z.string(),
        value: z.string(),
      })
      .array(),
    categories: z.object({ id: z.number() }).array(),
  }),
  update: z.object({
    id: FIELD.NUMBER("id"),
    name: FIELD.TEXT("name").optional(),
    scope: FIELD.ENUM(PRODUCT_SCOPES, "scope").optional(),
    status: FIELD.ENUM(PRODUCT_STATUSES, "status").optional(),
    thumbnail: FIELD.TEXT_URL("thumbnail").optional(),
    images: FIELD.ARRAY_TEXT_URL("images", "image").optional(),
    attributes: z
      .object({
        key: z.enum(PRODUCT_ATTRIBUTE_KEYS),
        title: z.string(),
        value: z.string(),
      })
      .array()
      .optional(),
    categories: z.object({ id: z.number() }).array().optional(),
  }),
};

export const formSchema = {
  product: z.object({
    name: FIELD.TEXT("name"),
    scope: FIELD.ENUM(PRODUCT_SCOPES, "scope"),
    status: FIELD.ENUM(PRODUCT_STATUSES, "status"),
    thumbnail: FIELD.TEXT_URL("thumbnail"),
    images: FIELD.ARRAY_TEXT_URL("images", "image"),
    attributes: z
      .object({
        key: z.enum(PRODUCT_ATTRIBUTE_KEYS),
        title: z.string(),
        value: z.string(),
      })
      .array(),
    services: serviceSchema.array().min(1, {
      message: __("min.array", { attribute: "services", min: 1 }),
    }),
    categories: categorySchema.array().min(1, {
      message: __("min.array", { attribute: "categories", min: 1 }),
    }),
  }),
};

export type FormSchema = {
  [K in keyof typeof formSchema]: z.infer<(typeof formSchema)[K]>;
};
