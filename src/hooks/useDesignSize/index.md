# useDesignSize

获取设计尺寸信息(包含rpx转换比率，750 设计宽度下的归一化尺寸与比例)，方便响应式布局。

## 平台支持

全平台

## 参数

无参数

## 返回值

`Ref<{ width: number, height: number, rate: number }>` - 设计尺寸信息的响应式引用对象，包含以下属性：

- `width`: 屏幕宽度（固定为750，基于设计宽度）
- `height`: 屏幕高度（根据实际屏幕高度和比例计算）
- `rate`: rpx转换比率（750 / 实际屏幕宽度）

## 使用示例

```typescript
import { useDesignSize } from "uni-toolkit";
import { computed } from "vue";

// 在组件中使用
export default {
  setup() {
    // 获取设计尺寸
    const designSize = useDesignSize();

    // 实际应用示例 - 计算元素尺寸
    const elementWidth = computed(() => {
      return designSize.value.width / 2; // 元素宽度为屏幕宽度的一半
    });

    // 实际应用示例 - 使用rpx转换
    const pxValue = computed(() => {
      return 100 * designSize.value.rate; // 将100rpx转换为px
    });

    return {
      designSize,
      elementWidth,
      pxValue
    };
  }
};
```

## 特性

- 基于750设计宽度提供归一化尺寸信息
- 自动响应窗口尺寸变化
- 返回响应式引用对象，尺寸变化时自动更新
- 提供rpx转换比率，便于不同设备间的尺寸转换
- 使用Vue的响应式系统，确保UI随尺寸变化自动更新
