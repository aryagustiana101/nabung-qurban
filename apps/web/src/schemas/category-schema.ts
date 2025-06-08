import { PAGINATION_TYPES } from "@repo/common";
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
