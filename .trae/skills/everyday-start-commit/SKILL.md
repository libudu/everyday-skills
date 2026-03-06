---
name: "everyday-start-commit"
description: "帮助用户分析当前项目的变更，并生成包含合适提交信息的 git commit 命令。当用户想要提交代码或生成 commit message 时调用。"
---

# Smart Commit Skill

此 Skill 旨在通过分析当前工作区中的代码变更，自动生成符合规范的 git 提交信息。

## 功能描述

当用户需要提交代码时，此 Skill 会：

1. **检测变更**：自动运行 git 命令获取当前项目中已修改的文件列表。
2. **分析差异**：通过 `git diff` 查看具体修改内容，理解变更的上下文。
3. **生成提交**：根据变更内容生成一句简洁、准确的 git commit message，并构建完整的 `git commit` 命令。

## 使用场景

- 用户输入 "提交代码" 或 "commit changes"
- 用户询问 "这次修改了什么？帮我写个提交信息"
- 用户想直接生成 git commit 命令

## 助手操作指南

当触发此 Skill 时，助手应按以下步骤执行：

1. **获取状态**
   - 运行 `git status` 查看工作区状态。
   - 运行 `git --no-pager diff` (针对未暂存的修改) 或 `git --no-pager diff --cached` (针对已暂存的修改) 获取详细变更内容。

2. **生成信息**
   - 分析 diff 内容，提炼出变更的核心意图（如：修复 bug、新增功能、重构代码等）。
   - 生成符合 Conventional Commits 规范的提交信息，**且描述部分必须使用中文**（例如：`feat: 增加登录页面`, `fix: 解决空指针异常`）。

3. **构建命令**
   - 如果用户未暂存文件，建议使用 `git add .` 后跟 `git commit -m "..."`，或者直接使用 `git commit -am "..."`（注意：`-a` 仅对已跟踪文件有效）。
   - 如果用户已暂存文件，生成 `git commit -m "..."`。

4. **输出建议**
   - 将生成的命令以代码块形式展示给用户，等待用户确认或直接执行。
