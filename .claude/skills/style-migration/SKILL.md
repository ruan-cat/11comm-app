---
name: style-migration
description: 专注于 ColorUI 到 UnoCSS + wot-design-uni 的样式系统迁移，从传统 CSS 框架到现代化原子 CSS。当需要迁移 ColorUI 类名到 UnoCSS 原子类、SCSS 变量到 UnoCSS 主题配置、固定像素到响应式单位时使用。完整页面迁移需与 component-migration、code-migration 协同。
context: fork
---

# 样式系统迁移专家

从 Vue2 项目的 **ColorUI + SCSS** 样式系统迁移到 Vue3 项目的 **UnoCSS + wot-design-uni** 现代化原子 CSS 样式系统。

## ⚠️ 重要原则

**禁止滥用 UnoCSS shortcuts 功能！** 不要将业务性质的、非公共性质的样式类写入 `uno.config.ts`。

## ⚠️ 多技能协同

完整页面迁移：

- `component-migration` + `code-migration`

样式优化：

- `beautiful-component-design`

参阅 `.claude/skills/check-trigger.md` 了解完整的技能触发检查流程。

**📝 提示**：在开始工作前，建议先阅读 `.claude/skills/check-trigger.md` 进行技能触发检查。

---

## ⚠️ 迁移前必读（Critical）

**🚨 禁止直接编写代码！必须先完成：**

1. ✅ **第一步：阅读参考文件**
   - 推荐：`src/pages-sub/repair/*.vue`（UnoCSS + wot-design-uni 样式示例）
   - 推荐：`uno.config.ts`（主题配置和公共变量）
   - 必读：本技能文件的完整内容

2. ✅ **第二步：理解核心差异**
   - ColorUI 类名（`cu-btn`）→ UnoCSS 原子类（`bg-blue-500 p-2 rounded`）
   - SCSS 变量（`$primary-color`）→ UnoCSS 主题（`bg-primary`）
   - 固定像素（`20px`）→ 响应式单位（`20rpx`）

3. ✅ **第三步：严格遵循规范**
   - **禁止**滥用 UnoCSS shortcuts 功能
   - **禁止**将 ColorUI 类名直接转为 shortcuts
   - **优先**展开为原子化 UnoCSS 类名
   - **仅在** `uno.config.ts` 定义主题和公共变量

### 🚫 常见错误（严禁犯）

|      ❌ 错误写法       |               ✅ 正确写法               |        说明        |
| :--------------------: | :-------------------------------------: | :----------------: |
|    `class="cu-btn"`    | `class="bg-blue-500 px-4 py-2 rounded"` |    展开为原子类    |
| shortcuts 定义业务样式 |             仅定义主题颜色              | 禁止滥用 shortcuts |
|    `20px` 固定像素     |           `20rpx` 响应式单位            |   使用 rpx 单位    |
|   保留 ColorUI 类名    |             完全使用 UnoCSS             |      彻底迁移      |

### 🚫 微信小程序 WXSS 限制（Critical）

**⚠️ 微信小程序 WXSS 是 CSS 的子集，有严格的选择器限制，使用不支持的选择器会导致编译错误：**

```log
[ WXSS 文件编译错误] ./app.wxss(76:3231): unexpected token `*`
[ WXSS 文件编译错误] ./pages-sub/xxx/xxx.wxss(27:30): error at token `:`
```

#### 🚫 禁止使用的 CSS 选择器

|         ❌ 禁止使用         |       ✅ 替代方案       |             说明             |
| :-------------------------: | :---------------------: | :--------------------------: |
|         `* { ... }`         | 使用具体组件选择器列表  |      WXSS 不支持通配符       |
|  `*, *::before, *::after`   | `page, view, text, ...` |        列举需要的组件        |
| `p { ... }` HTML 标签选择器 |  `.text-class { ... }`  |      使用 class 选择器       |
|      `:not([hidden])`       |     `.item + .item`     | 不支持属性选择器在 :not() 中 |
|     `:not(:last-child)`     |     `.item + .item`     |    不支持复杂 :not() 伪类    |
|      `:nth-child(n+2)`      |     `.item + .item`     |   不支持复杂 :nth-child()    |
|     `:nth-child(3n+1)`      |   手动添加 class 区分   |   不支持复杂 :nth-child()    |
|   `view:not(:last-child)`   |     `.item + .item`     |      不支持 :not() 伪类      |

#### 🚫 禁止使用的 UnoCSS 类名

**以下 UnoCSS 类名会生成不兼容微信小程序的 CSS，必须避免使用：**

| ❌ 禁止使用的类名 |                   生成的 CSS                    |              ✅ 替代方案              |
| :---------------: | :---------------------------------------------: | :-----------------------------------: |
|    `space-y-*`    | `.space-y-* > :not([hidden]) ~ :not([hidden])`  | `.item + .item { margin-top: Xpx; }`  |
|    `space-x-*`    | `.space-x-* > :not([hidden]) ~ :not([hidden])`  | `.item + .item { margin-left: Xpx; }` |
|   `divide-y-*`    | `.divide-y-* > :not([hidden]) ~ :not([hidden])` |         手动添加 border 样式          |
|   `divide-x-*`    | `.divide-x-* > :not([hidden]) ~ :not([hidden])` |         手动添加 border 样式          |

**示例：space-y-2 的问题**

```css
/* ❌ UnoCSS 生成的 space-y-2 样式 - 微信小程序不支持 */
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
	margin-top: 8rpx;
}

/* ✅ 兼容微信小程序的替代写法 */
.info-item + .info-item {
	margin-top: 8rpx;
}
```

**模板修改示例：**

```vue
<!-- ❌ 错误：使用 space-y-2 类 -->
<view class="text-sm text-gray-600 space-y-2">
  <view class="flex items-center">内容1</view>
  <view class="flex items-center">内容2</view>
</view>

<!-- ✅ 正确：使用自定义类名 + 相邻兄弟选择器 -->
<view class="text-sm text-gray-600">
  <view class="info-item flex items-center">内容1</view>
  <view class="info-item flex items-center">内容2</view>
</view>

<style scoped>
.info-item + .info-item {
  margin-top: 8rpx;
}
</style>
```

#### 🚫 禁止使用的复杂伪类选择器

```css
/* ❌ 错误：:nth-child(n+2) 在微信小程序中不支持 */
.action-buttons > :nth-child(n + 2) {
	margin-top: 12px;
}

/* ✅ 正确：使用简单的 class 选择器 */
.action-btn {
	margin-top: 12px;
}

/* 或使用相邻兄弟选择器 */
.action-btn + .action-btn {
	margin-top: 12px;
}
```

#### ✅ 微信小程序支持的选择器

|   选择器类型   |        示例         | 支持情况 |
| :------------: | :-----------------: | :------: |
|  class 选择器  |     `.my-class`     |    ✅    |
|   id 选择器    |      `#my-id`       |    ✅    |
|   元素选择器   |   `view`, `text`    |    ✅    |
|   后代选择器   |       `.a .b`       |    ✅    |
|    子选择器    |      `.a > .b`      |    ✅    |
| 相邻兄弟选择器 |      `.a + .b`      |    ✅    |
| 通用兄弟选择器 |      `.a ~ .b`      |    ✅    |
| `:first-child` | `.item:first-child` |    ✅    |
| `:last-child`  | `.item:last-child`  |    ✅    |
|   `::before`   |   `.item::before`   |    ✅    |
|   `::after`    |   `.item::after`    |    ✅    |
|    `:hover`    |    `.btn:hover`     | ⚠️ 仅 H5 |
|   `:active`    |    `.btn:active`    |    ✅    |

#### ⚠️ 微信小程序样式兼容性检查清单

在编写或迁移样式时，必须检查以下项目：

- [ ] 未使用 `*` 通配符选择器
- [ ] 未使用 `:not()` 伪类选择器（特别是带属性选择器的）
- [ ] 未使用复杂的 `:nth-child()` 选择器（如 `n+2`, `3n+1`）
- [ ] 未使用 UnoCSS 的 `space-y-*` / `space-x-*` 类
- [ ] 未使用 UnoCSS 的 `divide-y-*` / `divide-x-*` 类
- [ ] 未使用 HTML 标签选择器（如 `p`, `div`, `span`）
- [ ] `@media` 查询中未使用不支持的选择器

**错误示例（导致小程序编译失败）：**

```css
/* ❌ 错误：微信小程序不支持 * 通配符选择器 */
* {
	box-sizing: border-box;
}

*,
*::before,
*::after {
	box-sizing: border-box;
}

* {
	-webkit-tap-highlight-color: transparent;
}

/* ❌ 错误：@media 中也不能使用 * */
@media (prefers-reduced-motion: reduce) {
	* {
		animation-duration: 0.01ms !important;
	}
}
```

**正确示例：**

```css
/* ✅ 正确：使用具体的小程序组件选择器列表 */
page,
view,
scroll-view,
swiper,
swiper-item,
movable-area,
movable-view,
cover-view,
cover-image,
icon,
text,
rich-text,
progress,
button,
checkbox-group,
checkbox,
form,
input,
label,
picker,
picker-view,
picker-view-column,
radio-group,
radio,
slider,
switch,
textarea,
navigator,
audio,
image,
video,
camera,
live-player,
live-pusher,
map,
canvas,
open-data,
web-view,
ad {
	box-sizing: border-box;
}

/* ✅ 正确：伪元素单独处理 */
::before,
::after {
	box-sizing: border-box;
}

/* ✅ 正确：使用 page 替代 * 处理全局样式 */
page {
	-webkit-tap-highlight-color: transparent;
}

/* ✅ 正确：@media 中使用具体选择器 */
@media (prefers-reduced-motion: reduce) {
	view,
	text,
	image,
	button,
	navigator {
		animation-duration: 0.01ms !important;
	}
}
```

**UnoCSS preflights 配置规范：**

在 `uno.config.ts` 的 `preflights` 配置中编写全局样式时，**必须避免使用 `*` 选择器**：

```typescript
// uno.config.ts
preflights: [
  {
    getCSS: () => `
      /* ❌ 错误写法 - 会导致微信小程序编译失败 */
      /* *, *::before, *::after { box-sizing: border-box; } */
      /* * { -webkit-tap-highlight-color: transparent; } */

      /* ✅ 正确写法 - 兼容微信小程序 */
      page, view, scroll-view, swiper, text, image, button, input, textarea {
        box-sizing: border-box;
      }

      ::before, ::after {
        box-sizing: border-box;
      }

      page {
        -webkit-tap-highlight-color: transparent;
      }
    `,
  },
],
```

**Vue 组件 `<style>` 中的注意事项：**

```vue
<style lang="scss" scoped>
/* ❌ 错误：不要在组件样式中使用 * 选择器 */
/* @media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
  }
} */

/* ✅ 正确：使用具体的组件选择器 */
@media (prefers-reduced-motion: reduce) {
	view,
	text,
	image,
	button,
	navigator {
		animation-duration: 0.01ms !important;
		transition-duration: 0.01ms !important;
	}
}
</style>
```

## 核心方针

从 ColorUI 传统 CSS 框架迁移到 UnoCSS 原子化 CSS,实现样式文件体积从 **195KB 减少到 80KB,减少 60%**。

## ⚠️ 严格禁止

**禁止滥用 UnoCSS 的 shortcuts 功能**:

- ❌ 不要将 ColorUI 的 `cu-*` 类直接转换为 UnoCSS shortcuts
- ❌ 不要在 `uno.config.ts` 中创建大量业务性质的快捷方式
- ❌ 不要把非公共性质的样式类写入全局配置

**正确做法**:

- ✅ 展开为原子化的 UnoCSS 类名
- ✅ 直接在组件中使用原子类
- ✅ 仅在 `uno.config.ts` 中定义项目级别的主题颜色和公共变量

## 1. 样式系统架构对比

### Vue2 项目样式架构

```plain
ColorUI 框架样式系统
├── main.css                 # ColorUI 主样式文件 (195KB)
├── icon.css                 # 图标样式
├── animation.css            # 动画样式
└── 自定义 SCSS               # 项目自定义样式
    ├── variables.scss       # SCSS 变量
    └── mixins.scss          # SCSS 混入
```

**特点**:

- **预设类名**: 使用 `cu-` 前缀的预设类名
- **文件体积大**: 主样式文件 195KB
- **SCSS 预处理**: 需要 SCSS 编译
- **样式冗余**: 包含大量未使用的样式

### Vue3 项目样式架构

```plain
UnoCSS 原子化样式系统
├── uno.config.ts            # UnoCSS 配置文件
│   ├── theme                # 主题配置
│   │   ├── colors          # 颜色主题 (colorui-* 颜色变量)
│   │   └── spacing         # 间距主题
│   └── shortcuts            # 仅公共快捷方式
└── 原子类                    # 按需生成,最终 80KB
    ├── 布局类                # flex, grid, position
    ├── 颜色类                # text-*, bg-*, border-*
    ├── 间距类                # m-*, p-*, gap-*
    └── 形状类                # rounded-*, shadow-*
```

**特点**:

- **按需生成**: 仅生成使用的样式,减少 60% 体积
- **原子化类名**: 语义化的原子类,易于理解
- **零运行时**: 编译时生成,无运行时开销
- **类型安全**: TypeScript 支持,智能提示

## 2. 核心样式映射规则

### 2.1. 布局样式映射

#### Flex 布局

|   ColorUI 类名    |           UnoCSS 原子类            |      说明      |
| :---------------: | :--------------------------------: | :------------: |
|     `cu-flex`     |               `flex`               |   Flex 容器    |
|   `cu-flex-row`   |          `flex flex-row`           | 水平排列(默认) |
| `cu-flex-column`  |          `flex flex-col`           |    垂直排列    |
| `cu-flex-center`  | `flex items-center justify-center` |  水平垂直居中  |
|  `cu-flex-start`  |        `flex justify-start`        |  左对齐(默认)  |
|   `cu-flex-end`   |         `flex justify-end`         |     右对齐     |
| `cu-flex-between` |       `flex justify-between`       |    两端对齐    |
| `cu-flex-around`  |       `flex justify-around`        |    环绕对齐    |
|  `cu-flex-wrap`   |          `flex flex-wrap`          |    允许换行    |

#### 对齐方式

|    ColorUI 类名    |  UnoCSS 原子类  |      说明      |
| :----------------: | :-------------: | :------------: |
|  `cu-align-start`  |  `items-start`  |    顶部对齐    |
| `cu-align-center`  | `items-center`  |    垂直居中    |
|   `cu-align-end`   |   `items-end`   |    底部对齐    |
| `cu-align-stretch` | `items-stretch` | 拉伸填充(默认) |

### 2.2. 颜色样式映射

#### 文本颜色

| ColorUI 类名  |     UnoCSS 原子类     |  色值   |
| :-----------: | :-------------------: | :-----: |
|  `text-red`   |  `text-colorui-red`   | #e54d42 |
| `text-orange` | `text-colorui-orange` | #f37b1d |
| `text-yellow` | `text-colorui-yellow` | #fbbd08 |
| `text-olive`  | `text-colorui-olive`  | #8dc63f |
| `text-green`  | `text-colorui-green`  | #39b54a |
|  `text-cyan`  |  `text-colorui-cyan`  | #1cbbb4 |
|  `text-blue`  |  `text-colorui-blue`  | #0081ff |
| `text-purple` | `text-colorui-purple` | #6739b6 |
| `text-mauve`  | `text-colorui-mauve`  | #9c26b0 |
|  `text-pink`  |  `text-colorui-pink`  | #e03997 |
| `text-brown`  | `text-colorui-brown`  | #a5673f |
|  `text-grey`  |  `text-colorui-grey`  | #8799a3 |
|  `text-gray`  |  `text-colorui-gray`  | #aaaaaa |
| `text-black`  | `text-colorui-black`  | #333333 |
| `text-white`  | `text-colorui-white`  | #ffffff |

#### 背景颜色

| ColorUI 类名 |    UnoCSS 原子类    |
| :----------: | :-----------------: |
|   `bg-red`   |  `bg-colorui-red`   |
| `bg-orange`  | `bg-colorui-orange` |
| `bg-yellow`  | `bg-colorui-yellow` |
|  `bg-olive`  | `bg-colorui-olive`  |
|  `bg-green`  | `bg-colorui-green`  |
|  `bg-cyan`   |  `bg-colorui-cyan`  |
|  `bg-blue`   |  `bg-colorui-blue`  |
| `bg-purple`  | `bg-colorui-purple` |
|  `bg-mauve`  | `bg-colorui-mauve`  |
|  `bg-pink`   |  `bg-colorui-pink`  |
|  `bg-brown`  | `bg-colorui-brown`  |
|  `bg-grey`   |  `bg-colorui-grey`  |
|  `bg-gray`   |  `bg-colorui-gray`  |
|  `bg-black`  | `bg-colorui-black`  |
|  `bg-white`  | `bg-colorui-white`  |

### 2.3. 间距样式映射

#### Margin 外边距

|   ColorUI 类名    | UnoCSS 原子类 | 实际值 |
| :---------------: | :-----------: | :----: |
|    `margin-xs`    |   `m-10rpx`   | 10rpx  |
|    `margin-sm`    |   `m-20rpx`   | 20rpx  |
|  `margin` (默认)  |   `m-30rpx`   | 30rpx  |
|    `margin-lg`    |   `m-40rpx`   | 40rpx  |
|    `margin-xl`    |   `m-50rpx`   | 50rpx  |
|  `margin-top-xs`  |  `mt-10rpx`   | 10rpx  |
| `margin-right-sm` |  `mr-20rpx`   | 20rpx  |
|  `margin-bottom`  |  `mb-30rpx`   | 30rpx  |
| `margin-left-lg`  |  `ml-40rpx`   | 40rpx  |

#### Padding 内边距

|    ColorUI 类名    | UnoCSS 原子类 | 实际值 |
| :----------------: | :-----------: | :----: |
|    `padding-xs`    |   `p-10rpx`   | 10rpx  |
|    `padding-sm`    |   `p-20rpx`   | 20rpx  |
|  `padding` (默认)  |   `p-30rpx`   | 30rpx  |
|    `padding-lg`    |   `p-40rpx`   | 40rpx  |
|    `padding-xl`    |   `p-50rpx`   | 50rpx  |
|  `padding-top-xs`  |  `pt-10rpx`   | 10rpx  |
| `padding-right-sm` |  `pr-20rpx`   | 20rpx  |
|  `padding-bottom`  |  `pb-30rpx`   | 30rpx  |
| `padding-left-lg`  |  `pl-40rpx`   | 40rpx  |

### 2.4. 形状样式映射

#### 圆角

|  ColorUI 类名   |  UnoCSS 原子类  |  实际值   |
| :-------------: | :-------------: | :-------: |
|   `radius-xs`   | `rounded-4rpx`  |   4rpx    |
|   `radius-sm`   | `rounded-8rpx`  |   8rpx    |
| `radius` (默认) | `rounded-12rpx` |   12rpx   |
|   `radius-lg`   | `rounded-16rpx` |   16rpx   |
|   `radius-xl`   | `rounded-20rpx` |   20rpx   |
|     `round`     | `rounded-full`  | 999999rpx |

#### 阴影

|  ColorUI 类名   |    UnoCSS 原子类     |
| :-------------: | :------------------: |
|   `shadow-sm`   |  `shadow shadow-sm`  |
| `shadow` (默认) |       `shadow`       |
|   `shadow-lg`   |  `shadow shadow-lg`  |
|  `shadow-blur`  | `shadow shadow-blur` |

### 2.5. 网格布局映射

|    ColorUI 类名     |        UnoCSS 原子类        |      说明      |
| :-----------------: | :-------------------------: | :------------: |
|      `cu-grid`      |     `grid grid-cols-3`      | 3 列网格(默认) |
|   `cu-grid col-2`   |     `grid grid-cols-2`      |    2 列网格    |
|   `cu-grid col-3`   |     `grid grid-cols-3`      |    3 列网格    |
|   `cu-grid col-4`   |     `grid grid-cols-4`      |    4 列网格    |
|   `cu-grid col-5`   |     `grid grid-cols-5`      |    5 列网格    |
| `cu-grid no-border` | `grid grid-cols-3 border-0` |   无边框网格   |

## 3. 渐变色配置

### uno.config.ts 渐变色配置

```typescript
// uno.config.ts
export default defineConfig({
	theme: {
		extend: {
			colors: {
				// ColorUI 主题色
				colorui: {
					red: "#e54d42",
					orange: "#f37b1d",
					yellow: "#fbbd08",
					olive: "#8dc63f",
					green: "#39b54a",
					cyan: "#1cbbb4",
					blue: "#0081ff",
					purple: "#6739b6",
					mauve: "#9c26b0",
					pink: "#e03997",
					brown: "#a5673f",
					grey: "#8799a3",
					gray: "#aaaaaa",
					black: "#333333",
					white: "#ffffff",
				},
				// 渐变色变量 - 用于 UnoCSS 的 bg-gradient-to-* 类
				"gradual-red": {
					from: "#f43f3b",
					to: "#ec008c",
				},
				"gradual-orange": {
					from: "#ff9700",
					to: "#ed1c24",
				},
				"gradual-green": {
					from: "#39b54a",
					to: "#8dc63f",
				},
				"gradual-purple": {
					from: "#9000ff",
					to: "#5e00ff",
				},
				"gradual-pink": {
					from: "#ec008c",
					to: "#6739b6",
				},
				"gradual-blue": {
					from: "#0081ff",
					to: "#1cbbb4",
				},
			},
		},
	},
});
```

### 渐变背景使用方式

```vue
<!-- 旧的 ColorUI 渐变背景 -->
<view class="cu-bar bg-gradual-red"></view>

<!-- 新的 UnoCSS 渐变背景 -->
<view class="bg-gradient-to-r from-gradual-red-from to-gradual-red-to"></view>
```

## 4. 完整迁移示例

### 示例 1: 卡片组件迁移

**旧代码 (ColorUI)**:

```vue
<template>
	<view class="cu-card margin">
		<view class="cu-item shadow">
			<view class="cu-list menu-avatar">
				<view class="cu-item">
					<view class="cu-avatar round lg" :style="{ backgroundImage: 'url(' + avatar + ')' }"></view>
					<view class="content flex-sub">
						<view class="text-grey">{{ name }}</view>
						<view class="text-gray text-sm margin-top-xs">{{ desc }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
```

**新代码 (UnoCSS + wot-design-uni)**:

```vue
<template>
	<wd-card class="m-30rpx">
		<view class="shadow rounded-12rpx">
			<wd-cell center>
				<template #icon>
					<wd-img :src="avatar" round width="80rpx" height="80rpx" class="mr-20rpx" />
				</template>
				<template #title>
					<view class="flex flex-col">
						<text class="text-colorui-grey">{{ name }}</text>
						<text class="text-colorui-gray text-24rpx mt-10rpx">{{ desc }}</text>
					</view>
				</template>
			</wd-cell>
		</view>
	</wd-card>
</template>
```

### 示例 2: 按钮组迁移

**旧代码 (ColorUI)**:

```vue
<template>
	<view class="cu-bar btn-group">
		<button class="cu-btn bg-red lg">取消</button>
		<button class="cu-btn bg-green lg">确认</button>
	</view>
</template>
```

**新代码 (UnoCSS + wot-design-uni)**:

```vue
<template>
	<view class="flex justify-between gap-20rpx p-30rpx">
		<wd-button type="error" size="large" block>取消</wd-button>
		<wd-button type="success" size="large" block>确认</wd-button>
	</view>
</template>
```

### 示例 3: 列表项迁移

**旧代码 (ColorUI)**:

```vue
<template>
	<view class="cu-list menu">
		<view class="cu-item arrow">
			<view class="content">
				<text class="cuIcon-notification text-green margin-right-xs"></text>
				<text>通知标题</text>
			</view>
			<view class="action">
				<text class="text-gray text-sm">2023-12-01</text>
			</view>
		</view>
	</view>
</template>
```

**新代码 (UnoCSS + wot-design-uni)**:

```vue
<template>
	<wd-cell-group border>
		<wd-cell is-link>
			<template #icon>
				<wd-icon name="" custom-class="i-carbon-notification text-colorui-green mr-2" />
			</template>
			<template #title>
				<text>通知标题</text>
			</template>
			<template #default>
				<text class="text-colorui-gray text-24rpx">2023-12-01</text>
			</template>
		</wd-cell>
	</wd-cell-group>
</template>
```

## 5. 迁移检查清单

### 布局样式

- [ ] Flex 布局已迁移到 UnoCSS flex 类
- [ ] Grid 布局已迁移到 UnoCSS grid 类
- [ ] 对齐方式已使用 items-_ 和 justify-_ 类

### 颜色样式

- [ ] 文本颜色已使用 `text-colorui-*` 主题色
- [ ] 背景颜色已使用 `bg-colorui-*` 主题色
- [ ] 渐变背景已迁移到 `bg-gradient-to-*` 类

### 间距样式

- [ ] Margin 已迁移到 `m-*rpx` 类
- [ ] Padding 已迁移到 `p-*rpx` 类
- [ ] Gap 间距已使用 `gap-*rpx` 类

### 形状样式

- [ ] 圆角已迁移到 `rounded-*rpx` 类
- [ ] 阴影已迁移到 `shadow` 类

### 组件样式

- [ ] 所有 ColorUI 组件已替换为 wot-design-uni 组件
- [ ] 图标已迁移到 Carbon iconify 系统
- [ ] 按钮已使用 `wd-button` 组件

### uno.config.ts 配置

- [ ] 主题颜色已在 `theme.extend.colors` 中定义
- [ ] 渐变色变量已正确配置
- [ ] **未**滥用 shortcuts 功能
- [ ] **preflights 中未使用 `*` 通配符选择器**（微信小程序兼容）

### 微信小程序兼容性检查

- [ ] 所有 CSS 中未使用 `*` 通配符选择器
- [ ] 未使用 HTML 标签选择器（如 `p`、`div`、`span`）
- [ ] `@media` 查询中未使用 `*` 选择器
- [ ] Vue 组件 `<style>` 中未使用 `*` 选择器
- [ ] 未使用 `:not()` 伪类选择器（特别是 `:not([hidden])`）
- [ ] 未使用复杂的 `:nth-child()` 选择器（如 `n+2`, `3n+1`）
- [ ] 未使用 UnoCSS 的 `space-y-*` / `space-x-*` 类
- [ ] 未使用 UnoCSS 的 `divide-y-*` / `divide-x-*` 类
- [ ] 所有间距需求使用 `.item + .item` 相邻兄弟选择器实现

## 6. 性能优化收益

### 样式文件体积对比

|    项目    |  ColorUI  |  UnoCSS  |   减少    |
| :--------: | :-------: | :------: | :-------: |
| 主样式文件 |   195KB   |   80KB   | **-60%**  |
|  图标样式  |   45KB    | 按需生成 | **-100%** |
|  动画样式  |   20KB    | 按需生成 | **-100%** |
|  **总计**  | **260KB** | **80KB** | **-69%**  |

### 开发体验提升

- ✅ **类型提示**: UnoCSS 提供完整的 TypeScript 类型支持
- ✅ **智能补全**: VSCode 插件提供智能提示和补全
- ✅ **按需生成**: 仅生成使用的样式,减少冗余
- ✅ **语义化**: 原子类名语义清晰,易于理解和维护

## 7. 常见问题

### 1. 为什么不能使用 shortcuts?

**答**: shortcuts 会将样式类写入全局配置,导致:

- 配置文件臃肿,难以维护
- 失去原子化 CSS 的优势
- 增加团队成员的学习成本
- 违背"就近原则"

### 2. 为什么微信小程序不能使用 `*` 通配符选择器?

**答**: 微信小程序的 WXSS 是 CSS 的子集，有以下限制：

- **不支持 `*` 通配符选择器**：会导致编译错误 `unexpected token *`
- **不支持 HTML 标签选择器**：如 `p`、`div`、`span` 等
- **仅支持 class 选择器和小程序组件选择器**

**解决方案**：

```css
/* ❌ 错误 */
* {
	box-sizing: border-box;
}

/* ✅ 正确：列举小程序组件 */
page,
view,
text,
image,
button {
	box-sizing: border-box;
}
```

### 3. 如何处理复杂的样式组合?

**答**: 直接在组件中使用原子类组合,例如:

```vue
<!-- ✅ 推荐: 直接使用原子类 -->
<view class="flex items-center justify-between p-30rpx bg-white rounded-12rpx shadow">
  <!-- 内容 -->
</view>

<!-- ❌ 不推荐: 创建 shortcuts -->
<!-- uno.config.ts -->
<!-- shortcuts: { 'card-container': 'flex items-center justify-between p-30rpx bg-white rounded-12rpx shadow' } -->
```

### 4. ColorUI 的动画如何迁移?

**答**: UnoCSS 支持内置的动画类,或使用 CSS transitions/animations:

```vue
<!-- 淡入动画 -->
<view class="animate-fade-in">内容</view>

<!-- 滑动动画 -->
<view class="transition-all duration-300 transform translate-x-0 hover:translate-x-10">内容</view>
```

### 5. 如何查找 UnoCSS 对应的类名?

**答**:

1. **官方文档**: https://unocss.dev/interactive/
2. **VSCode 插件**: UnoCSS 插件提供智能提示
3. **交互式工具**: UnoCSS Playground

### 6. 为什么不能使用 UnoCSS 的 space-y-_ 和 space-x-_ 类？

**答**: 这些类会生成包含 `:not([hidden])` 伪类选择器的 CSS，微信小程序不支持：

```css
/* UnoCSS 生成的 space-y-2 样式 */
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
	margin-top: 8rpx;
}
```

**解决方案**：使用相邻兄弟选择器替代：

```vue
<!-- ❌ 错误 -->
<view class="space-y-2">
  <view>项目1</view>
  <view>项目2</view>
</view>

<!-- ✅ 正确 -->
<view>
  <view class="list-item">项目1</view>
  <view class="list-item">项目2</view>
</view>

<style scoped>
.list-item + .list-item {
  margin-top: 8rpx;
}
</style>
```

### 7. 如何实现列表项之间的间距？

**答**: 使用相邻兄弟选择器 `+` 是最兼容的方式：

```scss
/* 垂直间距 */
.item + .item {
	margin-top: 8rpx;
}

/* 水平间距 */
.item + .item {
	margin-left: 8rpx;
}
```

或者使用 Flex 布局的 `gap` 属性（微信小程序基础库 2.19.2+ 支持）：

```vue
<view class="flex flex-col gap-2">
  <view>项目1</view>
  <view>项目2</view>
</view>
```

通过系统化的样式迁移,实现更小的体积、更好的性能和更佳的开发体验!
