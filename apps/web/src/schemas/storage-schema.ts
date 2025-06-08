import { FIELD } from "@repo/common";
import { z } from "zod";

export const routerSchema = {
  getPresignedUrl: z.object({
    file: FIELD.TEXT("file"),
    expires: FIELD.NUMBER("expires").optional().default(3600),
  }),
};
