import { PAGINATION_TYPES, WAREHOUSE_STATUSES } from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  getMultiple: z.object({
    page: z.number().nullish(),
    limit: z.number().nullish(),
    cursor: z.number().nullish(),
    keyword: z.string().nullish(),
    pagination: z.enum(PAGINATION_TYPES).nullish(),
    statuses: z.enum(WAREHOUSE_STATUSES).array().nullish(),
  }),
};

export const warehouseSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  status: z.enum(WAREHOUSE_STATUSES),
  province: z.string(),
  city: z.string(),
  district: z.string(),
  postalCode: z.string(),
  address: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  fmt: z.object({
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});
