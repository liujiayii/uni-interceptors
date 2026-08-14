# useDraggable

`useDraggable` 为悬浮元素提供拖拽能力，含边界约束、边缘吸附、点击与拖拽区分、位置持久化。

## 功能描述

典型场景是可拖动的悬浮客服按钮 / 回到顶部按钮：

1. 手指拖动时实时跟随，并约束在屏幕可视区内
2. 松手后自动吸附到最近的左右边缘
3. 位移小于阈值判定为点击（`isTap`），便于在 `touchend` 中触发业务动作
4. 位置写入本地缓存，下次进入沿用

## 函数签名

```typescript
function useDraggable(options?: UseDraggableOptions): UseDraggableReturn;

function useDragState(): { dragging: ComputedRef<boolean> };
```

### UseDraggableOptions

| 参数          | 类型    | 必填 | 默认值     | 说明                                 |
| ------------- | ------- | ---- | ---------- | ------------------------------------ |
| initialX      | number  | 否   | 贴右边缘   | 初始横坐标（px）                     |
| initialY      | number  | 否   | 距底部偏移 | 初始纵坐标（px）                     |
| elementWidth  | number  | 否   | 0          | 元素宽度（px），吸附计算必需         |
| elementHeight | number  | 否   | 0          | 元素高度（px）                       |
| edgeSnap      | boolean | 否   | true       | 松手后是否吸附到最近的水平边缘       |
| storageKey    | string  | 否   | ""         | 位置持久化的缓存 key，留空则不持久化 |
| threshold     | number  | 否   | 10         | 位移小于该值（px）视为点击           |
| bottomOffset  | number  | 否   | 204        | 默认初始位置距屏幕底部的偏移（rpx）  |

### UseDraggableReturn

| 字段         | 类型                               | 说明                   |
| ------------ | ---------------------------------- | ---------------------- |
| position     | `Ref<{ x: number; y: number }>`    | 当前位置（px）         |
| isDragging   | `Ref<boolean>`                     | 当前实例是否正在拖拽   |
| isTap        | `Ref<boolean>`                     | 本次手势是否判定为点击 |
| onTouchStart | `(e: DraggableTouchEvent) => void` | 绑定到 `@touchstart`   |
| onTouchMove  | `(e: DraggableTouchEvent) => void` | 绑定到 `@touchmove`    |
| onTouchEnd   | `(e: DraggableTouchEvent) => void` | 绑定到 `@touchend`     |
| snapToEdge   | `() => void`                       | 手动触发一次边缘吸附   |

## 使用方法

```vue
<script setup lang="ts">
import { useDraggable } from "uni-toolkit/hooks";

const {
  position,
  isDragging,
  isTap,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
} = useDraggable({
  elementWidth: uni.upx2px(114),
  elementHeight: uni.upx2px(104),
  storageKey: "customer-service-position",
});

// 微信小程序中 catchtouchstart 会阻断子元素 tap 事件，
// 因此点击不能依赖 @click，需要在 touchend 里按 isTap 判断
function onTouchEndWrap(e: TouchEvent) {
  onTouchEnd(e);
  if (isTap.value) {
    isTap.value = false;
    uni.makePhoneCall({ phoneNumber: "10086" });
  }
}
</script>

<template>
  <view
    class="fixed left-0 top-0"
    :style="{
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: isDragging ? 'none' : 'transform 0.3s ease',
    }"
    @touchstart.stop="onTouchStart"
    @touchmove.stop.prevent="onTouchMove"
    @touchend="onTouchEndWrap"
  >
    悬浮按钮
  </view>
</template>
```

配合下拉刷新，避免拖拽被误判为下拉：

```typescript
import { useDragState } from "uni-toolkit/hooks";

const { dragging } = useDragState();

onPullDownRefresh(() => {
  // 拖拽过程中误触发的下拉，直接结束掉
  if (dragging.value) {
    uni.stopPullDownRefresh();
    return;
  }

  refreshList().finally(() => {
    uni.stopPullDownRefresh();
  });
});
```

## 注意事项

### 触摸事件类型

参数类型是包内声明的 `DraggableTouchEvent`（只要求 `touches` / `changedTouches` 含 `clientX` / `clientY`），
而不是 DOM 的 `TouchEvent`——小程序端给的是普通数组而非 `TouchList`，按结构声明各端通用。

### 全局拖拽状态是计数而非布尔量

`useDragState` 内部按「正在拖拽的实例数」统计。
若用布尔量，两个可拖拽元素并存时，后一个 `touchend` 会把前一个的拖拽状态冲掉。

### 屏幕尺寸在初始化时取一次

`useDraggable` 调用时通过 `uni.getSystemInfoSync()` 取一次窗口尺寸，不响应真实旋转。
组件挂载时会重新约束一次位置，能覆盖大部分场景；对横竖屏切换敏感的页面需要自行重建。

### 必须在 setup 作用域内调用

内部使用了 `onMounted`。
