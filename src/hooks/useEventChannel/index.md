# useEventChannel

封装获取 EventChannel 并提供类型安全的 on/emit/off 便捷方法，用于页面间通信，监听上一个页面通过 EventChannel 传递的数据。需要在页面的 setup 中使用，且页面由 navigateTo 打开。组件卸载时会自动清理通过 on 注册的所有监听器。

## 平台支持

全平台

## createEventChannelActions

纯函数，为任意 EventChannel 实例提供类型安全的 on/emit/off 方法，不依赖 Vue 生命周期，适用于发送页面（上一个页面）等非 setup 场景。

### 泛型参数

| 参数 | 约束                     | 默认值           | 说明                                             |
| ---- | ------------------------ | ---------------- | ------------------------------------------------ |
| T    | extends IEventChannelMap | IEventChannelMap | 事件数据类型映射，定义事件名与数据类型的对应关系 |

### 参数

| 参数         | 类型                | 说明                         |
| ------------ | ------------------- | ---------------------------- |
| eventChannel | UniApp.EventChannel | 需要包装的 EventChannel 实例 |

### 返回值

`IEventChannelActions<T>` — 包含 on/emit/off 的类型安全对象

### 使用示例

```typescript
import type { IEventChannelMap } from "uni-toolkit";
import { createEventChannelActions } from "uni-toolkit";

// 定义事件数据类型映射
type IMyEventMap = {
  acceptDataFromOpenerPage: { id: number; name: string };
  sendDataToOpenerPage: { reply: string; timestamp: number };
} & IEventChannelMap;

uni.navigateTo({
  url: "/pages/detail/index",
  events: {
    acceptDataFromOpenedPage: (data) => {
      console.log("收到下级页面数据:", data);
    }
  },
  success(res) {
    // 使用 createEventChannelActions 包装，获得类型安全的 emit
    const channel = createEventChannelActions<IMyEventMap>(res.eventChannel);
    // emit 具有类型约束，事件名和数据类型都会被检查
    channel.emit("acceptDataFromOpenerPage", { id: 1, name: "测试" });
  }
});
```

## 泛型参数

| 参数 | 约束                     | 默认值           | 说明                                             |
| ---- | ------------------------ | ---------------- | ------------------------------------------------ |
| T    | extends IEventChannelMap | IEventChannelMap | 事件数据类型映射，定义事件名与数据类型的对应关系 |

## 返回值

`IEventChannelActions<T> | undefined` — 包含 on/emit/off 的类型安全对象，获取 EventChannel 失败时返回 undefined

## IEventChannelActions 方法

| 方法 | 签名                                                                            | 说明               |
| ---- | ------------------------------------------------------------------------------- | ------------------ |
| on   | `<K extends keyof T>(event: K, callback: IEventChannelCallback<T[K]>) => void`  | 类型安全的事件监听 |
| emit | `<K extends keyof T>(event: K, data: T[K]) => void`                             | 类型安全的事件发送 |
| off  | `<K extends keyof T>(event: K, callback?: IEventChannelCallback<T[K]>) => void` | 类型安全的事件移除 |

## 相关类型

- `IEventChannelMap` — 事件数据类型映射接口，`Record<string, unknown>`
- `IEventChannelCallback<T>` — 事件回调函数类型，`(data: T) => void`

## 使用示例

### 基础用法

```typescript
import { useEventChannel } from "uni-toolkit";

export default {
  setup() {
    const channel = useEventChannel();

    channel?.on("acceptDataFromOpenerPage", (data) => {
      console.log("收到数据:", data);
    });

    return {};
  }
};
```

### 带类型约束的用法

```typescript
import type { IEventChannelMap } from "uni-toolkit";
import { useEventChannel } from "uni-toolkit";

// 定义事件数据类型映射
type IMyEventMap = {
  acceptDataFromOpenerPage: { id: number; name: string };
  someOtherEvent: { message: string };
} & IEventChannelMap;

export default {
  setup() {
    const channel = useEventChannel<IMyEventMap>();

    // on — 类型安全，data 自动推导为 { id: number; name: string }
    channel?.on("acceptDataFromOpenerPage", (data) => {
      console.log("收到数据:", data.id, data.name);
    });

    // emit — 类型安全，data 必须匹配对应事件的数据类型
    channel?.emit("someOtherEvent", { message: "hello" });

    // off — 类型安全移除监听
    const handler = (data: { id: number; name: string }) => { /* ... */ };
    channel?.off("acceptDataFromOpenerPage", handler);

    // 组件卸载时自动清理，无需手动 off
    return {};
  }
};
```

### 发送页面配合使用

```typescript
import type { IEventChannelMap } from "uni-toolkit";
// 发送页面（上一个页面）
import { createEventChannelActions } from "uni-toolkit";

// 定义事件数据类型映射（与接收页面共享同一类型）
type IMyEventMap = {
  acceptDataFromOpenerPage: { id: number; name: string };
  sendDataToOpenerPage: { reply: string; timestamp: number };
} & IEventChannelMap;

uni.navigateTo({
  url: "/pages/detail/index",
  events: {
    acceptDataFromOpenedPage: (data) => {
      console.log("收到下级页面数据:", data);
    }
  },
  success(res) {
    // 使用 createEventChannelActions 包装，获得类型安全的 emit
    const channel = createEventChannelActions<IMyEventMap>(res.eventChannel);
    // emit 具有类型约束，事件名和数据类型都会被检查
    channel.emit("acceptDataFromOpenerPage", { id: 1, name: "测试" });
  }
});
```

## 特性

- 封装 `getOpenerEventChannel` 调用，简化 EventChannel 获取
- 提供类型安全的 on/emit/off 便捷方法，替代原始 EventChannel 操作
- 支持泛型事件映射，事件名和数据类型完全约束
- 组件卸载时自动清理通过 on 注册的所有监听器，防止内存泄漏
- 开发环境下，获取 EventChannel 失败时输出 console.warn 警告
- `createEventChannelActions` 纯函数，为任意 EventChannel 提供类型安全的 on/emit/off，不依赖 Vue 生命周期

## 注意事项

1. 必须在页面的 setup 函数中调用
2. 当前页面必须由 `uni.navigateTo` 打开，否则无法获取 EventChannel
3. 开发环境下，如果获取 EventChannel 失败，控制台会输出警告信息
4. 通过 on 注册的监听器会在组件卸载时自动清理，无需手动 off
5. 如果需要手动移除某个监听器，可以使用 off 方法
6. `createEventChannelActions` 是纯函数，不会自动清理监听器。如需自动清理，请使用 `useEventChannel`
