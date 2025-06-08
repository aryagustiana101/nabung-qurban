import {
  ACTIVE_MAIN_SERVICE_CODES,
  PAGINATION_TYPES,
  PRODUCT_STATUSES,
} from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  getMultiple: z.object({
    keyword: z.string().nullish(),
    pagination: z.enum(PAGINATION_TYPES).nullish(),
    limit: z.number().nullish(),
    page: z.number().nullish(),
    cursor: z.number().nullish(),
    categories: z.string().array().nullish(),
    services: z
      .string()
      .array()
      .transform((value) =>
        value
          .filter((v) => z.enum(ACTIVE_MAIN_SERVICE_CODES).safeParse(v).success)
          .map((v) => z.enum(ACTIVE_MAIN_SERVICE_CODES).parse(v)),
      )
      .nullish(),
    statuses: z
      .string()
      .array()
      .transform((value) =>
        value
          .filter((v) => z.enum(PRODUCT_STATUSES).safeParse(v).success)
          .map((v) => z.enum(PRODUCT_STATUSES).parse(v)),
      )
      .nullish(),
  }),
};
