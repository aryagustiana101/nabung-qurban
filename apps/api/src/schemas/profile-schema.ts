import { z } from "zod";

const field = {
  name: z
    .string({ message: "Name is required" })
    .min(1, { message: "Name is required" }),
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Email is not valid" }),
  image: z
    .string({ message: "Image is required" })
    .min(1, { message: "Image is required" }),
};

export const routerSchema = {
  update: z.object({
    name: field.name.optional(),
    email: field.email.nullish().default(null),
    image: field.image.nullish().default(null),
  }),
};
