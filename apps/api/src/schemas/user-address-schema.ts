import { __, FIELD, USER_ADDRESS_TYPES } from "@repo/common";
import { z } from "zod";
import { transformRecord } from "~/lib/utils";

const field = {
  location: z.object(
    {
      name: z.string(),
      detail: z.string(),
      coordinates: z.object({ latitude: z.string(), longitude: z.string() }),
    },
    {
      message: __("required", { attribute: "location" }),
      invalid_type_error: __("invalid", { attribute: "location" }),
    },
  ),
};

export const routerSchema = {
  getMultiple: z.object({
    keyword: z.string().nullish(),
    page: FIELD.TEXT_NUMERIC("page").nullish(),
    limit: FIELD.TEXT_NUMERIC("limit").nullish(),
    types: FIELD.TEXT_ENUM_ARRAY(USER_ADDRESS_TYPES).nullish(),
  }),
  getSingle: z.object({ id: FIELD.TEXT_NUMERIC("ID") }),
  create: z
    .object({
      name: FIELD.TEXT("name"),
      type: FIELD.ENUM(USER_ADDRESS_TYPES, "type"),
      detail: FIELD.TEXT("detail"),
      location: field.location,
      contact_name: FIELD.TEXT("contact name"),
      note: FIELD.TEXT("note").nullish().default(null),
      contact_phone_number: FIELD.TEXT_PHONE_NUMBER("contact phone number"),
    })
    .transform((v) => transformRecord(v, "camel")),
  update: z
    .object({
      name: FIELD.TEXT("name").optional(),
      type: FIELD.ENUM(USER_ADDRESS_TYPES, "type").optional(),
      detail: FIELD.TEXT("detail").optional(),
      location: field.location.optional(),
      contact_name: FIELD.TEXT("contact name").optional(),
      note: FIELD.TEXT("note").nullish().default(null),
      contact_phone_number: FIELD.TEXT_PHONE_NUMBER(
        "contact phone number",
      ).optional(),
    })
    .transform((v) => transformRecord(v, "camel")),
};
