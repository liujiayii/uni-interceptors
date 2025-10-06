# Hooks 文档

本文档详细介绍了 uni-toolkit 中提供的所有 Hooks。

## 目录

- [useChooseImage](#usechooseimage)
- [useOnShow](#useonshow)
- [useWindowSize](#usewindowsize)

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

| 参数     | 类型       | 必填 | 说明                 |
| -------- | ---------- | ---- | -------------------- |
| callback | () => void | 是   | 页面显示时的回调函数 |

### 使用示例

```typescript
import { useOnShow } from "uni-toolkit";

// 在组件中使用
export default {
  setup() {
    // 监听页面显示事件
    useOnShow(() => {
      console.log("页面显示");
      // 可以在这里执行页面显示时的逻辑，如数据刷新等
    });

    return {};
  }
};
```

### 特性

- 自动处理页面生命周期
- 支持在组件中使用，无需手动管理事件监听和移除

## useWindowSize

**功能：** 获取窗口尺寸信息，方便响应式布局。

**平台：** 全平台

### 返回值

`{ windowWidth: number, windowHeight: number }` - 窗口尺寸信息

### 使用示例

```typescript
import { useWindowSize } from "uni-toolkit";

// 在组件中使用
export default {
  setup() {
    // 获取窗口尺寸
    const { windowWidth, windowHeight } = useWindowSize();

    return {
      windowWidth,
      windowHeight
    };
  }
};
```

### 特性

- 自动响应窗口尺寸变化
- 返回格式化的尺寸信息，方便直接使用
