# 快速开始

## 安装

使用你喜欢的包管理器安装 uni-toolkit：

```bash
# 使用 pnpm
pnpm install uni-toolkit

# 使用 npm
npm install uni-toolkit

# 使用 yarn
yarn add uni-toolkit
```

## 基本使用

### 1. 导入模块

uni-toolkit 提供了多种导入方式，你可以根据需要选择：

```typescript
// 导入主包（包含所有功能）
import uniToolkit from "uni-toolkit";

import { isWeChatMiniProgram } from "uni-toolkit/env";
import { useChooseImage } from "uni-toolkit/hooks";
// 按需导入特定模块
import { chooseImageInterceptor } from "uni-toolkit/interceptors";
import { checkPermission } from "uni-toolkit/tools";
```

### 2. 注册拦截器

```typescript
// 在 main.js 或 main.ts 中
import { chooseImageInterceptor, chooseLocationInterceptor } from "uni-toolkit/interceptors";

// 注册图片选择拦截器
uni.addInterceptor("chooseImage", chooseImageInterceptor);

// 注册位置选择拦截器
uni.addInterceptor("chooseLocation", chooseLocationInterceptor);
```

### 3. 使用 Hooks

```vue
<script setup>
import { useChooseImage } from "uni-toolkit/hooks";
import { ref } from "vue";

const { chooseImage } = useChooseImage();
const imageUrl = ref("");

function handleChooseImage() {
  chooseImage({
    count: 1,
    success: (res) => {
      imageUrl.value = res.tempFilePaths[0];
    }
  });
}
</script>

<template>
  <view>
    <button @click="handleChooseImage">
      选择图片
    </button>
    <image v-if="imageUrl" :src="imageUrl" mode="aspectFit" />
  </view>
</template>
```

### 4. 使用工具函数

```typescript
import { checkPermission, requestPermission } from "uni-toolkit/tools";

// 检查权限
const hasPermission = await checkPermission("camera");
if (!hasPermission) {
  // 请求权限
  const granted = await requestPermission("camera");
  if (granted) {
    // 权限已授予，继续操作
  }
}
```

## 下一步

- 查看 [使用指南](/guide/usage) 了解更多详细用法
- 查看 [功能模块](/guide/overview) 了解所有可用功能
- 查看 [示例项目](https://github.com/liujiayii/uni-toolkit/tree/main/playground) 了解实际应用
