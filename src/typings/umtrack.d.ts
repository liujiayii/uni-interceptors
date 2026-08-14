/**
 * 各端友盟埋点 SDK 模块类型兜底
 * ⚠️ 必须是无 top-level export 的独立脚本：
 * 本文件若与 index.d.ts 合并（后者有 `export type MiniProgramPlatform`），
 * 会变成模块上下文，`declare module "umtrack-*"` 便无法覆盖真实 npm 包（TS7016）。
 */
declare module "umtrack-alipay" {
  /** 友盟小程序 SDK 暂无官方类型，按运行时插件对象透传 */
  const uma: any;
  export default uma;
}

declare module "umtrack-kuaishou" {
  /** 友盟小程序 SDK 暂无官方类型，按运行时插件对象透传 */
  const uma: any;
  export default uma;
}

declare module "umtrack-tt" {
  /** 友盟小程序 SDK 暂无官方类型，按运行时插件对象透传 */
  const uma: any;
  export default uma;
}

declare module "umtrack-wx" {
  /** 友盟小程序 SDK 暂无官方类型，按运行时插件对象透传 */
  const uma: any;
  export default uma;
}
