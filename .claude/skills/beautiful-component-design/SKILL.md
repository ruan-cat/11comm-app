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

## 6. 选择器组件美观规范（⚠️ 重要）

在表单中使用 `wd-picker` 选择器组件时，需要特别注意**组件嵌套顺序**和标签宽度的一致性。

### 6.1. ⚠️ 严重错误：禁止的嵌套方式

**❌ 绝对禁止将 `wd-picker` 嵌套在 `wd-cell` 内部**，这会导致选择器无法点击！

```vue
<!-- ❌ 严重错误！会导致选择器无法点击 -->
<template>
	<wd-cell-group border>
		<wd-cell :title-width="LABEL_WIDTH" center>
			<template #title>
				<text>商品类型</text>
			</template>
			<template #value>
				<!-- ❌ 错误：wd-picker 被 wd-cell 包裹，点击事件被阻挡 -->
				<wd-picker v-model="selectedIndex" :columns="options" label-key="name" value-key="id">
					<text class="text-blue-500">
						{{ options[selectedIndex]?.name || "请选择" }}
					</text>
				</wd-picker>
			</template>
		</wd-cell>
	</wd-cell-group>
</template>
```

**问题原因**: `wd-cell` 包裹 `wd-picker` 会导致点击事件被阻挡，选择器弹窗无法正常打开。

---

### 6.2. ✅ 正确做法 1: 标准模式（推荐）

**使用场景**: 绝大多数情况下使用此方式，简洁高效。

```vue
<template>
	<wd-cell-group border>
		<!-- ✅ 正确：直接使用 wd-picker，通过 label 属性设置标题 -->
		<wd-picker
			v-model="model.category"
			label="分类"
			:label-width="LABEL_WIDTH"
			:columns="categoryOptions"
			label-key="name"
			value-key="id"
		/>
	</wd-cell-group>
</template>
```

---

### 6.3. ✅ 正确做法 2: 自定义插槽模式

**使用场景**: 仅在需要动态标题或复杂自定义显示时使用。

**关键要点**: `wd-picker` **包裹** `wd-cell`，而不是反过来！

```vue
<template>
	<wd-cell-group border>
		<!-- ✅ 正确：wd-picker 包裹 wd-cell，用于自定义显示 -->
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
	</wd-cell-group>
</template>

<style lang="scss" scoped>
/** wd-cell 值靠左对齐 - 确保选择器选中值与其他表单项对齐 */
:deep(.cell-value-left) {
	flex: 1;
	text-align: left !important;
}
</style>
```

---

### 6.4. 关键属性说明（自定义插槽模式）

|         属性          |                 作用                 |    必要性    |
| :-------------------: | :----------------------------------: | :----------: |
| `:title-width="80px"` |      统一标签宽度，与其他项对齐      | **必须设置** |
|       `center`        |           内容垂直居中对齐           | **必须设置** |
| `custom-value-class`  | 自定义选中值样式类，配合样式穿透使用 | **必须设置** |
|       `is-link`       |           显示右侧箭头图标           |   推荐设置   |

### 6.5. 样式穿透要点

```scss
/** wd-cell 值靠左对齐 - wot-design-uni 组件必需样式 */
:deep(.cell-value-left) {
	flex: 1; /* 占据剩余空间 */
	text-align: left !important; /* 左对齐，覆盖默认右对齐 */
}
```

### 6.6. 📝 选择器使用检查清单

使用 `wd-picker` 组件时，请务必检查：

- ✅ **组件嵌套顺序**: `wd-picker` 在外层，`wd-cell` 在内层（仅自定义插槽模式）
- ✅ **优先使用标准模式**: 直接使用 `label` 属性，除非确实需要自定义显示
- ✅ **label-width/title-width**: 与其他表单项保持一致的标签宽度
- ✅ **点击测试**: 实现后务必测试选择器能否正常点击弹出
- ❌ **严格禁止**: 将 `wd-picker` 放在 `wd-cell` 的 `#value` 插槽内

## 7. 典型应用场景

- 维修工单详情页的信息展示
- 报修记录的列表项设计
- 状态展示的标签和图标组合
- 图片墙和画廊展示
- 时间轴和流程记录
- **表单中选择器组件的统一对齐**

## 8. 设计检查清单

### 8.1. 通用美化检查

- [ ] 图标和文本是否垂直居中对齐？
- [ ] 文本大小是否在 24-32rpx 之间？
- [ ] 行高是否与图标高度一致？
- [ ] 是否使用 `flex-shrink: 0` 防止图标变形？
- [ ] 是否正确使用 `:deep()` 穿透组件样式？
- [ ] 间距是否使用 8 的倍数？

### 8.2. 选择器组件专项检查（⚠️ 必须检查）

- [ ] **组件嵌套顺序是否正确？**（`wd-picker` 在外层，`wd-cell` 在内层）
- [ ] **是否优先使用标准模式？**（通过 `label` 属性设置标题）
- [ ] **标签宽度是否统一？**（设置了统一的 `:title-width` 或 `:label-width`）
- [ ] **自定义插槽模式是否添加了必需样式？**（`cell-value-left` 样式类和样式穿透）
- [ ] **选择器能否正常点击弹出？**（实际测试点击功能）
- [ ] **是否避免了禁止的嵌套方式？**（`wd-picker` 绝不能在 `wd-cell` 的 `#value` 插槽内）
