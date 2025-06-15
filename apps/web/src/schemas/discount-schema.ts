import {
  DISCOUNT_LEVELS,
  DISCOUNT_TYPES,
  PAGINATION_TYPES,
} from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  getMultiple: z.object({
    page: z.number().nullish(),
    limit: z.number().nullish(),
    cursor: z.number().nullish(),
    keyword: z.string().nullish(),
    pagination: z.enum(PAGINATION_TYPES).nullish(),
    levels: z.enum(DISCOUNT_LEVELS).array().nullish(),
    types: z.enum(DISCOUNT_TYPES).array().nullish(),
  }),
};

export const discountSchema = z.object({
  id: z.number(),
  name: z.string(),
  level: z.enum(DISCOUNT_LEVELS),
  type: z.enum(DISCOUNT_TYPES),
  value: z.number(),
  rule: z.object({
    quantity: z.object({
      min: z.number().nullable(),
      max: z.number().nullable(),
    }),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
  fmt: z.object({
    level: z.string(),
    type: z.string(),
    value: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});
