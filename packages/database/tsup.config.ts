import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  dts: true,
  clean: true,
  minify: true,
  bundle: true,
  outDir: "./dist",
  format: ["cjs", "esm"],
  noExternal: ["@repo/common"],
  entryPoints: ["src/index.ts"],
  ...options,
}));
