import {
  ACTIVE_MAIN_SERVICE_CODES,
  FIELD,
  PAGINATION_TYPES,
  PRODUCT_STATUSES,
} from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  getMultiple: z.object({
    page: z.number().nullish(),
    limit: z.number().nullish(),
    cursor: z.number().nullish(),
    keyword: z.string().nullish(),
    categories: z.string().array().nullish(),
    pagination: z.enum(PAGINATION_TYPES).nullish(),
    statuses: FIELD.ARRAY_ENUM(PRODUCT_STATUSES).nullish(),
    services: FIELD.ARRAY_ENUM(ACTIVE_MAIN_SERVICE_CODES).nullish(),
  }),
};
