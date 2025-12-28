---
name: code-migration
description: 专注于 Vue2 Options API 到 Vue3 Composition API + TypeScript 的迁移。当需要进行Vue2到Vue3代码迁移、Options API到Composition API转换、TypeScript类型定义、Vuex到Pinia状态管理迁移、组合式函数编写时使用
---

# uni-app 代码写法迁移专家

从 Vue2 项目的 **Options API + JavaScript** 开发模式迁移到 Vue3 项目的 **Composition API + TypeScript + unibest** 现代化开发模式。

## 迁移概述

### 核心转变

| 技术栈维度 | Vue2 旧项目             | Vue3 新项目                        |
| :--------: | :---------------------- | :--------------------------------- |
|  语法范式  | Options API             | Composition API (`<script setup>`) |
|  类型系统  | JavaScript (无类型)     | TypeScript (完整类型安全)          |
|  状态管理  | Vuex 3.x                | Pinia 2.x + 持久化                 |
|  代码复用  | Mixins                  | Composables (组合式函数)           |
|  生命周期  | `mounted/beforeDestroy` | `onMounted/onBeforeUnmount`        |
| 响应式数据 | `data() { return {} }`  | `ref()/reactive()`                 |
|  计算属性  | `computed: { ... }`     | `computed(() => ...)`              |
|  页面配置  | `pages.json` 集中配置   | `definePage()` 组件内配置          |

### 职责边界

⚠️ **重要说明**:

- 本技能专注于 **Vue2 Options API 到 Vue3 Composition API** 的代码写法迁移
- 关于 **API 接口定义、请求状态管理、useRequest 使用规范**，请参考 `api-migration` 技能
- 两个技能职责明确分工，避免重复说明

## 快速迁移指南

### 1. 组件结构迁移

**Vue2 Options API 典型结构**:

```javascript
export default {
  name: 'TaskList',
  data() {
    return {
      loading: false,
      taskList: []
    }
  },
  computed: {
    filteredTasks() {
      return this.taskList.filter(...)
    }
  },
  mounted() {
    this.loadTasks()
  },
  methods: {
    async loadTasks() {
      // 加载数据
    }
  }
}
```

**Vue3 Composition API 对应结构**:

```typescript
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTaskList } from '@/api/task'

// 页面配置
definePage({
  style: {
    navigationBarTitleText: '任务列表'
  }
})

// 类型定义
interface Task {
  id: string
  title: string
  status: string
}

// 响应式数据
const taskList = ref<Task[]>([])
const loading = ref(false)

// 计算属性
const filteredTasks = computed(() => {
  return taskList.value.filter(...)
})

// 方法
async function loadTasks() {
  loading.value = true
  try {
    const result = await getTaskList({ page: 1, row: 10 })
    taskList.value = result.tasks
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadTasks()
})
</script>
```

> **📚 详细对比**: 参阅 [Vue2 到 Vue3 写法对比.md](Vue2到Vue3写法对比.md)

### 2. 状态管理迁移 (Vuex → Pinia)

**核心区别**:

- Vuex: `state/mutations/actions/getters` 分离式定义
- Pinia: `defineStore()` 组合式 API，无需 mutations

**Pinia Store 定义**:

```typescript
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useTaskStore = defineStore(
	"task",
	() => {
		// State
		const taskList = ref<Task[]>([]);
		const loading = ref(false);

		// Getters
		const completedTasks = computed(() => taskList.value.filter((task) => task.status === "completed"));

		// Actions
		const loadTasks = async () => {
			loading.value = true;
			try {
				const result = await getTaskList();
				taskList.value = result;
			} finally {
				loading.value = false;
			}
		};

		return {
			taskList: readonly(taskList),
			loading: readonly(loading),
			completedTasks,
			loadTasks,
		};
	},
	{
		// 持久化配置
		persist: {
			key: "task-store",
			storage: {
				getItem: uni.getStorageSync,
				setItem: uni.setStorageSync,
			},
		},
	},
);
```

> **📚 详细指南**: 参阅 [状态管理迁移.md](状态管理迁移.md)

### 3. 组合式函数 (Composables)

**替代 Mixins 的现代方案**:

```typescript
// composables/useRequest.ts
export function useRequest<T>(requestFn: () => Promise<T>) {
	const loading = ref(false);
	const error = ref<string | null>(null);
	const data = ref<T | null>(null);

	const execute = async (...args: any[]) => {
		loading.value = true;
		error.value = null;
		try {
			const result = await requestFn(...args);
			data.value = result;
			return result;
		} catch (err: any) {
			error.value = err.message;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	return {
		loading: readonly(loading),
		error: readonly(error),
		data: readonly(data),
		execute,
	};
}
```

**组件中使用**:

```typescript
<script setup lang="ts">
import { useTask } from '@/composables/useTask'

const { taskList, loading, error, loadTasks } = useTask()

onMounted(() => {
  loadTasks()
})
</script>
```

> **📚 详细规范**: 参阅 [组合式函数规范.md](组合式函数规范.md)

### 4. 生命周期迁移

| Vue2 Options API | Vue3 Composition API | 说明            |
| :--------------- | :------------------- | :-------------- |
| `beforeCreate`   | `setup()`            | 组件创建前      |
| `created`        | `setup()`            | 组件创建后      |
| `mounted`        | `onMounted`          | 挂载后          |
| `beforeDestroy`  | `onBeforeUnmount`    | 销毁前          |
| `destroyed`      | `onUnmounted`        | 销毁后          |
| `activated`      | `onActivated`        | keep-alive 激活 |
| `deactivated`    | `onDeactivated`      | keep-alive 停用 |

**uni-app 页面生命周期**:

```typescript
import { onPullDownRefresh, onReachBottom, onShow } from "@dcloudio/uni-app";

// 下拉刷新
onPullDownRefresh(async () => {
	try {
		await refreshData();
	} finally {
		uni.stopPullDownRefresh();
	}
});

// 上拉加载
onReachBottom(() => {
	loadMoreData();
});

// 页面显示
onShow(() => {
	refreshData();
});
```

> **📚 完整对照**: 参阅 [生命周期迁移.md](生命周期迁移.md)

### 5. TypeScript 类型定义规范

**接口类型定义**:

```typescript
// types/task.ts
export interface Task {
	id: string;
	title: string;
	status: "pending" | "processing" | "completed";
	priority: "low" | "medium" | "high";
	createTime: string;
	updateTime: string;
}

export interface TaskListParams {
	page: number;
	pageSize: number;
	status?: string;
	keyword?: string;
}
```

**组件 Props 和 Emits 类型**:

```typescript
<script setup lang="ts">
interface Props {
  task: Task
  editable?: boolean
}

interface Emits {
  update: [task: Task]
  delete: [taskId: string]
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
})

const emit = defineEmits<Emits>()
</script>
```

> **📚 类型规范**: 参阅 [TypeScript 类型规范.md](TypeScript类型规范.md)

### 6. 工具函数迁移

**重要**: 项目提供统一的工具函数，避免重复实现。

**图片路径处理**:

```typescript
import { getImageUrl } from "@/utils";

// ✅ 使用统一工具函数
const imageSrc = getImageUrl(activity.headerImg, communityId.value);

// ❌ 不要内联实现
const imageSrc = activity.headerImg.startsWith("http") ? activity.headerImg : `/api/file?fileId=${activity.headerImg}`;
```

**工具函数 TypeScript 化**:

```typescript
// utils/format.ts
import dayjs from "dayjs";

/** 格式化日期 */
export function formatDate(date: string | number | Date, format: string = "YYYY-MM-DD"): string {
	return dayjs(date).format(format);
}

/** 格式化货币 */
export function formatCurrency(amount: number): string {
	return `¥${amount.toFixed(2)}`;
}

/** 防抖函数 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout | null = null;

	return function executedFunction(...args: Parameters<T>) {
		const later = () => {
			timeout = null;
			func(...args);
		};

		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}
```

> **📚 完整指南**: 参阅 [工具函数迁移.md](工具函数迁移.md)

### 7. 数据字典常量使用规范

**核心原则**:

1. 所有枚举/下拉字典存放于 `src/constants/{模块}.ts`
2. 类型统一使用 `ColumnItem[]`（来自 `wot-design-uni/components/wd-picker-view/types`）
3. `value` 必须是字符串，`label` 为展示文案
4. mock 文件引用常量使用相对路径（避免别名解析失败）

**定义示例**:

```typescript
// src/constants/repair.ts
import type { ColumnItem } from "wot-design-uni/components/wd-picker-view/types";

export const REPAIR_STATUSES: ColumnItem[] = [
	{ value: "10001", label: "待派单" },
	{ value: "10002", label: "已派单" },
	{ value: "10003", label: "已完成" },
];
```

**Mock 文件中使用**:

```typescript
// src/api/mock/repair.mock.ts
import { REPAIR_STATUSES } from "../../constants/repair";

const statusItem = REPAIR_STATUSES[Math.floor(Math.random() * REPAIR_STATUSES.length)];
const statusCd = statusItem.value; // 字段值
const statusName = statusItem.label; // 展示名称
```

> **📚 详细规范**: 参阅 [数据字典常量规范.md](数据字典常量规范.md)

## 迁移检查清单

### 代码结构检查

- [ ] 使用 `<script setup lang="ts">`
- [ ] 正确定义 Props 和 Emits 类型
- [ ] 使用 Composition API
- [ ] 移除所有 `this` 引用

### 响应式数据检查

- [ ] `data` 转换为 `ref` 或 `reactive`
- [ ] `computed` 使用 Composition API 语法
- [ ] 正确解构响应式对象（使用 `storeToRefs`）

### 生命周期检查

- [ ] `mounted` → `onMounted`
- [ ] `beforeDestroy` → `onBeforeUnmount`
- [ ] uni-app 页面生命周期正确导入

### TypeScript 类型检查

- [ ] 所有 interface 和 type 正确定义
- [ ] Props 和 Emits 有完整类型注解
- [ ] 避免使用 `any` 类型（除非必要）
- [ ] 正确处理可选属性

### 功能一致性检查

- [ ] 所有原有功能正常工作
- [ ] 用户交互响应正确
- [ ] 数据流转正常
- [ ] 页面加载速度不降低

## 总结

uni-app 代码写法迁移通过系统性的迁移策略实现:

1. **代码现代化**: 从传统 Options API 升级到现代 Composition API
2. **类型安全**: TypeScript 完整类型系统保障代码质量
3. **开发效率**: 利用现代工具链和最佳实践提升开发体验
4. **代码复用**: 组合式函数替代 Mixins，更清晰的代码组织

迁移过程中需要特别关注**功能一致性**、**类型安全性**和**性能表现**，确保迁移后的代码质量和用户体验都有显著提升。
