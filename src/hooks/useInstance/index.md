# useInstance

获取当前组件实例的 proxy 对象，封装了 `getCurrentInstance().proxy` 逻辑，用于在组件内部获取组件实例的代理对象。支持泛型参数以获得更精确的类型推断。

## 平台支持

全平台

## 类型参数

| 参数 | 约束                    | 默认值                  | 说明                       |
| ---- | ----------------------- | ----------------------- | -------------------------- |
| T    | ComponentPublicInstance | ComponentPublicInstance | 组件实例类型，用于类型推断 |

## 参数

无参数

## 返回值

`T | null` — 组件实例的 proxy 对象，如果不在组件上下文中调用则返回 null

## 使用示例

### 基础用法

```typescript
import { useInstance } from "uni-toolkit";

export default {
  setup() {
    const instance = useInstance();
    if (instance) {
      console.log(instance.$props);
      console.log(instance.$el);
    }
    return {};
  }
};
```

### 泛型用法

```typescript
import { useInstance } from "uni-toolkit";

// 传入自定义组件类型，获得精确的类型推断
const instance = useInstance<MyComponent>();
if (instance) {
  // 可以直接访问组件自定义属性和方法，无需类型断言
  instance.customMethod();
}
```

## 特性

- 封装 `getCurrentInstance().proxy` 逻辑，简化组件实例获取
- 支持泛型参数，可传入组件类型获得精确的类型推断
- 开发环境下，非 setup 上下文调用时输出 console.warn 警告
- 不在组件上下文中调用时安全返回 null

## 注意事项

1. 必须在 setup 函数中调用，不能在异步回调（如 setTimeout、Promise.then）中使用
2. 开发环境下，如果在非 setup 上下文中调用，控制台会输出警告信息
3. 建议使用泛型参数以获得更好的类型提示
