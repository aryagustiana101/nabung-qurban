import { z } from "zod";
import { transformRecord } from "~/lib/utils";

const field = {
  key: z
    .string({ message: "Key is required" })
    .min(1, { message: "Key is required" }),
  otpCode: z
    .string({ message: "Code is required" })
    .length(6, { message: "Code length must be 6" })
    .refine((v) => z.number().safeParse(Number(v)).success, {
      message: "Code must be a number",
    }),
  pin: z
    .string({ message: "PIN is required" })
    .length(6, { message: "PIN length must be 6" })
    .refine((v) => z.number().safeParse(Number(v)).success, {
      message: "PIN must be a number",
    }),
  phoneNumber: z
    .string({ message: "Phone number is required" })
    .min(1, { message: "Phone number is required" })
    .max(15, { message: "Phone number max is 15" })
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
    .string({ message: "New PIN is required" })
    .length(6, { message: "New PIN length must be 6" })
    .refine((v) => z.number().safeParse(Number(v)).success, {
      message: "New PIN must be a number",
    }),
  oldPin: z
    .string({ message: "New PIN is required" })
    .length(6, { message: "New PIN length must be 6" })
    .refine((v) => z.number().safeParse(Number(v)).success, {
      message: "New PIN must be a number",
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
