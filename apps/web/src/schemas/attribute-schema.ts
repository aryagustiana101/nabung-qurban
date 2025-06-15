import {
  ATTRIBUTE_SCOPES,
  ATTRIBUTE_STATUSES,
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
    scopes: z.enum(ATTRIBUTE_SCOPES).array().nullish(),
    statuses: z.enum(ATTRIBUTE_STATUSES).array().nullish(),
  }),
};

export const attributeSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  label: z.string(),
  status: z.enum(ATTRIBUTE_STATUSES),
  scopes: z.enum(ATTRIBUTE_SCOPES).array(),
  rule: z.object({
    quantity: z.object({
      min: z.number().nullable(),
      max: z.number().nullable(),
    }),
    participant: z.object({
      min: z.number().nullable(),
      max: z.number().nullable(),
    }),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
  fmt: z.object({
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});
