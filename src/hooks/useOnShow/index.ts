import { onShow } from "@dcloudio/uni-app";
import { onUnmounted } from "vue";
import { eventBus, getCurrentPageRoute } from "../../tools";

export type UseOnShowOptions = {
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

  /**
   * 是否指定为页面级别组件
   * 如果未指定，则默认判断为页面级别组件
   * @default true
   */
  isPageLevel?: boolean;
};

/**
 * 统一的onShow钩子函数，可用于页面级别和组件级别
 * @param hook
 * @param options 配置选项
 */
export function useOnShow(
  hook?: () => void,
  options: UseOnShowOptions = {},
): void {
  const {
    immediate = false,
    triggerHistory = true,
    context,
    isPageLevel = true,
  } = options;

  // 获取当前页面的路由路径作为pageId
  const pageId = getCurrentPageRoute();

  // 判断是否是页面级别：优先使用配置项，否则自动判断
  // const isPageLevel = isPageLevelComponent();

  // console.log("useOnShow initialized with pageId:", pageId, "options:", options, "isPageLevel:", isPageLevel);

  if (isPageLevel) {
    // 页面级别的onShow处理
    onShow(() => {
    //  console.log("Page onShow triggered, emitting events for pageId:", pageId);
      // 触发页面级别的onShow事件
      eventBus.emit("page:onShow", { pageId });

      // 触发全局onShow事件（用于不关心特定页面的组件）
      eventBus.emit("global:onShow");

      // 如果提供了回调函数，则执行
      if (hook) {
        const wrappedHook = context ? hook.bind(context) : hook;
        wrappedHook();
      }
    });
  } else {
    // 组件级别的onShow处理
    if (!hook) {
      // console.warn("useOnShow: hook function is required when isPageLevel is false");
      return;
    }

    // 包装原始钩子函数，绑定上下文
    const wrappedHook = context ? hook.bind(context) : hook;

    // 事件处理函数
    let historyTriggeredDuringRegister = false;
    const handlePageOnShow = (eventData: { pageId: string }): void => {
      // console.log("handlePageOnShow called with eventData:", eventData, "component pageId:", pageId);
      if (eventData.pageId === pageId) {
        historyTriggeredDuringRegister = true; // 若为历史回放，将在注册阶段置位
        // console.log("Executing useOnShow hook for component with pageId:", pageId);
        wrappedHook();
      }
    };

    // 直接绑定事件监听
    // console.log("Registering event listener for page:onShow with triggerHistory:", triggerHistory);
    eventBus.on("page:onShow", handlePageOnShow, triggerHistory);

    // 如果immediate为true，且未在历史回放中触发，立即执行一次
    if (immediate && !historyTriggeredDuringRegister) {
    //  console.log("Executing useOnShow hook immediately due to immediate option");
      wrappedHook();
    }

    // 组件卸载时移除监听
    onUnmounted(() => {
      // console.log("Removing event listener for useOnShow component with pageId:", pageId);
      eventBus.off("page:onShow", handlePageOnShow);
    });
  }
}
