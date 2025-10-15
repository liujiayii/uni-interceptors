import type { AuthType } from "../authTips";
import { authTips } from "../authTips";
import { checkSelfPermission } from "../checkSelfPermission";

/**
 * 用户拒绝授权提示手动授权
 */
export async function showManualAuth(authorize: AuthType): Promise<boolean> {
  const result = checkSelfPermission(authorize);
  // 如果已经授权直接返回
  if (result)
    return Promise.resolve(true);
  const tip = authTips[authorize];
  if (!tip) {
    console.warn(`[showManualAuth] 未配置 ${authorize} 的提示文案`);
    return false;
  }
  return new Promise((resolve) => {
    uni.showModal({
      title: "重要提醒",
      content: tip.failTips,
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
