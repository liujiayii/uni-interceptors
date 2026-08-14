# 接入 Changesets 自动发布流程 — 设计文档

- 日期：2026-08-14
- 状态：已实现
- 分支：feat/new-hooks-and-tools

## 1. 背景与目标

当前仓库 `uni-toolkit` 采用手动 tag 发布流程：开发者本地修改 `package.json` 版本号、手动打 `v*` tag、推送后由 `.github/workflows/npm-publish.yml` 触发 `npm publish`。该流程存在版本号易写错、CHANGELOG 需手写、发布动作依赖人工记忆等问题。

目标：接入 Changesets 全自动 Release PR 发布闭环，实现「PR 带 changeset → 合并 main → 机器人开 Release PR → 合并即自动发包」的零本地命令流程。

## 2. 范围

### 包含

- 新增 `.changeset/config.json` 与 `.changeset/README.md`
- 新增 `.github/workflows/release.yml`（changesets/action）
- 初始化空 `CHANGELOG.md`
- `package.json` 增加 `@changesets/cli`、`@changesets/changelog-github` 依赖与 `changeset` 脚本
- 删除 `.github/workflows/npm-publish.yml`（旧 tag 流程废弃）

### 不包含

- 不改动 `build-test.yml`、`unit-test.yml`、`deploy-docs.yml`
- 不回填 v0.6.0 之前的历史 CHANGELOG
- 不在代码/配置文件中安装 Changeset-bot 的 GitHub App（App 安装属主人手动操作项，见第 6 节）

## 3. 整体架构

```
开发：开 PR 写代码
  └─ 在同一 PR 里加一个 .changeset/*.md（记录变更级别 + 描述）
       └─ Changeset-bot（GitHub App）：自动在 PR 里渲染变更摘要，缺 changeset 时提醒
  └─ CI（build-test / unit-test）：对 PR 跑 lint / typecheck / test / build
合并到 main：
  └─ changesets/action 检测到未消费 changeset → 自动开「Release PR」
       └─ 内容：bump package.json 版本号 + 追加 CHANGELOG.md + 消费掉 changeset 文件
       └─ 该 PR 由机器人维护，主人点合并即可
合并 Release PR：
  └─ changesets/action 再次运行，检测到无未消费 changeset 但版本号已 bump
       └─ 执行 pnpm build + npm publish，发布到 npm
```

两个机器人协作：

- **Changeset-bot（GitHub App）**：只读，PR 里提示与渲染，不发布
- **changesets/action（CI workflow）**：开 Release PR、发包

## 4. 文件清单

### 新增

| 文件                            | 作用                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| `.changeset/config.json`        | Changesets 配置（changelog 方式、版本策略、baseBranch 等）                                    |
| `.changeset/README.md`          | 给协作者看的 changeset 写法说明（README 是 changesets 约定保留名，不会被当作 changeset 消费） |
| `.github/workflows/release.yml` | 发布 workflow                                                                                 |
| `CHANGELOG.md`                  | 空账本，仅含标题，后续版本由 changesets 自动追加                                              |

### 改动

| 文件                  | 改动                                                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `package.json`        | 加 `@changesets/cli`、`@changesets/changelog-github` 到 devDependencies；加 `"changeset": "changeset"` 脚本           |
| `pnpm-workspace.yaml` | `packages` 字段加 `- .` 让 changesets v3 把根包 `uni-toolkit` 识别为可发布工作区包（v3 不再把根目录包默认纳入工作区） |

### 删除

| 文件                                | 原因                                     |
| ----------------------------------- | ---------------------------------------- |
| `.github/workflows/npm-publish.yml` | 旧 `v*` tag 触发发布，与新流程冲突，废弃 |

### 不动

- `.github/workflows/build-test.yml`
- `.github/workflows/unit-test.yml`
- `.github/workflows/deploy-docs.yml`
- `.github/renovate.json`
- `package.json` 的 `deploy` 脚本（docs 部署用，与发布无关）

## 5. 详细设计

### 5.1 `.changeset/config.json`

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
  "ignore": ["playground"]
}
```

字段说明：

- `changelog`：用 `@changesets/changelog-github`，CHANGELOG 每条变更带上对应 PR/commit 的 GitHub 链接
- `fixed: []`：单包仓库，无多包同步发版需求。changesets v3 不再把根包纳入 fixed 校验，留空即可
- `access: "public"`：公开包，发布时 `--access public`
- `baseBranch: "main"`：主分支为 main
- `commit: false`：Release PR 的 commit message 由 action 统一处理
- `updateInternalDependencies: "patch"`：新版 `@changesets/config` schema 仅接受 `"minor" | "patch"`，不再接受 `false`；单包仓库无 internal 依赖，此字段无实际作用
- `ignore: ["playground"]`：忽略 playground 测试包，防止其被误 bump 或发布（playground 是本地调试用包）

### 5.2 `.changeset/README.md`

说明 changeset 写法：级别（patch/minor/major）、描述要求、生成方式（`pnpm changeset` 交互式或手写 markdown）。强调 README 是保留名，不会被消费为 changeset。

### 5.3 `.github/workflows/release.yml`

```yaml
name: Release

on:
  push:
    branches: [main]

# 防止并发发布，同分支多次 push 排队不抢占
concurrency:
  group: release-${{ github.ref }}
  cancel-in-progress: false

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Install pnpm
        uses: pnpm/action-setup@v6

      - name: Set Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 24.19.0
          registry-url: https://registry.npmjs.org/
          cache: pnpm

      - name: Install deps
        run: pnpm install

      - name: Build
        run: pnpm run build

      # 核心：有未消费 changeset → 开/更新 Release PR；版本已 bump → 发布
      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm changeset publish
          title: "chore(release): 版本发布"
          commit: "chore(release): 版本发布"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_ACCESS_TOKEN }}
```

设计决策：

1. **触发时机**：只监听 push 到 main（PR 合并即触发），不再依赖 tag
2. **concurrency `cancel-in-progress: false`**：发布流程不可中途取消，避免版本号 bump 了但没发包的脏状态
3. **action 一个 step 干两件事**：有未消费 changeset → 开/更新 Release PR（不发布）；无未消费 changeset（Release PR 刚合并）→ 执行 `publish` 发包
4. **secret 复用**：`NPM_TOKEN` 映射现有 `NPM_ACCESS_TOKEN` secret，不新建
5. **职责单一**：Release 流程只做 build + publish，lint/test 已由其他 workflow 对 PR 跑过，不重复

### 5.4 `CHANGELOG.md`

仅标题：

```markdown
# Changelog
```

### 5.5 `package.json` 改动

- devDependencies 增加：
  - `@changesets/cli`
  - `@changesets/changelog-github`
- scripts 增加：`"changeset": "changeset"`

## 6. 主人手动确认项（不在代码内完成）

以下为接入后需主人手动操作，spec 中列出以备查：

1. **安装 Changeset-bot GitHub App**：访问 https://github.com/apps/changeset-bot，安装并授权给 `liujiayii/uni-toolkit` 仓库
2. **确认 workflow 写权限**：仓库 Settings → Actions → General → Workflow permissions 勾选 "Read and write permissions"（否则 Release PR 推不上去）
3. **确认 npm secret**：`NPM_ACCESS_TOKEN` secret 已存在（旧流程在用，应已有）；若为 automation token 需确认有 publish 权限

## 7. 错误处理

| 场景                            | 行为                                                                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Release PR 未合并时 push 新代码 | concurrency 排队；action 更新已存在 Release PR 而非新开                                                                           |
| 发包失败（网络/限流/权限）      | workflow 红掉；版本号已 bump 但包未发。重跑 release.yml，changesets 检测到版本号已升但 npm 无此版本，重新 publish，无需回滚版本号 |
| Changeset-bot 未安装            | PR 里无变更摘要渲染、无缺 changeset 提醒；不影响发布主链路                                                                        |
| workflow 无写权限               | Release PR 推送失败；按第 6 节第 2 项修正权限                                                                                     |

## 8. 测试

### 8.1 本地自测

```bash
pnpm changeset          # 交互式生成 changeset，确认 .changeset/ 下产出小票
pnpm changeset version  # 模拟消费：package.json 版本号 bump、CHANGELOG.md 追加、小票删除
git restore .            # 回滚，避免污染工作区
```

### 8.2 CI 端到端验证（接入后首次实战）

1. 开测试 PR 带 changeset → 确认 bot 渲染、release.yml 对 PR 不发包
2. 合到 main → 确认 bot 开出 Release PR、版本号 bump 正确
3. 合并 Release PR → 确认包发到 npm、版本号对得上

## 9. 收尾

- 删除 `npm-publish.yml` 后，旧 `v*` tag 不再触发发布，旧 tag 保留作历史记录
- `deploy` 脚本保留（docs 部署，与发布无关）
