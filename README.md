# uni-toolkit 🛠️

> uniapp 工具库

这个仓库提供了一套用于 uniapp 开发的通用工具库，包含拦截器、hooks、工具函数和环境检测等功能，帮助解决平台兼容性问题和实现权限申请功能。

<p align="center">
  <a href="https://www.npmjs.com/package/uni-toolkit" target="_blank">
    <img src="https://img.shields.io/npm/v/uni-toolkit.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/package/uni-toolkit" target="_blank">
    <img src="https://img.shields.io/npm/dt/uni-toolkit.svg" alt="NPM Downloads" />
  </a>
  <a href="https://github.com/liujiayii/uni-toolkit/actions/workflows/build-test.yml" target="_blank">
    <img src="https://github.com/liujiayii/uni-toolkit/actions/workflows/build-test.yml/badge.svg" alt="Build Status" />
  </a>
  <a href="https://github.com/liujiayii/uni-toolkit/actions/workflows/deploy-docs.yml" target="_blank">
    <img src="https://github.com/liujiayii/uni-toolkit/actions/workflows/deploy-docs.yml/badge.svg" alt="Docs Status" />
  </a>
  <a href="https://liujiayii.github.io/uni-toolkit/" target="_blank">
    <img src="https://img.shields.io/badge/docs-online-brightgreen" alt="Online Docs" />
  </a>
  <a href="./LICENSE" target="_blank">
    <img src="https://img.shields.io/npm/l/uni-toolkit.svg" alt="License" />
  </a>
</p>

## 📋 目录

- [🎯 适用场景](#-适用场景)
- [🚀 安装](#-安装)
- [📦 主要功能](#-主要功能)
- [📚 详细文档](#-详细文档)
- [🤝 贡献](#-贡献)
- [📄 许可证](#-许可证)

## 🎯 适用场景

- 需要兼容低版本浏览器或手机系统
- 需要处理不同平台（微信小程序、抖音小程序等）的特殊问题
- 需要实现全局功能如路由守卫、数据存储优化等
- 希望简化常见业务逻辑的处理
- 需要处理 App、小程序权限申请问题
- 需要使用封装好的 hooks 简化开发流程
- 需要环境检测功能，针对不同环境进行特殊处理

## 🚀 安装

```bash
npm install uni-toolkit
# 或
pnpm add uni-toolkit
# 或
yarn add uni-toolkit
```

## 🚀 快速开始

### 基础使用

```typescript
// 1. 导入拦截器
import { chooseImageInterceptor } from "uni-toolkit/interceptors";

// 2. 在应用入口处安装拦截器
app.use(chooseImageInterceptor);

// 3. 正常调用 uni API，拦截器会自动处理权限
uni.chooseImage({
  count: 1,
  sourceType: ["album", "camera"],
  success: (res) => {
    console.log("选择成功", res.tempFilePaths);
  }
});
```

```typescript
// 使用 Hooks
import { useChooseImage } from "uni-toolkit/hooks";

const { chooseImage } = useChooseImage();

// 简化的图片选择
async function handleChooseImage() {
  try {
    const result = await chooseImage({ count: 1 });
    console.log("选择成功", result.tempFilePaths);
  } catch (error) {
    console.error("选择失败", error);
  }
}
```

```typescript
import { isMpWeiXinWork } from "uni-toolkit/env";
// 使用工具函数
import { cloneDeep } from "uni-toolkit/tools";

// 深拷贝对象
const clonedData = cloneDeep(originalData);

// 环境检测
if (isMpWeiXinWork) {
  console.log("当前运行在微信小程序企业版环境");
}
```

## 📦 主要功能

### 🛡️ 拦截器 (Interceptors)

- **chooseImage 拦截器**: 自动处理图片选择权限，支持 App 和小程序平台的相机、相册权限申请
- **chooseLocation 拦截器**: 增强位置选择功能，自动处理权限和错误
- **makePhoneCall 拦截器**: 增强拨打电话功能，提供参数校验和权限处理
- **route 拦截器**: 路由增强，支持路由白名单和参数处理
- **setClipboardData 拦截器**: 剪贴板增强，提供兼容性处理
- **setStorage 拦截器**: 存储增强，支持数据加密和过期时间

### 🎣 Hooks

- **useChooseImage**: 简化图片选择流程，自动处理权限申请
- **useDesignSize**: 响应式设计尺寸处理
- **useOnShow**: 页面显示生命周期处理

### 🛠️ 工具函数 (Tools)

- **权限管理**: 提供完整的权限检查、申请和提示功能
  - `checkSelfPermission` - 检查应用权限状态
  - `permissionAuth` - 权限认证工具
  - `showAuthTip` - 显示权限提示对话框
  - `showManualAuth` - 引导用户手动授权
- **通用工具**:
  - `cloneDeep` - 高性能对象深拷贝功能
  - `getCurrentPageRoute` - 获取当前页面路由
  - `isPageLevelComponent` - 判断是否为页面级组件

### 🌍 环境检测 (Environment)

- **平台检测**: 检测当前运行环境和平台
  - `isMpWeiXinWork` - 检测是否为微信小程序企业版

## 📚 详细文档

### 📖 在线文档

访问我们的 [在线文档网站](https://liujiayii.github.io/uni-toolkit/) 获取最新的文档和示例。

### 📝 文档部署

本项目使用 GitHub Actions 自动部署文档到 GitHub Pages。详细部署信息请参考 [DEPLOY.md](./DEPLOY.md)。

### 入门指南

- [快速开始](https://liujiayii.github.io/uni-toolkit/guide/getting-started) - 快速上手使用 uni-toolkit
- [使用指南](https://liujiayii.github.io/uni-toolkit/guide/usage) - 详细的使用方法和注意事项

### 功能模块

- [核心功能概览](https://liujiayii.github.io/uni-toolkit/guide/overview) - 拦截器、Hooks 和工具函数的概览
- [拦截器文档](https://liujiayii.github.io/uni-toolkit/interceptors/index) - 详细介绍所有拦截器
- [Hooks 文档](https://liujiayii.github.io/uni-toolkit/hooks/index) - 详细介绍所有可用的 Hooks
- [工具函数文档](https://liujiayii.github.io/uni-toolkit/tools/index) - 详细介绍所有工具函数
- [环境检测文档](https://liujiayii.github.io/uni-toolkit/env/index) - 详细介绍环境检测功能

### 示例项目

- [playground 示例](https://github.com/liujiayii/uni-toolkit/tree/main/playground) - 完整的示例项目，展示所有功能的实际应用
  - 图片选择示例：展示了 chooseImageInterceptor 的各种使用场景
  - 拦截器示例：展示了各种拦截器的实际效果
  - Hook 使用示例：展示了如何在实际项目中使用 Hooks

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！详细信息请参考 [贡献指南](https://liujiayii.github.io/uni-toolkit/guide/contributing)。

## 📄 许可证

MIT
