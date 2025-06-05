import { parseDate } from "~/lib/utils";
import { createTRPCRouter, protectedProcedure } from "~/trpc/init";

export const dashboardRouter = createTRPCRouter({
  greeting: protectedProcedure.query(async ({ ctx: { session } }) => {
    const user = session.user;
    const hour = parseDate(new Date()).getHours();

    const greeting =
      Object.entries({
        morning: hour >= 5 && hour < 12,
        afternoon: hour >= 12 && hour < 16,
        evening: hour >= 16 || hour < 5,
      }).find(([_, value]) => value)?.[0] ?? "day";

    return {
      success: true,
      message: null,
      result: { greeting: `Good ${greeting}, ${user.name}` },
    };
  }),
});
