import {
  __,
  ACTIVE_MAIN_SERVICE_CODES,
  FIELD,
  PAGINATION_TYPES,
  PRODUCT_ATTRIBUTE_KEYS,
  PRODUCT_INVENTORY_TRACKERS,
  PRODUCT_SCOPES,
  PRODUCT_STATUSES,
  PRODUCT_VARIANT_STATUSES,
} from "@repo/common";
import { z } from "zod";
import { attributeSchema } from "~/schemas/attribute-schema";
import { categorySchema } from "~/schemas/category-schema";
import { discountSchema } from "~/schemas/discount-schema";
import { entrantSchema } from "~/schemas/entrant-schema";
import { serviceSchema } from "~/schemas/service-schema";
import { warehouseSchema } from "~/schemas/warehouse-schema";

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
    services: z.object({ id: z.number() }).array(),
    categories: z.object({ id: z.number() }).array(),
    inventories: z
      .object({
        sku: z.string(),
        stock: z.number(),
        weight: z.number(),
        tracker: z.enum(PRODUCT_INVENTORY_TRACKERS),
      })
      .array(),
    warehouses: z.object({ id: z.number() }).array(),
    entrants: z.object({ id: z.number() }).array(),
    variants: z
      .object({
        name: z.string(),
        label: z.string(),
        status: z.enum(PRODUCT_VARIANT_STATUSES),
        price: z.number(),
        rule: z.object({
          year: z.object({
            min: z.number().nullable(),
            max: z.number().nullable(),
          }),
        }),
        attributes: z.object({ id: z.number() }).array(),
        discount: z.object({ id: z.number() }).nullish(),
      })
      .array(),
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
    services: z.object({ id: z.number() }).array().optional(),
    categories: z.object({ id: z.number() }).array().optional(),
    inventories: z
      .object({
        sku: z.string(),
        stock: z.number(),
        weight: z.number(),
        tracker: z.enum(PRODUCT_INVENTORY_TRACKERS),
      })
      .array()
      .optional(),
    warehouses: z.object({ id: z.number() }).array().optional(),
    entrants: z.object({ id: z.number() }).array().optional(),
    variants: z
      .object({
        id: z.number().nullish(),
        name: z.string(),
        label: z.string(),
        status: z.enum(PRODUCT_VARIANT_STATUSES),
        price: z.number(),
        rule: z.object({
          year: z.object({
            min: z.number().nullable(),
            max: z.number().nullable(),
          }),
        }),
        attributes: z.object({ id: z.number() }).array(),
        discount: z.object({ id: z.number() }).nullish(),
      })
      .array()
      .optional(),
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
        title: FIELD.TEXT("title", 0),
        value: FIELD.TEXT("value", 0),
      })
      .array(),
    services: serviceSchema.array().min(1, {
      message: __("min.array", { attribute: "services", min: 1 }),
    }),
    categories: categorySchema.array().min(1, {
      message: __("min.array", { attribute: "categories", min: 1 }),
    }),
    inventories: z
      .object({
        sku: FIELD.TEXT("sku", 0),
        stock: FIELD.NUMBER("stock"),
        weight: FIELD.NUMBER("weight"),
        tracker: FIELD.ENUM(PRODUCT_INVENTORY_TRACKERS, "tracker"),
      })
      .array()
      .min(1, {
        message: __("min.array", { attribute: "inventories", min: 1 }),
      }),
    warehouses: warehouseSchema.array().min(1, {
      message: __("min.array", { attribute: "warehouses", min: 1 }),
    }),
    entrants: entrantSchema.array().min(1, {
      message: __("min.array", { attribute: "entrants", min: 1 }),
    }),
    variants: z
      .object({
        id: z.number().nullish(),
        name: FIELD.TEXT("name"),
        label: FIELD.TEXT("label"),
        status: FIELD.ENUM(PRODUCT_VARIANT_STATUSES, "status"),
        price: FIELD.NUMBER("price").min(1, {
          message: __("min.numeric", { attribute: "price", min: 1 }),
        }),
        rule: z.object(
          {
            year: z.object(
              { min: z.number().nullable(), max: z.number().nullable() },
              { message: __("required", { attribute: "year" }) },
            ),
          },
          { message: __("required", { attribute: "rule" }) },
        ),
        attributes: attributeSchema.array().min(1, {
          message: __("min.array", { attribute: "attributes", min: 1 }),
        }),
        discount: discountSchema.nullish(),
      })
      .array()
      .min(1, { message: __("min.array", { attribute: "variants", min: 1 }) }),
  }),
};

export type FormSchema = {
  [K in keyof typeof formSchema]: z.infer<(typeof formSchema)[K]>;
};
