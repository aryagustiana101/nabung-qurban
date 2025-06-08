import {
  FIELD,
  USER_APPLICATION_JACKET_PAYMENT_METHODS,
  USER_APPLICATION_JACKET_PICKUP_METHODS,
  USER_APPLICATION_LEVELS,
  USER_APPLICATION_STATUSES,
  USER_APPLICATION_TYPES,
  __,
} from "@repo/common";
import { z } from "zod";
import { transformRecord } from "~/lib/utils";

export const routerSchema = {
  getMultiple: z.object({
    keyword: z.string().nullish(),
    page: FIELD.TEXT_NUMERIC("page").nullish(),
    limit: FIELD.TEXT_NUMERIC("limit").nullish(),
    statuses: FIELD.TEXT_ENUM_ARRAY(USER_APPLICATION_STATUSES).nullish(),
    types: FIELD.TEXT_ENUM_ARRAY(USER_APPLICATION_TYPES).nullish(),
    levels: FIELD.TEXT_ENUM_ARRAY(USER_APPLICATION_LEVELS).nullish(),
  }),
  getSingle: z.object({ code: FIELD.TEXT("code") }),
  create: z
    .object({
      type: FIELD.ENUM(USER_APPLICATION_TYPES, "type"),
      level: FIELD.ENUM(USER_APPLICATION_LEVELS, "level"),
      individual: z
        .object({
          name: FIELD.TEXT("individual name"),
          phone_number: FIELD.TEXT_PHONE_NUMBER("individual phone number"),
          email: FIELD.TEXT_EMAIL("individual email"),
          address: FIELD.TEXT("individual address"),
          identity_card_image: FIELD.TEXT_URL("individual identity card image"),
          selfie_image: FIELD.TEXT_URL("individual selfie image"),
        })
        .nullish(),
      institution: z
        .object({
          name: FIELD.TEXT("institution name"),
          pic_name: FIELD.TEXT("institution PIC name"),
          phone_number: FIELD.TEXT_PHONE_NUMBER("institution phone number"),
          email: FIELD.TEXT_EMAIL("institution email"),
          address: FIELD.TEXT("institution address"),
          deed_establishment: FIELD.TEXT("institution deed establishment"),
          office_image: FIELD.TEXT_URL("institution office image"),
        })
        .nullish(),
      bank: z
        .object({
          name: FIELD.TEXT("bank name"),
          account_number: FIELD.TEXT("bank account number"),
        })
        .nullish(),
      jacket: z.object(
        {
          size: FIELD.TEXT("jacket size"),
          pickup_method: FIELD.ENUM(
            USER_APPLICATION_JACKET_PICKUP_METHODS,
            "jacket pickup method",
          ),
          payment_method: FIELD.ENUM(
            USER_APPLICATION_JACKET_PAYMENT_METHODS,
            "jacket payment method",
          ),
        },
        { message: __("required", { attribute: "jacket" }) },
      ),
      vehicle: z
        .object({
          plate_number: FIELD.TEXT("vehicle plate number"),
          fleet_type: FIELD.TEXT("vehicle fleet type"),
          carrying_weight: FIELD.NUMBER("vehicle carrying weight"),
          registration_image: FIELD.TEXT_URL("vehicle registration image"),
        })
        .nullish(),
    })
    .transform((v) => transformRecord(v, "camel")),
};
