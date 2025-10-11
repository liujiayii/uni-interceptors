# 快速开始

本文档提供了 uni-toolkit 的快速开始指南，帮助您快速上手使用本工具库。

## 目录

- [安装](#安装)
- [作为 Vue 插件使用](#作为-vue-插件使用)
- [直接调用函数使用](#直接调用函数使用)
- [使用 Hooks](#使用-hooks)
- [按模块导入](#按模块导入)

## 安装

```bash
pnpm install uni-toolkit
```

## 作为 Vue 插件使用

```javascript
import { chooseLocationInterceptor } from "uni-toolkit";
import { createApp } from "vue";

const app = createApp(App);

// 注册拦截器
app.use(chooseLocationInterceptor);
```

### 说明

这种方式将拦截器作为 Vue 插件注册，适用于使用 Vue 3 的项目。注册后，拦截器会自动拦截相应的 uni API 调用，提供增强功能。

## 直接调用函数使用

```javascript
import { applyChooseLocationInterceptor } from "uni-toolkit";

// 应用拦截器
applyChooseLocationInterceptor();
```

### 说明

这种方式直接调用拦截器的应用函数，适用于不使用 Vue 3 或需要更精细控制拦截器应用时机的场景。调用后，拦截器会立即生效。

## 使用 Hooks

```javascript
import { useChooseImage, useDesignSize, useOnShow } from "uni-toolkit";

// 在组件中使用
export default {
  setup() {
    // 使用图片选择 hook
    const chooseImage = async () => {
      try {
        const res = await useChooseImage({
          count: 1,
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"]
        });
        console.log("选择的图片：", res);
      } catch (error) {
        console.error("选择图片失败：", error);
      }
    };

    // 使用页面显示 hook
    useOnShow(() => {
      console.log("页面显示");
    });

    // 使用设计尺寸 hook
    const designSize = useDesignSize();

    return {
      chooseImage,
      designSize
    };
  }
};
```

### 说明

uni-toolkit 提供了多个实用的 Hooks，可以简化常见功能的开发流程。这些 Hooks 可以在 Vue 组件的 setup 函数中使用，提供响应式的数据和功能。

## 按模块导入

```javascript
// 按需导入环境检测功能
import { isMpWeiXinWork } from "uni-toolkit/env";

// 按需导入hooks
import { useChooseImage } from "uni-toolkit/hooks";

// 按需导入拦截器
import { applyChooseLocationInterceptor } from "uni-toolkit/interceptors";

// 按需导入工具函数
import { checkSelfPermission } from "uni-toolkit/tools";
```

### 说明

为了减少包体积，uni-toolkit 支持按模块导入。您可以根据需要只导入特定的功能模块，而不是导入整个工具库。这种方式特别适合对包体积有严格要求的项目。

### 模块结构

- `uni-toolkit/env` - 环境检测功能
- `uni-toolkit/hooks` - Hooks 功能
- `uni-toolkit/interceptors` - 拦截器功能
- `uni-toolkit/tools` - 工具函数功能

## 下一步

完成快速开始后，您可以：

1. 阅读 [使用指南](./usage.md) 了解更详细的使用方法和注意事项
2. 查看 [详细文档](../README.md#-详细文档) 了解各个功能模块的详细信息
3. 根据项目需求选择合适的功能模块进行开发
