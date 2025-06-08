import { FIELD } from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  login: z.object({
    username: FIELD.TEXT("username"),
    password: FIELD.TEXT("password"),
  }),
};

export const formSchema = {
  login: z.object({
    username: FIELD.TEXT("username"),
    password: FIELD.TEXT("password"),
  }),
};

export type FormSchema = {
  [K in keyof typeof formSchema]: z.infer<(typeof formSchema)[K]>;
};
