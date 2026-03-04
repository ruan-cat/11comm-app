# API 接口定义完整示例

## 维修模块 API 接口定义

```typescript
/**
 * 维修工单模块 API 接口定义
 * 对应业务：维修工单流程管理
 */

import type { PaginationResponse } from "@/types/api";
import type { RepairOrder, RepairListParams, CreateRepairReq, UpdateRepairReq, RepairStatistics } from "@/types/repair";
import { http } from "@/http/alova";

/** ==================== 查询接口 ==================== */

/** 1. 查询维修工单列表 */
export function getRepairOrderList(params: RepairListParams) {
	return http.Get<PaginationResponse<RepairOrder>>("/app/ownerRepair.listOwnerRepairs", { params });
}

/** 2. 获取维修工单详情 */
export function getRepairDetail(params: { repairId: string }) {
	return http.Get<{ ownerRepair: RepairOrder }>("/app/ownerRepair.queryOwnerRepair", {
		params,
	});
}

/** 3. 获取维修统计数据 */
export function getRepairStatistics(communityId?: string) {
	return http.Get<RepairStatistics>("/app/ownerRepair.getRepairStatistics", {
		params: { communityId },
	});
}

/** ==================== 创建和更新接口 ==================== */

/** 4. 创建维修工单 */
export function createRepairOrder(data: CreateRepairReq) {
	return http.Post<{ ownerRepair: RepairOrder }>("/app/ownerRepair.saveOwnerRepair", data);
}

/** 5. 更新维修工单 */
export function updateRepairOrder(data: UpdateRepairReq) {
	return http.Post<{ ownerRepair: RepairOrder }>("/app/ownerRepair.updateOwnerRepair", data);
}
```

## 迁移对照表

|     特性     |          旧项目模式          |                    新项目模式                    |
| :----------: | :--------------------------: | :----------------------------------------------: |
| **请求方式** |    `_that.context.get()`     |                  `http.Get<>()`                  |
| **参数传递** |        `data: _data`         |                   `{ params }`                   |
| **返回类型** |        `Promise<any>`        |   `Promise<T>` (响应拦截器已解包 ApiResponse)    |
| **错误处理** |     手动 `uni.showToast`     |              全局拦截器 + 自动处理               |
| **类型安全** |      JavaScript 无类型       |               TypeScript 完整类型                |
| **分页参数** |       `{ page, row }`        |                `PaginationParams`                |
| **响应数据** | `{ code, msg, data, total }` | `PaginationResponse<T>` (已解包，直接是业务数据) |

## 重要说明

**⚠️ 关于 `ApiResponse` 的使用**：

由于 Alova 响应拦截器（`src/http/alova.ts` 第 116 行）已经自动解包了 `ApiResponse`，所以：

1. **Mock 函数返回**：`successResponse({ list: [...], total: 10 })` → 生成 `{ code: 0, message: "成功", data: { list: [...], total: 10 } }`
2. **响应拦截器处理**：提取 `data` 字段 → 返回 `{ list: [...], total: 10 }`
3. **API 函数泛型**：直接写业务数据类型，不需要包裹 `ApiResponse`

**正确示例**：

```typescript
// ✅ 正确 - 直接使用业务数据类型
export function getRepairDetail(params: { repairId: string }) {
	return http.Get<{ ownerRepair: RepairOrder }>("/api/repair/detail", { params });
}

// ❌ 错误 - 不需要包裹 ApiResponse（拦截器已经解包了）
export function getRepairDetail(params: { repairId: string }) {
	return http.Get<ApiResponse<{ ownerRepair: RepairOrder }>>("/api/repair/detail", { params });
}
```
