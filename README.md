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
pnpm install uni-toolkit
```

## 📦 主要功能

### 拦截器 (Interceptors)

- **chooseImage 拦截器**: 自动处理图片选择权限，支持 App 和小程序平台的相机、相册权限申请
- **chooseLocation 拦截器**: 增强位置选择功能，自动处理权限和错误
- **makePhoneCall 拦截器**: 增强拨打电话功能，提供参数校验和权限处理
- **route 拦截器**: 路由增强，支持路由白名单和参数处理
- **setClipboardData 拦截器**: 剪贴板增强，提供兼容性处理
- **setStorage 拦截器**: 存储增强，支持数据加密和过期时间

### Hooks

- **useChooseImage**: 简化图片选择流程，自动处理权限申请
- **useDesignSize**: 响应式设计尺寸处理
- **useOnShow**: 页面显示生命周期处理

### 工具函数 (Tools)

- **权限管理**: 提供完整的权限检查、申请和提示功能
- **环境检测**: 检测当前运行环境和平台
- **事件总线**: 轻量级事件通信机制
- **深拷贝**: 高性能对象深拷贝功能

## 📚 详细文档

为了提供更好的文档体验，我们将详细文档按功能模块进行了分类：

### 入门指南

- [快速开始](https://github.com/liujiayii/uni-toolkit/blob/main/doc/getting-started.md) - 快速上手使用 uni-toolkit
- [使用指南](https://github.com/liujiayii/uni-toolkit/blob/main/doc/usage.md) - 详细的使用方法和注意事项

### 功能模块

- [核心功能概览](https://github.com/liujiayii/uni-toolkit/blob/main/doc/overview.md) - 拦截器、Hooks 和工具函数的概览
- [hooks 文档](https://github.com/liujiayii/uni-toolkit/blob/main/doc/hooks.md) - 详细介绍所有可用的 Hooks
- [env 文档](https://github.com/liujiayii/uni-toolkit/blob/main/doc/env.md) - 详细介绍环境检测功能
- [tools 文档](https://github.com/liujiayii/uni-toolkit/blob/main/doc/tools.md) - 详细介绍所有工具函数
- [interceptors 文档](https://github.com/liujiayii/uni-toolkit/blob/main/doc/interceptors.md) - 详细介绍所有拦截器

### 示例项目

- [playground 示例](https://github.com/liujiayii/uni-toolkit/tree/main/playground) - 完整的示例项目，展示所有功能的实际应用
  - 图片选择示例：展示了 chooseImageInterceptor 的各种使用场景
  - 拦截器示例：展示了各种拦截器的实际效果
  - Hook 使用示例：展示了如何在实际项目中使用 Hooks

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！详细信息请参考 [贡献指南](https://github.com/liujiayii/uni-toolkit/blob/main/doc/contributing.md)。

## 📄 许可证

MIT
