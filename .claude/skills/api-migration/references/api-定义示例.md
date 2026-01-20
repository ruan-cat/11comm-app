# API 接口定义完整示例

## 维修模块 API 接口定义

```typescript
/**
 * 维修工单模块 API 接口定义
 * 对应业务：维修工单流程管理
 */

import type { ApiResponse, PaginationResponse } from "@/types/api";
import type { RepairOrder, RepairListParams, CreateRepairReq, UpdateRepairReq, RepairStatistics } from "@/types/repair";
import { http } from "@/http/alova";

/** ==================== 查询接口 ==================== */

/** 1. 查询维修工单列表 */
export function getRepairOrderList(params: RepairListParams) {
	return http.Get<PaginationResponse<RepairOrder>>("/app/ownerRepair.listOwnerRepairs", { params });
}

/** 2. 获取维修工单详情 */
export function getRepairDetail(params: { repairId: string }) {
	return http.Get<ApiResponse<{ ownerRepair: RepairOrder }>>("/app/ownerRepair.queryOwnerRepair", {
		params,
	});
}

/** 3. 获取维修统计数据 */
export function getRepairStatistics(communityId?: string) {
	return http.Get<ApiResponse<RepairStatistics>>("/app/ownerRepair.getRepairStatistics", {
		params: { communityId },
	});
}

/** ==================== 创建和更新接口 ==================== */

/** 4. 创建维修工单 */
export function createRepairOrder(data: CreateRepairReq) {
	return http.Post<ApiResponse<{ ownerRepair: RepairOrder }>>("/app/ownerRepair.saveOwnerRepair", data);
}

/** 5. 更新维修工单 */
export function updateRepairOrder(data: UpdateRepairReq) {
	return http.Post<ApiResponse<{ ownerRepair: RepairOrder }>>("/app/ownerRepair.updateOwnerRepair", data);
}
```

## 迁移对照表

| 特性         | 旧项目模式                   | 新项目模式                           |
| ------------ | ---------------------------- | ------------------------------------ |
| **请求方式** | `_that.context.get()`        | `http.Get<>()`                       |
| **参数传递** | `data: _data`                | `{ params }`                         |
| **返回类型** | `Promise<any>`               | `Promise<ApiResponse<T>>`            |
| **错误处理** | 手动 `uni.showToast`         | 全局拦截器 + 自动处理                |
| **类型安全** | JavaScript 无类型            | TypeScript 完整类型                  |
| **分页参数** | `{ page, row }`              | `PaginationParams`                   |
| **响应数据** | `{ code, msg, data, total }` | `ApiResponse<PaginationResponse<T>>` |
