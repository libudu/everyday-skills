---
name: "everyday-start-coding"
description: "自动化日常代码同步：fetch，stash，rebase，pop。当用户想要开始写代码或同步代码时调用。"
---

# Everyday Start Coding

此 Skill 用于自动化日常代码同步流程。为防止输出分页导致流程卡死，所有 git 命令均应使用 `--no-pager` 选项。请按照以下步骤执行：

1.  **Fetch 远程分支**
    - 执行命令: `git --no-pager fetch --all`

2.  **确定目标分支**
    - 执行命令: `git --no-pager branch -r` 获取远程分支列表。
    - 检查是否存在 `origin/dev`，如果存在则目标为 `origin/dev`。
    - 否则检查 `origin/main`，如果存在则目标为 `origin/main`。
    - 否则检查 `origin/master`，如果存在则目标为 `origin/master`。
    - 如果都找不到，询问用户目标分支。

3.  **检查并 Stash 本地更改**
    - 执行命令: `git --no-pager status --porcelain`
    - 如果输出不为空（有未提交的更改）：
      - 执行命令: `git --no-pager stash push -m "Auto-stash by everyday-start-coding"`
      - 记录已执行 stash 操作。

4.  **Rebase**
    - 执行命令: `git --no-pager rebase <目标分支>` (例如 `git --no-pager rebase origin/dev`)
    - **检查结果**:
      - 如果成功（exit code 0）：继续下一步。
      - 如果失败（有冲突）：
        - 提示用户："Rebase 过程中发现冲突。请手动解决冲突，然后运行 `git rebase --continue`。"
        - **重要**: 如果之前执行了 stash，提醒用户："解决冲突并 rebase 完成后，请记得运行 `git stash pop` 找回您的更改。"
        - 停止执行。

5.  **Stash Pop**
    - 只有在步骤 3 中执行了 stash 操作，且步骤 4 rebase 成功的情况下执行。
    - 执行命令: `git --no-pager stash pop`
    - **检查结果**:
      - 如果成功：流程结束，提示用户："代码已同步，工作现场已恢复。"
      - 如果失败（pop 冲突）：
        - 提示用户："Stash pop 过程中发现冲突。请手动解决冲突。"
        - 停止执行。

6.  **完成**
    - 如果一切顺利，提示用户："Happy Coding! 代码已同步至最新。"
