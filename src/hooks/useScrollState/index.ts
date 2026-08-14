import type { Ref } from "vue";
import { throttle } from "es-toolkit";
import { ref } from "vue";

/** 滚动状态配置 */
export type ScrollStateOptions = {
  /**
   * 触发节流间隔（毫秒）
   * @default 100
   */
  throttleMs?: number;

  /**
   * 停止滚动后恢复为「未滚动」的延迟（毫秒）
   * @default 800
   */
  resumeDelay?: number;
};

/** 一份独立的滚动状态 */
export type ScrollState = {
  /** 当前是否正在滚动 */
  isScrolling: Ref<boolean>;
  /** 供 onPageScroll 直接注册的处理函数，已内置节流 */
  scrollHandler: () => void;
};

/**
 * 创建一份独立的页面滚动状态
 *
 * 用模块级共享 ref 取代 uni.$emit / uni.$on 事件总线：
 * 无监听者时更新 ref 零开销，也不存在事件泄漏、无需手动 off。
 * @param options 配置项
 */
export function createScrollState(options: ScrollStateOptions = {}): ScrollState {
  const { throttleMs = 100, resumeDelay = 800 } = options;

  const isScrolling = ref(false);
  let resumeTimer: ReturnType<typeof setTimeout> | null = null;

  // 限流只做这一层。持续滚动期间必须不断重置恢复计时器，
  // 若在外层再套一层 leading 防抖，滚动中途计时器得不到刷新，状态会提前回落。
  const scrollHandler = throttle(() => {
    isScrolling.value = true;

    if (resumeTimer) {
      clearTimeout(resumeTimer);
    }
    resumeTimer = setTimeout(() => {
      isScrolling.value = false;
    }, resumeDelay);
  }, throttleMs, { edges: ["leading"] });

  return { isScrolling, scrollHandler };
}

// 默认共享实例：页面注册 scrollHandler，组件通过 useScrollState 读状态
const defaultScrollState = createScrollState();

/**
 * 触发滚动状态更新，供页面 onPageScroll 调用，已内置节流
 * @example onPageScroll(triggerScroll)
 */
export const triggerScroll = defaultScrollState.scrollHandler;

/** triggerScroll 的别名，语义上更贴近 onPageScroll 的入参 */
export const scrollHandler = triggerScroll;

/**
 * 读取共享的滚动状态
 * @returns isScrolling 当前是否正在滚动
 */
export function useScrollState(): { isScrolling: Ref<boolean> } {
  return { isScrolling: defaultScrollState.isScrolling };
}
