# Hooks 文档

本文档详细介绍了 uni-toolkit 中提供的所有 Hooks。

## 目录

- [useChooseImage](#usechooseimage) - 封装图片选择功能
- [useOnShow](#useonshow) - 统一的页面显示事件钩子
- [useDesignSize](#usedesignsize) - 获取设计尺寸信息

## useChooseImage

### 功能描述

封装图片选择功能，处理不同平台的兼容性问题。

### 平台支持

全平台

### 参数

| 参数       | 类型     | 必填 | 默认值                     | 说明                   |
| ---------- | -------- | ---- | -------------------------- | ---------------------- |
| count      | number   | 否   | 9                          | 最多可以选择的图片张数 |
| sizeType   | string[] | 否   | ['original', 'compressed'] | 所选的图片的尺寸       |
| sourceType | string[] | 否   | ['album', 'camera']        | 选择图片的来源         |
| extension  | string[] | 否   | []                         | 文件扩展名过滤         |

### 返回值

`Promise<UniApp.ChooseImageSuccessCallbackResult>` - 图片选择结果

### 使用示例

```typescript
import { useChooseImage } from "uni-toolkit";
import { ref } from "vue";

// 在组件中使用
export default {
  async setup() {
    const chooseImage = async () => {
      try {
        const res = await useChooseImage({
          count: 1,
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"]
        });
        console.log("选择的图片：", res.tempFilePaths);

        // 实际应用示例 - 显示选择的图片
        const imgSrc = ref(res.tempFilePaths[0]);
      } catch (error) {
        console.error("选择图片失败：", error);
      }
    };

    return { chooseImage };
  }
};
```

### 特性

- 自动处理微信小程序的兼容性问题，在微信小程序中使用 `chooseMedia` 接口
- 统一不同平台的返回结果格式
- 支持文件扩展名过滤

## useOnShow

### 功能描述

统一的页面显示事件钩子，可用于页面级别和组件级别，方便在页面显示时执行特定逻辑。

### 平台支持

全平台

### 参数

| 参数     | 类型             | 必填 | 默认值 | 说明                                   |
| -------- | ---------------- | ---- | ------ | -------------------------------------- |
| callback | () => void       | 否   | -      | 页面显示时的回调函数（组件级别时必填） |
| options  | UseOnShowOptions | 否   | {}     | 配置选项，用于控制监听行为             |

### UseOnShowOptions

| 参数           | 类型    | 必填 | 默认值 | 说明                                                                                 |
| -------------- | ------- | ---- | ------ | ------------------------------------------------------------------------------------ |
| immediate      | boolean | 否   | false  | 是否在组件挂载后立即执行一次                                                         |
| triggerHistory | boolean | 否   | true   | 是否在组件挂载后触发最近的历史事件（如果有），解决父组件onShow时子组件还未注册的问题 |
| context        | any     | 否   | -      | 事件处理函数的执行上下文                                                             |
| isPageLevel    | boolean | 否   | true   | 是否强制指定为页面级别组件，如果未指定将自动通过 isPageLevelComponent 判断           |

### 返回值

`void` - 无返回值

### 使用示例

#### 自动判断使用级别（推荐）

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

#### 组件级别使用

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

#### 页面级别使用

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

#### 强制指定使用级别

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

### 特性

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

## useDesignSize

### 功能描述

获取设计尺寸信息(包含rpx转换比率，750 设计宽度下的归一化尺寸与比例)，方便响应式布局。

### 平台支持

全平台

### 参数

无参数

### 返回值

`Ref<{ width: number, height: number, rate: number }>` - 设计尺寸信息的响应式引用对象，包含以下属性：

- `width`: 屏幕宽度（固定为750，基于设计宽度）
- `height`: 屏幕高度（根据实际屏幕高度和比例计算）
- `rate`: rpx转换比率（750 / 实际屏幕宽度）

### 使用示例

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

### 特性

- 基于750设计宽度提供归一化尺寸信息
- 自动响应窗口尺寸变化
- 返回响应式引用对象，尺寸变化时自动更新
- 提供rpx转换比率，便于不同设备间的尺寸转换
- 使用Vue的响应式系统，确保UI随尺寸变化自动更新
