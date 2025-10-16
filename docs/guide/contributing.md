# 贡献指南

感谢您对 uni-toolkit 的关注！我们欢迎任何形式的贡献，包括报告问题、提出建议、改进文档或提交代码。

## 开发流程

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

## 添加新功能

### 添加新的拦截器

1. 在 `src/interceptors` 目录下创建新的拦截器文件
2. 实现拦截器逻辑，确保支持多平台
3. 在 `src/interceptors/index.ts` 中导出您的拦截器
4. 在 `src/index.ts` 中添加导出
5. 添加相应的测试用例
6. 在 [拦截器文档](/guide/interceptors) 中添加拦截器文档

### 添加新的 Hooks

1. 在 `src/hooks` 目录下创建新的 hook 文件
2. 实现 hook 逻辑，确保类型安全
3. 在 `src/hooks/index.ts` 中导出您的 hook
4. 在 `src/index.ts` 中添加导出
5. 添加相应的测试用例
6. 在 [Hooks 文档](/guide/hooks) 中添加 hook 文档

### 添加新的工具函数

1. 在 `src/tools` 目录下创建新的工具函数文件
2. 实现工具函数逻辑，确保类型安全
3. 在 `src/tools/index.ts` 中导出您的工具函数
4. 在 `src/index.ts` 中添加导出
5. 添加相应的测试用例
6. 在 [工具函数文档](/guide/tools) 中添加函数文档

### 添加新的环境检测功能

1. 在 `src/env` 目录下创建新的环境检测文件
2. 实现环境检测逻辑，确保类型安全
3. 在 `src/env/index.ts` 中导出您的环境检测功能
4. 在 `src/index.ts` 中添加导出
5. 添加相应的测试用例
6. 在 [环境检测文档](/guide/env) 中添加功能文档

## 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 配置
- 添加适当的注释和文档
- 确保代码在所有目标平台上都能正常工作

## 提交规范

我们使用语义化提交消息，请遵循以下格式：

```text
<type>(<scope>): <subject>

<body>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修改 bug 的代码变动）
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动

### Scope 范围

Scope 用于说明本次提交影响的范围，如：interceptors, hooks, tools, env 等。

### Subject 主题

Subject 是对本次提交的简短描述，不超过 50 个字符。

### Body 正文

Body 是对本次提交的详细描述，可以分多行，每行不超过 72 个字符。

## 测试

在提交代码前，请确保：

1. 所有测试用例通过
2. 新功能添加了相应的测试用例
3. 代码覆盖率没有下降

## 文档

在添加新功能时，请确保：

1. 更新相应的文档
2. 添加必要的注释
3. 提供清晰的使用示例

## 问题反馈

如果您发现问题或有改进建议，请：

1. 检查是否已有类似的问题
2. 创建新问题时，提供详细的问题描述和复现步骤
3. 如果可能，提供相应的代码示例

## 许可证

通过贡献代码，您同意您的贡献将在 [MIT 许可证](https://github.com/liujiayii/uni-toolkit/blob/main/LICENSE) 下发布。
