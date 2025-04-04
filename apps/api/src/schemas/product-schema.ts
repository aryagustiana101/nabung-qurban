import { PRODUCT_STATUSES, SERVICE_CODES } from "@repo/common";
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
          .filter((v) => z.enum(PRODUCT_STATUSES).safeParse(v).success)
          .map((v) => z.enum(PRODUCT_STATUSES).parse(v)),
      )
      .nullish(),
    services: z
      .string()
      .transform((value) => value.split(","))
      .transform((value) =>
        value
          .filter((v) => z.enum(SERVICE_CODES).safeParse(v).success)
          .map((v) => z.enum(SERVICE_CODES).parse(v)),
      )
      .nullish(),
    categories: z
      .string()
      .transform((value) => value.split(","))
      .nullish(),
  }),
  getSingle: z.object({
    id: z
      .string()
      .refine((v) => z.number().safeParse(Number(v)).success, {
        params: ["id"],
        message: "ID must be number",
      })
      .transform((v) => z.number().parse(Number(v))),
  }),
};
