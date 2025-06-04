import { __ } from "@repo/common/lib/validation";
import { z } from "zod";

export const routerSchema = {
  getPresignedUrl: z.object({
    file: z
      .string({ message: __("required", { attribute: "file" }) })
      .min(1, { message: __("required", { attribute: "file" }) }),
    expires: z
      .string()
      .optional()
      .refine(
        (v) => (v ? z.number().int().safeParse(Number(v)).success : true),
        { path: ["expires"], message: __("numeric", { attribute: "expires" }) },
      )
      .transform((v) => z.number().int().safeParse(Number(v)).data ?? 3600),
  }),
};
