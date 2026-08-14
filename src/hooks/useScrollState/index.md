# useScrollState

`useScrollState` 提供跨组件共享的页面滚动状态，用于「滚动时隐藏、停下后恢复」这类交互。

## 功能描述

页面在 `onPageScroll` 中调用 `triggerScroll`，任意组件通过 `useScrollState()` 读取 `isScrolling`。

用模块级共享 ref 取代 `uni.$emit` / `uni.$on` 事件总线：

1. 无监听者时更新 ref 零开销（Vue 响应式系统自动跳过无依赖的更新）
2. 不存在事件泄漏，无需手动 `uni.$off`
3. 页面只需注册一个函数，组件侧完全被动

## 函数签名

```typescript
function useScrollState(): { isScrolling: Ref<boolean> };

const triggerScroll: () => void;
const scrollHandler: () => void; // triggerScroll 的别名

function createScrollState(options?: ScrollStateOptions): ScrollState;
```

### ScrollStateOptions

| 参数        | 类型   | 必填 | 默认值 | 说明                                 |
| ----------- | ------ | ---- | ------ | ------------------------------------ |
| throttleMs  | number | 否   | 100    | 触发节流间隔（毫秒）                 |
| resumeDelay | number | 否   | 800    | 停止滚动后恢复为未滚动的延迟（毫秒） |

## 使用方法

页面侧注册：

```vue
<script setup lang="ts">
import { triggerScroll } from "uni-toolkit/hooks";

onPageScroll(triggerScroll);
</script>
```

组件侧读取：

```vue
<script setup lang="ts">
import { useScrollState } from "uni-toolkit/hooks";

const { isScrolling } = useScrollState();
</script>

<template>
  <view :style="{ opacity: isScrolling ? 0 : 1 }">
    悬浮按钮
  </view>
</template>
```

需要独立状态或自定义时序时用工厂：

```typescript
import { createScrollState } from "uni-toolkit/hooks";

const { isScrolling, scrollHandler } = createScrollState({
  throttleMs: 50,
  resumeDelay: 1500,
});
```

## 注意事项

### 不要在外层再包一层防抖

限流已经在内部做了一层节流。若在外面再套一层 leading 防抖：

```typescript
// ❌ 错误：持续滚动时只在起始触发一次
const handler = debounce(triggerScroll, 100, { edges: ["leading"] });
```

leading 防抖只在滚动起始触发一次，之后 `triggerScroll` 不再被调用，
`resumeDelay` 计时器得不到刷新，`isScrolling` 会在用户还在滚动时提前回落，
表现为「悬浮元素滚动中途自己弹回来」。

### 默认实例是全局单例

`triggerScroll` / `scrollHandler` / `useScrollState` 共用同一份状态。
多个页面注册同一个 `triggerScroll` 是预期用法；需要互不干扰时改用 `createScrollState`。
