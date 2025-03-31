import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // ブラウザを自動で開く
    // port: 3000, // ポート番号を指定する場合 (省略可能)
  },
});
