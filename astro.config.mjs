import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [react()],
  compatibilityDate: "2024-04-03",
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
