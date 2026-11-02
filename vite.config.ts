import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // honour the port assigned by the preview harness (autoPort → PORT env),
    // falling back to 5180 for a plain `npm run dev`.
    port: process.env.PORT ? Number(process.env.PORT) : 5180,
  },
});
