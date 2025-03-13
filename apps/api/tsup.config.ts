import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  clean: true,
  minify: true,
  bundle: true,
  format: ["esm"],
  splitting: false,
  sourcemap: false,
  outDir: "./dist",
  noExternal: ["@repo/common"],
  entryPoints: ["src/index.ts"],
  ...options,
}));
