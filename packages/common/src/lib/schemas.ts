import {
  isPhoneNumberLocaleIndonesia,
  transformIndonesiaPhoneNumber,
} from "@repo/common/lib/utils";
import { __ } from "@repo/common/lib/validation";
import { z } from "zod";

export const literalSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

export type Json =
  | z.infer<typeof literalSchema>
  | { [key: string]: Json }
  | Json[];

export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const FIELD = {
  TEXT: (attribute: string) =>
    z
      .string({ message: __("required", { attribute }) })
      .min(1, { message: __("required", { attribute }) }),
  TEXT_NUMERIC_DIGITS: (attribute: string, digits: number) =>
    z
      .string({ message: __("required", { attribute }) })
      .length(digits, {
        message: __("digits", { attribute, digits: String(digits) }),
      })
      .refine((v) => z.number().safeParse(Number(v)).success, {
        message: __("numeric", { attribute }),
      }),
  TEXT_PHONE_NUMBER: (attribute: string) =>
    z
      .string({ message: __("required", { attribute }) })
      .min(1, { message: __("required", { attribute }) })
      .max(15, {
        message: __("max.string", { attribute, max: "15" }),
      })
      .transform((value) => transformIndonesiaPhoneNumber(value))
      .refine((value) => isPhoneNumberLocaleIndonesia(value), {
        message: __("phone_number.id_locale", { attribute }),
      }),
  TEXT_EMAIL: (attribute: string) =>
    z
      .string({ message: __("required", { attribute }) })
      .email({ message: __("email", { attribute }) }),
  TEXT_URL: (attribute: string) =>
    z
      .string({ message: __("required", { attribute }) })
      .url({ message: __("url", { attribute }) }),
  TEXT_NUMERIC: (attribute: string) =>
    z
      .string()
      .refine((v) => z.number().safeParse(Number(v)).success, {
        message: __("numeric", { attribute }),
      })
      .transform((v) => z.number().parse(Number(v))),
  ENUM: <T extends readonly [string, ...string[]]>(
    values: T,
    attribute: string,
  ) => z.enum(values, { message: __("required", { attribute }) }),
  NUMBER: (attribute: string) =>
    z.number({ message: __("required", { attribute }) }),
  TEXT_ENUM_ARRAY: <T extends readonly [string, ...string[]]>(values: T) =>
    z
      .string()
      .transform((value) => value.split(","))
      .transform((value) =>
        value
          .filter((v) => z.enum(values).safeParse(v).success)
          .map((v) => z.enum(values).parse(v)),
      ),
  TEXT_ARRAY: () => z.string().transform((value) => value.split(",")),
  ARRAY_ENUM: <T extends readonly [string, ...string[]]>(values: T) =>
    z
      .string()
      .array()
      .transform((value) =>
        value
          .filter((v) => z.enum(values).safeParse(v).success)
          .map((v) => z.enum(values).parse(v)),
      ),
};
