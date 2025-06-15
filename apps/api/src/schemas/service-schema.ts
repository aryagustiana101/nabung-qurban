import {
  FIELD,
  SERVICE_LEVELS,
  SERVICE_SCOPES,
  SERVICE_STATUSES,
} from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  getMultiple: z.object({
    keyword: z.string().nullish(),
    page: FIELD.TEXT_NUMERIC("page").nullish(),
    limit: FIELD.TEXT_NUMERIC("limit").nullish(),
    levels: FIELD.TEXT_ENUM_ARRAY(SERVICE_LEVELS).nullish(),
    statuses: FIELD.TEXT_ENUM_ARRAY(SERVICE_STATUSES).nullish(),
    scopes: FIELD.TEXT_ENUM_ARRAY(SERVICE_SCOPES).nullish(),
  }),
  getSingle: z.object({ code: FIELD.TEXT("code") }),
};
