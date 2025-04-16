import {
  USER_APPLICATION_JACKET_PAYMENT_METHODS,
  USER_APPLICATION_JACKET_PICKUP_METHODS,
  USER_APPLICATION_LEVELS,
  USER_APPLICATION_STATUSES,
  USER_APPLICATION_TYPES,
} from "@repo/common";
import { z } from "zod";
import { transformRecord } from "~/lib/utils";

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
          .filter((v) => z.enum(USER_APPLICATION_TYPES).safeParse(v).success)
          .map((v) => z.enum(USER_APPLICATION_TYPES).parse(v)),
      )
      .nullish(),
    levels: z
      .string()
      .transform((value) => value.split(","))
      .transform((value) =>
        value
          .filter((v) => z.enum(USER_APPLICATION_LEVELS).safeParse(v).success)
          .map((v) => z.enum(USER_APPLICATION_LEVELS).parse(v)),
      )
      .nullish(),
    statuses: z
      .string()
      .transform((value) => value.split(","))
      .transform((value) =>
        value
          .filter((v) => z.enum(USER_APPLICATION_STATUSES).safeParse(v).success)
          .map((v) => z.enum(USER_APPLICATION_STATUSES).parse(v)),
      )
      .nullish(),
  }),
  getSingle: z.object({
    code: z
      .string({ message: "Code is required" })
      .min(1, { message: "Code is required" }),
  }),
  create: z
    .object({
      type: z.enum(USER_APPLICATION_TYPES, { message: "Type is required" }),
      level: z.enum(USER_APPLICATION_LEVELS, { message: "Level is required" }),
      individual: z
        .object({
          name: z
            .string({ required_error: "Individual name is required" })
            .min(1, { message: "Individual name is required" }),
          phone_number: z
            .string({ message: "Individual phone number is required" })
            .min(1, { message: "Individual phone number is required" })
            .max(15, { message: "Individual phone number max is 15" })
            .transform((value) =>
              (value.startsWith("08") ? value.replace("08", "628") : value)
                .replaceAll(" ", "")
                .replaceAll("+", "")
                .replace(/\D/g, ""),
            )
            .refine(
              (value) =>
                value ? ["62", "08"].includes(value.slice(0, 2)) : true,
              { message: "Individual phone number locale must be Indonesia" },
            ),
          email: z
            .string({ message: "Individual email is required" })
            .email({ message: "Individual email is not valid" }),
          address: z
            .string({ message: "Individual address is required" })
            .min(1, { message: "Individual address is required" }),
          identity_card_image: z
            .string({ message: "Individual identity card image is required" })
            .url({ message: "Individual identity card image is not valid" }),
          selfie_image: z
            .string({ message: "Individual selfie image is required" })
            .url({ message: "Individual selfie image is not valid" }),
        })
        .nullish(),
      institution: z
        .object({
          name: z
            .string({ message: "Institution name is required" })
            .min(1, { message: "Institution name is required" }),
          pic_name: z
            .string({ message: "Institution PIC name is required" })
            .min(1, { message: "Institution PIC name is required" }),
          phone_number: z
            .string({ message: "Individual phone number is required" })
            .min(1, { message: "Institution phone number is required" })
            .max(15, { message: "Institution phone number max is 15" })
            .transform((value) =>
              (value.startsWith("08") ? value.replace("08", "628") : value)
                .replaceAll(" ", "")
                .replaceAll("+", "")
                .replace(/\D/g, ""),
            )
            .refine(
              (value) =>
                value ? ["62", "08"].includes(value.slice(0, 2)) : true,
              { message: "Institution phone number locale must be Indonesia" },
            ),
          email: z.string({ message: "Institution email is required" }).email({
            message: "Institution email is not valid",
          }),
          address: z
            .string({ message: "Institution address is required" })
            .min(1, { message: "Institution address is required" }),

          deed_establishment: z
            .string({ message: "Institution Deed establishment is required" })
            .min(1, { message: "Institution Deed establishment is required" }),
          office_image: z
            .string({ message: "Institution Office image is required" })
            .url({ message: "Institution Office image is not valid" }),
        })
        .nullish(),
      bank: z
        .object({
          name: z
            .string({ message: "Bank name is required" })
            .min(1, { message: "Bank name is required" }),
          account_number: z
            .string({ message: "Bank account number is required" })
            .min(1, { message: "Bank account number is required" }),
        })
        .nullish(),
      jacket: z.object(
        {
          size: z
            .string({ message: "Jacket size is required" })
            .min(1, { message: "Jacket size is required" }),
          pickup_method: z.enum(USER_APPLICATION_JACKET_PICKUP_METHODS, {
            message: "Jacket pickup method is required",
          }),
          payment_method: z.enum(USER_APPLICATION_JACKET_PAYMENT_METHODS, {
            message: "Jacket payment method is required",
          }),
        },
        { message: "Jacket is required" },
      ),
      vehicle: z
        .object({
          plate_number: z
            .string({ message: "Vehicle plate number is required" })
            .min(1),
          fleet_type: z
            .string({ message: "Vehicle fleet type is required" })
            .min(1),
          carrying_weight: z.number({
            message: "Vehicle carrying weight is required",
          }),
          registration_image: z
            .string({
              message: "Vehicle registration image is required",
            })
            .url({ message: "Vehicle registration image is not valid" }),
        })
        .nullish(),
    })
    .transform((v) => transformRecord(v, "camel")),
};
