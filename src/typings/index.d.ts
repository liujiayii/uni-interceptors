/// <reference types="@dcloudio/types" />
/// <reference path="./uni.d.ts" />
/// <reference path="./platform.d.ts" />
/// <reference path="./window.d.ts" />
/// <reference path="./umtrack.d.ts" />

/**
 * 全局类型声明聚合入口
 * - 依赖 uni-toolkit 的消费端，在 tsconfig 的 "types" 数组加 "uni-toolkit/types"，
 *   即可经此引入 uni 平台 / 各端 JS-SDK / H5 window 的全部全局补充声明。
 * - 声明按类别拆分到同目录各 *.d.ts，本文件仅做 reference 聚合（无内容实现）。
 */
export type { MiniProgramPlatform } from "./uni.d.ts";
