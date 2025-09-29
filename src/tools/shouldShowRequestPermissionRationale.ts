import type { AuthType } from "./authTips";
import { isApp, isAppIOS } from "@uni-helper/uni-env";

/**
 * 是否需要显示请求权限提示
 * @param authorize
 * @returns boolean
 */
export function shouldShowRequestPermissionRationale(authorize: AuthType): boolean {
  // 非 App 端：不触发 plus，视为无需本地权限
  if (!isApp) {
    return false;
  }
  // iOS 平台处理
  if (isAppIOS) {
    return false;
  }

  const activity = plus.android.runtimeMainActivity();
  const rationale: any = plus.android.importClass("androidx.core.app.ActivityCompat");
  return rationale.shouldShowRequestPermissionRationale(activity, authorize);
}
