# getSafeAreaTop

`getSafeAreaTop` 返回自定义导航栏所需的顶部安全高度，单位 px。

## 功能描述

小程序端以右上角胶囊按钮的底部位置为准（`胶囊 top + 胶囊高度`），得到的高度正好让自定义导航栏内容与胶囊垂直居中对齐。

H5 / App 没有胶囊按钮，`uni.getMenuButtonBoundingClientRect` 在这些端**不存在**，
直接调用会抛错，因此退化为「状态栏高度 + 导航栏高度」。

## 函数签名

```typescript
function getSafeAreaTop(options?: GetSafeAreaTopOptions): number;
```

### GetSafeAreaTopOptions

| 参数                | 类型   | 必填 | 默认值 | 说明                                   |
| ------------------- | ------ | ---- | ------ | -------------------------------------- |
| navigationBarHeight | number | 否   | 44     | 非小程序端退化时使用的导航栏高度（px） |

### 返回值

顶部安全高度，单位 px。

## 使用方法

```vue
<script setup lang="ts">
import { getSafeAreaTop } from "uni-toolkit/tools";

const safeAreaTop = getSafeAreaTop();
</script>

<template>
  <view :style="{ paddingTop: `${safeAreaTop}px` }">
    <text>自定义导航栏</text>
  </view>
</template>
```

导航栏高度与设计稿不一致时：

```typescript
const safeAreaTop = getSafeAreaTop({ navigationBarHeight: 48 });
```

## 实现要点

条件编译对 TypeScript 只是普通注释，**两个分支各写一个 `return` 会被 ESLint 判成 unreachable code**。
因此这里用 `if` 守卫后自然下落到兜底分支：

```typescript
// #ifdef MP
const button = uni.getMenuButtonBoundingClientRect();
if (button && button.height > 0) {
  return button.top + button.height;
}
// #endif

const { safeAreaInsets, statusBarHeight } = uni.getSystemInfoSync();
return (safeAreaInsets?.top ?? statusBarHeight ?? 0) + navigationBarHeight;
```

这样还额外覆盖了「小程序端隐藏原生导航时拿不到胶囊信息」的情况。
