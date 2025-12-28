---
name: component-migration
description: 专业的 uni-app 组件迁移专家,专注于从 ColorUI + uni-app 内置组件到 wot-design-uni 组件库的迁移。当需要进行组件映射转换、Icon图标迁移、表单组件迁移、空状态组件迁移或全局反馈组件配置时使用
---

# 组件迁移专家

专业的 uni-app 组件迁移专家,专注于从传统 ColorUI + uni-app 内置组件架构迁移到现代化 wot-design-uni + UnoCSS 技术栈。

## 专业能力

- **组件映射分析**: 深度理解 ColorUI 和 wot-design-uni 组件库的设计理念和实现差异
- **API 转换策略**: 精通 Vue2 到 Vue3 的组件 API 升级和属性映射转换
- **样式迁移**: 熟练处理从 ColorUI 类名到 UnoCSS 原子化 CSS 的样式迁移
- **跨平台兼容**: 确保迁移后的组件在 H5、小程序、APP 多平台正常运行
- **性能优化**: 利用 Vue3 + TypeScript 提升组件性能和开发体验

## 获取 wot-design-uni 组件库文档

当需要了解 wot-design-uni 组件使用方法时,可通过以下方式查阅文档:

1. **官方文档**: https://wot-ui.cn/guide/quick-use.html
2. **GitHub 文档**: https://github.com/Moonofweisheng/wot-design-uni/tree/master/docs/component
3. 使用 WebFetch 或 MCP 工具获取在线文档

**类型导入规范**: 本项目使用 pnpm 安装 wot-design-uni,类型导入使用 `wot-design-uni/components/wd-xxx/types`,而非 `@/uni_modules/...`

## 核心职责

### 1. 组件识别与分析

- 识别项目中使用的 ColorUI 组件和样式类
- 分析组件的功能需求和交互逻辑
- 评估组件的复杂度和迁移优先级

### 2. 组件映射与转换

- 提供 ColorUI 到 wot-design-uni 的精确组件映射
- 转换组件属性和事件处理方法
- 适配 Vue3 Composition API 和 TypeScript 语法

### 3. 样式系统迁移

- 将 ColorUI 样式类转换为 UnoCSS 原子化类名
- 保持视觉效果的一致性
- 优化样式性能和可维护性

### 4. 交互逻辑升级

- 升级 Vue2 Options API 到 Vue3 Composition API
- 优化事件处理和数据绑定逻辑
- 集成 TypeScript 类型系统

## 快速迁移指南

### 1. 基础组件映射

|   旧组件/类名    |  使用场景  |           新组件           |          迁移说明          |
| :--------------: | :--------: | :------------------------: | :------------------------: |
|     `cu-btn`     |  按钮组件  |        `wd-button`         |  支持多种类型、尺寸和状态  |
| `cu-btn bg-blue` |  蓝色按钮  | `wd-button type="primary"` | 使用 type 属性替代颜色类名 |
|   `cu-btn lg`    | 大尺寸按钮 |  `wd-button size="large"`  |   使用 size 属性控制尺寸   |

**示例**:

```vue
<!-- 旧代码 -->
<button class="cu-btn bg-blue lg" @tap="doLogin()">登录</button>

<!-- 新代码 -->
<wd-button type="primary" size="large" @click="doLogin">登录</wd-button>
```

### 2. 列表组件映射

|   旧组件/类名   |     使用场景     |          新组件           |       迁移说明        |
| :-------------: | :--------------: | :-----------------------: | :-------------------: |
| `cu-list menu`  |   菜单列表容器   |      `wd-cell-group`      |     列表容器组件      |
|    `cu-item`    |      列表项      |         `wd-cell`         |      基础列表项       |
| `cu-item arrow` |  带箭头的列表项  |     `wd-cell is-link`     | 使用 is-link 显示箭头 |
|   `.content`    |    列表项内容    |    `wd-cell` 默认插槽     | 直接使用组件内容区域  |
|    `.action`    | 列表项右侧操作区 | `wd-cell` 的 `right` 插槽 |     使用具名插槽      |

**示例**:

```vue
<!-- 旧代码 -->
<view class="cu-list menu">
  <view class="cu-item arrow" @click="gotoDetail">
    <view class="content">
      <text class="cuIcon-notification text-green"></text>
      <view class="text-cut">{{ notice.title }}</view>
    </view>
  </view>
</view>

<!-- 新代码 -->
<wd-cell-group>
  <wd-cell is-link @click="gotoDetail">
    <template #icon>
      <wd-icon name="" custom-class="i-carbon-notification text-green-500 mr-2" />
    </template>
    <template #title>
      <view class="truncate">{{ notice.title }}</view>
    </template>
  </wd-cell>
</wd-cell-group>
```

> **📚 完整映射表**: 参阅 [组件映射表.md](组件映射表.md)

### 3. Icon 图标迁移

**核心方针**: 从 `cuIcon-*` ColorUI 图标迁移到基于 `<wd-icon>` 组件的 Carbon 图标系统。

**技术要点**:

1. **Icon 实现方式**: 使用基于类名生成的 iconify 图标系统
2. **图标集**: 本项目使用 `@iconify-json/carbon` (Carbon 图标集)
3. **类名格式**: `i-carbon-*` (UnoCSS + Iconify 规范)
4. **组件要求**: 必须使用 `<wd-icon name="" custom-class="i-carbon-..." />`

**迁移示例**:

```vue
<!-- 旧代码: ColorUI 图标 -->
<text class="cuIcon-notification"></text>
<text class="cuIcon-notification text-green"></text>

<!-- 新代码: wd-icon + Carbon 图标 -->
<wd-icon name="" custom-class="i-carbon-notification" />
<wd-icon name="" custom-class="i-carbon-notification text-colorui-green" />
```

**常用图标映射**:

| ColorUI 图标          | Carbon 图标映射         |
| :-------------------- | :---------------------- |
| `cuIcon-notification` | `i-carbon-notification` |
| `cuIcon-close`        | `i-carbon-close`        |
| `cuIcon-search`       | `i-carbon-search`       |
| `cuIcon-add`          | `i-carbon-add`          |
| `cuIcon-delete`       | `i-carbon-trash-can`    |
| `cuIcon-edit`         | `i-carbon-edit`         |
| `cuIcon-home`         | `i-carbon-home`         |
| `cuIcon-user`         | `i-carbon-user-avatar`  |
| `cuIcon-time`         | `i-carbon-time`         |

> **📚 完整映射**: 参阅 [Icon 图标迁移.md](Icon图标迁移.md)

### 4. 表单组件迁移

**表单分区标题**: 必须使用 `form-section-title` 组件

```vue
<script setup lang="ts">
import FormSectionTitle from "@/components/common/form-section-title/index.vue";
</script>

<template>
	<!-- 基础用法 -->
	<wd-cell-group border>
		<FormSectionTitle title="房屋信息" />
		<wd-input label="楼栋" />
	</wd-cell-group>

	<!-- 带图标和必填标记 -->
	<wd-cell-group border class="mt-3">
		<FormSectionTitle title="报修信息" icon="information" icon-class="i-carbon-information text-green-500" required />
		<wd-input label="报修人" />
	</wd-cell-group>
</template>
```

**wd-picker 选择器**: 组件嵌套顺序至关重要!

```vue
<!-- ✅ 正确用法 1: 标准模式（推荐） -->
<wd-cell-group border>
  <wd-picker
    v-model="model.category"
    label="分类"
    :label-width="LABEL_WIDTH"
    :columns="categoryOptions"
    label-key="name"
    value-key="id"
  />
</wd-cell-group>

<!-- ✅ 正确用法 2: 自定义插槽模式（wd-picker 包裹 wd-cell） -->
<wd-cell-group border>
  <wd-picker v-model="model.feeFlag" :columns="feeOptions" label-key="name" value-key="id">
    <wd-cell :title-width="LABEL_WIDTH" is-link>
      <text>{{ selectedLabel || '请选择' }}</text>
    </wd-cell>
  </wd-picker>
</wd-cell-group>

<!-- ❌ 错误: wd-cell 不存在 #value 插槽! -->
<wd-cell>
  <template #value>  <!-- 错误! -->
    <wd-picker />
  </template>
</wd-cell>
```

> **📚 详细规范**: 参阅 [wd-picker 使用规范.md](wd-picker使用规范.md)

### 5. 图片组件迁移

**强制使用 `<wd-img>` 替换 `<image>`**

```vue
<!-- 旧代码 -->
<image :src="avatar" mode="aspectFill" style="width: 100px; height: 100px;" />

<!-- 新代码 -->
<wd-img :src="avatar" mode="aspectFill" class="w-100rpx h-100rpx" round />

<!-- ⚠️ 禁止使用 width/height 属性,必须用 UnoCSS 类 -->
<wd-img :src="image" class="w-full h-auto" />
<!-- ✅ 正确 -->
<wd-img :src="image" width="100" />
<!-- ❌ 错误 -->
```

**增强功能**:

```vue
<!-- 带加载和错误状态 -->
<wd-img :src="image" class="w-200rpx h-200rpx">
  <template #loading>
    <wd-loading />
  </template>
  <template #error>
    <view class="text-gray-400">加载失败</view>
  </template>
</wd-img>

<!-- 可预览的图片 -->
<wd-img :src="image" :enable-preview="true" class="w-150rpx h-150rpx" />
```

### 6. 空状态组件迁移

**强制使用 `<wd-status-tip>` 替换 `no-data-page`**

```vue
<!-- 旧代码 -->
<view v-if="list.length === 0">
  <no-data-page></no-data-page>
</view>

<!-- 新代码 -->
<view v-if="list.length === 0">
  <wd-status-tip image="search" tip="暂无数据" />
</view>
```

**7 种内置状态类型**:

- `search`: 搜索无结果
- `network`: 网络连接失败
- `content`: 内容为空（默认）
- `collect`: 收藏/收集为空
- `comment`: 评论/联系人为空
- `halo`: 操作失败/支付失败
- `message`: 消息通知

**自定义图片内容**:

```vue
<wd-status-tip tip="自定义空状态">
  <template #image>
    <wd-icon name="" custom-class="i-carbon-warning-alt text-60rpx text-orange-500" />
  </template>
</wd-status-tip>
```

### 7. 全局反馈组件

**核心原则**: 所有反馈组件统一在 `App.vue` 根组件注册,避免层级遮挡问题。

**⚠️ 严格禁止**:

- 在子组件内直接使用 `<wd-toast />`、`<wd-message-box />`、`<wd-loading />`
- 手动管理 loading 状态

**✅ 必须使用**:

```typescript
// ✅ 正确: 使用全局组合式函数
import { useGlobalToast } from "@/hooks/useGlobalToast";
import { useGlobalMessage } from "@/hooks/useGlobalMessage";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

const toast = useGlobalToast();
const message = useGlobalMessage();
const loading = useGlobalLoading();

// 使用
toast.success("操作成功");
message.confirm({
	msg: "确认删除?",
	success: () => {
		/* 确认回调 */
	},
});
loading.show("加载中...");
loading.hide();
```

> **📚 详细文档**: 参阅 [全局反馈组件.md](全局反馈组件.md)

### 8. z-paging 分页组件

**必配项**:

- `ref="pagingRef"` - 组件引用
- `v-model="list"` - 列表数据绑定
- `@query="handleQuery"` - 请求触发
- `:default-page-size="10"` - 每页数量
- `:refresher-enabled="true"` - 下拉刷新
- `:loading-more-enabled="true"` - 上拉加载
- `:show-scrollbar="false"` - 隐藏滚动条

**基础用法**:

```vue
<template>
	<z-paging
		ref="pagingRef"
		v-model="list"
		@query="handleQuery"
		:default-page-size="10"
		:refresher-enabled="true"
		:loading-more-enabled="true"
		:show-scrollbar="false"
	>
		<view v-for="item in list" :key="item.id">
			<!-- 列表项 -->
		</view>

		<template #empty>
			<wd-status-tip image="search" tip="暂无数据" />
		</template>
	</z-paging>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const pagingRef = ref();
const list = ref([]);

function handleQuery(pageNo: number, pageSize: number) {
	// 只发请求,不要 await/try/catch
	// 详见 z-paging-integration skill
}

onMounted(() => {
	pagingRef.value?.reload();
});
</script>
```

> **📚 详细规范**: 参阅 `.claude/skills/z-paging-integration/SKILL.md`

## 迁移策略

### 1. 渐进式迁移原则

- **页面级迁移**: 优先迁移相对独立的页面组件
- **组件级迁移**: 逐个迁移可复用的基础组件
- **功能级迁移**: 按业务功能模块进行分批迁移

### 2. 兼容性保证

- **向后兼容**: 保持原有功能和交互逻辑不变
- **渐进增强**: 利用新组件库的高级特性优化用户体验
- **平台适配**: 确保多平台运行的一致性

### 3. 质量控制

- **类型安全**: 充分利用 TypeScript 提供类型检查
- **性能优化**: 使用 Vue3 组合式 API 优化组件性能
- **代码规范**: 遵循现代化的代码编写规范

## 技术要点

### 1. Vue3 Composition API 迁移

- 使用 `ref` 和 `reactive` 替代 `data`
- 使用 `computed` 和 `watch` 进行响应式计算
- 使用 `onMounted`、`onUnmounted` 等生命周期钩子

### 2. TypeScript 集成

- 为组件 props 定义明确的类型接口
- 使用泛型提升组件的类型安全性
- 充分利用 IDE 的类型提示和检查

### 3. UnoCSS 样式优化

- 使用原子化 CSS 类替代传统的样式类
- 保持样式的一致性和可维护性
- 利用 UnoCSS 的预设和自定义规则

### 4. 平台兼容性处理

- 使用条件编译处理平台差异
- 确保组件在不同平台的一致表现
- 优化小程序和 APP 的性能

## 迁移检查清单

- [ ] **基础组件**
  - [ ] 按钮、列表、标签组件已迁移
  - [ ] 导航、弹窗组件已迁移

- [ ] **表单组件**
  - [ ] 输入框、选择器组件已迁移
  - [ ] 表单分区标题使用 form-section-title
  - [ ] wd-picker 嵌套顺序正确

- [ ] **Icon 图标**
  - [ ] 所有 cuIcon-_ 已替换为 i-carbon-_
  - [ ] 使用 wd-icon 组件 + custom-class 属性

- [ ] **图片组件**
  - [ ] 所有 `<image>` 已替换为 `<wd-img>`
  - [ ] 宽高使用 UnoCSS 类,不用 width/height 属性

- [ ] **空状态**
  - [ ] no-data-page 已替换为 wd-status-tip
  - [ ] 选择合适的内置状态类型

- [ ] **全局反馈**
  - [ ] 子组件内无 Toast/Message/Loading 组件
  - [ ] 使用 useGlobalToast/Message/Loading

- [ ] **样式系统**
  - [ ] ColorUI 类名已转换为 UnoCSS
  - [ ] 保持视觉效果一致性

通过系统化的组件迁移,确保项目从传统 ColorUI 架构平滑升级到现代化 wot-design-uni + UnoCSS 技术栈,提升开发效率和用户体验。
