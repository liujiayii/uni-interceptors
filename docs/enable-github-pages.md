# 启用 GitHub Pages

要使自动部署流程正常工作，您需要在 GitHub 仓库中启用 GitHub Pages 功能。

## 步骤

1. 进入您的 GitHub 仓库页面
2. 点击 "Settings" 选项卡
3. 在左侧菜单中找到 "Pages" 选项
4. 在 "Source" 部分，选择 "GitHub Actions"
5. 保存设置

## 工作流程

完成上述设置后，当您将代码推送到 `main` 分支时，将自动触发以下流程：

1. GitHub Actions 工作流自动运行
2. 构建 VitePress 文档
3. 将构建结果部署到 GitHub Pages

## 访问文档

部署完成后，您可以通过以下 URL 访问文档：

```
https://[您的用户名].github.io/uni-toolkit/
```

例如：`https://liujiayii.github.io/uni-toolkit/`

## 故障排除

如果部署失败，请检查：

1. GitHub Actions 工作流日志
2. 确保仓库权限设置正确
3. 检查 VitePress 配置是否有语法错误