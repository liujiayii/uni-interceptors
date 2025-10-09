import type { Ref } from "vue";
import { onReady, onResize } from "@dcloudio/uni-app";
import { ref } from "vue";

/**
 * 获取窗口尺寸信息(包含rpx转换比率)
 * @returns Ref对象,包含窗口宽度、高度和rpx转换比率
 */
export function useWindowSize(): Ref<{ width: number; height: number; rate: number }> {
  const result = ref({
    width: 750,
    height: 1334,
    rate: 2,
  });
  function update(): void {
    const res = uni.getSystemInfoSync();
    const rate = 750 / res.windowWidth;
    result.value = {
      width: 750,
      height: Math.ceil(res.windowHeight * rate),
      rate,
    };
    console.log("useWindowSize", result.value);
  }
  onReady(() => {
    update();
  });
  onResize(() => {
    update();
  });
  return result;
}
