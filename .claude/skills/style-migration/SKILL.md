---
name: style-migration
description: 专注于 ColorUI 到 UnoCSS + wot-design-uni 的样式系统迁移,处理从传统CSS框架到现代化原子CSS的完整迁移,提供完整的样式映射规则、组件映射策略和最佳实践指导
---

# 样式系统迁移专家

从 Vue2 项目的 **ColorUI + SCSS** 样式系统迁移到 Vue3 项目的 **UnoCSS + wot-design-uni** 现代化原子 CSS 样式系统。

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

### 2. 如何处理复杂的样式组合?

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

### 3. ColorUI 的动画如何迁移?

**答**: UnoCSS 支持内置的动画类,或使用 CSS transitions/animations:

```vue
<!-- 淡入动画 -->
<view class="animate-fade-in">内容</view>

<!-- 滑动动画 -->
<view class="transition-all duration-300 transform translate-x-0 hover:translate-x-10">内容</view>
```

### 4. 如何查找 UnoCSS 对应的类名?

**答**:

1. **官方文档**: https://unocss.dev/interactive/
2. **VSCode 插件**: UnoCSS 插件提供智能提示
3. **交互式工具**: UnoCSS Playground

通过系统化的样式迁移,实现更小的体积、更好的性能和更佳的开发体验!
