import type { AuthType } from "./authTips";
import { isApp, isAppIos } from "../env";

/**
 * 检查权限
 * @param authorize
 * @returns boolean
 */
export function checkSelfPermission(authorize: AuthType): boolean {
  // 非 App 端：不触发 plus，视为无需本地权限
  if (!isApp) {
    return true;
  }
  // iOS 平台处理
  if (isAppIos) {
    return true;
  }

  // 安卓端权限检查和处理
  const compat: any = plus.android.importClass("androidx.core.content.ContextCompat");
  const context = plus.android.runtimeMainActivity();
  const result = compat.checkSelfPermission(context, authorize);
  console.log(`权限检查结果:${result}`);
  return result === 0;
}
