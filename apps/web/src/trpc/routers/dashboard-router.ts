import { parseDate } from "~/lib/utils";
import { createTRPCRouter, protectedProcedure } from "~/trpc/init";

export const dashboardRouter = createTRPCRouter({
  greeting: protectedProcedure.query(async ({ ctx: { session } }) => {
    const user = session.user;
    const hour = parseDate(new Date()).getHours();

    const greeting =
      Object.entries({
        morning: hour >= 5 && hour < 11,
        afternoon: hour >= 11 && hour < 15,
        evening: hour >= 15 && hour < 18,
        night: hour >= 18 || hour < 5,
      }).find(([_, value]) => value)?.[0] ?? "day";

    return {
      success: true,
      message: null,
      result: { greeting: `Good ${greeting}, ${user.name}` },
    };
  }),
});
