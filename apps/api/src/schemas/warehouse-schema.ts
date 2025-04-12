import { WAREHOUSE_STATUSES } from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  getMultiple: z.object({
    keyword: z.string().nullish(),
    page: z
      .string()
      .transform((v) => z.number().positive().safeParse(Number(v)).data ?? null)
      .nullish(),
    limit: z
      .string()
      .transform((v) => z.number().positive().safeParse(Number(v)).data ?? null)
      .nullish(),
    statuses: z
      .string()
      .transform((value) => value.split(","))
      .transform((value) =>
        value
          .filter((v) => z.enum(WAREHOUSE_STATUSES).safeParse(v).success)
          .map((v) => z.enum(WAREHOUSE_STATUSES).parse(v)),
      )
      .nullish(),
  }),
  getSingle: z.object({
    code: z
      .string({ message: "Code is required" })
      .min(1, { message: "Code is required" }),
  }),
};
