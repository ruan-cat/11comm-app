# 杂项提示词

各类杂七杂八的提示词，不一定和本项目有关。

## 001 <!-- 该任务迁移到monorepo项目处置了 --> 处理 cursor 无法识别读取 claude code 插件商城 sh 脚本并反复打开的问题

我在 cursor 每次实现对话时，每次都会自动打开 C:\Users\pc.claude\plugins\cache\ruan-cat-tools\common-tools\3.2.0\scripts\user-prompt-logger.sh 和 C:\Users\pc.claude\plugins\cache\ruan-cat-tools\common-tools\3.2.0\scripts\task-complete-notifier.sh 文件，我知道我在 cursor 内配置了读取是被 claude code 的插件商城，读取识别了全局的 hooks 并执行，但是我很不满意这个自动打开文件的做法。这导致页面不断的打开最新发布的 claude code 插件商城 sh 脚本，打断了我开发的心流状态。很影响我的开发状态；

是这个文件无法识别执行么？是里面的工作目录或者是环境变量写法，导致 cursor 无法执行 claude code 插件商城的 hooks sh 脚本么？

还是什么缘故？

我要修改的事 cursor 配置？还是去合理的修改这两个 .sh 的逻辑呢？

这两个 .sh 实际上来自于： D:\code\github-desktop-store\gh.ruancat.monorepo\ai-plugins\common-tools\scripts 项目提供的 sh 脚本。你看看是不是有写法不兼容的问题，导致 cursor 无法实现默认识别读取的故障？

## 002 <!--（canonical 已迁移） --> 全面重构项目的远程 github 链接

本项目的 GitHub 托管已由 `https://github.com/nwt-q/001-Smart-Community` 迁移至 **`https://github.com/ruan-cat/11comm-app`**（nwt-q 将权限移交给 ruan-cat）。

- **本地**：`origin` 应使用 `https://github.com/ruan-cat/11comm-app.git`（若仍为旧 URL，请执行 `git remote set-url origin https://github.com/ruan-cat/11comm-app.git`）。
- **说明**：GitHub 可能对旧仓库保留重定向，但文档、CI 与 Vercel 绑定的仓库\_slug 应以新地址为准。

## 003 <!-- 已完成 --> 优化项目对 `11commAppH5` 和 `11commAppNitroServer` 域名别名的使用

我们项目存在写死的域名地址，我希望现在全部改写，全部改成从 `@ruan-cat/domains` 内获取，从 `https://dm.ruancat6312.top/` 获取 `@ruan-cat/domains` 包的使用方式。

具体别名： https://github.com/ruan-cat/monorepo/pull/99

注意使用获取别名的方式，获取到具体的配置。

## 004 <!-- TODO: --> 拓展增强 codex 通知能力

找到本机的的全局 codex 用户配置：

```toml
notify = ["powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "C:\\Users\\你的用户名\\.codex\\codex-notify-ccntf.ps1"]

[tui]
notifications = true
notification_method = "auto"
```

codex-notify-ccntf.ps1

```bash
param(
    [string]$PayloadJson
)

$ErrorActionPreference = "SilentlyContinue"

if ([string]::IsNullOrWhiteSpace($PayloadJson)) {
    exit 0
}

try {
    $payload = $PayloadJson | ConvertFrom-Json
} catch {
    exit 0
}

if ($payload.type -ne "agent-turn-complete") {
    exit 0
}

$message = ""
if ($payload."last-assistant-message") {
    $message = [string]$payload."last-assistant-message"
} elseif ($payload."input-messages") {
    $message = [string]::Join(" ", $payload."input-messages")
} else {
    $message = "Codex 任务已完成，请回到终端查看。"
}

if ($message.Length -gt 120) {
    $message = $message.Substring(0, 120) + "..."
}

$taskDescription = ""
if ($payload.cwd) {
    $taskDescription = [string]$payload.cwd
}

@ruan-cat/claude-notifier task-complete `
  --title "Codex" `
  --message $message `
  --task-description $taskDescription `
  --sound success `
  --icon success
```
