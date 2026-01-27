# 维修工单流程模块迁移计划

**文档版本**: v1.0
**创建日期**: 2025-01-21
**适用项目**: HC 掌上物业 Vue2 → Vue3 uni-app 迁移
**模块范围**: 维修管理模块（10 个页面）

---

## 📋 迁移范围评估

### 页面清单 (共 10 个页面)

基于 `route-migration-map.yml` 的权威映射:

|  #  |                        旧路径                         |                 新路径                 |           业务功能            |  复杂度  |
| :-: | :---------------------------------------------------: | :------------------------------------: | :---------------------------: | :------: |
|  1  |          `pages/repairOrder/repairOrder.vue`          |   `pages-sub/repair/order-list.vue`    |        维修工单池/列表        |  ⭐⭐⭐  |
|  2  |       `pages/repairDispatch/repairDispatch.vue`       |    `pages-sub/repair/dispatch.vue`     |          维修待办单           |  ⭐⭐⭐  |
|  3  | `pages/repairDispatchFinish/repairDispatchFinish.vue` |     `pages-sub/repair/finish.vue`      |           维修已办            |   ⭐⭐   |
|  4  |         `pages/repairDetail/repairDetail.vue`         |  `pages-sub/repair/order-detail.vue`   |           维修详情            |   ⭐⭐   |
|  5  |            `pages/repairAdd/repairAdd.vue`            |    `pages-sub/repair/add-order.vue`    |         添加维修记录          | ⭐⭐⭐⭐ |
|  6  |         `pages/repairHandle/repairHandle.vue`         |     `pages-sub/repair/handle.vue`      | 订单处理(派单/转单/退单/办结) | ⭐⭐⭐⭐ |
|  7  |        `pages/repairHandle/selectResource.vue`        | `pages-sub/repair/select-resource.vue` |      选择物品(维修资源)       |   ⭐⭐   |
|  8  |           `pages/repairOrder/repairEnd.vue`           |    `pages-sub/repair/end-order.vue`    |           结束订单            |   ⭐⭐   |
|  9  |       `pages/appraiseRepair/appraiseRepair.vue`       |    `pages-sub/repair/appraise.vue`     |           回访工单            |  ⭐⭐⭐  |
| 10  |      `pages/repairOrder/replyRepairAppraise.vue`      | `pages-sub/repair/appraise-reply.vue`  |           回复评价            |   ⭐⭐   |

**复杂度说明**:

- ⭐ 简单 - 基础页面，逻辑简单
- ⭐⭐ 中等 - 标准业务页面
- ⭐⭐⭐ 复杂 - 包含复杂交互和状态管理
- ⭐⭐⭐⭐ 非常复杂 - 多功能集成，逻辑复杂

### 业务流程分析

**完整工单流程**:

```plain
[工单池] → [派单] → [待办单] → [处理/选择物品] → [办结] → [回访] → [已办/结束]
                                                              ↓
                                                          [评价回复]
```

**4 大核心功能模块**:

#### 1. 工单列表和查询 (3 个页面)

- `order-list.vue` - 工单池/列表，支持搜索和筛选
- `dispatch.vue` - 待办单，待处理的工单
- `finish.vue` - 已办单，已完成的工单

#### 2. 工单创建和派单 (2 个页面)

- `add-order.vue` - 新增维修记录，支持选择楼栋/单元/房屋
- `handle.vue` - 订单处理，支持派单/转单/退单操作

#### 3. 工单处理和完成 (3 个页面)

- `handle.vue` - 订单处理，支持办结工单
- `select-resource.vue` - 选择维修物品/资源
- `end-order.vue` - 结束订单

#### 4. 评价和回访 (2 个页面)

- `appraise.vue` - 回访工单，收集用户评价
- `appraise-reply.vue` - 回复评价，物业回复用户评价

---

## 🎯 8 阶段迁移实施计划

### 阶段 01: 新建简单占位符页面 已完成

**目标**: 创建 10 个符合约定式路由规范的占位符页面

**预估时间**: 2-3 小时
**技术难度**: ⭐
**风险等级**: 低

#### 详细任务

1. **前置准备**
   - 阅读 `docs\reports\vue2-route-navigation-map.md` 的维修工单流程模块
   - 阅读 `docs\prompts\route-migration-map.yml` 关于维修管理模块的映射

2. **创建页面文件**
   - 使用 `route-migration` 子代理
   - 严格按照映射表创建 10 个页面文件
   - 目标目录: `src/pages-sub/repair/`

3. **页面基础结构** (每个页面必须包含)

   ```vue
   <!--
     业务名称: 维修工单池
     功能说明: 显示维修工单列表，支持搜索和筛选
   
     访问地址: http://localhost:9000/#/pages-sub/repair/order-list
     建议携带参数: ?status=PENDING&page=1
   -->

   <script setup lang="ts">
   definePage({
   	style: {
   		navigationBarTitleText: "维修工单池",
   		enablePullDownRefresh: true,
   	},
   });
   </script>

   <template>
   	<view class="repair-order-list-page">
   		<view class="p-4 text-center">
   			<text class="text-lg text-gray-600">维修工单池页面 - 占位符</text>
   		</view>
   	</view>
   </template>
   ```

4. **完成标记**
   - 在 `docs\prompts\route-migration-map.yml` 标记 `3. 维修管理模块 (10个页面)` ✅

#### 验收标准

- ✅ 10 个页面文件全部创建在 `src/pages-sub/repair/` 目录
- ✅ 每个页面有正确的文件顶部注释（业务名 + 访问地址）
- ✅ `definePage()` 配置了正确的导航栏标题
- ✅ 可以通过 URL 直接访问每个页面（显示占位符内容）
- ✅ 映射表已标记完成状态

#### 页面文件清单

```plain
src/pages-sub/repair/
├── order-list.vue         # 维修工单池
├── dispatch.vue           # 维修待办单
├── finish.vue             # 维修已办
├── order-detail.vue       # 维修详情
├── add-order.vue          # 添加维修记录
├── handle.vue             # 订单处理
├── select-resource.vue    # 选择物品
├── end-order.vue          # 结束订单
├── appraise.vue           # 回访工单
└── appraise-reply.vue     # 回复评价
```

---

### 阶段 02: 新建路由跳转函数并在页面内使用 已完成

**目标**: 创建类型安全的路由跳转函数，并在页面内实现临时跳转测试

**预估时间**: 3-4 小时
**技术难度**: ⭐⭐
**风险等级**: 低

#### 详细任务

1. **分析路由参数**
   - 阅读 `docs\reports\vue2-route-navigation-map.md` 的维修工单流程模块
   - 重点关注路由跳转参数说明
   - 反向阅读旧项目 vue 组件，用 `uni.navigateTo` 函数查询清楚跳转参数

2. **更新路由类型定义** (`src/types/routes.ts`)

   **2.1 添加路由路径到 `PageRoute` 类型**

   ```typescript
   export type PageRoute =
   	| "/pages/index/index"
   	// ... 现有路径

   	// 维修管理模块路由
   	| "/pages-sub/repair/order-list" // 维修工单池
   	| "/pages-sub/repair/dispatch" // 维修待办单
   	| "/pages-sub/repair/finish" // 维修已办
   	| "/pages-sub/repair/order-detail" // 维修详情
   	| "/pages-sub/repair/add-order" // 添加维修记录
   	| "/pages-sub/repair/handle" // 订单处理
   	| "/pages-sub/repair/select-resource" // 选择物品
   	| "/pages-sub/repair/end-order" // 结束订单
   	| "/pages-sub/repair/appraise" // 回访工单
   	| "/pages-sub/repair/appraise-reply"; // 回复评价
   ```

   **2.2 定义页面参数类型到 `PageParams` 接口**

   ```typescript
   export interface PageParams {
   	// ... 现有参数定义

   	/** 维修模块参数 */
   	"/pages-sub/repair/order-list": {
   		status?: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
   		page?: number;
   		row?: number;
   	};
   	"/pages-sub/repair/dispatch": {
   		page?: number;
   		row?: number;
   	};
   	"/pages-sub/repair/finish": {
   		page?: number;
   		row?: number;
   	};
   	"/pages-sub/repair/order-detail": {
   		repairId: string;
   		storeId?: string;
   	};
   	"/pages-sub/repair/add-order": {
   		communityId?: string;
   	};
   	"/pages-sub/repair/handle": {
   		action: "DISPATCH" | "TRANSFER" | "RETURN" | "FINISH";
   		repairId: string;
   		repairType?: string;
   	};
   	"/pages-sub/repair/select-resource": {
   		feeFlag?: string;
   	};
   	"/pages-sub/repair/end-order": {
   		repairId: string;
   		communityId: string;
   	};
   	"/pages-sub/repair/appraise": {
   		repairId: string;
   		repairType?: string;
   	};
   	"/pages-sub/repair/appraise-reply": {
   		ruId: string;
   		repairId: string;
   	};
   }
   ```

3. **创建路由跳转工具方法** (`src/router/helpers.ts`)

   在 `TypedRouter` 类中添加静态方法:

   ```typescript
   export class TypedRouter {
   	// ... 现有方法

   	/** 维修模块导航 */

   	/** 跳转到维修工单列表 */
   	static toRepairOrderList(params?: PageParams["/pages-sub/repair/order-list"]) {
   		return navigateToTyped("/pages-sub/repair/order-list", params);
   	}

   	/** 跳转到维修待办单 */
   	static toRepairDispatch(params?: PageParams["/pages-sub/repair/dispatch"]) {
   		return navigateToTyped("/pages-sub/repair/dispatch", params);
   	}

   	/** 跳转到维修已办 */
   	static toRepairFinish(params?: PageParams["/pages-sub/repair/finish"]) {
   		return navigateToTyped("/pages-sub/repair/finish", params);
   	}

   	/** 跳转到维修详情 */
   	static toRepairDetail(repairId: string, storeId?: string) {
   		return navigateToTyped("/pages-sub/repair/order-detail", { repairId, storeId });
   	}

   	/** 跳转到新增维修记录 */
   	static toAddRepair(communityId?: string) {
   		return navigateToTyped("/pages-sub/repair/add-order", { communityId });
   	}

   	/** 跳转到订单处理 */
   	static toRepairHandle(
   		action: "DISPATCH" | "TRANSFER" | "RETURN" | "FINISH",
   		repairId: string,
   		repairType?: string,
   	) {
   		return navigateToTyped("/pages-sub/repair/handle", { action, repairId, repairType });
   	}

   	/** 跳转到选择物品 */
   	static toSelectResource(feeFlag?: string) {
   		return navigateToTyped("/pages-sub/repair/select-resource", { feeFlag });
   	}

   	/** 跳转到结束订单 */
   	static toEndRepair(repairId: string, communityId: string) {
   		return navigateToTyped("/pages-sub/repair/end-order", { repairId, communityId });
   	}

   	/** 跳转到回访工单 */
   	static toAppraiseRepair(repairId: string, repairType?: string) {
   		return navigateToTyped("/pages-sub/repair/appraise", { repairId, repairType });
   	}

   	/** 跳转到回复评价 */
   	static toReplyAppraise(ruId: string, repairId: string) {
   		return navigateToTyped("/pages-sub/repair/appraise-reply", { ruId, repairId });
   	}
   }
   ```

4. **补充页面访问地址注释**

   在每个页面顶部注释补充完整访问地址（含参数示例）:

   ```vue
   <!--
     维修工单池页面
     功能：显示维修工单列表，支持搜索和筛选
   
     访问地址: http://localhost:9000/#/pages-sub/repair/order-list
     参数示例: ?status=PENDING&page=1&row=10
   
     完整示例: http://localhost:9000/#/pages-sub/repair/order-list?status=PENDING&page=1&row=10
   -->
   ```

5. **添加临时测试按钮**

   在每个页面添加临时按钮，模拟业务流程跳转:

   ```vue
   <template>
   	<view class="repair-order-list-page p-4">
   		<view class="mb-4">
   			<text class="text-lg">维修工单池页面</text>
   		</view>

   		<!-- 临时测试按钮 -->
   		<view class="space-y-2">
   			<button @click="handleGoToDetail" class="w-full">查看工单详情</button>
   			<button @click="handleDispatch" class="w-full">派单</button>
   			<button @click="handleEndOrder" class="w-full">结束订单</button>
   		</view>
   	</view>
   </template>

   <script setup lang="ts">
   import { TypedRouter } from "@/router";

   /** 查看详情 - 假数据测试 */
   function handleGoToDetail() {
   	TypedRouter.toRepairDetail("REP_001", "STORE_001");
   }

   /** 派单 - 假数据测试 */
   function handleDispatch() {
   	TypedRouter.toRepairHandle("DISPATCH", "REP_001", "水电维修");
   }

   /** 结束订单 - 假数据测试 */
   function handleEndOrder() {
   	TypedRouter.toEndRepair("REP_001", "COMM_001");
   }
   </script>
   ```

#### 验收标准

- ✅ `src/types/routes.ts` 包含 10 个路由路径和完整参数类型
- ✅ `src/router/helpers.ts` 的 `TypedRouter` 类包含 10 个静态跳转方法
- ✅ 所有跳转函数有完整的 TypeScript 类型约束
- ✅ 每个页面顶部注释包含完整访问地址和参数示例
- ✅ 每个页面有临时测试按钮，能够跳转到相关页面
- ✅ 能够模拟完整的工单处理流程（从工单池 → 派单 → 处理 → 完成）

---

### 阶段 03: 新建接口 已完成

**目标**: 创建完整的维修工单 API 接口定义和 Mock 实现

**预估时间**: 4-6 小时
**技术难度**: ⭐⭐⭐
**风险等级**: 中

#### 详细任务

1. **接口需求分析**
   - 阅读 `docs\reports\vue2-route-navigation-map.md` 明确 10 个页面的接口需求
   - 反向阅读旧项目 vue 组件文件
   - 阅读 `gitee-example/api/repair/*.js` 文件
   - 阅读 `gitee-example/constant/url.js` 中的接口地址定义
   - 理清每个页面需要调用的接口

2. **创建接口定义文件** (`src/api/repair.ts`)

   ```typescript
   import { http } from "@/http/alova";
   import type {
   	RepairOrder,
   	RepairListParams,
   	RepairListResponse,
   	CreateRepairReq,
   	UpdateRepairReq,
   	RepairStatistics,
   } from "@/types/repair";

   /** 1. 查询维修工单列表 */
   export const getRepairOrderList = (params: RepairListParams) =>
   	http.Get<RepairListResponse>("/app/ownerRepair.listOwnerRepairs", { params });

   /** 2. 查询维修待办单列表 */
   export const getRepairDispatchList = (params: RepairListParams) =>
   	http.Get<RepairListResponse>("/app/ownerRepair.listRepairDispatch", { params });

   /** 3. 查询维修已办单列表 */
   export const getRepairFinishList = (params: RepairListParams) =>
   	http.Get<RepairListResponse>("/app/ownerRepair.listRepairFinish", { params });

   /** 4. 获取维修工单详情 */
   export const getRepairDetail = (repairId: string) =>
   	http.Get<RepairOrder>("/app/ownerRepair.getOwnerRepair", {
   		params: { repairId },
   	});

   /** 5. 创建维修工单 */
   export const createRepairOrder = (data: CreateRepairReq) =>
   	http.Post<RepairOrder>("/app/ownerRepair.saveOwnerRepair", data);

   /** 6. 更新维修工单 */
   export const updateRepairOrder = (data: UpdateRepairReq) =>
   	http.Post<RepairOrder>("/app/ownerRepair.updateOwnerRepair", data);

   /** 7. 派单 */
   export const dispatchRepair = (data: { repairId: string; staffId: string; remark?: string }) =>
   	http.Post<{ success: boolean }>("/app/ownerRepair.dispatchRepair", data);

   /** 8. 转单 */
   export const transferRepair = (data: { repairId: string; staffId: string; remark?: string }) =>
   	http.Post<{ success: boolean }>("/app/ownerRepair.transferRepair", data);

   /** 9. 退单 */
   export const returnRepair = (data: { repairId: string; remark: string }) =>
   	http.Post<{ success: boolean }>("/app/ownerRepair.returnRepair", data);

   /** 10. 办结工单 */
   export const finishRepair = (data: { repairId: string; remark?: string; images?: string[] }) =>
   	http.Post<{ success: boolean }>("/app/ownerRepair.finishRepair", data);

   /** 11. 结束订单 */
   export const endRepair = (data: { repairId: string; communityId: string }) =>
   	http.Post<{ success: boolean }>("/app/ownerRepair.endRepair", data);

   /** 12. 回访工单 */
   export const appraiseRepair = (data: { repairId: string; rating: number; comment: string }) =>
   	http.Post<{ success: boolean }>("/app/ownerRepair.appraiseRepair", data);

   /** 13. 回复评价 */
   export const replyAppraise = (data: { ruId: string; repairId: string; reply: string }) =>
   	http.Post<{ success: boolean }>("/app/ownerRepair.replyAppraise", data);

   /** 14. 查询维修物品/资源 */
   export const queryResources = (params: { keyword?: string; page?: number; row?: number }) =>
   	http.Get<{ resources: any[]; total: number }>("/app/ownerRepair.queryResources", { params });

   /** 15. 获取维修统计数据 */
   export const getRepairStatistics = (communityId: string) =>
   	http.Get<RepairStatistics>("/app/ownerRepair.getStatistics", {
   		params: { communityId },
   	});
   ```

3. **创建 Mock 接口实现** (`src/api/mock/repair.mock.ts`)

   **核心要求**:
   - ✅ 必须包含：**内联数据 + 数据库对象 + 接口定义**
   - ✅ 使用 `src/types/repair.ts` 的业务类型
   - ✅ 使用 `successResponse/errorResponse` 包装返回值
   - ✅ 使用 `mockLog` 输出日志
   - ✅ URL 前缀规范：直接使用 `/app/...`，不包含 `/api`

   ```typescript
   import { defineUniAppMock, successResponse, errorResponse, mockLog, ResultEnumMap } from "./shared/utils";
   import type { RepairOrder, RepairListParams, RepairStatus } from "@/types/repair";
   import type { PaginationResponse } from "@/types/api";

   /** Mock 数据库对象 - 内联数据存储 */
   const mockRepairDatabase = {
   	/** 维修工单数据 */
   	repairs: [
   		{
   			repairId: "REP_001",
   			title: "水电维修",
   			description: "业主报修：水电出现问题，需要及时处理。",
   			ownerName: "张三",
   			ownerPhone: "13812345678",
   			address: "1栋101A室",
   			repairType: "水电维修",
   			status: "PENDING" as RepairStatus,
   			priority: "HIGH" as const,
   			createTime: "2024-01-15T10:30:00Z",
   			updateTime: "2024-01-20T14:20:00Z",
   			assignedWorker: null,
   			estimatedCost: 200,
   			actualCost: null,
   			images: ["https://picsum.photos/400/300?random=1"],
   			communityId: "COMM_001",
   		},
   		// ... 更多模拟数据
   	] as RepairOrder[],

   	/** 获取工单详情 */
   	getRepairById(repairId: string): RepairOrder | undefined {
   		return this.repairs.find((repair) => repair.repairId === repairId);
   	},

   	/** 获取工单列表 */
   	getRepairList(params: RepairListParams): PaginationResponse<RepairOrder> {
   		let filteredRepairs = [...this.repairs];

   		if (params.status) {
   			filteredRepairs = filteredRepairs.filter((r) => r.status === params.status);
   		}

   		const total = filteredRepairs.length;
   		const start = (params.page - 1) * params.row;
   		const end = start + params.row;
   		const list = filteredRepairs.slice(start, end);

   		return { list, total, page: params.page, pageSize: params.row, hasMore: end < total };
   	},

   	// ... 更多数据库操作方法
   };

   /** Mock 接口定义 */
   export default defineUniAppMock([
   	// 1. 获取维修工单列表
   	{
   		url: "/app/ownerRepair.listOwnerRepairs",
   		method: ["GET", "POST"],
   		delay: [300, 800],
   		body: async ({ query, body }) => {
   			const params = { ...query, ...body } as RepairListParams;
   			mockLog("listOwnerRepairs", params);

   			const result = mockRepairDatabase.getRepairList({
   				page: Number(params.page) || 1,
   				row: Number(params.row) || 10,
   				status: params.status,
   			});

   			mockLog("listOwnerRepairs result", `${result.list.length} items`);

   			return successResponse(
   				{
   					ownerRepairs: result.list,
   					total: result.total,
   					page: result.page,
   					row: result.pageSize,
   				},
   				"查询成功",
   			);
   		},
   	},

   	// 2. 获取维修工单详情
   	{
   		url: "/app/ownerRepair.getOwnerRepair",
   		method: ["GET", "POST"],
   		delay: 200,
   		body: async ({ query, body }) => {
   			const params = { ...query, ...body };
   			mockLog("getOwnerRepair", params);

   			const repair = mockRepairDatabase.getRepairById(params.repairId);

   			if (!repair) {
   				return errorResponse("维修工单不存在", ResultEnumMap.NotFound);
   			}

   			mockLog("getOwnerRepair result", repair.title);
   			return successResponse(repair, "查询成功");
   		},
   	},

   	// ... 更多接口定义
   ]);
   ```

4. **在页面中使用接口**

   在每个页面使用 `useRequest` Hook 调用接口:

   ```vue
   <script setup lang="ts">
   import { useRequest } from "alova/client";
   import { getRepairOrderList } from "@/api/repair";
   import { ref } from "vue";

   /** 列表数据 */
   const repairList = ref<RepairOrder[]>([]);

   /** 请求管理 */
   const { loading, send: loadList, onSuccess, onError } = useRequest(() => getRepairOrderList({ page: 1, row: 10 }));

   /** 成功回调 */
   onSuccess((result) => {
   	repairList.value = result.ownerRepairs || [];
   	console.log("加载成功:", result);
   });

   /** 失败回调 */
   onError((error) => {
   	console.error("加载失败:", error);
   	uni.showToast({ title: "加载失败", icon: "none" });
   });

   /** 加载数据 */
   function handleLoad() {
   	loadList();
   }
   </script>

   <template>
   	<view class="p-4">
   		<button @click="handleLoad">加载数据</button>
   		<view v-if="loading">加载中...</view>
   		<view v-else>
   			<view v-for="item in repairList" :key="item.repairId" class="mb-2">
   				<text>{{ item.repairId }} - {{ item.title }}</text>
   			</view>
   		</view>
   	</view>
   </template>
   ```

#### 验收标准

- ✅ `src/api/repair.ts` 定义了所有接口函数（至少 15 个）
- ✅ `src/api/mock/repair.mock.ts` 实现了所有 Mock 接口
- ✅ Mock 文件包含：内联数据 + 数据库对象 + 接口定义
- ✅ Mock 数据 100%符合 `src/types/repair.ts` 类型定义
- ✅ 所有 Mock 接口使用 `successResponse/errorResponse` 包装返回值
- ✅ 所有 Mock 接口使用 `mockLog` 输出日志
- ✅ 所有页面都能正常调用接口并展示数据（简陋方式）
- ✅ 控制台有统一格式的 Mock 日志输出

---

### 阶段 04: 迁移组件 已完成

**目标**: 将旧项目的 UI 组件迁移到新项目，使用 wot-design-uni 替代 ColorUI

**预估时间**: 6-8 小时
**技术难度**: ⭐⭐⭐
**风险等级**: 中

#### 详细任务

1. **分析旧组件结构**
   - 阅读 `docs\reports\vue2-route-navigation-map.md` 明确 10 个页面的旧文件地址
   - 反向阅读旧项目 10 个 vue 组件的 UI 结构
   - 列出所有使用的 ColorUI 组件和自定义组件
   - 分析组件的功能和交互方式

2. **使用 `component-migration` 子代理进行组件迁移**

   **ColorUI → wot-design-uni 组件映射**:

   | ColorUI 组件    | wot-design-uni 组件         | 说明          |
   | --------------- | --------------------------- | ------------- |
   | `cu-bar`        | `wd-navbar` 或 `view`       | 导航栏/工具栏 |
   | `cu-btn`        | `wd-button`                 | 按钮          |
   | `cu-list`       | `wd-cell-group` + `wd-cell` | 列表          |
   | `cu-card`       | `view` + 自定义样式         | 卡片          |
   | `cu-form`       | `wd-form` + `wd-input`      | 表单          |
   | `picker`        | `wd-picker`                 | 选择器        |
   | `uni-load-more` | `z-paging` 或 `wd-loading`  | 加载更多      |

3. **迁移示例**

   **旧项目代码**:

   ```vue
   <template>
   	<view>
   		<view class="cu-bar bg-white search">
   			<view class="search-form round">
   				<text class="cuIcon-search"></text>
   				<input type="text" placeholder="输入报修人" v-model="repairName" />
   			</view>
   			<view class="action">
   				<button class="cu-btn bg-gradual-green" @tap="searchRepair">搜索</button>
   			</view>
   		</view>

   		<view v-for="(item, index) in repairOrders" :key="index" class="bg-white margin-bottom-sm padding">
   			<view class="flex padding-bottom-xs solid-bottom">
   				<view>{{ item.repairId }}</view>
   				<view class="text-gray">{{ item.stateName }}</view>
   			</view>
   			<view class="flex margin-top">
   				<view class="text-gray">报修类型</view>
   				<view class="text-gray">{{ item.repairTypeName }}</view>
   			</view>
   			<button class="cu-btn sm line-gray" @click="toDetail(item)">详情</button>
   		</view>
   	</view>
   </template>
   ```

   **新项目代码**:

   ```vue
   <template>
   	<view class="repair-order-list-page">
   		<!-- 搜索栏 -->
   		<view class="flex items-center px-4 py-2 bg-white">
   			<wd-search v-model="repairName" placeholder="输入报修人" @search="handleSearch" />
   		</view>

   		<!-- 列表 -->
   		<z-paging ref="pagingRef" v-model="repairOrders" @query="handleQuery">
   			<template #default="{ item }">
   				<wd-cell-group class="mb-2">
   					<wd-cell :title="item.repairId" :value="item.stateName" />
   					<wd-cell title="报修类型" :value="item.repairTypeName" />
   					<wd-cell>
   						<template #right-icon>
   							<wd-button size="small" @click="handleToDetail(item)"> 详情 </wd-button>
   						</template>
   					</wd-cell>
   				</wd-cell-group>
   			</template>
   		</z-paging>
   	</view>
   </template>
   ```

4. **自定义组件迁移**
   - 如果有自定义组件，迁移到 `src/components/repair/`
   - 确保组件符合 Vue3 Composition API 规范

#### 验收标准

- ✅ 所有页面使用 wot-design-uni 组件替代 ColorUI
- ✅ 表单、列表、按钮等交互组件功能正常
- ✅ 数据展示和用户交互逻辑正确
- ✅ 自定义组件（如果有）已迁移到 `src/components/repair/`
- ✅ 组件结构清晰，代码可读性好
- ✅ **本阶段不处理样式细节**，仅确保组件功能正常

### 阶段 05: 迁移样式 已完成

**目标**: 将旧项目的样式迁移到 UnoCSS 原子化 CSS

**预估时间**: 5-7 小时
**技术难度**: ⭐⭐⭐
**风险等级**: 中

#### 详细任务

1. **分析旧样式代码**
   - 反向阅读旧项目 10 个 vue 组件的样式代码
   - 列出所有 ColorUI 样式类和自定义样式
   - 分析布局方式、间距、颜色等

2. **使用 `style-migration` 子代理进行样式迁移**

   **ColorUI → UnoCSS 样式映射**:

   | ColorUI 样式类     | UnoCSS 原子类              | 说明     |
   | ------------------ | -------------------------- | -------- |
   | `cu-bar`           | `flex items-center`        | 横向布局 |
   | `bg-white`         | `bg-white`                 | 白色背景 |
   | `margin-top`       | `mt-4`                     | 上边距   |
   | `margin-bottom-sm` | `mb-2`                     | 小下边距 |
   | `padding`          | `p-4`                      | 内边距   |
   | `text-gray`        | `text-gray-600`            | 灰色文字 |
   | `flex`             | `flex`                     | 弹性布局 |
   | `justify-between`  | `justify-between`          | 两端对齐 |
   | `solid-bottom`     | `border-b border-gray-200` | 底部边框 |
   | `round`            | `rounded-full`             | 圆角     |

3. **迁移示例**

   **旧项目样式**:

   ```vue
   <template>
   	<view class="cu-bar bg-white search">
   		<view class="search-form round">
   			<input type="text" />
   		</view>
   	</view>

   	<view class="bg-white margin-bottom-sm margin-right-sm radius margin-left-sm padding">
   		<view class="flex padding-bottom-xs solid-bottom justify-between">
   			<view>{{ item.repairId }}</view>
   			<view class="text-gray">{{ item.stateName }}</view>
   		</view>
   	</view>
   </template>

   <style>
   .cu-bar.search {
   	padding: 20rpx 30rpx;
   }
   .search-form {
   	background: #f1f1f1;
   	padding: 10rpx 20rpx;
   }
   </style>
   ```

   **新项目样式**:

   ```vue
   <template>
   	<view class="flex items-center px-4 py-2 bg-white">
   		<view class="bg-gray-100 px-3 py-2 rounded-full flex-1">
   			<input type="text" class="bg-transparent outline-none" />
   		</view>
   	</view>

   	<view class="bg-white mb-2 mx-2 rounded-lg p-4">
   		<view class="flex items-center justify-between pb-2 border-b border-gray-200">
   			<view>{{ item.repairId }}</view>
   			<view class="text-gray-600">{{ item.stateName }}</view>
   		</view>
   	</view>
   </template>

   <style scoped>
   /* 仅保留必要的自定义样式 */
   </style>
   ```

4. **UnoCSS shortcuts 使用规范**
   - **禁止滥用**: 不要将业务性质的、非公共性质的样式写入 `uno.config.ts`
   - **仅定义通用样式**: 如通用按钮、通用卡片等
   - **优先使用原子类**: 直接在模板中使用 UnoCSS 原子类

#### 验收标准

- ✅ 所有页面使用 UnoCSS 原子类实现样式
- ✅ 视觉效果与旧项目基本一致（允许细微差异）
- ✅ 响应式布局和适配正常
- ✅ `uno.config.ts` 的 shortcuts 没有被滥用
- ✅ `<style scoped>` 仅包含必要的自定义样式
- ✅ 颜色、间距、圆角等符合设计规范

---

### 阶段 06: 代码写法迁移 已完成

**目标**: 将 Vue2 Options API 代码迁移到 Vue3 Composition API + TypeScript

**预估时间**: 6-8 小时
**技术难度**: ⭐⭐⭐⭐
**风险等级**: 高

#### 详细任务

1. **分析旧代码逻辑**
   - 反向阅读旧项目 10 个 vue 组件的业务逻辑
   - 列出所有 data、methods、computed、watch、生命周期
   - 分析状态管理和事件处理逻辑

2. **使用 `code-migration` 子代理进行代码迁移**

   **Vue2 Options API → Vue3 Composition API 映射**:

   | Vue2 Options API  | Vue3 Composition API        | 说明           |
   | ----------------- | --------------------------- | -------------- |
   | `data()`          | `ref()` / `reactive()`      | 响应式数据     |
   | `methods`         | 普通函数                    | 方法定义       |
   | `computed`        | `computed()`                | 计算属性       |
   | `watch`           | `watch()` / `watchEffect()` | 侦听器         |
   | `mounted()`       | `onMounted()`               | 挂载生命周期   |
   | `beforeDestroy()` | `onBeforeUnmount()`         | 卸载前生命周期 |
   | `this.xxx`        | 直接访问变量                | 无需 this      |

3. **迁移示例**

   **旧项目代码**:

   ```vue
   <script>
   export default {
   	data() {
   		return {
   			repairOrders: [],
   			repairName: "",
   			page: 1,
   			totalRecords: 0,
   			loading: false,
   		};
   	},

   	computed: {
   		hasMore() {
   			return this.repairOrders.length < this.totalRecords;
   		},
   	},

   	mounted() {
   		this.loadRepairList();
   	},

   	methods: {
   		async loadRepairList() {
   			this.loading = true;
   			try {
   				const res = await this.$api.getRepairList({
   					page: this.page,
   					row: 10,
   					repairName: this.repairName,
   				});
   				this.repairOrders = res.data.ownerRepairs;
   				this.totalRecords = res.data.total;
   			} catch (error) {
   				uni.showToast({ title: "加载失败", icon: "none" });
   			} finally {
   				this.loading = false;
   			}
   		},

   		handleSearch() {
   			this.page = 1;
   			this.loadRepairList();
   		},

   		toDetail(item) {
   			uni.navigateTo({
   				url: `/pages/repairDetail/repairDetail?repairId=${item.repairId}`,
   			});
   		},
   	},
   };
   </script>
   ```

   **新项目代码**:

   ```vue
   <script setup lang="ts">
   import { ref, computed, onMounted } from "vue";
   import { useRequest } from "alova/client";
   import { getRepairOrderList } from "@/api/repair";
   import { TypedRouter } from "@/router";
   import type { RepairOrder } from "@/types/repair";

   /** 列表数据 */
   const repairOrders = ref<RepairOrder[]>([]);
   const repairName = ref("");
   const page = ref(1);
   const totalRecords = ref(0);

   /** 计算属性 - 是否有更多数据 */
   const hasMore = computed(() => repairOrders.value.length < totalRecords.value);

   /** 请求管理 - 加载列表 */
   const {
   	loading,
   	send: loadList,
   	onSuccess: onLoadSuccess,
   	onError: onLoadError,
   } = useRequest(() =>
   	getRepairOrderList({
   		page: page.value,
   		row: 10,
   		keyword: repairName.value,
   	}),
   );

   /** 加载成功回调 */
   onLoadSuccess((result) => {
   	repairOrders.value = result.ownerRepairs || [];
   	totalRecords.value = result.total || 0;
   });

   /** 加载失败回调 */
   onLoadError((error) => {
   	console.error("加载失败:", error);
   	uni.showToast({ title: "加载失败", icon: "none" });
   });

   /** 搜索处理 */
   function handleSearch() {
   	page.value = 1;
   	loadList();
   }

   /** 跳转到详情 */
   function handleToDetail(item: RepairOrder) {
   	TypedRouter.toRepairDetail(item.repairId);
   }

   /** 页面加载时获取数据 */
   onMounted(() => {
   	loadList();
   });
   </script>
   ```

4. **关键迁移点**
   - **类型注解**: 所有变量、函数参数、返回值都添加类型
   - **useRequest**: 使用 `useRequest` Hook 管理请求状态
   - **TypedRouter**: 使用 `TypedRouter` 进行类型安全的路由跳转
   - **响应式数据**: 使用 `ref()` 定义基础类型，`reactive()` 定义对象
   - **生命周期**: 使用 `onMounted()` 等组合式 API

#### 验收标准

- ✅ 所有页面使用 `<script setup lang="ts">` 格式
- ✅ 所有变量、函数有完整的 TypeScript 类型注解
- ✅ 使用 `useRequest` Hook 管理请求状态（不手动管理 loading）
- ✅ 使用 `TypedRouter.toXxx()` 进行类型安全的路由跳转
- ✅ 业务逻辑完整且功能正常
- ✅ 无 TypeScript 编译错误
- ✅ 代码可读性好，符合 Vue3 最佳实践

---

### 阶段 07: 整体性检查 已完成

**目标**: 全面检查 10 个页面，查漏补缺

**预估时间**: 3-4 小时
**技术难度**: ⭐⭐
**风险等级**: 低

#### 详细任务

1. **业务流程对比**
   - 阅读 `docs\reports\vue2-route-navigation-map.md` 对比业务流程
   - 反向阅读旧项目 vue 组件对比功能点
   - 列出所有功能点清单

2. **使用所有迁移子代理做全面检查**

   **检查项目清单**:

   **a) route-migration 子代理检查**:
   - ✅ 路由配置是否正确
   - ✅ 路由跳转是否使用类型安全函数
   - ✅ 路由参数传递是否正确
   - ✅ `definePage()` 配置是否完整

   **b) api-migration 子代理检查**:
   - ✅ 接口定义是否完整
   - ✅ Mock 数据是否符合类型定义
   - ✅ 接口调用是否使用 `useRequest`
   - ✅ 错误处理是否完善

   **c) component-migration 子代理检查**:
   - ✅ 组件是否正确使用 wot-design-uni
   - ✅ 表单、列表等组件功能是否正常
   - ✅ 交互逻辑是否正确

   **d) style-migration 子代理检查**:
   - ✅ 样式是否使用 UnoCSS 原子类
   - ✅ 视觉效果是否符合预期
   - ✅ 响应式布局是否正常

   **e) code-migration 子代理检查**:
   - ✅ 代码是否使用 Composition API
   - ✅ TypeScript 类型是否完整
   - ✅ 业务逻辑是否正确

3. **功能测试**

   **测试完整业务流程**:

   ```plain
   1. 工单创建流程:
      新增维修记录 → 选择楼栋 → 选择单元 → 选择房屋 → 填写信息 → 提交成功

   2. 工单派单流程:
      工单池 → 查看详情 → 派单 → 选择维修人员 → 派单成功

   3. 工单处理流程:
      待办单 → 查看详情 → 开始处理 → 选择物品 → 办结工单

   4. 工单完成流程:
      已办单 → 查看详情 → 回访 → 评价 → 回复评价

   5. 工单结束流程:
      工单池 → 结束订单 → 确认结束
   ```

4. **输出检查报告**

   创建 `docs/reports/repair-module-check-report.md` 文档:

   ```markdown
   # 维修工单流程模块检查报告

   ## 检查时间

   2025-01-XX

   ## 检查范围

   10 个维修管理模块页面

   ## 问题清单

   ### 高优先级问题 (必须修复)

   1. [页面名称] - 问题描述 - 影响范围
   2. ...

   ### 中优先级问题 (建议修复)

   1. [页面名称] - 问题描述 - 影响范围
   2. ...

   ### 低优先级问题 (可选修复)

   1. [页面名称] - 问题描述 - 影响范围
   2. ...

   ## 功能测试结果

   | 测试项       | 结果 | 说明          |
   | ------------ | ---- | ------------- |
   | 工单创建流程 | ✅   | 功能正常      |
   | 工单派单流程 | ⚠️   | 存在 XXX 问题 |
   | ...          | ...  | ...           |

   ## 代码质量评估

   | 评估项   | 评分   | 说明             |
   | -------- | ------ | ---------------- |
   | 类型安全 | 90/100 | 部分类型需要完善 |
   | 代码规范 | 95/100 | 符合规范         |
   | ...      | ...    | ...              |

   ## 总结

   整体迁移质量：良好 / 需要改进
   主要问题：...
   建议：...
   ```

#### 验收标准

- ✅ 完成全面功能测试
- ✅ 完成代码质量检查
- ✅ 输出详细的检查报告（`docs/reports/repair-module-check-report.md`）
- ✅ 列出所有待修复问题清单（按优先级分类）
- ✅ 提供功能测试结果表格
- ✅ 提供代码质量评估表格

---

### 阶段 08: 整体性修复 已完成

**目标**: 根据检查报告修复所有问题

**预估时间**: 4-6 小时
**技术难度**: ⭐⭐⭐
**风险等级**: 中

#### 详细任务

1. **按优先级修复问题**

   **修复顺序**:

   ```plain
   1. 高优先级问题（阻塞性问题）- 必须修复
   2. 中优先级问题（功能性问题）- 建议修复
   3. 低优先级问题（优化性问题）- 可选修复
   ```

2. **问题修复流程**

   对于每个问题:

   ```plain
   a) 定位问题代码
   b) 分析问题原因
   c) 制定修复方案
   d) 实施修复
   e) 测试验证
   f) 标记完成
   ```

3. **重新测试修复后的功能**
   - 重新执行阶段 07 的功能测试
   - 确保所有问题已修复
   - 验证修复没有引入新问题

4. **优化用户体验和性能**

   **用户体验优化**:
   - 优化加载状态提示
   - 优化错误提示信息
   - 优化交互动画
   - 优化表单验证提示

   **性能优化**:
   - 优化列表渲染性能
   - 优化图片加载
   - 优化接口请求（防抖、节流）
   - 优化页面切换动画

5. **更新文档**
   - 更新检查报告，标记问题已修复
   - 更新功能说明文档
   - 更新已知问题清单

#### 验收标准

- ✅ 所有高优先级问题已修复
- ✅ 大部分中优先级问题已修复
- ✅ 功能测试 100%通过
- ✅ 代码质量符合规范（TypeScript 无错误，ESLint 通过）
- ✅ 用户体验良好（交互流畅，提示清晰）
- ✅ 性能良好（列表滚动流畅，页面切换无卡顿）
- ✅ 文档已更新

---

## 📊 工作量评估总表

|   阶段   |            任务             |    预估时间    | 技术难度 | 风险等级 |
| :------: | :-------------------------: | :------------: | :------: | :------: |
|    01    |     新建简单占位符页面      |    2-3 小时    |    ⭐    |    低    |
|    02    |      新建路由跳转函数       |    3-4 小时    |   ⭐⭐   |    低    |
|    03    |          新建接口           |    4-6 小时    |  ⭐⭐⭐  |    中    |
|    04    |          迁移组件           |    6-8 小时    |  ⭐⭐⭐  |    中    |
|    05    |          迁移样式           |    5-7 小时    |  ⭐⭐⭐  |    中    |
|    06    |        代码写法迁移         |    6-8 小时    | ⭐⭐⭐⭐ |    高    |
|    07    |         整体性检查          |    3-4 小时    |   ⭐⭐   |    低    |
|    08    |         整体性修复          |    4-6 小时    |  ⭐⭐⭐  |    中    |
| **总计** | **8 个阶段，10 个页面迁移** | **33-46 小时** |    -     |    -     |

**建议实施周期**: 5-7 个工作日（每天 6-8 小时工作量）

---

## ⚠️ 风险分析与注意事项

### 高风险点

#### 1. 代码写法迁移复杂度高 (阶段 06)

**风险描述**:

- Vue2 Options API → Vue3 Composition API 范式转变较大
- TypeScript 类型系统学习曲线陡峭
- 状态管理方式变化大

**应对策略**:

- 优先迁移简单页面（如详情页、已办单），积累经验
- 参考已迁移的活动模块（`src/pages/activity/`）作为模板
- 充分利用 `code-migration` 子代理的专业指导
- 分批次迁移，逐步验证

#### 2. 业务逻辑遗漏风险 (阶段 07-08)

**风险描述**:

- 旧项目业务逻辑可能分散在多个文件
- 隐藏的业务规则可能被遗漏
- 状态管理和数据流转可能复杂

**应对策略**:

- 仔细阅读旧代码，做好功能清单对比
- 使用所有 5 个迁移子代理进行全面检查
- 执行完整的业务流程测试
- 与熟悉旧项目的人员沟通确认

#### 3. 接口 Mock 数据准确性 (阶段 03)

**风险描述**:

- Mock 数据需要覆盖各种业务场景
- 数据结构可能与实际后端不一致
- 边界情况和错误场景可能考虑不全

**应对策略**:

- 参考旧项目的真实数据结构
- 准备多种典型数据状态（待处理、处理中、已完成等）
- 模拟错误场景（404、500 等）
- 预留接口扩展空间

### 技术依赖清单

**已有资源** ✅:

- `src/types/repair.ts` - 维修模块类型定义（已存在）
- `src/types/api.ts` - 基础 API 类型定义
- `src/http/alova.ts` - Alova 请求实例配置
- `src/router/helpers.ts` - 路由工具类（需要扩展）

**需要创建** ⚠️:

- `src/types/routes.ts` - 需要补充 10 个维修路由类型
- `src/router/helpers.ts` - 需要补充 10 个静态跳转方法
- `src/api/repair.ts` - 需要创建接口定义文件（15 个接口）
- `src/api/mock/repair.mock.ts` - 需要创建 Mock 实现文件
- `src/pages-sub/repair/*.vue` - 需要创建 10 个页面文件
- `src/components/repair/*.vue` - 可能需要自定义组件

### 开发环境注意事项

1. **Mock 接口重启要求**
   - 修改 `*.mock.ts` 文件后必须重启开发服务器（`pnpm dev`）
   - 建议使用子代理的自动重启功能

2. **TypeScript 类型检查**
   - 不要运行 `pnpm type-check` 命令
   - 依赖 IDE 的实时类型检查即可

3. **代码格式化**
   - 遵循项目的 Prettier 配置
   - 不要自作主张修改 `prettier.config.js`

### 最佳实践建议

#### 1. 严格按映射表执行

- 以 `docs\prompts\route-migration-map.yml` 为唯一权威路径来源
- 不自行决定文件路径
- 完成后及时在映射表标记进度

#### 2. 类型安全优先

- 确保 100%类型覆盖，禁用 `any` 类型
- 所有函数参数和返回值都要有类型注解
- Mock 数据必须符合业务类型定义

#### 3. 迁移子代理协作

- 充分利用 5 个专业子代理的能力:
  - `route-migration` - 路由迁移
  - `api-migration` - 接口迁移
  - `component-migration` - 组件迁移
  - `style-migration` - 样式迁移
  - `code-migration` - 代码迁移
- 每个阶段使用对应的子代理

#### 4. 测试驱动开发

- 每完成一个阶段就进行功能测试
- 不要等到最后才测试
- 及时发现问题，及时修复

#### 5. 文档同步更新

- 及时更新迁移进度文档
- 记录遇到的问题和解决方案
- 更新已知问题清单

#### 6. 代码规范遵守

- 遵循项目的代码规范（CLAUDE.md）
- 页面文件必须包含顶部注释（业务名 + 访问地址）
- 使用 jsdoc 格式注释函数
- 不滥用 UnoCSS 的 shortcuts 功能

---

## 🎯 下一步行动建议

由于本次任务是**"仅评估和规划"**，建议:

### 1. Review 本计划

- 仔细阅读 8 个阶段的详细任务说明
- 理解每个阶段的目标和验收标准
- 评估工作量和时间安排

### 2. 确认资源

- 确保有足够的开发时间（5-7 个工作日）
- 确保具备必要的技术储备（Vue3、TypeScript、uni-app）
- 准备好开发环境和工具

### 3. 分批实施建议

**建议分 3 批实施**:

- **第一批**: 阶段 01-03（基础搭建）- 预估 9-13 小时
  - 创建页面、路由、接口
  - 验证基础架构可行性
- **第二批**: 阶段 04-06（核心迁移）- 预估 17-23 小时
  - 组件、样式、代码迁移
  - 完成主要功能
- **第三批**: 阶段 07-08（检查修复）- 预估 7-10 小时
  - 全面检查、修复问题
  - 确保质量达标

### 4. 寻求指导

- 如有疑问，随时向 Claude Code 提问
- 使用迁移子代理获取专业指导
- 参考已迁移的模块作为模板

---

## 📚 相关文档引用

- **路由映射表**: `docs\prompts\route-migration-map.yml`
- **业务流程图**: `docs\reports\vue2-route-navigation-map.md`
- **类型定义**: `src\types\repair.ts`
- **项目规范**: `CLAUDE.md`
- **迁移子代理**:
  - `.claude\agents\route-migration.md`
  - `.claude\agents\api-migration.md`
  - `.claude\agents\component-migration.md`
  - `.claude\agents\style-migration.md`
  - `.claude\agents\code-migration.md`

---

## 🔖 版本记录

| 版本 | 日期       | 修改内容                        | 作者        |
| ---- | ---------- | ------------------------------- | ----------- |
| v1.0 | 2025-01-21 | 初始版本，完整的 8 阶段迁移计划 | Claude Code |

---

**准备好开始实施时，请告诉我从哪个阶段开始！** 🚀
