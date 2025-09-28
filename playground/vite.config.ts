import uni from "@dcloudio/vite-plugin-uni";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni(), UnoCSS({})],
});
