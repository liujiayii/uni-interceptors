# 开发指南

## 本地开发

### 使用 `pnpm` 链接本地开发包的方法

在开发过程中，您可能需要在本地项目中使用正在开发的 uni-toolkit 包。这时可以使用 pnpm 的 link 功能来创建本地链接。

> [从本地文件系统安装](https://pnpm.io/zh/cli/add#%E4%BB%8E%E6%9C%AC%E5%9C%B0%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F%E5%AE%89%E8%A3%85)

#### 使用方法

1. 在 uni-toolkit 项目根目录下执行：

```bash
pnpm link --global
```

2. 在您的项目目录下执行：

```bash
pnpm link uni-toolkit --global
```

或者直接从本地文件系统安装：

```bash
pnpm add ./path/to/uni-toolkit
```

#### 示例

```bash
# 假设 uni-toolkit 位于 /home/user/projects/uni-toolkit
pnpm link ./uni-toolkit
```

当你从目录安装时，会在当前项目的node_modules 目录中生成一个符号链接，因此这和执行 pnpm link 一致。

## 项目结构

```
uni-toolkit/
├── src/                 # 源代码目录
│   ├── interceptors/    # 拦截器实现
│   ├── hooks/          # Hooks 实现
│   ├── tools/          # 工具函数实现
│   ├── env/            # 环境检测实现
│   └── index.ts        # 主入口文件
├── docs/               # VitePress 文档目录
├── tests/              # 测试文件目录
├── playground/         # 示例代码目录
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript 配置
└── README.md           # 项目说明
```

## 构建和测试

### 构建项目

```bash
pnpm build
```

### 运行测试

```bash
pnpm test
```

### 运行文档

```bash
pnpm docs:dev
```

### 构建文档

```bash
pnpm docs:build
```

## 发布流程

1. 更新版本号

```bash
pnpm version patch|minor|major
```

2. 发布到 npm

```bash
pnpm publish
```

## 调试技巧

### 在 VS Code 中调试

1. 安装 [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) 扩展
2. 在 `.vscode/launch.json` 中添加配置：

```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Debug in Chrome",
  "url": "http://localhost:8080",
  "webRoot": "${workspaceFolder}/src"
}
```

### 在 Chrome 中调试

1. 在代码中添加 `debugger` 语句
2. 打开 Chrome 开发者工具
3. 刷新页面，代码将在 `debugger` 语句处暂停

## 常见问题

### Q: 如何添加新的拦截器？

A: 请参考 [贡献指南](/guide/contributing.md) 中的"添加新的拦截器"部分。

### Q: 如何处理平台差异？

A: uni-toolkit 使用 `uni.getSystemInfoSync()` 获取平台信息，并根据不同平台提供相应的实现。在编写代码时，请确保考虑所有目标平台的兼容性。

### Q: 如何贡献代码？

A: 请参考 [贡献指南](/guide/contributing.md) 了解详细的贡献流程。
