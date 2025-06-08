import { FIELD, transformRecord } from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  register: z
    .object({
      pin: FIELD.TEXT_NUMERIC_DIGITS("PIN", 6),
      phone_number: FIELD.TEXT_PHONE_NUMBER("phone number"),
    })
    .transform((v) => transformRecord(v, "camel")),
  login: z
    .object({
      pin: FIELD.TEXT_NUMERIC_DIGITS("PIN", 6),
      phone_number: FIELD.TEXT_PHONE_NUMBER("phone number"),
    })
    .transform((v) => transformRecord(v, "camel")),
  forgotPassword: z
    .object({ phone_number: FIELD.TEXT_PHONE_NUMBER("phone number") })
    .transform((v) => transformRecord(v, "camel")),
  changePassword: z
    .object({
      new_pin: FIELD.TEXT_NUMERIC_DIGITS("new PIN", 6),
      old_pin: FIELD.TEXT_NUMERIC_DIGITS("old PIN", 6),
    })
    .transform((v) => transformRecord(v, "camel")),
  resetPassword: z.object({
    key: FIELD.TEXT("key"),
    pin: FIELD.TEXT_NUMERIC_DIGITS("PIN", 6),
  }),
  verifyOtp: z.object({ key: FIELD.TEXT("key"), code: FIELD.TEXT("OTP code") }),
  resendOtp: z.object({ key: FIELD.TEXT("key") }),
};
