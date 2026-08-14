/* eslint-disable ts/consistent-type-definitions */

/**
 * H5 window 增强
 * - uni：小程序/App webview 注入的 uni 桥，H5 端亦可访问
 * （友盟 H5 埋点的 globalThis.aplus_queue 属项目私有，由各消费端自行声明）
 */
interface Window {
  /** H5 webview 注入的 uni 桥 */
  uni?: typeof uni;
}
