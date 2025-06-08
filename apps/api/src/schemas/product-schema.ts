import { FIELD, PRODUCT_STATUSES, SERVICE_CODES } from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  getMultiple: z.object({
    keyword: z.string().nullish(),
    page: FIELD.TEXT_NUMERIC("page").nullish(),
    limit: FIELD.TEXT_NUMERIC("limit").nullish(),
    statuses: FIELD.TEXT_ENUM_ARRAY(PRODUCT_STATUSES).nullish(),
    services: FIELD.TEXT_ENUM_ARRAY(SERVICE_CODES).nullish(),
    categories: FIELD.TEXT_ARRAY().nullish(),
    warehouses: FIELD.TEXT_ARRAY().nullish(),
  }),
  getSingle: z.object({ id: FIELD.TEXT_NUMERIC("ID") }),
};
