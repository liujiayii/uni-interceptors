import type { AuthType } from "./_constant";
import { authTips } from "./_constant";

const platform = uni.getSystemInfoSync().platform;

const isIos = platform === "ios";

/**
 * 授权前告知用户使用意图
 * @param authorize
 * @returns boolean
 */
export async function showAuthTip(authorize: AuthType): Promise<boolean> {
  // iOS平台处理
  if (isIos) {
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

  // 安卓端权限检查和处理
  const compat: any = plus.android.importClass("androidx.core.content.ContextCompat");
  const context = plus.android.runtimeMainActivity();
  const result = compat.checkSelfPermission(context, authorize);

  // 如果已经授权直接返回
  if (result === 0)
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
  // iOS平台处理
  if (isIos) {
    return new Promise((resolve) => {
      uni.showModal({
        title: "提示",
        content: authTips[authorize].failTips,
        confirmText: "去设置",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            // iOS打开应用设置
            plus.runtime.openURL("app-settings:");
            resolve(true);
          } else {
            resolve(false);
          }
        },
        fail: () => {
          resolve(false);
        },
      });
    });
  }

  // 安卓端权限检查
  const compat: any = plus.android.importClass("androidx.core.content.ContextCompat");
  const context = plus.android.runtimeMainActivity();
  const result = compat.checkSelfPermission(context, authorize);

  // 如果已经授权直接返回
  if (result === 0)
    return Promise.resolve(true);

  return new Promise((resolve) => {
    uni.showModal({
      title: "提示",
      content: authTips[authorize].failTips,
      confirmText: "去设置",
      cancelText: "取消",
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
