import { onUnmounted } from "vue";
import { eventBus, getCurrentPageRoute } from "../tools";

export type UseOnShowOptions = {
  /**
   * 是否只响应当前页面的onShow事件
   * @default true
   */
  pageOnly?: boolean;

  /**
   * 是否在组件挂载后立即执行一次
   * @default false
   */
  immediate?: boolean;

  /**
   * 是否在组件挂载后触发最近的历史事件（如果有）
   * 这可以解决父组件onShow时子组件还未注册的问题
   * @default true
   */
  triggerHistory?: boolean;

  /**
   * 事件处理函数的执行上下文
   */
  context?: any;
};

export function useOnShow(
  hook: () => void,
  options: UseOnShowOptions = {},
): { trigger: () => void } {
  const {
    pageOnly = true,
    immediate = false,
    triggerHistory = true,
    context,
  } = options;

  // 获取当前页面的路由路径作为pageId
  const pageId = getCurrentPageRoute();

  console.log("useOnShow initialized with pageId:", pageId, "options:", options);

  // 包装原始钩子函数，绑定上下文
  const wrappedHook = context ? hook.bind(context) : hook;

  // 事件处理函数
  const handlePageOnShow = (eventData: { pageId: string }): void => {
    console.log("handlePageOnShow called with eventData:", eventData, "component pageId:", pageId, "pageOnly:", pageOnly);
    if (!pageOnly || eventData.pageId === pageId) {
      console.log("Executing useOnShow hook for component with pageId:", pageId);
      wrappedHook();
    }
  };

  // 直接绑定事件监听
  console.log("Registering event listener for page:onShow with triggerHistory:", triggerHistory);
  eventBus.on("page:onShow", handlePageOnShow, triggerHistory);

  // 如果immediate为true，立即执行一次
  if (immediate) {
    console.log("Executing useOnShow hook immediately due to immediate option");
    wrappedHook();
  }

  // 组件卸载时移除监听
  onUnmounted(() => {
    console.log("Removing event listener for useOnShow component with pageId:", pageId);
    eventBus.off("page:onShow", handlePageOnShow);
  });

  return {
    // 提供手动触发的方法
    trigger: wrappedHook,
  };
}
