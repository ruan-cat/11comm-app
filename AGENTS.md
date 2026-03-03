# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 1. 主动问询实施细节

在我与你沟通并要求你具体实施更改时，难免会遇到很多模糊不清的事情。

请你深度思考这些`遗漏点`，`缺漏点`，和`冲突相悖点`，**并主动的向我问询这些你不清楚的实施细节**。

我会与你共同补充细化实现细节。我们先迭代出一轮完整完善的实施清单，然后再由你亲自落实实施下去。

## 2. 对话沟通术语表

在我和你沟通时，我会使用以下术语，便于你理解。

### 2.1. 全局术语

在任何沟通下，这些术语都生效。

- `vue3项目` ： 即 `package.json` 指代的 uniapp 项目。
- `本项目`： 即 `vue3项目` 。
- `vue2项目`： `gitee-example` 目录下的 uniapp 项目。
- `旧项目`： 即 `vue2项目` 。
- `Vue2 到 Vue3 uni-app 路由迁移映射表`： `docs\prompts\route-migration-map.yml` 文件。
- `api-migration`： api 迁移技能。即 `.claude\skills\api-migration\SKILL.md` 文件。
- `code-migration`： 代码写法迁移技能。即 `.claude\skills\code-migration\SKILL.md` 文件。
- `component-migration`： 组件迁移技能。即 `.claude\skills\component-migration\SKILL.md` 文件。
- `route-migration`： 路由迁移技能。即 `.claude\skills\route-migration\SKILL.md` 文件。
- `style-migration`： 样式迁移技能。即 `.claude\skills\style-migration\SKILL.md` 文件。

- `api-error-handling`： 接口错误提示能力技能。即 `.claude\skills\api-error-handling\SKILL.md` 文件。
- `z-paging-integration`： `z-paging 分页组件集成方案` 技能。即 `.claude\skills\z-paging-integration\SKILL.md` 文件。
- `use-wd-form`： `使用 wd-form 表单组件编写表单页的实施规范` 技能。即 `.claude\skills\use-wd-form\SKILL.md` 文件。
- `use-uniapp-dynamic-page-title`： `uni-app 动态页面标题设置` 技能。即 `.claude\skills\use-uniapp-dynamic-page-title\SKILL.md` 文件。
- `add-new-component`： `新建公共组件规范` 技能。即 `.claude\skills\add-new-component\SKILL.md` 文件。

### 2.2. 业务术语

在实现具体业务时，某些热点组件会经常修改，为了便于沟通，这里说明清楚其简称，便于你快速找到对应组件。

- `选择器系列页面` ： `src\pages-sub\selector\*.vue` ，一个 glob 匹配语法，指代一系列 vue 组件。

#### 2.2.1. 维修工单流程模块

- `维修工单流程模块系列页面` ： `src\pages-sub\repair\*.vue` ，一个 glob 匹配语法，指代一系列 vue 组件。

#### 2.2.2. 房屋申请业务

- `房屋申请列表页` ： `src\pages-sub\property\apply-room.vue`
- `房屋申请记录页` ： `src\pages-sub\property\apply-room-record.vue`
- `房屋申请详情页` ： `src\pages-sub\property\apply-room-detail.vue`
- `房屋申请记录详情页` ： `src\pages-sub\property\apply-room-record-detail.vue`
- `房屋申请记录处理页` ： `src\pages-sub\property\apply-room-record-handle.vue`
- `房屋申请系列页面` ： `src\pages-sub\property\*.vue` ，一个 glob 匹配语法，指代一系列 vue 组件。

#### 2.2.3. 活动业务

- `活动操作按钮组件` ： `src\components\activity\activity-actions.vue`
- `活动信息组件` ： `src\components\activity\activity-info.vue`
- `活动详情页` ： `src\pages\activity\detail.vue`
- `活动列表页` ： `src\pages\activity\index.vue`

## 3. 迁移任务的重要原则

在实现 `vue3项目` 迁移到 `vue2项目` 时，请遵守以下几条重要原则：

1. 所有的接口都是 mock 假接口： 全部的接口都是使用本地的 `vite-plugin-mock-dev-server` 插件实现的假接口。
2. 不考虑严格的登录逻辑： 我们不做任何登录功能。关于 token 的存储，读取，管理，使用的功能与逻辑，在 `vue3项目` 内都不做。
3. 不考虑严格的鉴权逻辑： 我们不做任何鉴权功能。在跳转路由的时候，`vue3项目` 不做任何形式的鉴权处理。任何页面都可以随意跳转，任意访问。
4. 不许滥用 unocss 的 shortcuts 功能： 不要将业务性质的，非公共性质的样式类，都写入到 `uno.config.ts` 配置文件内。避免滥用全局变量性质的配置文件，

## 4. 技能触发与协同策略

### 4.1. ⚠️ 强制执行技能触发检查

**在执行任何开发任务前，必须先阅读 `.claude/skills/check-trigger.md` 进行技能触发检查。**

该文件提供了系统化的技能识别流程，帮助确保：

- ✅ 识别所有相关技能（避免遗漏）
- ✅ 理解多技能协同关系（避免单一技能思维）
- ✅ 按照正确顺序执行（避免顺序混乱）

### 4.2. 技能触发矩阵

根据任务特征快速识别需要使用的技能：

|        任务特征        |                                                         必须使用的技能                                                         |                              说明                              |
| :--------------------: | :----------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------: |
|    包含 `<wd-form>`    |                                          `use-wd-form` + `beautiful-component-design`                                          |                  表单页面必须同时使用两个技能                  |
|      需要选择功能      |                                              `use-wd-form`（第 3.2 节 wd-picker）                                              |            必须使用 wd-picker，禁止 wd-radio-group             |
|    需要表单分区标题    |                                     `beautiful-component-design`（form-section-title.md）                                      | 必须使用 FormSectionTitle，禁止 `<view class="section-title">` |
|      需要美化组件      |                                                  `beautiful-component-design`                                                  |                 添加图标、调整样式、响应式设计                 |
|    ColorUI 组件迁移    |                                                     `component-migration`                                                      |            ColorUI / uni-app 组件 → wot-design-uni             |
|    ColorUI 样式迁移    |                                                       `style-migration`                                                        |                  ColorUI 类名 → UnoCSS 原子类                  |
|      API 接口迁移      |                                                        `api-migration`                                                         |       Java110Context + uni.request → Alova + TypeScript        |
| Vue2 到 Vue3 代码迁移  |                                                        `code-migration`                                                        |           Options API → Composition API + TypeScript           |
|        路由迁移        |                                                       `route-migration`                                                        |                    pages.json → 约定式路由                     |
|      需要分页功能      |                                `z-paging-integration` + `api-migration` + `api-error-handling`                                 |                 z-paging 几乎总是需要 3 个技能                 |
|    需要接口错误提示    |                                                      `api-error-handling`                                                      |                 所有 API 调用都应该有错误提示                  |
|    需要动态页面标题    |                                                `use-uniapp-dynamic-page-title`                                                 |      根据参数/状态动态设置标题（如派单/转单显示不同标题）      |
|      新建公共组件      |                                                      `add-new-component`                                                       |          src/components/common 目录下新建公共组件规范          |
| 从 Vue2 完整迁移表单页 | `code-migration` + `component-migration` + `style-migration` + `use-wd-form` + `api-migration` + `beautiful-component-design`  |                       需要 6 个技能协同                        |
| 从 Vue2 完整迁移列表页 | `code-migration` + `component-migration` + `style-migration` + `api-migration` + `z-paging-integration` + `api-error-handling` |                       需要 6 个技能协同                        |

### 4.3. 多技能协同原则

**⚠️ 重要：大多数实际任务都需要多个技能协同，禁止单一技能思维！**

#### 4.3.1. 表单页面的技能组合

```plaintext
表单页面（创建/修改）：
  - use-wd-form（必须）- 表单结构、wd-picker、校验规则
  - beautiful-component-design（必须）- FormSectionTitle、图标、美化
  - api-migration（如果有接口）- API 调用
  - api-error-handling（如果有接口）- 错误提示
```

**检查清单**：

- [ ] 包含 `<wd-form>` → 必须使用 `use-wd-form`
- [ ] 需要分区标题 → 必须使用 `beautiful-component-design`（FormSectionTitle）
- [ ] 有选择功能 → 必须使用 `wd-picker`（禁止 wd-radio-group）
- [ ] 需要调用 API → 必须使用 `api-migration` + `api-error-handling`

#### 4.3.2. 列表页面的技能组合

```plaintext
列表页面（分页列表）：
  - z-paging-integration（必须）- 分页组件
  - api-migration（必须）- API 接口
  - api-error-handling（必须）- 错误提示
  - beautiful-component-design（可选）- 美化
```

#### 4.3.3. 从 Vue2 迁移的技能组合

```plaintext
从 Vue2 迁移单个页面：
  - code-migration（必须）- Vue2 → Vue3 代码写法
  - component-migration（必须）- ColorUI → wot-design-uni
  - style-migration（必须）- 样式类名迁移
  - route-migration（必须）- 路由配置迁移
  - 根据页面类型添加：
    - 表单页：+ use-wd-form + beautiful-component-design
    - 列表页：+ z-paging-integration + api-migration + api-error-handling
```

### 4.4. 技能执行流程

**强制执行以下流程：**

```plaintext
收到任务
  ↓
步骤 1：技能触发检查
  - 打开 .claude/skills/check-trigger.md
  - 逐项回答检查问题
  - 生成技能清单
  ↓
步骤 2：阅读所有相关技能
  - 阅读每个技能的主文件（SKILL.md）
  - 阅读所有子文档（*.md）
  - 查阅推荐的示例文件
  ↓
步骤 3：理解技能协同关系
  - 确认技能之间的依赖关系
  - 理解执行顺序
  ↓
步骤 4：创建任务清单
  - 使用 TodoWrite 列出所有任务
  - 包含"阅读技能文件"的任务
  ↓
步骤 5：开始执行
  - 严格按照技能文件规范执行
  - 逐项完成任务并标记
```

### 4.5. 违规后果警告

**如果跳过技能触发检查或只使用部分技能，将导致：**

- ❌ 使用错误的组件（如 `wd-radio-group` 代替 `wd-picker`）
- ❌ 使用错误的样式类（如 `<view class="section-title">` 代替 `FormSectionTitle`）
- ❌ 组件嵌套顺序错误
- ❌ 缺少必需的功能和美化效果
- ❌ 代码不符合项目规范
- ❌ **需要返工重写，浪费时间**

### 4.6. 快速参考

**常见问题快速查询：**

1. **Q: 如何判断需要使用哪些技能？**
   - A: 阅读 `.claude/skills/check-trigger.md`，按照检查清单逐项回答

2. **Q: 表单页面需要使用哪些技能？**
   - A: 至少需要 `use-wd-form` + `beautiful-component-design`

3. **Q: 什么时候使用 wd-picker，什么时候使用 wd-radio-group？**
   - A: 绝大多数情况使用 `wd-picker`；只有动态场景（选项不固定）才考虑 `wd-radio-group`

4. **Q: 如何添加表单分区标题？**
   - A: 必须使用 `FormSectionTitle` 组件，禁止使用 `<view class="section-title">`

5. **Q: 分页功能需要哪些技能？**
   - A: 必须同时使用 `z-paging-integration` + `api-migration` + `api-error-handling` 三个技能

## 5. 代码/编码格式要求

### 5.1. markdown 文档的 table 编写格式

每当你在 markdown 文档内编写表格时，表格的格式一定是**居中对齐**的，必须满足**居中对齐**的格式要求。

### 5.2. markdown 文档的 vue 组件代码片段编写格式

错误写法：

1. 代码块语言用 vue，且不带有 `<template>` 标签来包裹。

```vue
<wd-popup v-model="showModal">
  <wd-cell-group>
    <!-- 内容 -->
  </wd-cell-group>
</wd-popup>
```

2. 代码块语言用 html。

```html
<wd-popup v-model="showModal">
	<wd-cell-group>
		<!-- 内容 -->
	</wd-cell-group>
</wd-popup>
```

正确写法：代码块语言用 vue ，且带有 `<template>` 标签来包裹。

```vue
<template>
	<wd-popup v-model="showModal">
		<wd-cell-group>
			<!-- 内容 -->
		</wd-cell-group>
	</wd-popup>
</template>
```

### 5.3. javascript / typescript 的代码注释写法

代码注释写法应该写成 jsdoc 格式。而不是单纯的双斜杠注释。比如：

不合适的双斜线注释写法如下：

```ts
// 模拟成功响应
export function successResponse<T>(data: T, message: string = "操作成功") {
	return {
		success: true,
		code: ResultEnum.Success,
		message,
		data,
		timestamp: Date.now(),
	};
}
```

合适的，满足期望的 jsdoc 注释写法如下：

```ts
/** 模拟成功响应 */
export function successResponse<T>(data: T, message: string = "操作成功") {
	return {
		success: true,
		code: ResultEnum.Success,
		message,
		data,
		timestamp: Date.now(),
	};
}
```

### 5.4. unocss 配置不应该创建过多的 shortcuts 样式类快捷方式

在你做样式迁移的时候，**不允许滥用** unocss 的 shortcuts 功能。不要把那么多样式类都设计成公共全局级别的快捷方式。

### 5.5. vue 组件编写规则

1. vue 组件命名风格，使用短横杠的命名风格，而不是大驼峰命名。
2. 先 `<script setup lang="ts">`、然后 `<template>`、最后是 `<style scoped>` 。
3. 每个 vue 组件的最前面，提供少量的 html 注释，说明本组件是做什么的。

### 5.6. jsdoc 注释的 `@example` 标签不要写冗长复杂的例子

1. 你应该积极主动的函数编写 jsdoc 注释的 `@example` 标签。
2. 但是 `@example` 标签不允许写复杂的例子，请写简单的单行例子。完整的函数使用例子，你应该择机在函数文件的附近编写 md 文档，在文档内给出使用例子。

### 5.7. 页面 vue 组件必须提供注释说明本组件的`业务名`和`访问地址`

比如以下的这几个例子：

```html
<!--
  房屋申请列表页
  功能：显示房屋申请列表，支持搜索和筛选

  访问地址: http://localhost:9000/#/pages-sub/property/apply-room
-->
```

```html
<!--
  房屋申请详情页
  功能：显示房屋申请详细信息，支持验房和审核操作

  访问地址: http://localhost:9000/#/pages-sub/property/apply-room-detail
  建议携带参数: ?ardId=xxx&communityId=xxx

  http://localhost:9000/#/pages-sub/property/apply-room-detail?ardId=ARD_002&communityId=COMM_001

-->
```

每个页面都必须提供最顶部的文件说明，说明其业务名称，提供访问地址。

### 5.8. markdown 的多级标题要主动提供序号

对于每一份 markdown 文件的二级标题、三级标题和四级标题，你都应该要：

1. 主动添加**数字**序号，便于我阅读文档。
2. 主动**维护正确的数字序号顺序**。如果你处理的 markdown 文档，其手动添加的序号顺序不对，请你及时的更新序号顺序。

## 6. 报告编写规范

在大多数情况下，你的更改是**不需要**编写任何说明报告的。但是每当你需要编写报告时，请你首先遵循以下要求：

- 报告地址： 默认在 `docs\reports` 文件夹内编写报告。
- 报告文件格式： `*.md` 通常是 markdown 文件格式。
- 报告文件名称命名要求：
  1. 前缀以日期命名。包括年月日。日期格式 `YYYY-MM-DD` 。
  2. 用小写英文加短横杠的方式命名。
- 报告的一级标题： 必须是日期`YYYY-MM-DD`+报告名的格式。
  - 好的例子： `2025-12-09 修复 @ruan-cat/commitlint-config 包的 negation pattern 处理错误` 。前缀包含有 `YYYY-MM-DD` 日期。
  - 糟糕的例子： `构建与 fdir/Vite 事件复盘报告` 。前缀缺少 `YYYY-MM-DD` 日期。
- 报告日志信息的代码块语言： 一律用 `log` 作为日志信息的代码块语言。如下例子：

  ````markdown
  日志如下：

  ```log
  日志信息……
  ```
  ````

- 报告语言： 默认用简体中文。

## 7. 其他注意事项

1. 每次你完成更改时，都**不要运行**任何类型检查命令。我们项目不需要你去运行类型检查命令。
2. 不要去更改 `prettier.config.js` 文件，**不要自作主张**的给这个配置文件**增加单引号**。
3. 报告输出地址： 你在生成 markdown 格式的报告时，请默认输出到 `docs\reports` 目录下面，这便于我阅读。

## 8. 代码搜索与检查策略

### 8.1. 为什么需要严格的搜索策略？

在进行代码规范检查、组件用法迁移等任务时，**单次搜索极易遗漏**，可能导致：

- ❌ 特殊字符转义问题导致搜索失败（如 `<template #value>` 搜索不到结果）
- ❌ 依赖单一搜索方式，没有交叉验证
- ❌ 只检查部分文件，未系统性覆盖所有相关文件

### 8.2. 多重搜索策略（必须执行）

当需要在代码库中查找特定模式时，**必须使用至少 2 种以上的搜索方法**进行交叉验证：

#### 8.2.1. 方法 A：正则表达式搜索

```bash
# 示例：搜索 <template #value> 用法
Grep: pattern="template.*#value" path="src/" glob="*.vue"
```

**适用场景**：查找包含特定关键词组合的代码模式

#### 8.2.2. 方法 B：宽泛关键词搜索 + 人工筛选

```bash
# 示例：搜索所有 wd-cell 用法，手动筛选错误用法
Grep: pattern="wd-cell" path="src/pages-sub/repair" glob="*.vue" output_mode="content"
```

**适用场景**：当正则表达式难以精确匹配，需要人工判断时

#### 8.2.3. 方法 C：搜索相关标签/属性

```bash
# 示例：搜索所有 template 插槽用法
Grep: pattern="<template #" path="src/" glob="*.vue"
```

**适用场景**：从更广的范围搜索，避免遗漏边缘情况

### 8.3. 系统性检查方法（用于重要任务）

对于关键的代码规范检查（如组件迁移、API 迁移），**禁止仅依赖搜索**，必须：

#### 8.3.1. 步骤 1：列出所有相关文件

```bash
# 使用 Glob 工具列出所有需要检查的文件
Glob: pattern="**/*.vue" path="src/pages-sub/repair"
```

#### 8.3.2. 步骤 2：逐文件阅读关键部分

- 不要跳过任何一个相关文件
- 重点检查 `<template>` 区域的组件用法
- 检查 `<script>` 区域的类型导入和 API 调用

#### 8.3.3. 步骤 3：交叉验证

- 用不同搜索方法确认结果一致性
- 搜索结果为 0 时，**必须用另一种方法再次确认**

### 8.4. 常见搜索场景示例

#### 8.4.1. 场景 1：检查 `wd-cell` 组件的错误用法

```bash
# 方法 A：搜索 #value 插槽（错误用法）
Grep: pattern="template.*#value" path="src/" glob="*.vue"

# 方法 B：搜索 #title 插槽（大多数情况下是错误的）
Grep: pattern="template.*#title" path="src/" glob="*.vue"

# 方法 C：搜索所有 wd-cell 用法，人工检查
Grep: pattern="wd-cell" path="src/" output_mode="content" -n=true
```

#### 8.4.2. 场景 2：检查 API 调用方式

```bash
# 方法 A：搜索旧的 API 调用方式
Grep: pattern="Java110Context" path="src/"

# 方法 B：搜索未迁移的 uni.request
Grep: pattern="uni\.request" path="src/"

# 方法 C：检查所有 api 文件是否使用新的 Alova 方式
Glob: pattern="*.ts" path="src/api"
# 然后逐个文件检查导入语句
```

#### 8.4.3. 场景 3：检查样式迁移情况

```bash
# 方法 A：搜索旧的 ColorUI 类名
Grep: pattern="cu-" path="src/" glob="*.vue"

# 方法 B：搜索未迁移的内联样式
Grep: pattern="style=" path="src/" glob="*.vue"

# 方法 C：检查所有 scoped style 块
Grep: pattern="<style.*scoped" path="src/"
```

### 8.5. 避免遗漏的检查清单

当执行代码规范检查任务时，请务必完成以下清单：

- [ ] **至少使用 2 种不同的搜索方法**进行交叉验证
- [ ] **搜索结果为 0 时，必须用第二种方法再次确认**（避免搜索语法错误）
- [ ] **对于关键任务，列出所有相关文件并逐个检查**（不依赖搜索）
- [ ] **在修改后，立即搜索验证是否还有遗漏**
- [ ] **记录搜索过程**，便于复查和调试

### 8.6. 错误示例与改进

#### 8.6.1. ❌ 错误做法

```bash
# 单次搜索，搜索失败就认为"没问题"
Grep: pattern="<template #value>"  # 可能因转义问题搜索不到
# 结果：No matches found
# 错误结论：没有错误用法 ❌
```

#### 8.6.2. ✅ 正确做法

```bash
# 方法 1：正则表达式
Grep: pattern="template.*#value"
# 结果：找到 3 处

# 方法 2：宽泛搜索 + 人工筛选
Grep: pattern="<template #" output_mode="content"
# 结果：找到 3 处（交叉验证一致）

# 方法 3：列出所有文件逐个检查
Glob: pattern="*.vue" path="src/pages-sub/repair"
# 逐个文件阅读 <template> 区域
```

### 8.7. 搜索命令速查表

|     任务      |             推荐搜索命令              |                备用搜索命令                 |
| :-----------: | :-----------------------------------: | :-----------------------------------------: |
| 查找插槽用法  |   `Grep: pattern="template.*#\w+"`    |        `Grep: pattern="<template #"`        |
| 查找组件用法  |       `Grep: pattern="<wd-\w+"`       | `Grep: pattern="wd-" output_mode="content"` |
| 查找 API 调用 | `Grep: pattern="import.*from.*@/api"` |        `Grep: pattern="useRequest"`         |
| 查找样式类名  |       `Grep: pattern="class="`        |          `Grep: pattern="<style"`           |

## 9. 项目概述

这是基于 unibest 框架的智慧社区物业管理系统，使用 uniapp + Vue3 + TypeScript + Vite5 + UnoCSS 技术栈开发，支持 H5、小程序、APP 多平台。

## 10. 开发环境要求

- Node.js >= 22
- pnpm >= 10
- Vue Official >= 2.1.10
- TypeScript >= 5.0

## 11. 常用开发命令

### 11.1. 安装依赖

```bash
pnpm install
```

### 11.2. 开发环境

```bash
# H5 开发 (默认端口 9000)
pnpm dev
pnpm dev:h5

# 微信小程序开发
pnpm dev:mp
pnpm dev:mp-weixin

# APP 开发
pnpm dev:app

# 其他小程序平台
pnpm dev:mp-alipay    # 支付宝小程序
pnpm dev:mp-baidu     # 百度小程序
pnpm dev:mp-toutiao   # 字节跳动小程序

# 测试/生产环境
pnpm dev:test         # 测试环境
pnpm dev:prod         # 生产环境
```

### 11.3. 构建打包

```bash
# H5 构建
pnpm build
pnpm build:h5

# 微信小程序构建
pnpm build:mp
pnpm build:mp-weixin

# APP 构建
pnpm build:app

# 环境区分构建
pnpm build:test       # 测试环境构建
pnpm build:prod       # 生产环境构建
```

### 11.4. 代码质量检查

```bash
# ESLint 检查
pnpm lint

# ESLint 自动修复
pnpm lint:fix

# TypeScript 类型检查
pnpm type-check
```

### 11.5. 其他常用命令

```bash
# 依赖升级
pnpm up-taze

# API 接口类型生成
pnpm openapi-ts-request

# 文档开发/构建
pnpm docs:dev
pnpm docs:build

# 持续集成构建
pnpm ci
```

## 12. 项目架构与目录结构

### 12.1. 核心配置文件

- `package.json` - 项目依赖和脚本配置
- `vite.config.ts` - Vite 构建配置，包含插件配置和平台适配
- `manifest.config.ts` - uni-app 应用清单配置
- `pages.config.ts` - 页面路由配置
- `uno.config.ts` - UnoCSS 配置
- `tsconfig.json` - TypeScript 配置

### 12.2. 源码目录结构

```plain
src/
├── api/            # API 接口定义
├── components/     # 公共组件
├── hooks/          # Vue3 组合式函数
├── http/           # HTTP 请求封装
├── layouts/        # 页面布局组件
├── pages/          # 主要页面文件
├── pages-sub/      # 分包页面
├── router/         # 路由配置
├── service/        # 业务服务层
├── static/         # 静态资源
├── store/          # 状态管理 (Pinia)
├── style/          # 全局样式
├── tabbar/         # 底部导航栏
├── types/          # TypeScript 类型定义
├── utils/          # 工具函数
├── App.vue         # 应用入口组件
├── main.ts         # 应用入口文件
└── uni.scss        # uni-app 全局样式
```

### 12.3. 核心技术栈

- **框架**: uni-app 3.x (Vue3 + TypeScript)
- **构建工具**: Vite 5.x
- **状态管理**: Pinia 2.x + pinia-plugin-persistedstate (持久化)
- **HTTP 请求**: Alova (适配 uni-app)
- **UI 组件库**: wot-design-uni
- **样式方案**: UnoCSS + SCSS
- **分页组件**: z-paging
- **日期处理**: dayjs
- **代码质量**: ESLint + TypeScript + husky + commitlint

### 12.4. 环境配置

项目使用自定义 `env/` 目录管理环境变量：

- `env/.env.development` - 开发环境配置
- `env/.env.test` - 测试环境配置
- `env/.env.production` - 生产环境配置

### 12.5. 路由与页面管理

- 使用约定式路由，文件名即路由路径
- 支持分包加载，分包页面放在 `pages-sub/` 目录
- 布局组件放在 `layouts/` 目录，支持嵌套布局

### 12.6. 平台适配策略

- 使用条件编译 (`#ifdef` / `#endif`) 处理平台差异
- 支持的平台：H5、微信小程序、APP、支付宝小程序等
- 平台特定代码应放在对应的条件编译块中

### 12.7. 开发调试

- **H5**: 访问 http://localhost:9000
- **微信小程序**: 构建后导入 `dist/dev/mp-weixin` 到微信开发者工具
- **APP**: 构建后导入 `dist/dev/app` 到 HBuilderX

### 12.8. 业务特点

这是一个智慧社区物业管理系统，主要功能模块包括：

- 公告管理
- 维修录单
- 通讯录
- 投诉录单
- 物业员工工作台

当前项目处于开发阶段，使用 `dev-rc` 分支进行开发，主分支为 `main`。

### 12.9. 重要注意事项

1. 必须使用 pnpm 作为包管理器
2. 代码提交前会自动进行 ESLint 检查和格式化
3. 遵循 uni-app Vue3 + TypeScript 开发规范
4. 新增组件会自动注册，无需手动引入
5. 使用 UnoCSS 进行样式开发，支持原子化 CSS

## 13. <!-- https://github.com/GuDaStudio/geminimcp --> Core Instruction for Gemini MCP

在任何时刻，你必须思考当前过程可以如何与 gemini 进行协作，如何调用 gemini 为你提供的 MCP 工具作为你**客观全面分析**的保障。

其中你**务必执行**以下几个步骤：

**1** 在你对用户需求**形成初步分析后**，
（1）首先将用户**原始需求（一字不差，严禁转述）**、以及你的初始思路告知 gemini；
（2）与 gemini 进行**充分讨论、辩驳**，以完善需求分析和实施计划。这一步的结束标志为，**必须**确保对用户需求的透彻理解，并**生成切实可行的行动计划**。

**2** 在实施具体编码任务前，你**必须向 gemini 索要代码实现原型**（要求 gemini 仅给出 unified diff patch，严禁对代码做任何真实修改）。在获取代码原型后，你**只能以此为逻辑参考，再次对代码修改进行重写**，形成企业生产级别、可读性极高、可维护性极高的代码后，才能实施具体编程修改任务。

- **注意：** Gemini 十分擅长前端代码，并精通样式、UI 组件设计。在涉及前端代码时，你必须向其索要代码原型（CSS/React/Vue/HTML 等前端代码），任何时刻，你**必须以 gemini 的前端设计（原型代码）为最终的前端代码基点**。
- 例如，当你识别到用户给出了前端设计需求，你的首要行为必须自动调整为，将用户需求原封不动转发给 gemini，并让其出具代码示例（此阶段严禁对用户需求进行任何改动、简写等等）。即你必须从 gemini 获取代码基点，才可以进行接下来的各种行为。

## 14. <!-- https://github.com/GuDaStudio/geminimcp --> Gemini Tool Invocation Specification

1.  工具概述

gemini MCP 提供了一个工具 `gemini`，用于调用 Google Gemini 模型执行 AI 任务。该工具拥有极强的前端审美、任务规划与需求理解能力，但在**上下文长度（Effective 32k）**上有限制。

2. 使用方式与规范

   **必须遵守的限制**：

- **会话管理**：捕获返回的 `SESSION_ID` 用于多轮对话。
- **后端避让**：严禁让 Gemini 编写复杂的后端业务逻辑代码。

**擅长场景（必须优先调用 Gemini）**：

- **需求清晰化**：在任务开始阶段辅助生成引导性问题。
- **任务规划**：生成 Step-by-step 的实施计划。
- **前端原型**：编写 CSS、HTML、UI 组件代码，调整样式风格。

## 15. 使用 `gemini MCP` 或直接使用 `gemini` 时需要额外主动获取上下文

1. 在使用 `gemini MCP` 或直接使用 `gemini` 时，由于传递信息的关系，gemini 是不会主动的先阅读来自 claude code 的配置文件的，因此你必须要告诉 gemini，并约束 gemini 的上下文读取行为，**必须要求**gemini 首先要无条件的阅读 claude code 的上下文。
2. 请务必先主动阅读 `CLAUDE.md` 和 `.claude` 目录内的全部的指导文件。
3. 不需要你阅读以下文件：
   - .claude\settings.json
   - .claude\statusline.sh
4. 你的修改必须按照这些 claude code 文档的要求和约束来做。特别是 `agents` 和 `skills` 的要求。

## 16. 获取技术栈对应的上下文

### 16.1. 阅读 `wot-design-uni` 组件库的文档

我们项目是移动端项目，高强度的使用了 `wot-design-uni` 组件库。你应该在编写 vue 组件时，主动地获取组件库的文档，及时使用正确的组件。

#### 16.1.1. 文档资源

- **官方文档**: https://wot-ui.cn/guide/quick-use.html （推荐优先查看）
- **GitHub 文档**: https://github.com/Moonofweisheng/wot-design-uni/tree/master/docs/component

#### 16.1.2. 类型导入的正确方式

⚠️ **重要**：本项目使用 pnpm 安装 wot-design-uni，而不是 uni_modules 插件方式。

**正确的类型导入路径格式**：

```typescript
// ✅ 正确 - 本项目使用方式
import type { FormRules } from "wot-design-uni/components/wd-form/types";
import type { UploadBeforeUpload, UploadFile } from "wot-design-uni/components/wd-upload/types";

// ❌ 错误 - GitHub 文档示例（仅适用于 uni_modules 安装方式）
import type { FormRules } from "@/uni_modules/wot-design-uni/components/wd-form/types";
```

**路径转换规则**：

如果从 GitHub 文档中看到的导入路径是：

```typescript
import type { XXX } from "@/uni_modules/wot-design-uni/components/wd-xxx/types";
```

在本项目中应该转换为：

```typescript
import type { XXX } from "wot-design-uni/components/wd-xxx/types";
```

即：去掉 `@/uni_modules/` 前缀。

#### 16.1.3. 常用组件的类型导入示例

|      组件      |                     导入路径                     |              常用类型              |
| :------------: | :----------------------------------------------: | :--------------------------------: |
|    wd-form     |    `wot-design-uni/components/wd-form/types`     |    `FormRules`, `FormInstance`     |
|   wd-upload    |   `wot-design-uni/components/wd-upload/types`    | `UploadBeforeUpload`, `UploadFile` |
|   wd-picker    |   `wot-design-uni/components/wd-picker/types`    |           `PickerColumn`           |
| wd-picker-view | `wot-design-uni/components/wd-picker-view/types` |            `ColumnItem`            |
|  wd-textarea   |  `wot-design-uni/components/wd-textarea/types`   |          `TextareaProps`           |

#### 16.1.4. 获取文档的方式

你可以使用以下工具查找文档：

1. 其他的 fetch 网站获取工具。
2. markdown 的 MCP 工具。

**注意**：从 GitHub 获取的文档中的类型导入路径需要按照上述规则进行转换。

### 16.3. z-paging 分页组件

- 仓库： https://github.com/SmileZXLee/uni-z-paging
- 文档： https://z-paging.zxlee.cn/
- 文档的仓库： https://github.com/SmileZXLee/uni-z-paging-doc

### 16.2. claude code skill

- 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
- 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices
- 规范文档： https://agentskills.io/home
