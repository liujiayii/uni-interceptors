# GitHub Pages 部署指南

本项目已配置自动部署流程，当您将代码推送到 `main` 分支时，会自动构建并部署 VitePress 文档到 GitHub Pages。

## 启用 GitHub Pages

要使自动部署流程正常工作，您需要在 GitHub 仓库中启用 GitHub Pages 功能。

### 步骤

1. 进入您的 GitHub 仓库页面
2. 点击 "Settings" 选项卡
3. 在左侧菜单中找到 "Pages" 选项
4. 在 "Source" 部分，选择 "GitHub Actions"
5. 保存设置

## 工作流程

完成上述设置后，当您将代码推送到 `main` 分支时，将自动触发以下流程：

1. GitHub Actions 工作流自动运行
2. 安装依赖并构建 VitePress 文档
3. 将构建结果部署到 GitHub Pages

## 本地开发

### 安装依赖

```bash
pnpm install
```

### 本地运行文档

```bash
pnpm run docs:dev
```

### 本地构建文档

```bash
pnpm run docs:build
```

### 本地预览构建结果

```bash
pnpm run docs:preview
```

## 手动部署

如果您需要手动部署文档到 GitHub Pages，可以使用以下命令：

```bash
pnpm run deploy
```

## 访问文档

部署完成后，您可以通过以下 URL 访问文档：

```
https://[您的用户名].github.io/uni-toolkit/
```

例如：`https://liujiayii.github.io/uni-toolkit/`

## 配置说明

### GitHub Actions 工作流

工作流文件位于 `.github/workflows/deploy-docs.yml`，包含以下主要步骤：

1. **检出代码**：获取最新代码
2. **安装依赖**：使用 pnpm 安装项目依赖
3. **构建文档**：运行 `pnpm run docs:build` 构建文档
4. **部署到 GitHub Pages**：将构建结果部署到 GitHub Pages

### VitePress 配置

VitePress 配置文件位于 `docs/.vitepress/config.ts`，已设置：

- `base: '/uni-toolkit/'`：确保资源路径正确
- 更新了导航和侧边栏结构
- 添加了页脚信息

## 注意事项

1. 确保 GitHub 仓库已启用 GitHub Pages 功能
2. 在仓库设置中，将 GitHub Pages 源设置为 "GitHub Actions"
3. 首次部署可能需要几分钟时间才能生效

## 故障排除

如果部署失败，请检查：

1. GitHub Actions 工作流日志
2. 确保所有依赖都已正确安装
3. 检查 VitePress 配置是否有语法错误
4. 确保仓库权限设置正确