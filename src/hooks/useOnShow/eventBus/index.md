# eventBus

`eventBus` 是 `useOnShow` 钩子的内部事件总线实现，提供组件间通信和解耦的能力，支持事件发布订阅模式。

> **注意**: 此模块是 `useOnShow` 钩子的内部实现细节，不建议直接使用。如果您需要使用页面显示事件，请使用 `useOnShow` 钩子。

## 功能描述

事件总线实现了观察者模式，允许组件之间通过事件进行通信，而无需直接引用彼此。特别支持了事件历史记录功能，可以在监听器注册后触发最近发生的事件。

## 核心特性

- **事件发布/订阅**: 支持事件的发布和订阅
- **事件历史记录**: 保存最近的事件，支持延迟订阅后触发
- **自动清理**: 自动清理过期的事件历史记录
- **错误处理**: 事件处理函数中的错误不会影响其他监听器
- **TypeScript 支持**: 完整的类型支持

## 在 useOnShow 中的应用

在 `useOnShow` 钩子中，eventBus 主要用于：

1. 页面级别组件触发 `page:onShow` 和 `global:onShow` 事件
2. 组件级别组件监听 `page:onShow` 事件并执行回调函数
3. 通过事件历史记录机制解决父组件 onShow 时子组件还未注册的问题

## API 参考

### on(event, handler, triggerHistory?)

订阅指定事件。

**参数:**

- `event: string` - 事件名称
- `handler: EventHandler` - 事件处理函数
- `triggerHistory?: boolean` - 是否触发历史事件，默认为 true

### off(event, handler)

取消订阅指定事件。

**参数:**

- `event: string` - 事件名称
- `handler: EventHandler` - 要取消的事件处理函数

### emit(event, ...args)

发布指定事件。

**参数:**

- `event: string` - 事件名称
- `...args: any[]` - 传递给事件处理函数的参数

### clearHistory(event?)

清除事件历史记录。

**参数:**

- `event?: string` - 可选，指定要清除历史记录的事件名称。不指定则清除所有事件历史

## 事件历史记录

事件总线会自动保存最近的事件历史（默认保存 1000ms 内的事件），当新的监听器注册时，可以触发最近发生的事件。这个特性在 `useOnShow` 中用于解决父组件 onShow 时子组件还未注册的问题。

## 使用建议

如果您需要在页面显示时执行逻辑，建议直接使用 `useOnShow` 钩子，而不是直接使用 eventBus：

```typescript
import { useOnShow } from "uni-toolkit";

// 推荐：使用 useOnShow 钩子
export default {
  setup() {
    useOnShow(() => {
      console.log("页面显示");
      // 页面显示时的逻辑
    });

    return {};
  }
};
```

而不是：

```typescript
// 不推荐：直接使用 eventBus
import { eventBus } from "uni-toolkit/hooks/useOnShow/eventBus";

export default {
  setup() {
    eventBus.on("page:onShow", ({ pageId }) => {
      // 需要手动处理页面 ID 匹配、组件卸载时取消监听等
    });

    return {};
  }
};
```
