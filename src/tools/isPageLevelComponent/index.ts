import type { ComponentInternalInstance } from "vue";
import { getCurrentInstance } from "vue";

/**
 * 判断当前组件是否是页面级别，在APP环境不确定是否正常，慎用！！！
 * @returns 是否是页面级别
 */
export function isPageLevelComponent(): boolean {
  try {
    // 获取当前组件实例
    const instance = getCurrentInstance();
    if (!instance) {
      return false;
    }

    const isPage = (instance as ComponentInternalInstance & { renderer: string }).renderer === "page";

    if (isPage) {
      return true;
    }

    return false;
  } catch (error) {
    console.warn("Error determining if component is page level:", error);
    return false;
  }
}
