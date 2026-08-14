/** 安全区顶部高度配置 */
export type GetSafeAreaTopOptions = {
  /**
   * 非小程序端退化时使用的导航栏高度（px）
   * @default 44
   */
  navigationBarHeight?: number;
};

/**
 * 获取自定义导航栏所需的顶部安全高度
 *
 * 小程序端以右上角胶囊按钮的底部位置为准；H5 / App 没有胶囊按钮
 * （getMenuButtonBoundingClientRect 不存在，直接调用会报错），
 * 退化为「状态栏高度 + 导航栏高度」。
 * @param options 配置项
 * @returns 顶部安全高度，单位 px
 */
export function getSafeAreaTop(options: GetSafeAreaTopOptions = {}): number {
  const { navigationBarHeight = 44 } = options;

  // #ifdef MP
  const button = uni.getMenuButtonBoundingClientRect();
  // 部分端在隐藏原生导航时可能拿不到胶囊信息，此时继续走下面的兜底
  if (button && button.height > 0) {
    return button.top + button.height;
  }
  // #endif

  const { safeAreaInsets, statusBarHeight } = uni.getSystemInfoSync();
  return (safeAreaInsets?.top ?? statusBarHeight ?? 0) + navigationBarHeight;
}
