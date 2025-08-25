import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
import fs from "node:fs/promises";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    {
      name: "dev-save-json",
      apply: "serve",
      configureServer(server) {
        const root = server.config.root || process.cwd();
        server.middlewares.use("/__dev/save-json", async (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end("Method Not Allowed");
            return;
          }
          let body = "";
          req.on("data", (c) => (body += c));
          req.on("end", async () => {
            try {
              const { path, text } = JSON.parse(body || "{}");
              if (typeof path !== "string" || typeof text !== "string") {
                res.statusCode = 400;
                res.end("Invalid payload");
                return;
              }
              const rel = path.replace(/^\/+/, "");
              const abs = resolve(root, rel);
              const allowedRoot = resolve(root, "src", "test-data");
              if (!abs.startsWith(allowedRoot)) {
                res.statusCode = 403;
                res.end("Forbidden");
                return;
              }
              await fs.writeFile(abs, text, "utf8");
              res.setHeader("content-type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e) {
              res.statusCode = 500;
              res.end("Error");
            }
          });
        });
      },
    },
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      // prevent reload loops when writing test-data
      ignored: ["**/src/test-data/**"],
    },
  },
});
