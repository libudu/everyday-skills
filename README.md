# Everyday Skills

这是一个为 Trae IDE 编写的 Skill 集合，旨在通过自动化常见任务和提供特定领域的辅助功能，提升开发效率和体验。

## 已有的 Skills

本项目包含以下 Skill，你可以在 Trae 中直接调用它们：

### 1. Everyday Start Coding (`everyday-start-coding`)

**描述**: 自动化日常代码同步流程。

**功能**:
- 自动 fetch 远程分支。
- 智能检测并 stash 本地未提交的更改。
- 自动 rebase 到目标分支（如 `origin/dev`, `origin/main`）。
- Rebase 成功后自动 pop stash，恢复工作现场。

**使用场景**: 当你开始一天的工作，或者想要同步最新代码时调用。

### 2. Smart Commit (`everyday-start-commit`)

**描述**: 智能分析代码变更并生成提交信息。

**功能**:
- 分析工作区的文件变更（`git status` 和 `git diff`）。
- 自动生成符合 Conventional Commits 规范的 commit message。
- 构建完整的 git commit 命令供用户执行。

**使用场景**: 当你完成了一部分工作想要提交代码，或者不知道如何写 commit message 时调用。

### 3. Skill Generator (`everyday-start-skill`)

**描述**: 帮助用户快速创建和配置新的 Skill。

**功能**:
- 引导用户通过交互式问答定义新 Skill 的名称、功能和触发条件。
- 自动在 `.trae/skills/` 目录下生成标准的 Skill 结构和 `SKILL.md` 文件。
- 确保生成的 Skill 符合 Trae 的规范，便于立即使用。

**使用场景**: 当你想要扩展 Trae 的能力，添加自定义功能或新 Skill 时调用。

### 4. Porn Novel Assistant (`everyday-porn-novel`)

**描述**: 专注于色情小说创作和续写的辅助工具。

**功能**:
- **想法孵化**: 将模糊的灵感转化为具体的创作蓝图。
- **故事分析**: 深入分析现有小说内容，生成角色档案、情节梳理等文档。
- **大纲制定**: 根据分析结果或用户要求，生成详细的分章大纲。
- **正文续写**: 基于大纲和上下文，创作高质量的小说正文。

**使用场景**: 当你需要创作、续写或分析色情小说内容时调用。

## 如何使用

在 Trae 的对话框中，你可以通过自然语言描述你的需求，Trae 会根据 skill 的描述自动选择合适的工具。例如：

- "帮我同步一下代码" -> 触发 `everyday-start-coding`
- "我要提交代码" -> 触发 `everyday-start-commit`
- "创建一个新的 skill" -> 触发 `everyday-start-skill`
- "续写这篇小说" -> 触发 `everyday-porn-novel`
