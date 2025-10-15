# Hooks

Hooks 是基于 Vue 3 Composition API 封装的常用功能，简化组件开发。

## 目录

- [useChooseImage](./useChooseImage) - 封装图片选择功能
- [useOnShow](./useOnShow) - 统一的页面显示事件钩子
- [useDesignSize](./useDesignSize) - 获取设计尺寸信息

## 概述

uni-toolkit 提供了一系列实用的 Hooks，帮助开发者简化组件开发，提高代码复用性。这些 Hooks 基于 Vue 3 Composition API 设计，可以轻松集成到你的项目中。

### 主要 Hooks

| Hook             | 功能描述             | 适用场景                       |
| ---------------- | -------------------- | ------------------------------ |
| `useChooseImage` | 简化图片选择流程     | 需要选择图片的组件             |
| `useDesignSize`  | 响应式设计尺寸处理   | 需要响应式布局的组件           |
| `useOnShow`      | 页面显示生命周期处理 | 需要在页面显示时执行操作的组件 |

### 使用方式

```vue
<script setup>
import { useChooseImage } from "uni-toolkit/hooks";

const { chooseImage } = useChooseImage();

function handleChooseImage() {
  chooseImage({
    count: 1,
    success: (res) => {
      console.log("选择图片成功", res.tempFilePaths);
    }
  });
}
</script>
```

### 按模块导入

使用 `import { xxx } from "uni-toolkit/hooks"` 的方式可以只导入特定模块，减少包体积：

```javascript
// 按需导入hooks
import { useChooseImage, useDesignSize, useOnShow } from "uni-toolkit/hooks";
```

每个 Hook 都有详细的文档和使用示例，您可以通过上方的链接查看具体信息。
