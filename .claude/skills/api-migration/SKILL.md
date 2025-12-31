---
name: api-migration
description: 专业的接口请求迁移专家，从 Java110Context + uni.request 迁移到 Alova + TypeScript + Mock 接口。当需要实现 API 接口迁移、编写 Mock 接口、定义接口类型、处理 useRequest 集成时使用。分页功能必须与 z-paging-integration 协同。
---

# 接口请求迁移专家

## ⚠️ 多技能协同

常见组合场景：

- 表单提交接口：`use-wd-form` + `api-error-handling`
- 列表分页接口：`z-paging-integration` + `api-error-handling`
- Vue2 迁移 API：`code-migration` + `api-error-handling`

参阅 `.claude/skills/check-trigger.md` 了解完整的技能触发检查流程。

---

## 核心文档与参考

必读文件：

- `src/api/mock/repair.mock.ts` - 最完整、最标准的参考实现
- `.claude/skills/api-migration/mock-实现指南.md`
- `.claude/skills/api-migration/mock-规范.md`
- `.claude/skills/api-migration/mock-响应格式.md`

关键要求：

- 使用 `{ query, body }` 解构参数
- method 必须是数组：`['GET', 'POST']`
- 必须设置 `delay: [300, 800]`
- Mock 文件使用 `ResultEnumMap`，非 `ResultEnum`

## 核心原则

- **参考优先**：以现有 Mock 文件为标准，不以通用插件文档为准
- **完全模仿**：100% 按照 `repair.mock.ts` 的代码结构编写
- **类型安全**：所有 `ColumnItem.value` 赋值时添加 `as string` 断言
- **响应格式**：强制使用 `successResponse`/`errorResponse`/`mockLog`

## 迁移概述

从 Vue2 项目的 **Java110Context + uni.request** 网络请求架构迁移到 Vue3 项目的 **Alova + TypeScript + 模拟接口** 现代化开发架构。

**⚠️ 重要说明**: 严格遵循 CLAUDE.md 无登录原则,完全移除认证逻辑,采用纯模拟接口方式。

## 核心设计原则

1. **🎯 类型安全优先**: 使用 TypeScript 完整的类型定义
2. **📦 统一基础类型**: 强制使用 `src/types/api.ts` 中的基础业务类型
3. **🔄 保持接口兼容性**: 与旧项目的接口 URL 和数据结构保持兼容
4. **🚀 现代化架构**: 采用 Alova + Composition API 的现代化请求模式

## Mock 数据存储新规范

**强制执行的核心规则**:

1. **📁 单文件完整性**: 每个 `*.mock.ts` 文件必须包含**数据库对象** + **接口定义**
2. **💾 内联数据存储**: 模拟业务数据直接存储在各自的 `*.mock.ts` 文件的数据库对象内
3. **🎯 业务类型使用**: 强制使用 `src/types` 文件夹内拆分后的业务类型
4. **🌐 URL 前缀规范**: Mock 接口的 URL 必须**移除** `/api` 前缀,直接使用 `/app` 等路径

> **💡 详细规范**: 关于 Mock 数据字典、日期格式、URL 前缀等详细规范,参阅 [mock-规范.md](mock-规范.md)

## Mock 接口返回值格式规范

**🔴 强制要求**: 所有 Mock 接口的返回值必须使用统一的响应格式函数:

```typescript
import { successResponse, errorResponse, mockLog, ResultEnumMap } from "./shared/utils";

// ✅ 成功响应
return successResponse(data, "操作成功");

// ✅ 错误响应
return errorResponse("资源不存在", ResultEnumMap.NotFound);

// ✅ 日志输出
mockLog("apiName", params);
```

**⚠️ 禁止使用 ResultEnum 枚举**: 在 `*.mock.ts` 文件内,**禁止**直接以路径别名方式导入 ResultEnum,必须使用 ResultEnumMap。

> **📖 响应格式详解**: 关于 successResponse、errorResponse、mockLog 的详细用法,参阅 [mock-响应格式.md](mock-响应格式.md)

## useRequest 组合式 API 使用规范

**🔴 核心原则**: 使用 Alova 的 `useRequest` Hook 管理接口请求状态,替代手动管理 loading、error、data。

**🔴 默认规范**: 所有 `useRequest` 必须设置 `immediate: false`,禁止自动运行请求。

**核心状态说明**:

| 状态名      | 类型                      | 说明                  |
| ----------- | ------------------------- | --------------------- |
| `loading`   | `Ref<boolean>`            | 请求加载状态,自动管理 |
| `data`      | `Ref<T \| undefined>`     | 响应数据,类型安全     |
| `error`     | `Ref<Error \| undefined>` | 错误信息              |
| `send`      | `(...args) => Promise<T>` | 手动触发请求函数      |
| `onSuccess` | `(callback) => void`      | 成功回调钩子          |
| `onError`   | `(callback) => void`      | 失败回调钩子          |

> **📚 详细用法**: 关于标准请求、表单提交、分页加载、静默请求、错误处理等,参阅 `api-error-handling` Skill

## 技术栈对比

### Vue2 项目网络请求架构

- **自研封装**: 基于 uni.request 的自定义封装
- **Context 模式**: 通过 Java110Context 统一管理
- **无类型检查**: JavaScript,缺乏类型安全
- **手动错误处理**: 每个请求需要手动处理错误

### Vue3 项目网络请求架构

- **现代化库**: 基于 Alova 的先进请求管理
- **TypeScript 支持**: 完整的类型检查和智能提示
- **⚠️ 严格无认证**: 完全移除登录、token、鉴权相关逻辑
- **⚠️ 纯 Mock 接口**: 所有接口都是本地模拟数据
- **响应式状态**: 自动管理请求状态和数据响应式更新

## TypeScript 类型定义体系

**📦 基础业务类型详解**:

```typescript
// src/types/api.ts - 基础 API 类型
export interface ApiResponse<T = any> {
	success: boolean; // 请求是否成功
	code: string; // 业务状态码
	message: string; // 响应消息
	data: T; // 业务数据
	timestamp: number; // 时间戳
}

/** 分页请求参数 */
export interface PaginationParams {
	page: number; // 当前页码
	row: number; // 每页条数
}

/** 分页响应结构 */
export interface PaginationResponse<T> {
	list: T[]; // 当前页数据列表
	total: number; // 总记录数
	page: number; // 当前页码
	pageSize: number; // 每页条数
	hasMore: boolean; // 是否有更多数据
}
```

> **📝 业务模块类型**: 关于如何定义业务模块的类型接口,参阅 [类型定义规范.md](类型定义规范.md)

## API 接口定义标准

```typescript
/**
 * [模块名] API 接口定义
 * 对应业务：[业务功能说明]
 */

// 1. 类型导入（优先）
import type { ApiResponse, PaginationResponse } from '@/types/api'
import type { [业务类型定义] } from '@/types/[模块名]'

// 2. 工具导入
import { http } from '@/http/alova'

/** 查询 [实体] 列表 */
export function get[Entity]List(params: [Entity]QueryParams & PaginationParams) {
  return http.Get<PaginationResponse<[Entity]>>('/app/[entity].query[Entity]s', { params })
}

/** 查询 [实体] 详情 */
export function get[Entity]Detail(params: { [entity]Id: string }) {
  return http.Get<ApiResponse<[Entity]>>('/app/[entity].query[Entity]Detail', { params })
}
```

> **💡 完整示例**: 参阅 [api-定义示例.md](api-定义示例.md) 查看维修模块的完整接口定义

## Mock 文件结构要求

**核心要求**:

- **文件格式**: 必须使用 `*.mock.ts` 格式
- **文件位置**: Mock 文件必须放在 `src/api/mock` 目录下
- **必须使用**: `defineUniAppMock` 函数代替 `defineMock`

**正确的项目结构**:

```plain
src/api/
├── mock/                          # Mock 文件目录
│   ├── maintainance.mock.ts       # 维修模块 Mock (含内联数据)
│   ├── complaint.mock.ts          # 投诉模块 Mock (含内联数据)
│   ├── activity.mock.ts           # 活动模块 Mock (含内联数据)
│   └── shared/                    # 共享工具
│       └── utils.ts               # Mock 工具函数
├── maintainance.ts                # 维修相关接口定义
├── complaint.ts                   # 投诉相关接口定义
└── activity.ts                    # 活动相关接口定义
```

> **📦 Mock 实现**: 关于 Mock 数据库对象、接口定义、高级特性的完整说明,参阅 [mock-实现指南.md](mock-实现指南.md)

## z-paging 分页组件适配

> **📚 详细方案**: 关于 z-paging 与 useRequest 的完整适配方案,请参阅 `z-paging-integration` Skill

当页面使用 `<z-paging>` 组件时,必须遵循:

1. **在 @query 中触发请求**: 使用 `send()` 方法触发请求
2. **在 onSuccess 中调用 complete**: 将 z-paging 的 `complete()` 放在成功回调中
3. **在 onError 中调用 complete(false)**: 加载失败时通知 z-paging

## Mock 文件修改后的自动重启流程

**🔴 重要说明**: 修改 Mock 文件后,必须重启开发环境才能使更改生效。

**自动重启触发条件**:

1. **新增** 任何 `*.mock.ts` 文件时
2. **修改** 任何现有 `*.mock.ts` 文件时
3. **修改** mock 数据内容时

> **🔧 重启流程**: 关于检测、停止、启动、验证的完整流程,参阅 [mock-重启流程.md](mock-重启流程.md)

## 迁移实施标准

**基础格式要求**:

- ✅ 所有 Mock 文件使用 `*.mock.ts` 格式
- ✅ Mock 文件都在 `src/api/mock` 目录下
- ✅ 使用 `defineUniAppMock()` 而非原生 `defineMock()` 函数
- ✅ API 接口保持与原项目相同的 URL 路径
- ✅ **Mock 接口返回值必须使用统一的响应格式函数**

**类型安全要求**:

- ✅ 必须从 `@/types/{模块名}` 导入拆分后的业务类型
- ✅ 模拟数据直接定义在各自的 `*.mock.ts` 文件的数据库对象内
- ✅ 所有函数参数和返回值都有明确的 TypeScript 类型注解
- ✅ 严禁使用 `any` 类型

**文件结构要求**:

- ✅ 每个 `*.mock.ts` 文件必须包含：内联数据 + 数据库对象 + 接口定义
- ✅ 数据库对象包含完整的 CRUD 操作方法和模拟数据存储
- ✅ Mock 生成的假数据 100%符合业务类型定义

## 验证步骤

### 接口响应验证

1. **启动开发服务器**: 运行 `pnpm dev`
2. **检查 Mock 加载**: 控制台应显示 Mock 插件已加载成功
3. **测试接口调用**: 在浏览器中访问页面,触发接口请求
4. **验证返回数据**: 检查数据格式符合 `ApiResponse<T>` 类型定义
5. **检查控制台日志**: 验证 `mockLog()` 函数输出的日志格式统一

### 类型安全验证

**✅ API 文件类型检查清单**:

- [ ] 所有接口函数都有明确的参数类型注解
- [ ] 所有接口函数都有明确的返回类型注解
- [ ] 正确导入和使用基础业务类型
- [ ] 严格禁止使用 `any` 类型
- [ ] 分页接口使用 `PaginationParams` 和 `PaginationResponse<T>`

**✅ Mock 文件类型检查清单**:

- [ ] Mock 数据使用业务类型定义
- [ ] 数据库对象方法有完整的类型注解
- [ ] Mock 响应使用 `successResponse()` 和 `errorResponse()` 包装
- [ ] 所有日志输出使用 `mockLog()` 函数
- [ ] 严格禁止使用 `ResultEnum` 枚举,只使用 `ResultEnumMap`

## 相关文档

- [mock-规范.md](mock-规范.md) - Mock 数据字典、日期格式、URL 前缀等详细规范
- [mock-响应格式.md](mock-响应格式.md) - successResponse、errorResponse、mockLog 详细用法
- [类型定义规范.md](类型定义规范.md) - 业务模块类型定义标准和示例
- [api-定义示例.md](api-定义示例.md) - 完整的 API 接口定义示例
- [mock-实现指南.md](mock-实现指南.md) - Mock 数据库对象、接口定义、高级特性
- [mock-重启流程.md](mock-重启流程.md) - Mock 文件修改后的自动重启完整流程
