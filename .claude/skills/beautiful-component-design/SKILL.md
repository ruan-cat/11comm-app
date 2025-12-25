---
name: beautiful-component-design
description: 移动端 uni-app + wot-design-uni 组件美化规范。包含图标使用、文本样式、对齐方式、响应式设计等优化技巧。在编写维修工单详情页风格的信息展示页面时使用。
color: pink
---

# 组件美化设计规范

> **📚 关联 Skill**: 无关联其他 Skill，本技能独立提供组件美化设计指导。

用于指导编写视觉美观、文本与图标对齐良好、响应式友好的 Vue 组件的最佳实践。

## 1. 专业能力

- **图标规范设计**: 精通 Carbon Icons 图标集使用，熟悉图标与文本对齐的视觉设计原则
- **文本样式控制**: 掌握 wot-design-uni 组件文本样式覆盖技巧，实现统一的字号和行高
- **响应式布局**: 熟悉 uni-app rpx 单位系统和 UnoCSS 原子化 CSS，实现响应式友好设计
- **时间轴组件**: 能设计美观的流程记录时间轴，支持状态颜色区分和动态数据展示
- **图片网格**: 掌握响应式图片网格布局，支持多图展示和预览功能

## 2. 快速开始

### 2.1 图标使用模式

```vue
<template>
	<wd-cell title="报修ID" :value="repairDetail.repairId">
		<template #icon>
			<wd-icon
				name=""
				custom-class="i-carbon-edit text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center"
			/>
		</template>
	</wd-cell>
</template>
```

图标规范详见 [icon-usage.md](icon-usage.md)

### 2.2 文本样式统一

```vue
<template>
	<view class="text-36rpx">主内容</view>
	<view class="text-gray-600">次要内容</view>
</template>
```

文本规范详见 [text-alignment.md](text-alignment.md)

### 2.3 响应式图片网格

```vue
<template>
	<view class="grid grid-cols-3 gap-2">
		<wd-img
			v-for="(photo, index) in photos"
			:key="index"
			:src="photo.url || photo.photo"
			mode="aspectFill"
			class="aspect-square w-full rounded"
			:enable-preview="true"
		/>
	</view>
</template>
```

响应式规范详见 [responsive-design.md](responsive-design.md)

## 3. 设计原则

| 原则     | 说明                                    |
| :------- | :-------------------------------------- |
| 大小协调 | 文本 = 图标尺寸 - (4~8)rpx              |
| 高度一致 | 行高 = 图标高度                         |
| 对齐方式 | `display: flex` + `align-items: center` |
| 样式穿透 | `:deep()` + `!important`                |

## 4. 本项目标准配置

```scss
/** 标准图标文本组合 */
.icon {
	width: 36rpx;
	height: 36rpx;
	flex-shrink: 0;
}

.text {
	font-size: 28rpx;
	line-height: 36rpx;
}

.container {
	display: flex;
	align-items: center;
	gap: 8rpx;
}
```

## 5. 目录

| 文件                                         | 内容                                      |
| :------------------------------------------- | :---------------------------------------- |
| [icon-usage.md](icon-usage.md)               | 图标使用规范、UnoCSS 图标类名、尺寸、间距 |
| [text-alignment.md](text-alignment.md)       | 文本字号、行高、颜色、加粗、对齐方式      |
| [responsive-design.md](responsive-design.md) | rpx 单位、图片网格、圆角、深度选择器      |

## 6. 选择器组件美观规范

在表单中使用 `wd-picker` 选择器组件时，需要特别注意标签宽度和选中值显示的一致性。

### 6.1. 问题场景

当使用 `wd-picker` 的自定义插槽方式（嵌套 `wd-cell`）时，如果不设置 `:title-width`，选中值的显示位置会与其他表单项不一致，导致界面不美观。

### 6.2. 正确做法

```vue
<template>
	<wd-picker
		v-model="model.staffId"
		:columns="staffOptions"
		label-key="staffName"
		value-key="staffId"
		@confirm="handleStaffChange"
	>
		<wd-cell title="维修师傅" :title-width="LABEL_WIDTH" is-link center custom-value-class="cell-value-left">
			<text :class="model.staffId ? 'text-gray-900' : 'text-gray-400'">
				{{ selectedStaff?.staffName || "请选择员工" }}
			</text>
		</wd-cell>
	</wd-picker>
</template>

<style lang="scss" scoped>
/** wd-cell 值靠左对齐 - 确保选择器选中值与其他表单项对齐 */
:deep(.cell-value-left) {
	flex: 1;
	text-align: left !important;
}
</style>
```

### 6.3. 关键属性说明

|         属性          |                 作用                 |    必要性    |
| :-------------------: | :----------------------------------: | :----------: |
| `:title-width="80px"` |      统一标签宽度，与其他项对齐      | **必须设置** |
|       `center`        |           内容垂直居中对齐           | **必须设置** |
| `custom-value-class`  | 自定义选中值样式类，配合样式穿透使用 | **必须设置** |
|       `is-link`       |           显示右侧箭头图标           |   推荐设置   |

### 6.4. 样式穿透要点

```scss
/** wd-cell 值靠左对齐 - wot-design-uni 组件必需样式 */
:deep(.cell-value-left) {
	flex: 1; /* 占据剩余空间 */
	text-align: left !important; /* 左对齐，覆盖默认右对齐 */
}
```

## 7. 典型应用场景

- 维修工单详情页的信息展示
- 报修记录的列表项设计
- 状态展示的标签和图标组合
- 图片墙和画廊展示
- 时间轴和流程记录
- **表单中选择器组件的统一对齐**

## 8. 设计检查清单

- [ ] 图标和文本是否垂直居中对齐？
- [ ] 文本大小是否在 24-32rpx 之间？
- [ ] 行高是否与图标高度一致？
- [ ] 是否使用 `flex-shrink: 0` 防止图标变形？
- [ ] 是否正确使用 `:deep()` 穿透组件样式？
- [ ] 间距是否使用 8 的倍数？
- [ ] **选择器组件是否设置了统一的 `:title-width` 或 `:label-width`？**
- [ ] **选择器使用自定义插槽时是否添加了 `cell-value-left` 样式？**
