import { randomString } from "@repo/common";
import { routerSchema } from "~/schemas/storage-schema";
import { getPublicUrl, getUploadPresignedUrl } from "~/server/storage";
import { createTRPCRouter, publicProcedure } from "~/trpc/init";

export const storageRouter = createTRPCRouter({
  getPresignedUrl: publicProcedure
    .input(routerSchema.getPresignedUrl)
    .query(async ({ input }) => {
      const file = `upload/${randomString()}.${input.file.match(/\.(\w+)$/)?.[1] ?? "png"}`;

      return {
        success: true,
        message: null,
        result: {
          public: getPublicUrl(file),
          upload: await getUploadPresignedUrl(file, { expires: input.expires }),
        },
      };
    }),
});
