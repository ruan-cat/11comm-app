# Mock 数据规范

## Mock 数据字典常量使用规范

- 字典/下拉选项统一放在 `src/constants/{模块}.ts`(全大写蛇形命名,如 `REPAIR_STATUSES`、`COMPLAINT_TYPE_OPTIONS`),跨模块通用的放 `src/constants/common.ts`
- 字典类型统一使用 `ColumnItem[]`(`wot-design-uni/components/wd-picker-view/types`),`value` 必须是字符串(禁止在同一数组内混用 number/boolean),`label` 为展示文案
- `*.mock.ts` 引用字典必须使用相对路径(如 `../../constants/repair`),避免 mock 插件解析别名失败；禁止在 mock 内再写一份同义的内联字典
- 在生成器/数据库对象中,先取 `ColumnItem` 再落地字段：`value` 写业务字段、`label` 写显示名称

**示例**:

```ts
import { REPAIR_STATUSES } from "../../constants/repair";

const statusItem = REPAIR_STATUSES[Math.floor(Math.random() * REPAIR_STATUSES.length)];
repair.statusCd = statusItem.value as string;
repair.statusName = statusItem.label;
```

## Mock 日期时间格式规范

- **统一格式**: 所有 Mock 日期时间字符串必须使用 dayjs,格式固定为 `YYYY-MM-DD HH:mm:ss`
- **禁止写法**: 禁用 `new Date().toISOString()`、`toTimeString()` 等原生格式化输出
- **推荐写法**: 使用 `shared/utils` 的 `formatDateTime(value?)`(内置 dayjs 与统一格式),或直接 `dayjs(value).format('YYYY-MM-DD HH:mm:ss')`
- **比较/排序**: 使用 `dayjs(value).valueOf()` 做时间比较/排序,避免混用原生 `Date`

## URL 前缀变更规则

**重要说明**: 在创建新的 Mock 函数时,URL 地址前缀需要按照以下规则变更：

**❌ 错误示例**:

```typescript
// 错误：包含多余的 /api 前缀
url: "/api/app/activities.updateStatus";
url: "/api/app/ownerRepair.listOwnerRepairs";
```

**✅ 正确示例**:

```typescript
// 正确：直接使用业务路径,无需 /api 前缀
url: "/app/activities.updateStatus";
url: "/app/ownerRepair.listOwnerRepairs";
```

**规则说明**:

- 使用自定义的 `defineUniAppMock` 函数,它会自动添加环境变量前缀
- `defineUniAppMock` 会从 `import.meta.env.VITE_APP_PROXY_PREFIX` 获取前缀并自动拼接到 URL
- 直接使用后端真实的业务路径结构(如 `/app/模块.方法`)
- 这样可以确保 Mock 接口与实际后端接口路径保持一致,并且环境配置灵活
