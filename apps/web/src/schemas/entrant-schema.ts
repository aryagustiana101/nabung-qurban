import { ENTRANT_CODES, PAGINATION_TYPES } from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  getMultiple: z.object({
    page: z.number().nullish(),
    limit: z.number().nullish(),
    cursor: z.number().nullish(),
    keyword: z.string().nullish(),
    pagination: z.enum(PAGINATION_TYPES).nullish(),
  }),
};

export const entrantSchema = z.object({
  id: z.number(),
  code: z.enum(ENTRANT_CODES),
  name: z.string(),
  label: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  fmt: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});
