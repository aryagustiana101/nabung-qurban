import { FIELD } from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  update: z.object({
    name: FIELD.TEXT("name").optional(),
    email: FIELD.TEXT_EMAIL("email").nullish().default(null),
    image: FIELD.TEXT_URL("image").nullish().default(null),
  }),
};
