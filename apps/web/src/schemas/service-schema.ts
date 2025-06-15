import {
  PAGINATION_TYPES,
  SERVICE_CODES,
  SERVICE_LEVELS,
  SERVICE_SCOPES,
  SERVICE_STATUSES,
} from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  getMultiple: z.object({
    page: z.number().nullish(),
    limit: z.number().nullish(),
    cursor: z.number().nullish(),
    keyword: z.string().nullish(),
    pagination: z.enum(PAGINATION_TYPES).nullish(),
    levels: z.enum(SERVICE_LEVELS).array().nullish(),
    scopes: z.enum(SERVICE_SCOPES).array().nullish(),
    statuses: z.enum(SERVICE_STATUSES).array().nullish(),
  }),
  getAll: z.object({
    levels: z.enum(SERVICE_LEVELS).array().nullish(),
    statuses: z.enum(SERVICE_STATUSES).array().nullish(),
  }),
};

export const serviceSchema = z.object({
  id: z.number(),
  code: z.enum(SERVICE_CODES),
  name: z.string(),
  status: z.enum(SERVICE_STATUSES),
  level: z.enum(SERVICE_LEVELS),
  scopes: z.enum(SERVICE_SCOPES).array(),
  description: z.string().nullable(),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  fmt: z.object({
    status: z.string(),
    level: z.string(),
    description: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});
