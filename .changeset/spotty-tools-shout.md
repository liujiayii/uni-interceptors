---
"uni-toolkit": minor
---

新增 `./types` 导出入口，将全局类型声明拆分为 uni/platform/window/umtrack 多文件；消费端可在 tsconfig 的 `"types"` 数组加 `"uni-toolkit/types"` 引入 uni 平台 / 各端 JS-SDK / H5 window 的全部全局补充声明。构建脚本同步复制 `src/typings` 到 `dist/types`。