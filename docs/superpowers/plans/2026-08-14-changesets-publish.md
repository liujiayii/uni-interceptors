# Changesets 自动发布流程 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 接入 Changesets 全自动 Release PR 发布闭环，实现「PR 带 changeset → 合并 main → 机器人开 Release PR → 合并即自动发包」的零本地命令流程。

**Architecture:** 用 `.changeset/config.json` 配置变更记录策略，用 `changesets/action` 在 push 到 main 时自动开 Release PR 或发包，用 `@changesets/changelog-github` 生成带 GitHub 链接的 CHANGELOG，废弃旧的 `v*` tag 发布 workflow。

**Tech Stack:** pnpm 10.34.5、Node 24.19.0、@changesets/cli 3.0.0、@changesets/changelog-github 1.0.0、changesets/action@v1、GitHub Actions。

## Global Constraints

- 包管理器固定 `pnpm@10.34.5`（由 package.json `packageManager` 字段约束，workflow 用 `pnpm/action-setup@v6` 自动识别）。
- Node 版本固定 `24.19.0`（与现有 build-test.yml / npm-publish.yml 对齐，由 renovate 管）。
- 仓库 `owner/repo` 为 `liujiayii/uni-toolkit`。
- npm secret 名为 `NPM_ACCESS_TOKEN`（旧 npm-publish.yml 已在用，复用，不新建）。
- 代码与注释用中文。
- fixed 模式单包同步发版（`fixed: [["uni-toolkit"]]`）。
- `baseBranch` 为 `main`。
- 不改动 build-test.yml / unit-test.yml / deploy-docs.yml / renovate.json / `deploy` 脚本。

---

## File Structure

| 文件                                | 责任                                                                                          | 动作 |
| ----------------------------------- | --------------------------------------------------------------------------------------------- | ---- |
| `.changeset/config.json`            | Changesets 核心配置：changelog 生成方式、版本策略、access、baseBranch                         | 新建 |
| `.changeset/README.md`              | 给协作者看的 changeset 写法说明（README 是 changesets 约定保留名，不会被当作 changeset 消费） | 新建 |
| `CHANGELOG.md`                      | 空账本，仅含标题，后续版本由 changesets 自动追加                                              | 新建 |
| `.github/workflows/release.yml`     | 发布 workflow：push 到 main 时开 Release PR 或发包                                            | 新建 |
| `.github/workflows/npm-publish.yml` | 旧 `v*` tag 发布流程，与新流程冲突                                                            | 删除 |
| `package.json`                      | 加 changesets 依赖与 `changeset` 脚本                                                         | 改动 |

---

### Task 1: 安装 changesets 依赖与脚本

**Files:**

- Modify: `package.json`

**Interfaces:**

- Produces: `package.json` 的 devDependencies 新增 `@changesets/cli: ^3.0.0`、`@changesets/changelog-github: ^1.0.0`；scripts 新增 `"changeset": "changeset"`。后续任务依赖 `pnpm changeset` 命令可用。

- [ ] **Step 1: 安装依赖**

Run:

```bash
pnpm add -D @changesets/cli@^3.0.0 @changesets/changelog-github@^1.0.0
```

Expected: 安装成功，`package.json` 的 devDependencies 出现两个新包，pnpm-lock.yaml 更新。

- [ ] **Step 2: 加 changeset 脚本**

把 `package.json` 的 `"scripts"` 块里，在 `"clean": "rimraf dist",` 之前插入一行 `"changeset": "changeset",`。

改完后 scripts 开头应为（仅示意开头两行，其余既有脚本保持不变）：

```json
{
  "scripts": {
    "changeset": "changeset",
    "clean": "rimraf dist"
  }
}
```

- [ ] **Step 3: 验证命令可用**

Run:

```bash
pnpm changeset --help
```

Expected: 打印 changeset CLI 帮助信息，证明安装成功、脚本生效。

- [ ] **Step 4: 提交**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: 安装 @changesets/cli 与 @changesets/changelog-github"
```

---

### Task 2: 创建 .changeset/config.json

**Files:**

- Create: `.changeset/config.json`

**Interfaces:**

- Consumes: Task 1 安装的 `@changesets/changelog-github`。
- Produces: `.changeset/config.json`，后续 changesets/action 与本地 `pnpm changeset version` 都依赖此配置。

- [ ] **Step 1: 创建配置文件**

新建 `.changeset/config.json`，内容：

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": ["@changesets/changelog-github", { "repo": "liujiayii/uni-toolkit" }],
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

> 说明：新版 `@changesets/config` schema 仅接受 `"minor" | "patch"`，不再接受 `false`。单包仓库无 internal 依赖，此字段无实际作用，用 `"patch"` 即可。

> 说明：`fixed` 留空。changesets v3 不再把根包纳入 fixed 校验，单包仓库无多包同步发版需求，留空即可（原 spec 写 `fixed: [["uni-toolkit"]]` 会报 "does not match any package" 错误）。

- [ ] **Step 2: 验证配置被识别**

Run:

```bash
pnpm changeset status
```

Expected: 输出当前 changeset 状态（此时无未消费 changeset，应输出无包需发布或类似空状态），无报错。若配置有误会在此报错。

- [ ] **Step 3: 提交**

```bash
git add .changeset/config.json
git commit -m "chore: 新增 .changeset/config.json 配置"
```

---

### Task 3: 创建 .changeset/README.md

**Files:**

- Create: `.changeset/README.md`

**Interfaces:**

- 无外部接口依赖。README 是 changesets 约定保留名，不会被当作 changeset 消费，纯文档。

- [ ] **Step 1: 创建说明文件**

新建 `.changeset/README.md`，内容：

````markdown
# Changesets

本目录用于记录每次变更，发布流程由 [Changesets](https://github.com/changesets/changesets) 驱动。

## 如何添加一个变更记录

在提 PR 前，运行：

```bash
pnpm changeset
```

按交互提示选择：

1. **影响的包**：本仓库为单一包 `uni-toolkit`，直接选它。
2. **变更级别**（semver）：
   - `patch`：修 bug、小修复，不破坏兼容性（0.6.0 → 0.6.1）
   - `minor`：新增功能，向后兼容（0.6.0 → 0.7.0）
   - `major`：破坏性变更（0.6.0 → 1.0.0）
3. **变更描述**：一句话写清改了啥，会进 CHANGELOG。

执行后会在本目录生成一个 `随机名.md` 文件，把它和你的代码改动一起提交。

## 变更记录文件格式

也可手写，格式如下：

```markdown
---
"uni-toolkit": minor
---

这里写变更描述
```

## 注意

- `README.md` 是 changesets 约定保留名，不会被当作变更记录消费，仅作说明。
- 合并到 main 后，机器人会自动开一个 Release PR 收集所有未消费的变更记录、bump 版本号、更新 CHANGELOG，合并该 Release PR 即自动发布到 npm。
````

- [ ] **Step 2: 提交**

```bash
git add .changeset/README.md
git commit -m "docs: 新增 .changeset/README.md 变更记录写法说明"
```

---

### Task 4: 初始化 CHANGELOG.md

**Files:**

- Create: `CHANGELOG.md`

**Interfaces:**

- 无外部接口依赖。changesets 在 bump 版本时向此文件追加内容，初始只需标题占位。

- [ ] **Step 1: 创建空账本**

新建 `CHANGELOG.md`，内容：

```markdown
# Changelog
```

- [ ] **Step 2: 提交**

```bash
git add CHANGELOG.md
git commit -m "docs: 初始化 CHANGELOG.md"
```

---

### Task 5: 创建 release.yml workflow

**Files:**

- Create: `.github/workflows/release.yml`

**Interfaces:**

- Consumes: Task 2 的 `.changeset/config.json`；secrets `GITHUB_TOKEN`（Actions 自动注入）、`NPM_ACCESS_TOKEN`（仓库已有）。
- Produces: push 到 main 时自动开 Release PR 或发布到 npm。

- [ ] **Step 1: 创建 workflow 文件**

新建 `.github/workflows/release.yml`，内容：

```yaml
name: Release

# 当代码合并到 main 时触发：有未消费 changeset 则开 Release PR，否则发布
on:
  push:
    branches: [main]

# 防止并发发布，同分支多次 push 排队不抢占，避免版本号 bump 了但没发包的脏状态
concurrency:
  group: release-${{ github.ref }}
  cancel-in-progress: false

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      # 检出代码
      - name: Checkout
        uses: actions/checkout@v7

      # 安装 pnpm
      - name: Install pnpm
        uses: pnpm/action-setup@v6

      # 设置 Node 与 npm 注册表
      - name: Set Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 24.19.0
          registry-url: https://registry.npmjs.org/
          cache: pnpm

      # 安装依赖
      - name: Install deps
        run: pnpm install

      # 构建
      - name: Build
        run: pnpm run build

      # 核心：有未消费 changeset → 开/更新 Release PR（不发布）；无未消费 changeset（Release PR 刚合并）→ 执行 publish 发包
      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          # 版本号已 bump 时执行的发布命令
          publish: pnpm changeset publish
          # Release PR 的标题与 commit message
          title: "chore(release): 版本发布"
          commit: "chore(release): 版本发布"
        env:
          # changesets/action 用 GITHUB_TOKEN 开 Release PR
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          # changesets/action 把 NPM_TOKEN 注入 .npmrc，发包时自动用；复用现有 NPM_ACCESS_TOKEN secret
          NPM_TOKEN: ${{ secrets.NPM_ACCESS_TOKEN }}
```

- [ ] **Step 2: 验证 YAML 语法**

Run:

```bash
node -e "const yaml=require('fs').readFileSync('.github/workflows/release.yml','utf8'); require('js-yaml').load(yaml); console.log('YAML OK')"
```

Expected: 打印 `YAML OK`。

> 若本机无 `js-yaml`，可改用 `pnpm dlx js-yaml .github/workflows/release.yml` 或直接 `pnpm changeset`（配置若被 workflow 引用，本地 `pnpm changeset status` 不报错即间接证明配置链路通）。最简验证：肉眼核对缩进为 2 空格、键值冒号后有空格。

- [ ] **Step 3: 提交**

```bash
git add .github/workflows/release.yml
git commit -m "ci: 新增 release.yml 自动发布 workflow"
```

---

### Task 6: 删除旧 npm-publish.yml

**Files:**

- Delete: `.github/workflows/npm-publish.yml`

**Interfaces:**

- 无依赖。删除后旧 `v*` tag 不再触发发布，旧 tag 保留作历史记录，不影响。

- [ ] **Step 1: 删除文件**

Run:

```bash
git rm .github/workflows/npm-publish.yml
```

Expected: 文件被删除并暂存。

- [ ] **Step 2: 确认 release.yml 是唯一发布入口**

Run:

```bash
ls .github/workflows/
```

Expected: 输出 `build-test.yml  deploy-docs.yml  release.yml  unit-test.yml`，`npm-publish.yml` 已不在。

- [ ] **Step 3: 提交**

```bash
git commit -m "ci: 废弃 npm-publish.yml 旧 tag 发布流程"
```

---

### Task 7: 本地端到端自测

**Files:**

- 无文件改动，纯验证（最后会 `git restore` 回滚产生的临时 changeset）。

**Interfaces:**

- Consumes: Task 1-6 的全部产出。
- Produces: 验证 `pnpm changeset` → `pnpm changeset version` 链路通，版本号 bump 与 CHANGELOG 追加正确。

- [ ] **Step 1: 生成一个临时 changeset**

Run:

```bash
pnpm changeset
```

交互选择：包 `uni-toolkit` → 级别 `patch` → 描述输入「测试 changesets 流程（将回滚）」。

Expected: `.changeset/` 下新生成一个 `随机名.md` 文件，内容含 frontmatter 与描述。

- [ ] **Step 2: 模拟版本 bump**

Run:

```bash
pnpm changeset version
```

Expected:

- `package.json` 的 `version` 从 `0.6.0` 变为 `0.6.1`
- `CHANGELOG.md` 追加了 `## 0.6.1` 段落，含刚才写的描述
- `.changeset/` 下刚生成的 `随机名.md` 被消费删除

- [ ] **Step 3: 确认产物**

Run:

```bash
git status --short
```

Expected: 看到 `package.json`、`CHANGELOG.md` 被修改，`.changeset/随机名.md` 被删除。

- [ ] **Step 4: 回滚，避免污染**

Run:

```bash
git restore .
git clean -fd .changeset/
```

Expected: 工作区回到干净状态，`package.json` 版本号恢复 `0.6.0`，`CHANGELOG.md` 仅剩标题，`.changeset/` 下无临时文件（仅 `config.json` 与 `README.md`）。

> 注意：若 `git clean -fd .changeset/` 会误删 `config.json`/`README.md`，改为仅删临时 md：`git clean -fd .changeset/*.md` 不生效时，手动 `rm .changeset/<随机名>.md`。本仓库这两个文件已提交，`git restore .` 不会删它们，`git clean -fd` 默认只清未跟踪文件——`config.json`/`README.md` 已跟踪故安全。

- [ ] **Step 5: 确认工作区干净**

Run:

```bash
git status
```

Expected: `working tree clean`。

---

### Task 8: 更新 spec 状态并收尾

**Files:**

- Modify: `docs/superpowers/specs/2026-08-14-changesets-publish-design.md:4`

**Interfaces:**

- 无。

- [ ] **Step 1: 更新 spec 状态**

把 `docs/superpowers/specs/2026-08-14-changesets-publish-design.md` 第 4 行 `- 状态：待实现` 改为 `- 状态：已实现`。

- [ ] **Step 2: 提交**

```bash
git add docs/superpowers/specs/2026-08-14-changesets-publish-design.md
git commit -m "docs: 更新 changesets 设计文档状态为已实现"
```

- [ ] **Step 3: 输出主人手动确认项清单**

向主人输出以下三项，需主人在 GitHub 仓库手动完成（不在代码内）：

1. 安装 Changeset-bot GitHub App：访问 https://github.com/apps/changeset-bot，安装并授权给 `liujiayii/uni-toolkit` 仓库。
2. 确认 workflow 写权限：仓库 Settings → Actions → General → Workflow permissions 勾选 "Read and write permissions"。
3. 确认 npm secret：`NPM_ACCESS_TOKEN` secret 存在且有 publish 权限。
