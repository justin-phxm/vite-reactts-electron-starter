import path from "node:path";
import react from "@vitejs/plugin-react";
import { UserConfig, ConfigEnv, defineConfig } from "vite";
import { rmSync } from "node:fs";
import { join } from "path";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import pkg from "./package.json";
const root = join(__dirname);
const srcRoot = path.resolve(__dirname, "src");
rmSync("dist-electron", { recursive: true, force: true });

const buildElectron = (isDev: boolean) => ({
  sourcemap: isDev,
  minify: !isDev,
  outDir: join(root, "dist-electron"),
  rollupOptions: {
    external: Object.keys(pkg.dependencies || {}),
  },
});

function plugins(isDev: boolean) {
  return [
    react(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: join(root, "electron/index.ts"),
        onstart(options) {
          options.startup();
        },
        vite: {
          build: buildElectron(isDev),
        },
      },
      {
        entry: join(root, "electron/preload.ts"),
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload();
        },
        vite: {
          build: buildElectron(isDev),
        },
      },
    ]),
    renderer(),
  ];
}
const config = defineConfig({
  root: srcRoot,
  resolve: {
    alias: {
      "@": srcRoot,
    },
  },
  build: {
    outDir: join(root, "/dist-vite"),
    emptyOutDir: true,
    rollupOptions: {},
  },
  server: {
    port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
  },
  optimizeDeps: {
    exclude: ["path"],
  },
});
export default ({ command }: ConfigEnv): UserConfig => {
  // DEV
  if (command === "serve") {
    return {
      ...config,
      base: "/",
      plugins: plugins(true),
    };
  }
  // PROD
  return {
    ...config,
    base: "./",
    plugins: plugins(false),
  };
};
