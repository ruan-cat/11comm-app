# 美观组件设计规范

用于指导编写视觉美观、文本与图标对齐良好、响应式友好的 Vue 组件的最佳实践。

---

## 1. 核心设计原则

### 1.1 文本与图标的视觉统一

文本和图标应该保持视觉上的协调一致，主要体现在：

- **大小关系**：文本字体大小应略小于或等于图标尺寸
- **对齐方式**：文本与图标应垂直居中对齐
- **间距统一**：保持一致的间距规范

### 1.2 响应式友好的尺寸选择

在 uni-app 项目中，使用 rpx 单位确保跨平台一致性：

| 元素类型 |      推荐尺寸      |       说明       |
| :------: | :----------------: | :--------------: |
|  小图标  |      24-28rpx      |  适合辅助性图标  |
| 标准图标 |      32-36rpx      | 最常用的图标尺寸 |
|  大图标  |      40-48rpx      |    强调性图标    |
| 配套文本 | icon 尺寸 - 4~8rpx |   确保视觉平衡   |

**最佳实践**：

- 36rpx 图标 → 28rpx 文本（本项目标准）
- 文本行高设置为图标高度，确保垂直对齐

---

## 2. 文本与图标对齐的实现方案

### 2.1 使用 Flex 布局对齐

#### 基础对齐结构

```vue
<template>
	<view class="icon-text-row">
		<wd-icon name="" custom-class="icon-style" />
		<text class="text-style">标题文本</text>
	</view>
</template>

<style lang="scss" scoped>
.icon-text-row {
	display: flex;
	align-items: center; /* 垂直居中 */
	gap: 8rpx; /* 使用 gap 替代 margin，更简洁 */
}

.icon-style {
	width: 36rpx;
	height: 36rpx;
	flex-shrink: 0; /* 防止图标被压缩 */
}

.text-style {
	font-size: 28rpx;
	line-height: 36rpx; /* 与图标高度一致 */
}
</style>
```

### 2.2 处理第三方组件库的样式覆盖

当使用 wot-design-uni 等组件库时，常需要覆盖默认样式：

#### 使用 :deep() 穿透样式

```vue
<template>
	<wd-cell title="报修ID" :value="repairId">
		<template #icon>
			<wd-icon name="" custom-class="i-carbon-edit w-36rpx h-36rpx" />
		</template>
	</wd-cell>
</template>

<style lang="scss" scoped>
/** 强制覆盖 wd-cell 的文本大小 */
:deep(.wd-cell__title) {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
}

:deep(.wd-cell__value) {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
}

/** 确保 icon 区域垂直居中 */
:deep(.wd-cell__icon) {
	display: flex !important;
	align-items: center !important;
}
</style>
```

**关键点**：

- 使用 `:deep()` 穿透 scoped 样式
- 添加 `!important` 确保样式优先级
- 同时设置 `font-size` 和 `line-height`

### 2.3 图片标题区域的对齐

```vue
<template>
	<view class="image-section">
		<view class="image-section-title">
			<wd-icon name="" custom-class="i-carbon-image w-36rpx h-36rpx" />
			<text>业主报修图片</text>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.image-section-title {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 28rpx !important;
	line-height: 36rpx !important;
	font-weight: bold;
	margin-bottom: 16rpx;
}
</style>
```

---

## 3. 响应式设计最佳实践

### 3.1 使用 UnoCSS 的 rpx 规则

项目配置了自定义 rpx 规则（uno.config.ts），可直接使用：

```vue
<template>
	<!-- 推荐：使用 UnoCSS 原子类 -->
	<view class="flex items-center gap-2">
		<wd-icon custom-class="w-36rpx h-36rpx" />
		<text class="text-28rpx leading-36rpx">文本</text>
	</view>
</template>
```

### 3.2 字体大小的响应式选择

参考项目的 UnoCSS 配置（uno.config.ts:100-121）：

```typescript
fontSize: {
  'xs': ['24rpx', '32rpx'],    // 极小文本
  'sm': ['28rpx', '40rpx'],    // 小文本（推荐用于配图标）
  'base': ['32rpx', '44rpx'],  // 基准文本
  'lg': ['36rpx', '48rpx'],    // 大文本
  'xl': ['40rpx', '52rpx'],    // 超大文本
}
```

**推荐组合**：

- 36rpx 图标 + `text-sm`（28rpx）✅ **本项目标准**
- 32rpx 图标 + `text-xs`（24rpx）
- 40rpx 图标 + `text-base`（32rpx）

---

## 4. 时间轴组件的美观实现

### 4.1 完整的时间轴示例

```vue
<template>
	<view class="timeline-container">
		<view class="timeline-title">工单流转记录</view>

		<view class="timeline-list">
			<view v-for="(record, index) in records" :key="index" class="timeline-item">
				<!-- 时间轴节点 -->
				<view class="timeline-node">
					<view class="node-dot" />
					<view v-if="index !== records.length - 1" class="node-line" />
				</view>

				<!-- 时间轴内容 -->
				<view class="timeline-content">
					<view class="timeline-record-title"> {{ record.time }} - {{ record.status }} </view>
					<view class="timeline-record-content"> 处理意见：{{ record.context }} </view>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.timeline-title {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
	font-weight: bold;
	margin-bottom: 24rpx;
}

.timeline-item {
	display: flex;
	gap: 24rpx;
	margin-bottom: 32rpx;
}

.timeline-node {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 4rpx;

	.node-dot {
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
		background-color: #4299e1;
		flex-shrink: 0;
	}

	.node-line {
		flex: 1;
		width: 4rpx;
		background-color: #e2e8f0;
		margin-top: 8rpx;
		min-height: 80rpx;
	}
}

.timeline-content {
	flex: 1;
}

.timeline-record-title {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
	font-weight: 500;
	margin-bottom: 8rpx;
}

.timeline-record-content {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
	color: #718096;
}
</style>
```

---

## 5. 常见问题与解决方案

### 5.1 文本和图标不对齐

**问题现象**：图标和文本的垂直位置不一致

**解决方案**：

```scss
// ❌ 错误：缺少对齐设置
.container {
	display: flex;
}

// ✅ 正确：明确设置对齐方式
.container {
	display: flex;
	align-items: center; /* 垂直居中 */
}

// ✅ 更好：同时设置行高
.text {
	font-size: 28rpx;
	line-height: 36rpx; /* 与图标高度一致 */
}
```

### 5.2 响应式场景下文本显示过小

**问题现象**：在某些设备上文本太小，难以阅读

**原因分析**：

1. 使用了语义化尺寸（如 `text-lg`）但被组件库样式覆盖
2. 未设置明确的 `line-height`

**解决方案**：

```scss
// ❌ 避免：仅使用 class，可能被覆盖
.text {
	/* 依赖 UnoCSS 的 text-lg */
}

// ✅ 推荐：使用 scoped 样式 + !important
.text {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
}

// ✅ 或者：使用 :deep() 穿透
:deep(.component__text) {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
}
```

### 5.3 图标被文本挤压变形

**问题现象**：在 flex 布局中，图标宽高比例失调

**解决方案**：

```scss
.icon {
	width: 36rpx;
	height: 36rpx;
	flex-shrink: 0; /* 关键：防止被压缩 */
}
```

### 5.4 组件库默认样式无法覆盖

**问题现象**：设置了样式但不生效

**解决方案优先级**：

```scss
/* 1. 尝试普通覆盖 */
.custom-class {
	font-size: 28rpx;
}

/* 2. 使用 :deep() 穿透 */
:deep(.component__inner) {
	font-size: 28rpx;
}

/* 3. 添加 !important（最后手段） */
:deep(.component__inner) {
	font-size: 28rpx !important;
}
```

---

## 6. 完整示例：美观的信息展示卡片

### 6.1 组件代码

```vue
<template>
	<view class="info-card">
		<!-- 标题区域 -->
		<view class="card-header">
			<wd-icon name="" custom-class="i-carbon-document header-icon" />
			<text class="header-title">工单详情</text>
		</view>

		<!-- 信息列表 -->
		<wd-cell-group border>
			<wd-cell v-for="item in infoList" :key="item.label" :title="item.label" :value="item.value">
				<template #icon>
					<wd-icon name="" :custom-class="`${item.icon} cell-icon`" />
				</template>
			</wd-cell>
		</wd-cell-group>
	</view>
</template>

<script setup lang="ts">
const infoList = [
	{ label: "报修ID", value: "REP_001", icon: "i-carbon-edit" },
	{ label: "报修人", value: "张三", icon: "i-carbon-user" },
	{ label: "联系方式", value: "13800138000", icon: "i-carbon-phone" },
];
</script>

<style lang="scss" scoped>
.info-card {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 24rpx;
}

.card-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 24rpx;
}

.header-icon {
	width: 40rpx;
	height: 40rpx;
	color: #39b54a;
	flex-shrink: 0;
}

.header-title {
	font-size: 32rpx;
	line-height: 40rpx;
	font-weight: bold;
	color: #374151;
}

/** 覆盖 wd-cell 样式 */
:deep(.wd-cell__title) {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
	color: #374151 !important;
}

:deep(.wd-cell__value) {
	font-size: 28rpx !important;
	line-height: 36rpx !important;
	color: #6b7280 !important;
}

:deep(.wd-cell__icon) {
	display: flex !important;
	align-items: center !important;
}

.cell-icon {
	width: 36rpx;
	height: 36rpx;
	color: #39b54a;
	margin-right: 8rpx;
}
</style>
```

### 6.2 效果说明

这个示例展示了：

1. ✅ 图标与文本完美对齐
2. ✅ 统一的字体大小和行高
3. ✅ 合理的间距和留白
4. ✅ 响应式友好的尺寸单位
5. ✅ 正确的样式覆盖方法

---

## 7. 设计检查清单

在完成组件开发后，使用此检查清单验证：

- [ ] 图标和文本是否垂直居中对齐？
- [ ] 文本大小是否在 24-32rpx 之间（移动端适宜）？
- [ ] 行高是否与图标高度一致或接近？
- [ ] 是否使用了 `flex-shrink: 0` 防止图标变形？
- [ ] 是否正确使用了 `:deep()` 穿透组件样式？
- [ ] 间距是否统一（建议使用 8 的倍数：8rpx, 16rpx, 24rpx）？
- [ ] 在不同设备尺寸下显示是否正常？
- [ ] 是否使用了语义化的类名（如 `.icon-text-row`）？

---

## 8. 项目特定配置

### 8.1 UnoCSS 自定义规则

本项目在 `uno.config.ts` 中配置了 rpx 规则：

```typescript
// 可直接使用的类名
rules: [
	[/^text-(\d+)rpx$/, ([, d]) => ({ "font-size": `${d}rpx` })],
	[/^leading-(\d+)rpx$/, ([, d]) => ({ "line-height": `${d}rpx` })],
	[/^w-(\d+)rpx$/, ([, d]) => ({ width: `${d}rpx` })],
	[/^h-(\d+)rpx$/, ([, d]) => ({ height: `${d}rpx` })],
];
```

**使用示例**：

```vue
<text class="text-28rpx leading-36rpx">精确控制</text>
<wd-icon custom-class="w-36rpx h-36rpx" />
```

### 8.2 推荐的图标库

本项目使用 **Carbon Icons** 图标集：

- 图标前缀：`i-carbon-`
- 常用图标：`edit`, `user`, `phone`, `location`, `time`, `document`
- 优点：简洁、现代、统一风格

---

## 9. 总结

### 黄金法则

1. **大小协调**：文本 = 图标尺寸 - (4~8)rpx
2. **高度一致**：行高 = 图标高度
3. **对齐方式**：`display: flex` + `align-items: center`
4. **样式穿透**：`:deep()` + `!important`
5. **防止变形**：`flex-shrink: 0`

### 本项目标准配置

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

遵循这些规范，可以确保组件在所有平台上都呈现出美观、一致的视觉效果。

---

**最后更新**：2025-12-21
**适用范围**：uni-app + Vue3 + wot-design-uni + UnoCSS 项目
