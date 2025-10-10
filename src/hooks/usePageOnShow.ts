import { onShow } from "@dcloudio/uni-app";
import { eventBus, getCurrentPageRoute } from "../tools";

export function usePageOnShow(callback?: () => void): { pageId: string } {
  // 获取当前页面的路由路径作为pageId
  const pageId = getCurrentPageRoute();

  console.log("usePageOnShow initialized with pageId:", pageId);

  onShow(() => {
    console.log("Page onShow triggered, emitting events for pageId:", pageId);
    // 触发页面级别的onShow事件
    eventBus.emit("page:onShow", { pageId });

    // 触发全局onShow事件（用于不关心特定页面的组件）
    eventBus.emit("global:onShow");

    // 如果提供了回调函数，则执行
    if (callback) {
      callback();
    }
  });

  return {
    pageId,
  };
}
