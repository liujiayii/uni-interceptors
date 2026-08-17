# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

`uni-toolkit` 是一个 uniapp 工具库（npm 包），提供拦截器、Hooks、工具函数和环境检测，用于处理平台兼容性与权限申请。包通过 `exports` 暴露多个子入口：`env` / `hooks` / `interceptors` / `tools` / `types` / `style`。

## 常用命令（包管理器为 pnpm）

```bash
pnpm build          # 标准构建：node scripts/build.js（tsc 编译 + 复制类型/样式到 dist）
pnpm build2         # 备用构建：tsdown（配置见 tsdown.config.ts）
pnpm dev            # 构建产物不完全的 watch 开发（tsc --watch，不带复制步骤）
pnpm test           # vitest（watch）
pnpm test:run       # vitest 单次运行
pnpm lint           # eslint .（antfu 配置 + unocss）
pnpm typecheck      # tsc --noEmit
pnpm check          # lint + typecheck + test:run（提交前完整检查）
pnpm check:fast     # typecheck + test:run
pnpm docs:dev       # VitePress 本地文档
```

## 架构要点

### 为什么用自定义 build 而不是 tsdown

`pnpm build` 走 `scripts/build.js`，流程为：`tsc` 编译 → 物理复制 `src/typings/*.d.ts` 到 `dist/types/` → 复制 `src/style/` 到 `dist/style/`。之所以不能只靠 tsc：**纯 `declare global` 的 `.d.ts`（src/typings 下）在 `declaration: true` 下不会生成产物**，但消费端依赖它们。若改动 `src/typings/` 下的声明文件，必须重新 `pnpm build`（不是 dev），否则 dist 不同步。

`tsdown.config.ts`（build2）是另一个候选打包器，入口与 package.json exports 对齐。注意 tsdown 配置里 `treeshake: false`——因为源码含 uniapp 条件编译宏（见下），treeshake 会误删代码。两套构建若都维护，保持一致的标准入口文件列表。

### 多入口与导出约定

- `package.json` `exports` 定义各子路径对应的 dist 文件；`src/index.ts` 是根导出入口，同时每个模块有自己的聚合入口（`src/hooks/index.ts`、`src/interceptors/index.ts`、`src/tools/index.ts`、`src/env/index.ts`）。
- **新增功能三处导出**：模块内聚合 index.ts → `src/index.ts`（根导出，含类型）→ `src/hooks|tools|.../index.ts`。漏掉任何一处会导致某个子入口缺失导出。
- 全局类型声明聚合入口 `src/typings/index.d.ts`（pure reference 聚合），依赖关系图中被 `src/index.ts` 通过 `export type { MiniProgramPlatform }` 带到消费端。

### uniapp 条件编译（最关键）

源码广泛使用 `// #ifdef MP-ALIPAY` / `// #ifdef MP-WEIXIN` / `// #endif` 等平台条件编译宏（例如 `src/tools/permissionAuth/index.ts` 里按平台切换权限键）。这些宏是**给 uniapp 编译器看的预处理指令**，不是普通注释——改动相关分支时不要删掉它们，且要保持每个 `#ifdef` 有配对的 `#endif`。各平台的 API 差异都靠这个机制处理。

### 全局类型与消费端接入

`src/typings/` 拆分多个 `.d.ts`（platform / umtrack / uni / window / index），通过 `index.d.ts` 用 `/// <reference path>` 聚合。消费端在 tsconfig 的 `"types"` 数组加 `"uni-toolkit/types"` 即可引入全部 uni 全局补充声明。修改这些声明会影响所有使用该包的工程类型检查。

### 测试

vitest 配置 `tests/setupUni.ts` 作为 setupFile（mock 全局 `uni`）。新增用例时参考已有测试的 mock 方式。权限类、拦截器类测试通常需要 mock `uni.xxx` 系列 API。

## 发布与版本管理

- 用 **changesets** 管理版本与变更日志：`pnpm changeset` 添加变更集（`commit: false`，改完手动提交），CI 的 `release.yml` 在 main 合并后自动发版到 npm。
- pnpm-workspace 只包含根包 + playground；`playground` 在 changesets 的 `ignore` 里（不发布）。
- 提交信息用语义化格式（`feat|fix|docs|chore(scope): subject`），已有 `.husky` + `lint-staged` 在提交时跑 eslint 自动修复。

## 目录约定

- 每个功能模块 = 一个目录，含 `index.ts`（实现）+ 同名 `*.md`（文档）。
- `src/tools/convertHtmlToText/` 等模块只有实现没有 `.md`，是例外，新增功能默认应同时补文档。
- `src/style/nvue.scss` 是唯一样式源，构建时复制到 dist。
