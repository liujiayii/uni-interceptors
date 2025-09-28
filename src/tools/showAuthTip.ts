import type { AuthType } from "./authTips";
import { authTips } from "./authTips";
import { checkSelfPermission } from "./checkSelfPermission";

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
