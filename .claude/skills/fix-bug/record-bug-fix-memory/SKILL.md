---
name: record-bug-fix-memory
description: 当用户要求在 bug 已经定位并修复后，记录排错经验、事故结论、AI 记忆更新、复盘摘要或本地 MCP 记忆时使用。这个技能只负责沉淀"发生了什么、为什么会发生、如何修好、以后要记住什么"，不要把它用于实际修复 bug。
---

# 记录 Bug 修复记忆

## 概述

使用这个技能，把已经完成的排错结果沉淀成可复用的长期记忆。

目标是保存根因、有效修复路径、错误假设和验证证据，让后续 agent 不再重复同样的弯路。

核心原则：记录决策链，不记录流水账。

## 何时使用

在以下场景使用这个技能：

- 用户要求更新 AI 记忆文档、记录经验教训、补充事故记录、编写复盘摘要。
- bug 已经完成复现，且有效修复路径已经明确。
- 这条经验是仓库特有知识，应该对未来 agent 可见。
- 需要把结论同步到本地 MCP 记忆，例如 Memorix。

以下情况不要使用这个技能：

- bug 还在调查中，根因没有确认。
- 用户要求的是修复实现，而不是经验沉淀。
- 你手里只有猜测、片段证据或临时绕过方案。

## 前置输入

开始写记忆前，必须能回答下面六个问题：

1. 对用户来说，表面现象是什么？
2. 实际根因是什么？
3. 哪个错误假设或误导信号浪费了时间？
4. 最终是哪一个具体改动修好了问题？
5. 用什么验证证明修复成立？
6. 这条记忆应该写到哪里？

如果有任何一个问题答不上来，先完成排错，不要提前写记忆。

## 写到哪里

- 仓库级、可复用的规则：写到根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`
- 跨会话的本地记忆：写到 Memorix，类型用 `gotcha`、`decision` 或 `problem-solution`
- 包级 prompts、plans、reports：只有用户明确要求时才写进去

默认规则：只要这条经验会影响整个仓库里的未来 agent，就优先写入三个根级 AI 记忆文档，不要埋进包级备注里。

## 记录什么

每条记忆至少要覆盖这六件事：

1. 问题现象：从用户视角看，哪里坏了
2. 根因：真正出错的地方
3. 关键线索：哪条信号把问题从假象拉回真实根因
4. 有效修复：真正解决问题的改动
5. 验证方式：证明修复成功的证据
6. 后续约束：未来 agent 必须先检查什么、避免什么

## 记忆模板

使用简洁、面向未来复用的结构：

- `问题现象：...`
- `根因：...`
- `关键误导点：...`
- `有效修复：...`
- `验证方式：...`
- `后续约束：...`

这些句子应该帮助未来 agent 快速做对事，而不是复述完整排错过程。

## 仓库级经验库

当用户要求"补充 AI 记忆"时，不要只写当次 bug 的表面结论。先检查这次问题是否落在仓库已有事故模式里，再把对应经验合并写入记忆。

---

### z-paging 页面的 onMounted 生命周期被错误修改（2026-03-19）

- **问题现象**：`notice/index.vue` 原本有 `onMounted(() => reload())`，被 agent 两次错误修改：第一次改为 `onShow(() => reload())`（无文档依据），第二次在用户质疑后将其完全删除（过度纠正）。
- **实际根因**：agent 在未完整读取 `.claude/skills/z-paging-integration/SKILL.md` 的情况下，基于自身对框架的理解擅自修改了生命周期调用方式。用户质疑后，agent 查阅了 z-paging 官方文档，得出"onMounted 是冗余的"结论，又将正确代码删除。
- **关键线索**：用户主动质疑"这个写法是不是技能文档要求的"，触发了第二次错误（全删）。
- **关键误导点**：z-paging 官方文档的确说明 `auto: true` 时组件自动加载，但**本项目技能文档明确要求保留 `onMounted(() => reload())`** 作为统一规范。Agent 将"技术上冗余"误读为"必须删除"。
- **有效修复**：恢复 `onMounted(() => { pagingRef.value?.reload() })`，同时在技能文档 Section 13 添加说明："略微冗余但为项目统一规范，所有页面必须包含"。
- **验证方式**：Grep 全项目所有 z-paging 文件，确认全部含有 `onMounted` 或 `onShow` 中的 `reload()` 调用。
- **后续约束**：
  1. **修改任何生命周期调用之前，必须先完整读取对应的 skills 技能文档**，不允许基于框架通用知识或官方文档推翻项目规范。
  2. 当用户质疑某写法时，**正确响应是"读技能文档确认"，而不是立刻承认错误并过度纠正**——先核实，再判断。
  3. 项目规范 > 框架官方文档 > agent 个人推断。三者冲突时，项目规范优先。

---

### 子代理合规检查报告不可盲信（2026-03-19）

- **问题现象**：合规检查子代理报告 `complaint/order.vue` 和 `repair/appraise-reply.vue` 使用了 `<view class="section-title">` 而非 `<FormSectionTitle>`，但实际读取文件后发现这两个文件已经正确使用了 `<FormSectionTitle>`。
- **实际根因**：子代理在读取文件前 60 行时，只看到了 CSS 中的 `.section-title` 类名（样式定义），误认为模板中使用了旧写法。
- **关键误导点**：`.section-title { ... }` 在 `<style>` 段中的类定义，与模板中 `<view class="section-title">` 的使用是两件不同的事，子代理混淆了两者。
- **有效修复**：主 agent 直接用 Grep 搜索 `FormSectionTitle` 和 `<view class="section-title` 关键词，快速确认了实际使用情况，绕过了子代理的误报。
- **验证方式**：`Grep "<view class=\"section-title"` 在目标文件中结果为空，`Grep "FormSectionTitle"` 有结果。
- **后续约束**：
  1. 子代理的合规检查报告，特别是"使用了旧写法"类的报告，**必须用 Grep 独立验证，不可直接信任**。
  2. 检查"是否使用了某个组件"时，要同时搜索**模板区域**，不能被 style 区域的同名 CSS 类误导。
  3. 在基于子代理报告修改代码前，**至少用一个 Grep 命令确认问题确实存在**。

### uni-app 主插件链锁定 Vite 5.2.8（2026-03-24）

- 现象：希望把主仓库直接升级到 `vite@8` 并联动 `vitest@4`，但升级后无法保证 `uni-app` H5 构建链继续可用。
- 根因：截至 `2026-03-24`，即使执行 `pnpm dlx @dcloudio/uvm@latest --manager pnpm`，`@dcloudio/vite-plugin-uni` 仍声明 `peerDependencies.vite = "5.2.8"`，`@uni-helper/vite-plugin-uni-pages` 仍只支持 `vite ^5`。
- 关键信号：`uvm` 只会把 `@dcloudio/*` 主插件链升级到较新的 `5.04` 代次，不会把 Vite 主版本一并抬到 `6/7/8`。
- 容易误判的点：`uni-app` 官方包频繁发版，不代表底层 `vite` 兼容矩阵已经同步升级；必须直接检查相关包的 `peerDependencies`。
- 正确做法：主开发工作区继续保持 `vite 5.2.8`；如果必须验证 `vite@8`，只能放到项目内 `.worktrees/` 隔离工作树中单独实验。
- 验证动作：先运行 `pnpm dlx @dcloudio/uvm@latest --manager pnpm`，再检查 `node_modules/@dcloudio/vite-plugin-uni/package.json` 和 `node_modules/@uni-helper/vite-plugin-uni-pages/package.json` 的 `peerDependencies.vite`，最后执行 `pnpm build:h5`。
- 约束结论：没有官方插件链确认前，不要在主仓库直接升级到 `vite 6/7/8`，否则 `vitest`、`vite` 与 `uni-app` 主插件链会进入硬性不兼容状态。

## 写入经验时必须保留的额外信息

如果这次 bug 与仓库已有事故模式相似，写记忆时不要遗漏下面这些额外信息：

- 这次问题是否打破了某个"用户已确认稳定"的基线
- 是否存在"不要乱改"的配置
- 首个可信信号来自哪里，是终端日志、浏览器 console、网络请求，还是构建输出
- 这次修复属于哪一类：依赖实例统一、废弃 API 清理、导入路径修正、类型断言补齐、构建配置兜底、依赖入口兼容、模板层覆盖、样式层补齐、还是启动前置准备
- 这次是否存在误导性很强的假象
- 最终验证是否基于 fresh 进程、fresh 日志和 fresh 页面，而不是历史缓存

## 验证证据写法

未来写事故记录时，优先记录可重复验证的证据，而不是模糊措辞。

- 好的写法：`pnpm exec tsc --noEmit 输出中相关错误为 0`
- 好的写法：`fresh dev.stderr 为空`
- 好的写法：`修复文件均无类型错误输出`
- 好的写法：`pnpm install 后依赖版本一致，peer dependency 无冲突`
- 不好的写法：`应该没问题了`
- 不好的写法：`看起来像是好了`

## 不要写成什么

把根级 AI 记忆经验吸收到技能里，不等于把技能写成修复手册。下面这些内容不应该成为这个技能的主体：

- 大段命令执行流水
- 与当前仓库无关的泛化 debug 理论
- 逐条罗列所有试错过程
- 把某一次临时绕过方案包装成永久规则
- 用"必须执行这些命令"代替"应该记录哪些结论"

## 记录流程

1. 先确认 bug 已经理解清楚并且修复完成。
2. 把结果压缩成 4 到 6 条高信号事实。
3. 选对记忆落点。
4. 如果是仓库级经验，就更新根级 AI 记忆文档。
5. 用同样的结论更新 Memorix，并选对记忆类型。
   - 如果当前会话没有实际暴露 Memorix MCP 工具，就必须明确告诉用户“本会话无法写入 Memorix”，不能因为 `CLAUDE.md` / `AGENTS.md` 写着“可用”就假定真的已经拿到工具。
6. 回读一遍文本，删掉瞬时噪音、猜测和低价值命令历史。
7. 如果用户还要求提交 commit，把提交动作交给单独的 git 工作流处理。

## 好记忆的特征

- 解释清楚"为什么会坏"，而不是只写跑了什么命令
- 明确指出第一条可信线索，说明它如何打破错误假设
- 用可复用的方式描述最终修复
- 写出未来 agent 可以重复执行的验证动作
- 让下一次排错明显更短

## 常见错误

- 根因还没确认，就开始写猜测性结论
- 写成很长的 debug 日记，而不是可复用结论
- 仓库级经验写到了错误的位置
- 没把导致绕路的错误假设写出来
- 把修复说明和记忆沉淀混在一起
- 忘了同步本地 MCP 记忆
- 只因为仓库记忆文件声明“有 Memorix”，就跳过当前会话工具可用性核对

## 边界

这个技能只负责记忆沉淀和总结。

## 它不能替代调试、实现、测试和修复工作流。如果 bug 还没修好，先使用合适的调试或实现技能，等结果稳定后再回到这个技能做经验沉淀

### Uno 配置驱动类名只修 icon 不够（2026-03-28）

- 详细案例：`2026-03-28-unocss-config-driven-color-safelist.md`
- 适用场景：`menu-config.ts`、配置数组、动态 class 字符串、Uno safelist、iconify / carbon 图标恢复但颜色仍丢失
- 关键约束：不要只看 DOM 是否带类名，还要确认样式表是否真的生成了 `text-colorui-*` / `bg-colorui-*/10`，并核对主题色 token 是否存在

### Nitro 双运行时改造回填主工作区时，先同步依赖与文档（2026-03-29）

- 详细案例：`2026-03-29-nitro-dual-runtime-migration-gotchas.md`
- 适用场景：Nitro 双运行时改造、worktree 回填主分支、`pnpm.patchedDependencies`、Windows 下删除 worktree、旧路径文档收尾
- 关键约束：不要把 `Cannot find package "h3"` 直接当成 Nitro 代码错误，先确认当前活动工作区已经重新 `pnpm install`，并核对补丁目标版本与真实安装版本完全一致

### dev:h5:nitro 本地跨端口报跨域时，先区分“预检 404”还是“3101 根本没起来”（2026-03-29）

- 适用场景：`dev:h5:nitro`、H5 在 `127.0.0.1:3000`、Nitro 在 `127.0.0.1:3101`、浏览器报 CORS、日志里出现 `OPTIONS /app/**` 404
- 关键约束：
  1. 不要一看到“跨域”就直接改 `baseURL`、代理或 CORS 头；先同时检查浏览器 Network 和本机端口监听，区分是“预检被业务 dispatcher 误拦截”还是“3101 服务根本没启动”。
  2. 如果日志已经明确是 `Endpoint not found: OPTIONS /app/...`，优先检查共享 Nitro dispatcher 是否把 `OPTIONS` 当成业务接口匹配；这类预检请求应该直接返回空成功响应，不应该走 endpoint registry。
  3. 最终验证必须包含两层证据：一层是定向测试覆盖 `OPTIONS` 预检分支；另一层是 fresh 浏览器请求或 fresh `OPTIONS` 探针确认 `3000 -> 3101` 真实跨端口请求返回 `200` 且带 `access-control-allow-*` 响应头。

### Memorix 可用性必须以当前会话工具面板为准，不要只看仓库文档（2026-03-29）

- 适用场景：用户要求“写入 Memorix”、根级 `CLAUDE.md` / `AGENTS.md` / `GEMINI.md` 声明“有 Memorix 工具”，但当前 Codex 会话未实际暴露对应 MCP 工具
- 关键约束：
  1. 在声称“已经写入 Memorix”之前，先核对当前会话真实可调用的工具或 MCP 资源；仓库文档只能说明项目约定，不能替代当前运行时工具清单。
  2. 如果当前会话确实没有 Memorix 工具，就明确告诉用户“这次只能先把记忆写入仓库文档/技能文件，无法直接写入 Memorix”，不要做任何暗示性表述。
  3. 以后只要遇到“仓库文档声明可用，但当前工具面板没暴露”的情况，一律以当前工具面板为准，并把这个差异当成需要向用户说明的环境事实。

### dev:mp-weixin:nitro 报 `pages.json->pages/index/index duplication` 时，先检查脏的 `src/pages.json`，不要先怀疑 Nitro 编排（2026-03-29）

- 适用场景：`pnpm run dev:mp-weixin:nitro`、`pnpm exec uni -p mp-weixin --mode development-nitro-api`、终端直接报 `pages.json->pages/index/index duplication`
- 关键约束：
  1. 先把问题从 `scripts/dev-mp-weixin-nitro.mjs` 剥离出来，直接运行目标平台编译命令；如果裸 `uni -p mp-weixin` 也同样报 duplication，就说明根因在 `uni-pages` 路由生成链，而不是 Nitro 端口、健康检查或双进程 orchestration。
  2. 先检查 `src/pages.json` 是否混入旧的 `#ifdef MP-WEIXIN` 条目和新的 `GENERATED BY UNI-PAGES` 条目；同一路由同时出现“旧条件块 + 新生成块”时，优先判定为脏的生成文件，不要先去改 `pages.config.ts`、`VITE_SERVER_BASEURL` 或 Nitro 启动脚本。
  3. 这类故障的有效修复通常不是“手写删几行路由”，而是用目标平台的 fresh compile 重新生成一份无重复 `path` 的 `src/pages.json`，再把这份干净生成物保留下来。
  4. 最终验证不能只看单次 diff；至少要同时验证 `pnpm exec uni -p mp-weixin --mode development-nitro-api` 能到 `Build complete. Watching for changes...`，以及 `pnpm run dev:mp-weixin:nitro` 也能正常 ready。若怀疑平台切换会复发，再补一轮 `H5 -> mp-weixin` 切换回归。

## 本仓库落点覆盖

- 本仓库的 bug 经验优先记录在当前技能目录：`.claude/skills/fix-bug/record-bug-fix-memory/*.md`
- 根级 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 只在用户明确要求同步 AI 记忆文档时才更新
