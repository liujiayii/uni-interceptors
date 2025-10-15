# useOnShow

统一的页面显示事件钩子，可用于页面级别和组件级别，方便在页面显示时执行特定逻辑。

## 内部实现

`useOnShow` 钩子内部使用了一个专门的事件总线实现来处理页面显示事件的分发和监听。这个事件总线支持事件历史记录，可以解决父组件 onShow 时子组件还未注册的问题。

> **注意**: 内部的事件总线是 `useOnShow` 的实现细节，不建议直接使用。如果您需要更灵活的事件处理，请使用 `useOnShow` 钩子提供的选项。

## 平台支持

全平台

## 参数

| 参数     | 类型             | 必填 | 默认值 | 说明                                   |
| -------- | ---------------- | ---- | ------ | -------------------------------------- |
| callback | () => void       | 否   | -      | 页面显示时的回调函数（组件级别时必填） |
| options  | UseOnShowOptions | 否   | {}     | 配置选项，用于控制监听行为             |

## UseOnShowOptions

| 参数           | 类型    | 必填 | 默认值 | 说明                                                                                 |
| -------------- | ------- | ---- | ------ | ------------------------------------------------------------------------------------ |
| immediate      | boolean | 否   | false  | 是否在组件挂载后立即执行一次                                                         |
| triggerHistory | boolean | 否   | true   | 是否在组件挂载后触发最近的历史事件（如果有），解决父组件onShow时子组件还未注册的问题 |
| context        | any     | 否   | -      | 事件处理函数的执行上下文                                                             |
| isPageLevel    | boolean | 否   | true   | 是否强制指定为页面级别组件，如果未指定将自动通过 isPageLevelComponent 判断           |

## 返回值

`void` - 无返回值

## 使用示例

### 自动判断使用级别（推荐）

```typescript
import { useOnShow } from "uni-toolkit";

// 在组件或页面中使用，函数会自动判断当前是页面级别还是组件级别
export default {
  setup() {
    // 自动判断使用级别
    useOnShow(() => {
      console.log("页面显示");
      // 可以在这里执行页面显示时的逻辑，如数据刷新
      refreshData();
    });

    return {};
  }
};
```

### 组件级别使用

```typescript
import { useOnShow } from "uni-toolkit";

// 在组件中使用
export default {
  setup() {
    // 明确指定为组件级别使用
    useOnShow(() => {
      console.log("页面显示");
      // 可以在这里执行页面显示时的逻辑，如数据刷新等
    });

    // 使用选项
    useOnShow(() => {
      console.log("页面显示");
      // 页面显示时的逻辑
    }, {
      immediate: true, // 立即执行一次
      triggerHistory: true, // 触发历史事件
      context: this // 指定执行上下文
    });

    return {};
  }
};
```

### 页面级别使用

```typescript
import { useOnShow } from "uni-toolkit";

// 在页面中使用
export default {
  setup() {
    // 明确指定为页面级别使用，会自动触发页面事件和全局事件
    useOnShow(() => {
      console.log("页面显示");
      // 页面显示时的逻辑
    });

    // 页面级别使用，不提供回调函数
    useOnShow(undefined);

    return {};
  }
};
```

### 强制指定使用级别

```typescript
import { useOnShow } from "uni-toolkit";

// 在组件中使用
export default {
  setup() {
    // 强制指定为页面级别（绕过自动判断）
    useOnShow(() => {
      console.log("强制作为页面级别处理");
      // 页面级别的逻辑
    }, {
      isPageLevel: true // 强制指定为页面级别
    });

    // 强制指定为组件级别（绕过自动判断）
    useOnShow(() => {
      console.log("强制作为组件级别处理");
      // 组件级别的逻辑
    }, {
      isPageLevel: false // 强制指定为组件级别
    });

    return {};
  }
};
```

## 特性

- 自动判断当前是页面级别还是组件级别使用，无需手动指定
- 通过检查组件实例的 `$page` 属性（页面特有）来准确判断页面级别
- **新增：支持通过 `isPageLevel` 配置项强制指定使用级别，绕过自动判断**
- 统一的接口，支持页面级别和组件级别使用
- 页面级别使用时，自动触发页面事件和全局事件
- 组件级别使用时，自动监听页面事件并执行回调函数
- 支持组件挂载后立即执行回调函数
- 支持组件挂载后触发最近的历史事件，解决父组件onShow时子组件还未注册的问题
- 支持自定义事件处理函数的执行上下文
- 组件卸载时自动移除事件监听，避免内存泄漏
