import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// 👇 Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // "@": resolve(__dirname, "./src"),
      // "@": resolve(__dirname, "./src/EmployeeManagementSystem/src"),
      "@": resolve(__dirname, "src/EmployeeManagementSystem/src"), // original its working
    },
  },
});
