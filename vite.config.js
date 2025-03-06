
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "d6ed0173-979f-401f-85f4-826a574c4619-00-2btepdzlwfgjs.pike.replit.dev"
    ],
  },
});
