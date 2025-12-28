# Mock 接口返回值格式规范

## ⚠️ 禁止使用 ResultEnum 枚举的重要原则

**🚫 严格禁止**: 在任何 `*.mock.ts` 文件内,**禁止**直接以**路径别名**(如 `@/http/tools/enum`)的方式导入和使用 `ResultEnum` 枚举。

**原因说明**:

- 在 `*.mock.ts` 文件内使用路径别名导入 `ResultEnum` 会导致项目编译失败
- Vite Mock 插件在处理 mock 文件时无法正确解析路径别名

**🔴 强制规范**:

1. **禁止**: 在 `*.mock.ts` 文件中使用 `import { ResultEnum } from '@/http/tools/enum'`
2. **必须**: 仅使用 `ResultEnumMap` 对象提供的字面量字符串值
3. **必须**: 使用相对路径 `'./shared/utils'` 导入 `ResultEnumMap`
4. **禁止**: 使用任何形式的路径别名导入(`@/`、`~/` 等)

**正确的导入方式**:

```typescript
// ✅ 正确：使用相对路径导入 ResultEnumMap
import { successResponse, errorResponse, mockLog, ResultEnumMap } from "./shared/utils";

// ❌ 错误：使用路径别名导入 ResultEnum
import { ResultEnum } from "@/http/tools/enum";
```

**正确的使用方式**:

```typescript
// ✅ 正确：使用 ResultEnumMap 提供的字面量字符串
return errorResponse("资源不存在", ResultEnumMap.NotFound);
return errorResponse("参数错误", ResultEnumMap.Error);
return errorResponse("服务器错误", ResultEnumMap.InternalServerError);

// ❌ 错误：直接使用 ResultEnum 枚举
return errorResponse("资源不存在", ResultEnum.NotFound);
```

## 响应格式函数说明

从 `./shared/utils` 导入核心函数和 ResultEnumMap:

```typescript
import { successResponse, errorResponse, mockLog, ResultEnumMap } from "./shared/utils";
```

### 1. successResponse - 成功响应函数

```typescript
/**
 * 生成成功响应
 * @param data - 返回的业务数据
 * @param message - 成功提示信息(可选,默认 '操作成功')
 */
successResponse<T>(data: T, message?: string)
```

**返回格式**:

```typescript
{
  success: true,
  code: string,  // ResultEnum.Success 转换为字符串
  message: string,
  data: T,
  timestamp: number
}
```

### 2. errorResponse - 失败响应函数

```typescript
/**
 * 生成错误响应
 * @param message - 错误提示信息
 * @param code - 错误代码(使用 ResultEnumMap 提供的字符串,默认 ResultEnumMap.InternalServerError)
 */
errorResponse(message: string, code?: string)
```

**返回格式**:

```typescript
{
  success: false,
  code: string,  // ResultEnumMap 提供的字符串值
  message: string,
  data: null,
  timestamp: number
}
```

**错误码说明**: 所有错误码必须使用 `./shared/utils` 中的 `ResultEnumMap` 对象提供的字符串值,包括：

- `ResultEnumMap.Success` ('0') - 成功
- `ResultEnumMap.Error` ('400') - 参数错误
- `ResultEnumMap.Forbidden` ('403') - 禁止访问/业务逻辑错误
- `ResultEnumMap.NotFound` ('404') - 资源不存在
- `ResultEnumMap.InternalServerError` ('500') - 服务器内部错误

### 3. mockLog - Mock 日志输出函数

```typescript
/**
 * 统一的 Mock 日志输出函数
 * @param apiName - API 接口名称或标识
 * @param data - 要输出的数据(可选)
 */
mockLog(apiName: string, data?: any)
```

**功能说明**:

- 统一的 Mock 接口日志输出格式
- 自动添加时间戳和格式化输出
- 便于开发调试和追踪接口调用
- 替代手动的 `console.log('🚀 Mock API: ...')` 写法

**输出格式**:

```typescript
// 控制台输出示例
🚀 Mock API: [queryStaffInfos] { page: 1, row: 10 }
📋 Mock API Result: [queryStaffInfos] 50 items
```

## 使用示例

**✅ 正确的返回值写法**:

```typescript
import { successResponse, errorResponse, mockLog, ResultEnumMap } from "./shared/utils";

// 1. 接口开始时记录请求参数
mockLog("getActivityList", params);

// 2. 成功情况 - 返回列表数据
const result = {
	list: activities,
	total: 100,
	page: 1,
	pageSize: 10,
};
mockLog("getActivityList result", `${result.list.length} items`);
return successResponse(result, "查询成功");

// 3. 成功情况 - 返回单个对象
mockLog("getActivityDetail", activityId);
const activity = getActivityById(activityId);
mockLog("getActivityDetail result", activity ? activity.title : "not found");
return successResponse(activity, "获取活动详情成功");

// 4. 失败情况 - 资源不存在
mockLog("deleteActivity", params);
if (!activity) {
	return errorResponse("活动不存在", ResultEnumMap.NotFound);
}

// 5. 失败情况 - 参数错误
mockLog("createActivity", params);
if (!params.activityId) {
	return errorResponse("活动ID不能为空", ResultEnumMap.Error);
}

// 6. 失败情况 - 业务逻辑错误
mockLog("updateActivity", { activityId, status });
if (activity.status === "CLOSED") {
	return errorResponse("活动已关闭，无法修改", ResultEnumMap.Forbidden);
}
```

**❌ 错误的返回值和日志写法**:

```typescript
// ❌ 错误：手动构造返回对象(不使用 successResponse)
return {
	success: true,
	code: "0", // 硬编码字符串而非 ResultEnum
	message: "成功",
	data: activity,
	timestamp: Date.now(),
};

// ❌ 错误：直接返回数据(缺少统一响应格式)
return activity;

// ❌ 错误：使用不一致的字段名
return {
	status: "success",
	result: activity,
};

// ❌ 错误：硬编码错误码字符串
return errorResponse("活动不存在", "404"); // 应使用 ResultEnumMap.NotFound

// ❌ 错误：使用 ResultEnum 枚举(会导致编译失败)
import { ResultEnum } from "@/http/tools/enum";
return errorResponse("活动不存在", ResultEnum.NotFound); // 应使用 ResultEnumMap

// ❌ 错误：使用手动的 console.log
console.log("🚀 Mock API: getActivityList", params);
console.log("📋 Mock Response:", result);

// ❌ 错误：使用其他格式的日志
console.info("API called:", params);
console.debug("Result:", result);
```

## 强制规范说明

1. **100% 使用规范函数**: 禁止手动构造返回对象,必须使用 `successResponse/errorResponse`
2. **🔴 强制使用 ResultEnumMap**: 所有错误码必须使用 `./shared/utils` 中的 `ResultEnumMap` 对象提供的字符串值
   - ✅ 正确：`errorResponse('资源不存在', ResultEnumMap.NotFound)`
   - ❌ 错误：`errorResponse('资源不存在', '404')`
   - ❌ 错误：`errorResponse('资源不存在', ResultEnum.NotFound)` (会导致编译失败)
3. **字段一致性**: 确保所有接口响应格式完全一致,严格符合 `src/types/api.ts` 中的 `ApiResponse<T>` 接口定义
4. **timestamp 必需字段**: `timestamp` 字段是必需的,`successResponse/errorResponse` 函数会自动添加
5. **类型安全**: `successResponse<T>` 支持泛型,确保数据类型正确
6. **统一日志输出**: 所有 Mock 接口必须使用 `mockLog()` 函数输出日志,禁止使用其他 console 方法
