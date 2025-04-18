import build from "@hono/vite-build/node";
import devServer from "@hono/vite-dev-server";
import { tsImport } from "tsx/esm/api";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import type { env } from "~/env";

const module = (await tsImport("~/env", import.meta.url)) as {
  env: typeof env;
};

export default defineConfig(({ command }) => {
  return {
    server: { port: module.env.PORT },
    publicDir: command === "build" ? false : "static",
    plugins: [tsconfigPaths(), build({ port: module.env.PORT }), devServer()],
    resolve: {
      noExternal: ["@repo/common", "@repo/database"],
    },
  };
});
