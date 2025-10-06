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

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！详细信息请参考 [贡献指南](https://github.com/liujiayii/uni-toolkit/blob/main/doc/contributing.md)。

## 📄 许可证

MIT
