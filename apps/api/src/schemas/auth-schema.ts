import { __, transformRecord } from "@repo/common";
import { z } from "zod";

const field = {
  key: z
    .string({ message: __("required", { attribute: "key" }) })
    .min(1, { message: __("required", { attribute: "key" }) }),
  otpCode: z
    .string({ message: __("required", { attribute: "code" }) })
    .length(6, {
      message: __("digits", { attribute: "OTP code", digits: "6" }),
    })
    .refine((v) => z.number().safeParse(Number(v)).success, {
      message: __("numeric", { attribute: "OTP code" }),
    }),
  pin: z
    .string({ message: __("required", { attribute: "PIN" }) })
    .length(6, {
      message: __("digits", { attribute: "PIN", digits: "6" }),
    })
    .refine((v) => z.number().safeParse(Number(v)).success, {
      message: __("numeric", { attribute: "PIN" }),
    }),
  phoneNumber: z
    .string({ message: __("required", { attribute: "phone number" }) })
    .min(1, { message: __("required", { attribute: "phone number" }) })
    .max(15, {
      message: __("max.string", { attribute: "phone number", max: "15" }),
    })
    .transform((value) =>
      (value.startsWith("08") ? value.replace("08", "628") : value)
        .replaceAll(" ", "")
        .replaceAll("+", "")
        .replace(/\D/g, ""),
    )
    .refine(
      (value) => (value ? ["62", "08"].includes(value.slice(0, 2)) : true),
      { message: "Phone number locale must be Indonesia" },
    ),
  newPin: z
    .string({ message: __("required", { attribute: "new PIN" }) })
    .length(6, { message: __("digits", { attribute: "new PIN", digits: "6" }) })
    .refine((v) => z.number().safeParse(Number(v)).success, {
      message: __("numeric", { attribute: "new PIN" }),
    }),
  oldPin: z
    .string({ message: __("required", { attribute: "old PIN" }) })
    .length(6, { message: __("digits", { attribute: "old PIN", digits: "6" }) })
    .refine((v) => z.number().safeParse(Number(v)).success, {
      message: __("numeric", { attribute: "old PIN" }),
    }),
};

export const routerSchema = {
  register: z
    .object({ pin: field.pin, phone_number: field.phoneNumber })
    .transform((v) => transformRecord(v, "camel")),
  login: z
    .object({ pin: field.pin, phone_number: field.phoneNumber })
    .transform((v) => transformRecord(v, "camel")),
  forgotPassword: z
    .object({ phone_number: field.phoneNumber })
    .transform((v) => transformRecord(v, "camel")),
  changePassword: z
    .object({ new_pin: field.newPin, old_pin: field.oldPin })
    .transform((v) => transformRecord(v, "camel")),
  resetPassword: z.object({ key: field.key, pin: field.pin }),
  verifyOtp: z.object({ key: field.key, code: field.otpCode }),
  resendOtp: z.object({ key: field.key }),
};
