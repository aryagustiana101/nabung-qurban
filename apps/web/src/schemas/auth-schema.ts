import { __ } from "@repo/common/lib/validation";
import { z } from "zod";

export const routerSchema = {
  login: z.object({
    username: z
      .string({ message: __("required", { attribute: "username" }) })
      .min(1, { message: __("required", { attribute: "username" }) })
      .trim(),
    password: z
      .string({ message: __("required", { attribute: "password" }) })
      .min(1, { message: __("required", { attribute: "password" }) })
      .trim(),
  }),
};

export const formSchema = {
  login: z.object({
    username: z
      .string({ message: __("required", { attribute: "username" }) })
      .min(1, { message: __("required", { attribute: "username" }) })
      .trim(),
    password: z
      .string({ message: __("required", { attribute: "password" }) })
      .min(1, { message: __("required", { attribute: "password" }) })
      .trim(),
  }),
};

export type FormSchema = {
  [K in keyof typeof formSchema]: z.infer<(typeof formSchema)[K]>;
};
