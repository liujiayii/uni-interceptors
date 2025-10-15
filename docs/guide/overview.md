# 核心功能概览

uni-toolkit 提供了三大核心功能模块：拦截器、Hooks 和工具函数，以及环境检测功能，帮助开发者简化 uniapp 开发流程。

## 🛡️ 拦截器 (Interceptors)

拦截器是 uni-toolkit 的核心功能，通过拦截 uni-app 的原生 API，自动处理权限申请、错误处理和平台兼容性问题。

### 主要拦截器

| 拦截器                        | 功能描述                     | 适用场景               |
| ----------------------------- | ---------------------------- | ---------------------- |
| `chooseImageInterceptor`      | 自动处理图片选择权限         | 需要选择图片的场景     |
| `chooseLocationInterceptor`   | 增强位置选择功能             | 需要获取用户位置的场景 |
| `makePhoneCallInterceptor`    | 增强拨打电话功能             | 需要拨打电话的场景     |
| `routeInterceptor`            | 路由增强，支持白名单         | 需要路由守卫的场景     |
| `setClipboardDataInterceptor` | 剪贴板增强，提供兼容性处理   | 需要复制到剪贴板的场景 |
| `setStorageInterceptor`       | 存储增强，支持加密和过期时间 | 需要安全存储的场景     |

### 使用方式

```typescript
import { chooseImageInterceptor } from "uni-toolkit/interceptors";

// 注册拦截器
uni.addInterceptor("chooseImage", chooseImageInterceptor);
```

## 🎣 Hooks

Hooks 是基于 Vue 3 Composition API 封装的常用功能，简化组件开发。

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

## 🛠️ 工具函数 (Tools)

工具函数提供了一系列实用的辅助功能，帮助开发者处理常见任务。

### 主要工具函数

| 分类     | 函数                         | 功能描述                   |
| -------- | ---------------------------- | -------------------------- |
| 权限管理 | `checkPermission`            | 检查权限状态               |
| 权限管理 | `requestPermission`          | 请求权限                   |
| 权限管理 | `showPermissionDeniedDialog` | 显示权限被拒对话框         |
| 环境检测 | `isMpWeiXinWork`             | 检测是否为微信小程序企业版 |
| 工具函数 | `deepClone`                  | 高性能对象深拷贝           |

### 使用方式

```typescript
import { checkPermission, requestPermission } from "uni-toolkit/tools";

// 检查权限
const hasPermission = await checkPermission("camera");
if (!hasPermission) {
  // 请求权限
  const granted = await requestPermission("camera");
}
```

## 🌍 环境检测 (Env)

环境检测功能提供了精确的平台和环境检测，帮助开发者实现差异化处理。

### 主要环境检测

| 检测项           | 功能描述                   |
| ---------------- | -------------------------- |
| `isMpWeiXinWork` | 检测是否为微信小程序企业版 |

### 使用方式

```typescript
import { getPlatform, isMpWeiXinWork } from "uni-toolkit/env";

if (isMpWeiXinWork) {
  // 微信小程序特定逻辑
}

const platform = getPlatform();
console.log("当前平台:", platform);
```

## 🔄 工作流程

1. **安装** uni-toolkit
2. **导入** 所需模块
3. **注册** 拦截器（可选）
4. **使用** Hooks 和工具函数
5. **处理** 平台差异

## 📚 更多文档

- [拦截器详细文档](/interceptors)
- [Hooks 详细文档](/hooks)
- [工具函数详细文档](/tools)
- [环境检测详细文档](/env)
