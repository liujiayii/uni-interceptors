import type { Ref } from "vue";
import { onReady, onResize } from "@dcloudio/uni-app";
import { ref } from "vue";

/**
 * 获取设计尺寸信息(包含rpx转换比率，750 设计宽度下的归一化尺寸与比例)
 * @returns Ref对象,包含设计宽度、高度和rpx转换比率
 */
export function useDesignSize(): Ref<{ width: number; height: number; rate: number }> {
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
    console.log("useDesignSize", result.value);
  }
  onReady(() => {
    update();
  });
  onResize(() => {
    update();
  });
  return result;
}
