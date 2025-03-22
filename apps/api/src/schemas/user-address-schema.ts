import { USER_ADDRESS_TYPES } from "@repo/common";
import { z } from "zod";
import { transformRecord } from "~/lib/utils";

const field = {
  name: z
    .string({ message: "Name is required" })
    .min(1, { message: "Name is required" }),
  contactName: z
    .string({ message: "Contact name is required" })
    .min(1, { message: "Contact name is required" }),
  contactPhoneNumber: z
    .string({ message: "Contact phone number is required" })
    .min(1, { message: "Contact phone number is required" })
    .max(15, { message: "Contact phone number max is 15" })
    .transform((value) =>
      (value.startsWith("08") ? value.replace("08", "628") : value)
        .replaceAll(" ", "")
        .replaceAll("+", "")
        .replace(/\D/g, ""),
    )
    .refine(
      (value) => (value ? ["62", "08"].includes(value.slice(0, 2)) : true),
      { message: "Contact phone number locale must be Indonesia" },
    ),
  detail: z
    .string({ message: "Detail is required" })
    .min(1, { message: "Detail is required" }),
  note: z
    .string({ message: "Note is required" })
    .min(1, { message: "Note must be at least 1 characters" }),
  type: z.enum(USER_ADDRESS_TYPES, { message: "Type is required" }),
  location: z.object(
    {
      name: z.string(),
      detail: z.string(),
      coordinates: z.object({
        latitude: z.string(),
        longitude: z.string(),
      }),
    },
    { invalid_type_error: "Location invalid", message: "Location is required" },
  ),
};

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
    types: z
      .string()
      .transform((value) => value.split(","))
      .transform((value) =>
        value
          .filter((v) => z.enum(USER_ADDRESS_TYPES).safeParse(v).success)
          .map((v) => z.enum(USER_ADDRESS_TYPES).parse(v)),
      )
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
  create: z
    .object({
      name: field.name,
      type: field.type,
      detail: field.detail,
      location: field.location,
      contact_name: field.contactName,
      note: field.note.nullish().default(null),
      contact_phone_number: field.contactPhoneNumber,
    })
    .transform((v) => transformRecord(v, "camel")),
  update: z
    .object({
      name: field.name.optional(),
      type: field.type.optional(),
      detail: field.detail.optional(),
      location: field.location.optional(),
      contact_name: field.contactName.optional(),
      note: field.note.nullish().default(null).optional(),
      contact_phone_number: field.contactPhoneNumber.optional(),
    })
    .transform((v) => transformRecord(v, "camel")),
};
