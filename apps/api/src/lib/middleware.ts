import type { Optional } from "@repo/common/types";
import type { Context } from "hono";
import type { SafeParseReturnType } from "zod";

export function zodValidatorMiddleware<T, U>(
  output: Optional<SafeParseReturnType<T, U>, "error">,
  c: Context,
) {
  if (!output.success) {
    return c.json(
      {
        success: false,
        message: output?.error?.issues?.[0]?.message ?? null,
        result: null,
      },
      { status: 400 },
    );
  }
}
