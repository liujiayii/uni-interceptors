# Hooks 文档

本文档详细介绍了 uni-toolkit 中提供的所有 Hooks。

## 目录

- [useChooseImage](#usechooseimage)
- [useOnShow](#useonshow)
- [useDesignSize](#usedesignsize)

## useChooseImage

**功能：** 封装图片选择功能，处理不同平台的兼容性问题。

**平台：** 全平台

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

**功能：** 监听页面显示事件，方便在页面显示时执行特定逻辑。

**平台：** 全平台

### 参数

| 参数     | 类型              | 必填 | 默认值 | 说明                                                                 |
| -------- | ----------------- | ---- | ------ | -------------------------------------------------------------------- |
| callback | () => void        | 是   | -      | 页面显示时的回调函数                                                 |
| options  | UseOnShowOptions  | 否   | {}     | 配置选项，用于控制监听行为                                           |

### UseOnShowOptions

| 参数           | 类型    | 必填 | 默认值 | 说明                                                                 |
| -------------- | ------- | ---- | ------ | -------------------------------------------------------------------- |
| pageOnly       | boolean | 否   | true   | 是否只响应当前页面的onShow事件                                      |
| immediate      | boolean | 否   | false  | 是否在组件挂载后立即执行一次                                         |
| triggerHistory | boolean | 否   | true   | 是否在组件挂载后触发最近的历史事件（如果有），解决父组件onShow时子组件还未注册的问题 |
| context        | any     | 否   | -      | 事件处理函数的执行上下文                                             |

### 返回值

`{ trigger: () => void }` - 包含手动触发方法的对象

### 使用示例

```typescript
import { useOnShow } from "uni-toolkit";

// 在组件中使用
export default {
  setup() {
    // 基本用法
    useOnShow(() => {
      console.log("页面显示");
      // 可以在这里执行页面显示时的逻辑，如数据刷新等
    });

    // 使用选项
    const { trigger } = useOnShow(() => {
      console.log("页面显示或手动触发");
      // 页面显示时的逻辑
    }, {
      pageOnly: true,        // 只响应当前页面
      immediate: true,       // 立即执行一次
      triggerHistory: true,  // 触发历史事件
      context: this          // 指定执行上下文
    });

    // 手动触发
    const manualTrigger = () => {
      trigger();
    };

    return { manualTrigger };
  }
};
```

### 特性

- 自动处理页面生命周期
- 支持在组件中使用，无需手动管理事件监听和移除
- 提供灵活的配置选项，控制监听行为
- 支持手动触发回调函数
- 自动处理上下文绑定
- 支持历史事件触发，解决组件注册时机问题

## useDesignSize

**功能：** 获取设计尺寸信息，方便响应式布局。

**平台：** 全平台

### 返回值

`{ width: number, height: number, rate: number }` - 设计尺寸信息，包含rpx转换比率

### 使用示例

```typescript
import { useDesignSize } from "uni-toolkit";

// 在组件中使用
export default {
  setup() {
    // 获取设计尺寸
    const { width, height, rate } = useDesignSize();

    return {
      width,
      height,
      rate
    };
  }
};
```

### 特性

- 自动响应窗口尺寸变化
- 返回格式化的尺寸信息，方便直接使用
- 提供rpx转换比率，便于不同设备间的尺寸转换
