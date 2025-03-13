import { z } from "zod";

export const literalSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

export type Json =
  | z.infer<typeof literalSchema>
  | { [key: string]: Json }
  | Json[];

export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);
