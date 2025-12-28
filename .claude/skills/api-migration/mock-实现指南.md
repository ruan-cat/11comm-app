# Mock 接口实现完整指南

## Mock 数据库对象定义

每个 `*.mock.ts` 文件必须包含完整的数据库对象:

```typescript
// src/api/mock/maintainance.mock.ts
import { defineUniAppMock, successResponse, errorResponse, mockLog, ResultEnumMap } from "./shared/utils";
import type { RepairOrder, RepairListParams, RepairStatus } from "@/types/repair";
import type { PaginationResponse } from "@/types/api";

// 🔴 必须：Mock 数据库对象定义
const mockRepairDatabase = {
	// 直接在此文件内定义模拟数据
	repairs: [
		{
			repairId: "REP_001",
			title: "水电维修",
			description: "业主报修：水电出现问题",
			ownerName: "业主001",
			ownerPhone: "13812345678",
			address: "1栋101A室",
			repairType: "水电维修",
			status: "PENDING" as RepairStatus,
			priority: "HIGH" as const,
			createTime: "2024-01-15T10:30:00Z",
			updateTime: "2024-01-20T14:20:00Z",
			// ... 更多字段
		},
		// ... 更多模拟数据
	] as RepairOrder[], // 强制类型注解

	// 数据生成工具方法
	createMockRepair(id: string): RepairOrder {
		return {
			repairId: `REP_${id}`,
			title: `维修工单${id}`,
			// ... 其他字段
		};
	},

	// 初始化更多数据
	initMoreData() {
		if (this.repairs.length < 50) {
			const additionalData = Array.from({ length: 48 }, (_, index) =>
				this.createMockRepair((index + 3).toString().padStart(3, "0")),
			);
			this.repairs.push(...additionalData);
		}
	},

	// 获取工单详情
	getRepairById(repairId: string): RepairOrder | undefined {
		return this.repairs.find((repair) => repair.repairId === repairId);
	},

	// 获取工单列表 - 支持筛选和分页
	getRepairList(params: RepairListParams): PaginationResponse<RepairOrder> {
		let filteredRepairs = [...this.repairs];

		// 状态筛选
		if (params.status) {
			filteredRepairs = filteredRepairs.filter((repair) => repair.status === params.status);
		}

		// 分页处理
		const total = filteredRepairs.length;
		const start = (params.page - 1) * params.row;
		const end = start + params.row;
		const list = filteredRepairs.slice(start, end);

		return {
			list,
			total,
			page: params.page,
			pageSize: params.row,
			hasMore: end < total,
		};
	},

	// 添加工单
	addRepair(repair: RepairOrder): RepairOrder {
		this.repairs.unshift(repair);
		return repair;
	},

	// 更新工单状态
	updateRepairStatus(repairId: string, status: RepairStatus): RepairOrder | null {
		const repair = this.getRepairById(repairId);
		if (repair) {
			repair.status = status;
			repair.updateTime = new Date().toISOString();
			return repair;
		}
		return null;
	},
};
```

## Mock 接口路由定义

```typescript
// 模拟请求延迟
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// 🔴 必须：使用 defineUniAppMock 定义接口路由
export default defineUniAppMock([
	// 1. 获取维修工单列表
	{
		url: "/app/ownerRepair.listOwnerRepairs",
		method: ["GET", "POST"],
		delay: [300, 800],
		body: async ({ query, body }) => {
			await delay();

			const params = { ...query, ...body } as RepairListParams;
			const result = mockRepairDatabase.getRepairList({
				page: Number(params.page) || 1,
				row: Number(params.row) || 10,
				status: params.status,
				repairType: params.repairType,
			});

			// 🔴 必须：使用 mockLog 输出日志
			mockLog("listOwnerRepairs", params);
			mockLog("listOwnerRepairs result", `${result.list.length} items`);

			// 🔴 必须：使用 successResponse 包装返回值
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

	// 2. 获取维修任务详情
	{
		url: "/app/ownerRepair.getOwnerRepair",
		method: ["GET", "POST"],
		delay: 200,
		body: async ({ query, body }) => {
			const params = { ...query, ...body };
			mockLog("getOwnerRepair", params);

			const task = mockRepairDatabase.getRepairById(params.repairId);

			// 🔴 必须：失败情况使用 errorResponse
			if (!task) {
				return errorResponse("维修工单不存在", ResultEnumMap.NotFound);
			}

			mockLog("getOwnerRepair result", task.title);
			return successResponse(task, "查询成功");
		},
	},

	// 3. 更新维修任务
	{
		url: "/app/ownerRepair.updateOwnerRepair",
		method: "POST",
		delay: 600,
		body: async ({ body }) => {
			const data = body as UpdateRepairReq;
			mockLog("updateOwnerRepair", data);

			const updatedTask = mockRepairDatabase.updateRepairStatus(data.repairId, data.status);

			if (!updatedTask) {
				return errorResponse("更新失败，维修工单不存在", ResultEnumMap.Error);
			}

			mockLog("updateOwnerRepair result", updatedTask.title);
			return successResponse(updatedTask, "更新成功");
		},
	},
]);
```

## 高级 Mock 特性

### 条件响应和数据验证

```typescript
// 条件响应示例
{
  url: "/app/task/conditional",
  method: "POST",
  validator: { body: { type: "urgent" } },
  body: ({ body }) => {
    mockLog("conditional task", { type: body.type });
    return successResponse(
      {
        message: "紧急任务处理",
        priority: "HIGH",
      },
      "紧急任务创建成功"
    );
  },
}
```

### 文件上传模拟

```typescript
{
  url: "/api/upload/image",
  method: "POST",
  delay: 1000,
  body: ({ body }) => {
    mockLog("uploadImage", { name: body.name });

    const fileId = `FILE_${Date.now()}`;
    const result = {
      fileId,
      url: `https://picsum.photos/400/300?random=${Date.now()}`,
      size: Math.floor(Math.random() * 1000000) + 50000,
      originalName: body.name || "uploaded_file.jpg",
    };

    mockLog("uploadImage result", fileId);
    return successResponse(result, "文件上传成功");
  },
}
```
