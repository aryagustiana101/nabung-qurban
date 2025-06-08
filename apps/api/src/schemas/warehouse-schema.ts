import { FIELD, WAREHOUSE_STATUSES } from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  getMultiple: z.object({
    keyword: z.string().nullish(),
    page: FIELD.TEXT_NUMERIC("page").nullish(),
    limit: FIELD.TEXT_NUMERIC("limit").nullish(),
    statuses: FIELD.TEXT_ENUM_ARRAY(WAREHOUSE_STATUSES).nullish(),
  }),
  getSingle: z.object({ code: FIELD.TEXT("code") }),
};
