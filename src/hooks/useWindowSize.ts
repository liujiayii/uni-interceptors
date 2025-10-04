import type { Ref } from "vue";
import { onReady, onResize } from "@dcloudio/uni-app";
import { ref } from "vue";

/**
 * 获取窗口rpx单位尺寸
 * @returns {number} 窗口高度
 */
export function useWindowSize(): Ref<{ width: number; height: number; rate: number }> {
  const result = ref({
    width: 0,
    height: 0,
    rate: 0,
  });
  function update(): void {
    const res = uni.getSystemInfoSync();
    result.value = {
      width: res.windowWidth,
      height: res.windowHeight,
      rate: 750 / res.windowWidth,
    };
  }
  onReady(() => {
    update();
  });
  onResize(() => {
    update();
  });
  return result;
}
