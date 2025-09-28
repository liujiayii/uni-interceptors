import type { AuthType } from "./_constant";
import { authTips } from "./_constant";
import { isAppIos } from "./env";

/**
 * 是否需要显示请求权限提示
 * @param authorize
 * @returns boolean
 */
export function shouldShowRequestPermissionRationale(authorize: AuthType): boolean {
  // 仅在Android平台需要检查
  if (isAppIos) {
    return false;
  }

  const activity = plus.android.runtimeMainActivity();
  const rationale: any = plus.android.importClass("androidx.core.app.ActivityCompat");
  return rationale.shouldShowRequestPermissionRationale(activity, authorize);
}

/**
 * 检查权限
 * @param authorize
 * @returns boolean
 */
export function checkSelfPermission(authorize: AuthType): boolean {
  // iOS平台处理
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

/**
 * 授权前告知用户使用意图
 * @param authorize
 * @returns boolean
 */
export async function showAuthTip(authorize: AuthType): Promise<boolean> {
  const result = checkSelfPermission(authorize);
  // 如果已经授权直接返回
  if (result)
    return true;

  return new Promise((resolve) => {
    uni.showModal({
      title: authTips[authorize].title,
      content: authTips[authorize].describe,
      success: (res) => {
        resolve(!!res.confirm);
      },
      fail: () => {
        resolve(false);
      },
    });
  });
}

/**
 * 用户拒绝授权提示手动授权
 */
export async function showManualAuth(authorize: AuthType): Promise<boolean> {
  const result = checkSelfPermission(authorize);
  // 如果已经授权直接返回
  if (result)
    return Promise.resolve(true);

  return new Promise((resolve) => {
    uni.showModal({
      title: "重要提醒",
      content: authTips[authorize].failTips,
      confirmText: "去设置",
      cancelText: "暂不开启",
      success: (res) => {
        if (res.confirm) {
          uni.openAppAuthorizeSetting({
            success() {
              // 打开设置成功
            },
            fail() {
              // 打开设置失败
            },
          });
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail() {
        // 显示模态框失败
        resolve(false);
      },
    });
  });
}
