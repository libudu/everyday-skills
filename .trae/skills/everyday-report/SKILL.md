---
name: "everyday-report"
description: "根据当天 Git 提交记录生成 AI 日报。当用户要求写日报、汇总今日提交或写工作总结时调用。"
---

# 日报生成助手 (Everyday Report Generator)

这个 Skill 会帮助你读取当前项目下当天的所有 Git 提交记录，并基于这些记录自动生成一份满足特定要求的日报。

## 运行与执行流程

当用户触发此 Skill 时，你需要**严格按照以下顺序**执行操作：

1. **执行汇总命令**：
   在终端中运行以下命令，提取今天的 Git 提交记录到当前项目根目录：
   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
   git log --since="midnight" --author="$(git config user.email)" --date=iso --pretty=format:"%ad | %s" | Out-File -Encoding utf8 commits_today.txt
   ```
   *注意：这会在项目根目录生成* *`commits_today.txt`* *文件。*
2. **读取提交记录**：
   使用文件读取工具（Read），读取项目根目录下的 `commits_today.txt` 文件，分析今天的提交内容。
3. **生成并输出日报**：
   根据你读取到的提交内容，归纳总结并向用户输出一份日报。**必须严格遵守以下所有规则**：
   - **条数限制**：至少包含 3 条工作项。
   - **字数限制**：每条工作项**只需要一句话**。
   - **时间分配**：为每条工作项分配一个合理的估时，**确保所有工作项的总时长大约 8 小时**。
   - **输出要求**：不要输出任何多余的废话或解释，直接给出日报结果。

## 日报输出示例模板

- 修复了用户登录界面的数据校验 Bug。（估时：2小时）
- 重构了首页的核心组件，优化了页面的加载性能。（估时：4小时）
- 补充并更新了项目的 API 接口文档说明。（估时：2小时）

