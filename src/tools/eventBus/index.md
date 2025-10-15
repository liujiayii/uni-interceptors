# eventBus

`eventBus` 是一个事件总线工具，提供组件间通信和解耦的能力，支持事件发布订阅模式。

## 功能描述

事件总线实现了观察者模式，允许组件之间通过事件进行通信，而无需直接引用彼此。特别支持了事件历史记录功能，可以在监听器注册后触发最近发生的事件。

## 核心特性

- **事件发布/订阅**: 支持事件的发布和订阅
- **事件历史记录**: 保存最近的事件，支持延迟订阅后触发
- **自动清理**: 自动清理过期的事件历史记录
- **错误处理**: 事件处理函数中的错误不会影响其他监听器
- **TypeScript 支持**: 完整的类型支持

## 基本用法

```typescript
import { eventBus } from "@uni-toolkit/tools";

// 订阅事件
eventBus.on("user-login", (user) => {
  console.log("用户登录:", user);
});

// 发布事件
eventBus.emit("user-login", { id: 1, name: "张三" });

// 取消订阅
const handler = (data) => console.log("处理数据:", data);
eventBus.on("data-update", handler);
// 稍后取消订阅
eventBus.off("data-update", handler);
```

## API 参考

### on(event, handler, triggerHistory?)

订阅指定事件。

**参数:**

- `event: string` - 事件名称
- `handler: EventHandler` - 事件处理函数
- `triggerHistory?: boolean` - 是否触发历史事件，默认为 true

**示例:**

```typescript
// 订阅事件，默认会触发最近的历史事件
eventBus.on("app-initialized", (config) => {
  console.log("应用初始化配置:", config);
});

// 订阅事件，但不触发历史事件
eventBus.on("new-message", (message) => {
  console.log("新消息:", message);
}, false);
```

### off(event, handler)

取消订阅指定事件。

**参数:**

- `event: string` - 事件名称
- `handler: EventHandler` - 要取消的事件处理函数

**示例:**

```typescript
const messageHandler = (msg) => console.log(msg);
eventBus.on("message", messageHandler);

// 取消订阅
eventBus.off("message", messageHandler);
```

### emit(event, ...args)

发布指定事件。

**参数:**

- `event: string` - 事件名称
- `...args: any[]` - 传递给事件处理函数的参数

**示例:**

```typescript
// 发布简单事件
eventBus.emit("refresh");

// 发布带数据的事件
eventBus.emit("user-updated", { id: 1, name: "李四" }, "update-profile");

// 发布多个参数的事件
eventBus.emit("data-loaded", data, status, timestamp);
```

### clearHistory(event?)

清除事件历史记录。

**参数:**

- `event?: string` - 可选，指定要清除历史记录的事件名称。不指定则清除所有事件历史

**示例:**

```typescript
// 清除所有事件历史
eventBus.clearHistory();

// 清除特定事件的历史
eventBus.clearHistory("user-login");
```

## 高级用法

### 事件历史记录

事件总线会自动保存最近的事件历史（默认保存 1000ms 内的事件），当新的监听器注册时，可以触发最近发生的事件：

```typescript
// 先发布事件（此时可能还没有监听器）
eventBus.emit("app-config-loaded", { theme: "dark", language: "zh-CN" });

// 稍后订阅事件，会立即触发最近的历史事件
eventBus.on("app-config-loaded", (config) => {
  console.log("收到应用配置:", config);
  // 输出: 收到应用配置: { theme: 'dark', language: 'zh-CN' }
});
```

### 错误处理

事件处理函数中的错误不会影响其他监听器的执行：

```typescript
eventBus.on("data-update", (data) => {
  console.log("处理器1:", data);
});

eventBus.on("data-update", (data) => {
  throw new Error("处理器2出错");
});

eventBus.on("data-update", (data) => {
  console.log("处理器3:", data);
});

// 发布事件时，处理器2会出错，但不会影响处理器1和处理器3
eventBus.emit("data-update", { id: 1 });
// 输出:
// 处理器1: { id: 1 }
// Error in event handler for data-update: Error: 处理器2出错
// 处理器3: { id: 1 }
```

## 实际应用场景

### 1. 组件间通信

```typescript
// 用户组件
export default {
  methods: {
    login() {
      // 登录成功后发布事件
      eventBus.emit("user-login", this.user);
    }
  }
};

// 导航组件
export default {
  created() {
    // 订阅用户登录事件
    eventBus.on("user-login", (user) => {
      this.updateUserMenu(user);
    });
  },
  methods: {
    updateUserMenu(user) {
      // 更新导航菜单
    }
  }
};
```

### 2. 跨页面状态同步

```typescript
// 页面A
export default {
  methods: {
    updateSettings(settings) {
      // 更新设置
      this.settings = settings;
      // 发布设置更新事件
      eventBus.emit("settings-updated", settings);
    }
  }
};

// 页面B
export default {
  created() {
    // 订阅设置更新事件
    eventBus.on("settings-updated", (settings) => {
      this.applySettings(settings);
    });
  },
  methods: {
    applySettings(settings) {
      // 应用新设置
    }
  }
};
```

### 3. 异步操作通知

```typescript
// 数据服务
export const DataService = {
  async fetchData() {
    try {
      eventBus.emit("loading-start");
      const data = await api.getData();
      eventBus.emit("data-loaded", data);
    } catch (error) {
      eventBus.emit("data-error", error);
    } finally {
      eventBus.emit("loading-end");
    }
  }
};

// UI组件
export default {
  created() {
    eventBus.on("loading-start", () => this.loading = true);
    eventBus.on("loading-end", () => this.loading = false);
    eventBus.on("data-loaded", (data) => this.data = data);
    eventBus.on("data-error", (error) => this.showError(error));
  }
};
```

## 注意事项

1. **内存管理**: 长期运行的应用中，记得在组件销毁时取消事件订阅，避免内存泄漏
2. **事件命名**: 使用清晰、一致的事件命名约定，避免冲突
3. **事件历史**: 事件历史有默认的过期时间（1000ms），适合处理组件初始化场景
4. **错误隔离**: 每个事件处理器都是独立执行的，一个处理器的错误不会影响其他处理器

## 与其他通信方式的比较

| 通信方式       | 适用场景     | 优点               | 缺点                       |
| -------------- | ------------ | ------------------ | -------------------------- |
| Props/Emit     | 父子组件通信 | 简单直接，类型安全 | 层级深时繁琐               |
| Vuex/Pinia     | 全局状态管理 | 集中管理，可追踪   | 适合复杂状态，简单场景过重 |
| eventBus       | 组件解耦通信 | 松耦合，灵活       | 调试困难，可能滥用         |
| provide/inject | 跨层级通信   | 类型安全，Vue原生  | 需要明确的层级关系         |
