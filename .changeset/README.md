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
