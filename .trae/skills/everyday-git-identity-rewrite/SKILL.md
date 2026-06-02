---
name: "everyday-git-identity-rewrite"
description: "重写当前仓库 Git 提交记录中的作者/提交者姓名和邮箱，并同步迁移 tag。当用户明确要求把某姓名邮箱替换成另一组身份信息时调用。"
---

# Git 提交身份替换助手

这个 Skill 用于在**当前 Git 仓库**中批量重写历史提交记录里的姓名和邮箱，适用于用户误用公司 Git 身份提交个人项目、希望移除敏感身份信息的场景。

## 触发场景

当用户明确提出以下意图时调用：

- 要求替换、修改、重写当前仓库历史提交中的姓名和邮箱。
- 要求把旧的 Git 身份批量替换成新的 Git 身份。
- 明确提到要处理历史提交、提交记录、作者信息、邮箱信息、tag 一并迁移。

典型表达示例：

- 将当前仓库所有提交记录中的姓名“张三”和邮箱“zhangsan@gongsi.cn”替换为姓名“jack”和邮箱“jack@gmail.com”
- 帮我把历史提交里的公司邮箱改成个人邮箱
- 把这个仓库以前误提交的作者姓名和邮箱都改掉

## 必要信息

执行前，必须从用户输入中明确拿到以下 4 个字段：

- 旧姓名
- 旧邮箱
- 新姓名
- 新邮箱

如果用户没有明确说明这 4 个字段，**不要进行任何 Git 重写操作**，必须先追问。例如：

- 要替换的旧姓名和旧邮箱分别是什么？
- 要改成的新姓名和新邮箱分别是什么？

## 执行原则

1. 仅处理**当前仓库**。
2. 在真正改写历史前，先做检查并告知风险。
3. 重写时同时处理：
   - author name / author email
   - committer name / committer email
   - tags
4. 重写结束后必须校验：
   - 当前仓库历史提交中已不再包含旧姓名或旧邮箱
5. 最终必须向用户汇总：
   - 一共修改了多少个提交
   - 是否检测并处理了 tag
   - 校验结果是否通过

## 标准执行流程

### 1. 参数确认

从用户请求中提取并复述以下变量：

- `<old_name>`
- `<old_email>`
- `<new_name>`
- `<new_email>`

若任一缺失，停止执行并向用户追问。

### 2. 环境检查

先确认当前目录是 Git 仓库：

```powershell
git rev-parse --is-inside-work-tree
```

如果不是 Git 仓库，直接告知用户无法执行。

然后检查工作区状态：

```powershell
git status --short
```

如果工作区不干净，不要直接忽略，先提醒用户：

- 改写历史会重写 commit 和 tag
- 如果仓库已经推送到远端，后续通常需要强推
- 已签名 tag 或提交的签名会失效

若存在未提交改动，优先提醒用户先自行确认是否继续；只有在用户仍然明确要求继续时再执行。

### 3. 统计待修改提交数

先统计当前仓库里命中旧身份的提交数量。统计时要同时检查 author 和 committer：

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$oldName = '<old_name>'
$oldEmail = '<old_email>'
$matches = git --no-pager log --all --format='%H%x09%an%x09%ae%x09%cn%x09%ce' |
  Where-Object {
    $_ -match [regex]::Escape($oldName) -or $_ -match [regex]::Escape($oldEmail)
  }
$matchCount = ($matches | Where-Object { $_ -ne '' }).Count
```

如果 `$matchCount` 为 `0`，直接告知用户当前仓库没有发现待替换的历史提交，不执行改写。

### 4. 执行历史重写

优先使用 Git 内置可用的 `filter-branch` 方案，保证无需额外安装工具，同时带上 tag 迁移参数。

执行命令前，先将变量替换为用户提供的真实值：

```powershell
$env:FILTER_BRANCH_SQUELCH_WARNING = '1'
$env:OLD_NAME = '<old_name>'
$env:OLD_EMAIL = '<old_email>'
$env:NEW_NAME = '<new_name>'
$env:NEW_EMAIL = '<new_email>'

git filter-branch --force --tag-name-filter cat --env-filter "
if [ `"`$GIT_AUTHOR_NAME`" = `"`$OLD_NAME`" ] || [ `"`$GIT_AUTHOR_EMAIL`" = `"`$OLD_EMAIL`" ]; then
  export GIT_AUTHOR_NAME=`"`$NEW_NAME`"
  export GIT_AUTHOR_EMAIL=`"`$NEW_EMAIL`"
fi
if [ `"`$GIT_COMMITTER_NAME`" = `"`$OLD_NAME`" ] || [ `"`$GIT_COMMITTER_EMAIL`" = `"`$OLD_EMAIL`" ]; then
  export GIT_COMMITTER_NAME=`"`$NEW_NAME`"
  export GIT_COMMITTER_EMAIL=`"`$NEW_EMAIL`"
fi
" -- --all
```

注意事项：

- 必须保留 `--tag-name-filter cat`，以确保 tag 一起迁移。
- 必须保留 `-- --all`，以确保所有分支和 tag 都参与重写。
- 如果命令失败，向用户展示核心报错并停止，不要伪造成功结果。

### 5. 清理重写备份引用

历史重写成功后，继续清理 `filter-branch` 生成的备份引用，避免校验时旧信息仍可被检出：

```powershell
git for-each-ref --format="%(refname)" refs/original/ | ForEach-Object { git update-ref -d $_ }
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### 6. 校验旧身份是否已消失

重新扫描当前仓库历史记录：

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$oldName = '<old_name>'
$oldEmail = '<old_email>'
$remaining = git --no-pager log --all --format='%H%x09%an%x09%ae%x09%cn%x09%ce' |
  Where-Object {
    $_ -match [regex]::Escape($oldName) -or $_ -match [regex]::Escape($oldEmail)
  }
$remainingCount = ($remaining | Where-Object { $_ -ne '' }).Count
```

判定规则：

- 如果 `$remainingCount` 为 `0`：校验通过。
- 如果 `$remainingCount` 大于 `0`：说明旧敏感信息仍存在，必须如实告知用户校验失败，并附上剩余数量。

### 7. 统计 tag 情况

为了在报告中说明 tag 是否一并迁移，可在执行前后分别读取 tag 数量：

```powershell
$tagCount = (git tag | Measure-Object).Count
```

如果 `$tagCount` 大于 `0`，在结果中明确说明本次已对 tag 一并完成迁移重写。

### 8. 输出结果

最终回复用户时，必须包含以下信息：

- 旧身份：`<old_name> / <old_email>`
- 新身份：`<new_name> / <new_email>`
- 命中的历史提交数：`<matchCount>`
- tag 数量：`<tagCount>`
- 校验剩余命中数：`<remainingCount>`
- 结论：成功 / 失败

推荐输出示例：

- 已将当前仓库历史提交中的 `张三 / zhangsan@gongsi.cn` 替换为 `jack / jack@gmail.com`。
- 本次共重写 `12` 个提交，检测到 `3` 个 tag，并已随历史一并迁移。
- 重写后复查历史提交，旧身份命中数为 `0`，校验通过。
- 如果该仓库已有远端分支或 tag，后续需要由你自行确认并执行强制推送。

## 失败处理

出现以下任一情况时，不要假装完成，必须如实说明：

- 用户未提供完整的旧/新姓名邮箱
- 当前目录不是 Git 仓库
- 历史提交中没有命中旧身份
- `git filter-branch` 执行失败
- 校验后仍然存在旧身份信息

## 额外要求

- 不要在缺失参数时自行猜测姓名或邮箱。
- 不要只替换 author，不替换 committer。
- 不要漏掉 tag。
- 不要省略最终校验。
- 不要省略修改提交数统计。
- 如果仓库已连接远端，可补充提醒用户：重写历史后推送通常需要使用 `--force-with-lease` 或等价方式，但除非用户明确要求，否则不要代替用户直接推送。
