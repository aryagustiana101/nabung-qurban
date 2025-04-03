import { z } from "zod";

export const routerSchema = {
  getPresignedUrl: z.object({
    file: z
      .string({ message: "File is required" })
      .min(1, { message: "File is required" }),
    expires: z
      .string()
      .optional()
      .refine(
        (v) => (v ? z.number().int().safeParse(Number(v)).success : true),
        { path: ["expires"], message: "Expires must be a number" },
      )
      .transform((v) => z.number().int().safeParse(Number(v)).data ?? 3600),
  }),
};
