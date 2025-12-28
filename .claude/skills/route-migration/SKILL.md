---
name: route-migration
description: 专注于 Vue2 传统路由配置到 Vue3 约定式路由的迁移。当需要处理从 pages.json 到文件系统路由的转换、多平台路由适配或页面配置迁移时使用
---

# 路由系统迁移专家

从 Vue2 项目的 **传统 pages.json 路由配置** 迁移到 Vue3 项目的 **约定式路由系统 + 自动路由生成** 现代化路由管理模式。

## ⚠️ 重要工作原则

**必须严格遵照 `Vue2 到 Vue3 uni-app 路由迁移映射表` 执行所有路由迁移任务**

### 映射表文件位置

```plain
.github\prompts\route-migration-map.yml
```

### 工作流程

1. **任务开始前**: 必须首先读取完整的路由迁移映射表
2. **路径查询**: 根据旧路径在映射表中查找对应的新路径
3. **严格执行**: 所有迁移必须按照映射表的路径执行,不允许自行决定路径
4. **进度追踪**: 映射表文件本身作为进度表,完成迁移后需要标记状态
5. **映射表优先**: 如有冲突,一切以映射表为准

### 映射表使用方法

```bash
# 1. 首先读取映射表文件
Read: .github\prompts\route-migration-map.yml

# 2. 在 route_mappings 中查找对应的路径映射
# 例如：gitee-example/pages/repairOrder/repairOrder.vue → src/pages-sub/repair/order-list.vue

# 3. 严格按照映射表执行迁移
# 4. 完成后在映射表相应模块添加 ✅ 标记
```

## 路由架构对比

### Vue2 项目路由架构

```plain
传统路由配置模式 (pages.json)
├── pages.json                    # 手动维护的集中式路由配置
│   ├── pages[]                   # 主包页面配置数组
│   ├── subPackages[]             # 分包配置
│   ├── globalStyle{}             # 全局样式配置
│   ├── tabBar{}                  # 底部导航配置
│   └── networkTimeout{}          # 网络超时配置
├── 页面文件                       # 页面文件与路由配置分离
└── 手动同步                       # 需要手动保持文件与配置同步
```

**特点**:

- **集中式配置**: 所有路由在 pages.json 中手动维护
- **手动同步**: 新增页面需同时修改文件和配置
- **配置冗余**: 页面路径和标题分散配置
- **维护成本高**: 大项目中配置文件过长难以维护

### Vue3 项目路由架构

```plain
约定式路由系统 (文件系统路由)
├── pages.config.ts               # 全局配置和组件自动导入
├── src/pages/                    # 页面目录结构即路由结构
│   ├── index/                    # /pages/index/index
│   │   └── index.vue            # 页面文件
│   ├── login/                    # /pages/login/
│   │   ├── login.vue            # 登录页面
│   │   └── register.vue         # 注册页面
│   └── about/                    # /pages/about/
│       ├── about.vue            # 关于页面
│       └── components/          # 页面级组件
├── src/pages-sub/                # 分包页面 (自动识别为分包)
├── src/tabbar/                   # 底部导航配置
│   └── config.ts                # TabBar 配置
└── 自动生成                       # 路由配置自动生成到 pages.json
```

**特点**:

- **约定优于配置**: 文件路径即路由路径
- **自动生成**: 路由配置自动从文件结构生成
- **definePage**: 页面级配置直接写在 Vue 文件中
- **TypeScript 支持**: 完整的类型检查和智能提示

## 路由配置差异分析

### 1. 页面路由定义方式对比

**Vue2 项目 - 集中式配置**:

```json
// pages.json
{
	"pages": [
		{
			"path": "pages/index/index",
			"style": {
				"navigationBarTitleText": "首页"
			}
		},
		{
			"path": "pages/login/login",
			"style": {
				"navigationBarTitleText": "登录",
				"navigationStyle": "custom"
			}
		}
	]
}
```

**Vue3 项目 - 约定式路由**:

```vue
<!-- src/pages/index/index.vue -->
<script setup lang="ts">
// 使用 definePage API
definePage({
	style: {
		navigationBarTitleText: "首页",
	},
});
</script>

<template>
	<view>首页内容</view>
</template>
```

### 2. 分包配置迁移对比

**Vue2 项目 - 手动分包配置**:

```json
// pages.json
{
	"subPackages": [
		{
			"root": "pages-sub/maintenance",
			"pages": [
				{
					"path": "maintainance",
					"style": {
						"navigationBarTitleText": "设备保养"
					}
				}
			]
		}
	]
}
```

**Vue3 项目 - 自动分包识别**:

```plain
src/pages-sub/                    # 自动识别为分包目录
├── maintenance/                  # 分包名称
│   ├── maintainance.vue         # 自动生成路径: pages-sub/maintenance/maintainance
│   └── excuteMaintainance.vue   # 自动生成路径: pages-sub/maintenance/excuteMaintainance
└── complaint/                    # 其他分包
    ├── complaint.vue
    └── detail.vue
```

## 迁移步骤

### 步骤 1: 创建页面文件

根据映射表,在新项目中创建对应的页面文件:

```bash
# 旧路径: pages/repairOrder/repairOrder.vue
# 新路径: src/pages-sub/repair/order-list.vue

# 创建文件
Write: src/pages-sub/repair/order-list.vue
```

### 步骤 2: 添加 definePage 配置

在页面文件中使用 `definePage` 定义页面配置:

```vue
<script setup lang="ts">
definePage({
	style: {
		navigationBarTitleText: "维修工单池",
		enablePullDownRefresh: true,
		onReachBottomDistance: 50,
	},
});
</script>
```

### 步骤 3: 迁移页面内容

迁移页面的模板、脚本和样式:

- 使用 Vue3 Composition API
- 使用 TypeScript
- 使用 UnoCSS 样式
- 使用 wot-design-uni 组件

### 步骤 4: 更新路由跳转

更新所有跳转到该页面的路由路径:

```typescript
// 旧代码
uni.navigateTo({
	url: "/pages/repairOrder/repairOrder",
});

// 新代码
uni.navigateTo({
	url: "/pages-sub/repair/order-list",
});
```

## 常用 definePage 配置

```vue
<script setup lang="ts">
definePage({
	// 页面名称
	name: "RepairOrderList",

	// 页面样式配置
	style: {
		// 导航栏标题
		navigationBarTitleText: "维修工单",

		// 导航栏背景色
		navigationBarBackgroundColor: "#368CFE",

		// 导航栏标题颜色
		navigationBarTextStyle: "white",

		// 下拉刷新
		enablePullDownRefresh: true,

		// 触底距离
		onReachBottomDistance: 50,

		// 自定义导航栏
		navigationStyle: "custom",

		// 背景色
		backgroundColor: "#f5f5f5",
	},
});
</script>
```

## 路由跳转方式

### 普通跳转

```typescript
// 跳转到列表页
uni.navigateTo({
	url: "/pages-sub/repair/order-list",
});

// 带参数跳转
uni.navigateTo({
	url: "/pages-sub/repair/order-detail?orderId=123&status=pending",
});
```

### 接收路由参数

```vue
<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";

const orderId = ref("");
const status = ref("");

onLoad((options) => {
	orderId.value = options.orderId as string;
	status.value = options.status as string;
});
</script>
```

## 迁移检查清单

- [ ] **映射表检查**
  - [ ] 已读取完整的路由迁移映射表
  - [ ] 路径映射准确无误
  - [ ] 完成后已标记迁移状态

- [ ] **文件创建**
  - [ ] 页面文件已创建在正确的目录
  - [ ] 文件命名符合约定式路由规范

- [ ] **definePage 配置**
  - [ ] 页面标题已配置
  - [ ] 必要的页面配置已迁移
  - [ ] TypeScript 类型正确

- [ ] **路由跳转**
  - [ ] 所有跳转到该页面的路由已更新
  - [ ] 路由参数传递正确
  - [ ] 路由参数接收正确

- [ ] **功能验证**
  - [ ] 页面可以正常访问
  - [ ] 路由跳转正常
  - [ ] 参数传递正常

通过约定式路由系统,实现路由配置的自动化管理,提升开发效率和代码可维护性！
