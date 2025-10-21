import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: [
      "./src/index.ts",
      "./src/env/index.ts",
      "./src/hooks/index.ts",
      "./src/interceptors/index.ts",
      "./src/tools/index.ts",
    ],
    platform: "neutral",
    dts: true,
    unbundle: true,
    external: ["vue", "@dcloudio/uni-app"],
    // 确保因条件编译写的代码不会被 treeshake 移除
    treeshake: false,
    minify: false,
  },
]);
