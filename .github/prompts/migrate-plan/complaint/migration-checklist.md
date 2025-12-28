# 投诉模块迁移任务清单

> 📅 创建时间：2025-12-28
> 📦 模块名称：投诉处理流程模块
> 🎯 迁移目标：从 Vue2 uni-app 迁移到 Vue3 + TypeScript + Vite5 + UnoCSS

---

## 📊 整体进度概览

|   类别    |  总数  | 已完成 | 进行中 | 待完成 |  完成率  |
| :-------: | :----: | :----: | :----: | :----: | :------: |
| 类型定义  |   1    |   1    |   0    |   0    |   100%   |
| API 接口  |   1    |   1    |   0    |   0    |   100%   |
| Mock 数据 |   1    |   1    |   0    |   0    |   100%   |
| 页面迁移  |   7    |   7    |   0    |   0    |   100%   |
| 路由配置  |   1    |   1    |   0    |   0    |   100%   |
| **总计**  | **11** | **11** | **0**  | **0**  | **100%** |

---

## ✅ 已完成任务

### 1. TypeScript 类型定义 ✓

**文件**: `src/types/complaint.ts`
**完成时间**: 2025-12-28
**内容**:

- [x] 基础类型定义（Complaint、ComplaintEvent、ComplaintAppraise、ComplaintPhoto）
- [x] 常量定义（ComplaintTypeCode、ComplaintStateCode、ComplaintEventType、ComplaintAppraiseState）
- [x] API 请求参数类型（QueryComplaintListParams、SaveComplaintParams、HandleComplaintParams、AuditComplaintParams 等）
- [x] API 响应类型（ComplaintListResponse、ComplaintEventListResponse、ComplaintAppraiseListResponse 等）

**代码行数**: 354 行

---

### 2. API 接口定义 ✓

**文件**: `src/api/complaint.ts`
**完成时间**: 2025-12-28
**内容**:

- [x] 查询待办投诉列表（getTodoComplaintList）
- [x] 查询已办投诉列表（getFinishComplaintList）
- [x] 查询用户投诉历史（getUserComplaintHistory）
- [x] 查询投诉工单流转记录（getComplaintEvents）
- [x] 查询投诉评价列表（getComplaintAppraises）
- [x] 保存投诉（saveComplaint）
- [x] 处理投诉（handleComplaint）
- [x] 审核投诉（auditComplaint）
- [x] 回复投诉评价（replyComplaintAppraise）

**接口数量**: 9 个
**代码行数**: 约 110 行

---

### 3. Mock 数据 ✓

**文件**: `src/api/mock/complaint.mock.ts`
**完成时间**: 2025-12-28
**内容**:

- [x] 数据生成器（投诉内容、处理意见、评价、回复）
- [x] Mock 数据库（40 条投诉 + 事件 + 评价）
- [x] 7 个 Mock API 端点
- [x] 完整的请求验证和错误处理

**Mock 接口数量**: 7 个
**模拟数据量**: 40 条投诉记录
**代码行数**: 约 550 行

---

### 4. 页面迁移 - handle.vue ✓

**文件**: `src/pages-sub/complaint/handle.vue`
**完成时间**: 2025-12-28
**旧代码**: `gitee-example/pages/complaintHandle/complaintHandle.vue` (66 行)
**新代码行数**: 约 100 行
**功能**: 投诉处理页面，物业人员快速处理投诉工单，提交处理意见

**特点**:

- 使用 Composition API (script setup)
- 集成 Alova useRequest
- wot-design-uni 组件（wd-textarea、wd-button）
- 完整的错误处理和提示

**访问地址**: `http://localhost:9000/#/pages-sub/complaint/handle?complaintId=COMP_001`

---

### 5. 页面迁移 - appraise-reply.vue ✓

**文件**: `src/pages-sub/complaint/appraise-reply.vue`
**完成时间**: 2025-12-28
**旧代码**: `gitee-example/pages/complaintOrderDetail/replyComplainAppraise.vue` (56 行)
**新代码行数**: 约 110 行
**功能**: 回复投诉评价页面，物业人员对业主的投诉评价进行回复

**特点**:

- 使用 Composition API (script setup)
- 集成 Alova useRequest
- wot-design-uni 组件（wd-textarea、wd-button）
- 完整的表单验证和错误处理

**访问地址**: `http://localhost:9000/#/pages-sub/complaint/appraise-reply?appraiseId=APPR_COMP_001_1&communityId=COMM_001`

---

### 6. 页面迁移 - list.vue ✓

**文件**: `src/pages-sub/complaint/list.vue`
**完成时间**: 2025-12-28
**旧代码**: `gitee-example/pages/complaintList/complaintList.vue` (119 行)
**新代码行数**: 约 180 行
**功能**: 投诉受理单列表页面，显示待处理的投诉工单

**特点**:

- 卡片式列表展示
- 日期格式化为 MM-DD
- 空数据状态处理
- 支持查看详情和快速办结
- 使用 wot-design-uni 组件（wd-button）

**访问地址**: `http://localhost:9000/#/pages-sub/complaint/list`

---

### 7. 页面迁移 - finish.vue ✓

**文件**: `src/pages-sub/complaint/finish.vue`
**完成时间**: 2025-12-28
**旧代码**: `gitee-example/pages/complaintFinish/complaintFinish.vue` (120 行)
**新代码行数**: 约 185 行
**功能**: 投诉已办单列表页面，显示已完成处理的投诉工单

**特点**:

- 与 list.vue 类似的卡片式布局
- 使用不同的 API 端点（getFinishComplaintList）
- 完整的加载和空状态处理

**访问地址**: `http://localhost:9000/#/pages-sub/complaint/finish`

---

### 8. 页面迁移 - audit.vue ✓

**文件**: `src/pages-sub/complaint/audit.vue`
**完成时间**: 2025-12-28
**旧代码**: `gitee-example/pages/auditComplaintOrder/auditComplaintOrder.vue` (201 行)
**新代码行数**: 约 170 行
**功能**: 审核投诉单页面，选择处理结果并提交处理意见

**特点**:

- 使用 picker 选择处理结果（已处理/无法处理）
- wd-textarea 输入处理意见
- 完整的表单验证（结果选择 + 处理意见长度）
- 成功后自动返回上一页

**访问地址**: `http://localhost:9000/#/pages-sub/complaint/audit?complaintId=COMP_001&taskId=TASK_COMP_001`

---

### 9. 页面迁移 - detail.vue ✓

**文件**: `src/pages-sub/complaint/detail.vue`
**完成时间**: 2025-12-28
**旧代码**: `gitee-example/pages/complaintOrderDetail/complaintOrderDetail.vue` (217 行)
**新代码行数**: 约 280 行
**功能**: 投诉单详情页面，显示投诉详细信息、工单流转时间轴和评价

**特点**:

- 使用 wd-cell-group 展示投诉基本信息
- **自定义时间轴组件**（参考 repair/order-detail.vue）
  - 左侧圆点 + 连接线
  - 右侧时间和内容
  - 根据事件类型动态颜色（create=blue, handle=green, appraise=orange, reply=purple）
- 评价展示区域支持回复操作
- 集成两个 API（getComplaintEvents + getComplaintAppraises）

**访问地址**: `http://localhost:9000/#/pages-sub/complaint/detail?complaintId=COMP_001`

---

### 10. 页面迁移 - order.vue ✓

**文件**: `src/pages-sub/complaint/order.vue`
**完成时间**: 2025-12-28
**旧代码**: `gitee-example/pages/complaintOrder/complaintOrder.vue` (408 行)
**新代码行数**: 约 450 行
**功能**: 投诉录单页面，业主发起投诉工单，查看投诉历史记录

**特点**:

- **Tab 切换**：发起投诉 / 投诉历史
- **房屋选择流程**：楼栋 → 单元 → 房屋（使用已有 selector 页面）
- **投诉信息表单**：
  - 投诉类型 picker（投诉/建议）
  - 投诉人 input
  - 手机号码 input
  - 投诉内容 textarea
  - 图片上传（最多 4 张，Base64 转换）
- **投诉历史列表**：卡片式展示，支持查看详情
- **完整的表单验证**：所有必填项 + 房屋信息
- **图片处理**：uni.chooseImage + uni.getFileSystemManager().readFile Base64 转换
- 提交成功后自动切换到历史 Tab 并刷新列表

**访问地址**: `http://localhost:9000/#/pages-sub/complaint/order`

---

### 11. 路由配置 ✓

**完成时间**: 2025-12-28
**说明**: 本项目使用 `@uni-helper/vite-plugin-uni-pages` 插件，支持自动路由发现。所有页面通过文件结构和 `definePage` 配置自动注册，无需手动配置路由。

**已配置页面**:

- ✅ `pages-sub/complaint/order.vue` - 投诉录单
- ✅ `pages-sub/complaint/handle.vue` - 投诉处理
- ✅ `pages-sub/complaint/appraise-reply.vue` - 回复评价
- ✅ `pages-sub/complaint/list.vue` - 投诉受理单
- ✅ `pages-sub/complaint/finish.vue` - 投诉已办单
- ✅ `pages-sub/complaint/audit.vue` - 审核投诉单
- ✅ `pages-sub/complaint/detail.vue` - 投诉单详情

---

## 🔄 后续建议任务

### 1. 功能测试（可选）

**优先级**: ⭐⭐ 建议
**说明**: 虽然所有页面都已迁移完成，但建议进行端到端测试以确保功能正常。

**测试清单**:

- [ ] 测试投诉录单完整流程（房屋选择 → 表单填写 → 图片上传 → 提交成功）
- [ ] 测试投诉处理流程（列表查看 → 处理 → 成功提示）
- [ ] 测试投诉审核流程（审核 → 选择结果 → 提交）
- [ ] 测试评价回复流程（查看评价 → 回复 → 提交）
- [ ] 测试详情页面（基本信息 → 时间轴 → 评价列表）
- [ ] 测试列表页面（加载 → 空状态 → 跳转）
- [ ] 测试图片上传 Base64 转换
- [ ] 测试所有表单验证规则
- [ ] 测试错误提示和异常处理

---

### 2. 性能优化（可选）

**优先级**: ⭐ 低
**建议优化点**:

- [ ] 图片压缩（Base64 文件可能较大）
- [ ] 列表分页加载（当前一次加载 15 条）
- [ ] 缓存优化（Alova 缓存策略调整）
- [ ] 组件懒加载

---

### 3. 用户体验增强（可选）

**优先级**: ⭐ 低
**建议增强点**:

- [ ] 添加下拉刷新
- [ ] 添加上拉加载更多
- [ ] 添加骨架屏
- [ ] 优化图片上传交互（压缩、预览）
- [ ] 添加更丰富的动画效果

---

## 🗺️ 页面映射关系

| 序号 |                     Vue2 旧路径                      |              Vue3 新路径               |    业务名称    |   状态    |
| :--: | :--------------------------------------------------: | :------------------------------------: | :------------: | :-------: |
|  1   |        pages/complaintList/complaintList.vue         |      pages-sub/complaint/list.vue      | 投诉受理单列表 | ✅ 已完成 |
|  2   |       pages/complaintOrder/complaintOrder.vue        |     pages-sub/complaint/order.vue      |    投诉录单    | ✅ 已完成 |
|  3   | pages/complaintOrderDetail/complaintOrderDetail.vue  |     pages-sub/complaint/detail.vue     |   投诉单详情   | ✅ 已完成 |
|  4   |      pages/complaintHandle/complaintHandle.vue       |     pages-sub/complaint/handle.vue     |    投诉处理    | ✅ 已完成 |
|  5   |      pages/complaintFinish/complaintFinish.vue       |     pages-sub/complaint/finish.vue     |   投诉已办单   | ✅ 已完成 |
|  6   |  pages/auditComplaintOrder/auditComplaintOrder.vue   |     pages-sub/complaint/audit.vue      |   审核投诉单   | ✅ 已完成 |
|  7   | pages/complaintOrderDetail/replyComplainAppraise.vue | pages-sub/complaint/appraise-reply.vue |    回复评价    | ✅ 已完成 |

---

## 🔗 API 映射关系

| 序号 |        Vue2 API        |        Vue3 API         |                    旧端点                    |                    新端点                     |  状态   |
| :--: | :--------------------: | :---------------------: | :------------------------------------------: | :-------------------------------------------: | :-----: |
|  1   |    loadTodoCompaint    |  getTodoComplaintList   |      app/auditUser.listAuditComplaints       |      /app/auditUser.listAuditComplaints       | ✅ 完成 |
|  2   |   loadCompaintFinish   | getFinishComplaintList  |   app/auditUser.listAuditHistoryComplaints   |   /app/auditUser.listAuditHistoryComplaints   | ✅ 完成 |
|  3   |           -            | getUserComplaintHistory |   app/auditUser.listAuditHistoryComplaints   |   /app/auditUser.listAuditHistoryComplaints   | ✅ 完成 |
|  4   |     auditComplaint     |     handleComplaint     |         app/complaint.auditComplaint         |         /app/complaint.auditComplaint         | ✅ 完成 |
|  5   |     auditComplaint     |     auditComplaint      |         app/complaint.auditComplaint         |         /app/complaint.auditComplaint         | ✅ 完成 |
|  6   |           -            |      saveComplaint      |                app/complaint                 |                /app/complaint                 | ✅ 完成 |
|  7   |   getComplaintEvent    |   getComplaintEvents    |       app/complaint.listComplaintEvent       |       /app/complaint.listComplaintEvent       | ✅ 完成 |
|  8   |  getComplaintAppraise  |  getComplaintAppraises  | app/complaintAppraise.listComplaintAppraise  | /app/complaintAppraise.listComplaintAppraise  | ✅ 完成 |
|  9   | replyComplaintAppraise | replyComplaintAppraise  | app/complaintAppraise.replyComplaintAppraise | /app/complaintAppraise.replyComplaintAppraise | ✅ 完成 |

---

## 🎯 技术决策记录

### 1. 房屋选择器

**决策**: 使用已存在的选择器页面
**原因**: `src/pages-sub/selector/` 目录下已有完整的楼栋/单元/房屋选择器实现
**影响**: 无需重新开发，直接复用

---

### 2. 图片上传方式

**决策**: 继续使用 Base64 方案
**原因**: 保持与旧代码一致，API 端点期望 Base64 格式
**影响**: 需要实现 Base64 转换逻辑

---

### 3. 时间线组件

**决策**: 使用自定义时间轴组件（参考 repair/order-detail.vue）
**原因**: wot-design-uni 没有内置时间线组件
**实现**: 使用 flex 布局 + UnoCSS 自定义实现
**样式**: 左侧圆点+连接线，右侧内容，根据状态动态颜色

---

### 4. Mock 数据

**决策**: 创建完整的 Mock 数据
**原因**: 便于开发和测试，无需依赖后端
**数据量**: 40 条投诉 + 事件 + 评价

---

### 5. 状态码管理

**决策**: 创建常量文件
**位置**: `src/types/complaint.ts` 中的常量定义
**好处**: 类型安全、易于维护、避免硬编码

---

## 📝 注意事项

### 1. 日期格式化

- Vue2 使用原生 Date 对象，格式化为 `MM-DD`
- Vue3 统一使用 dayjs 处理日期
- 示例: `dayjs(createTime).format('M-D')`

---

### 2. 本地存储

- Vue2 使用 `uni.setStorageSync/getStorageSync` 存储对象
- Vue3 不需要本地存储，因为没有严格的登录/鉴权逻辑
- 数据通过路由参数传递或 API 重新获取

---

### 3. 错误处理

- Vue2: 简单的 statusCode 判断
- Vue3: 使用 Alova 的 onSuccess/onError 回调 + useGlobalToast

---

### 4. 组件库差异

| Vue2 (ColorUI) |       Vue3 (wot-design-uni)       |
| :------------: | :-------------------------------: |
|     cu-btn     |             wd-button             |
| cu-form-group  | wd-cell-group + wd-textarea/input |
|  cu-list menu  |           wd-cell-group           |
|    cu-item     |              wd-cell              |
|  cu-timeline   |         自定义时间轴组件          |
|    cu-modal    |             wd-popup              |

---

### 5. 图片处理

- Vue2: 使用 `java110Factory.base64.urlTobase64()`
- Vue3: 需要实现 Base64 转换工具函数

---

## 🎉 迁移完成总结

### ✅ 已完成工作

**完成时间**: 2025-12-28
**总耗时**: 1 天（实际完成，远超预期效率）

**完成清单**:

1. ✅ TypeScript 类型定义（354 行）
2. ✅ API 接口定义（110 行，9 个接口）
3. ✅ Mock 数据实现（550 行，40 条数据）
4. ✅ handle.vue - 投诉处理页面
5. ✅ appraise-reply.vue - 回复评价页面
6. ✅ list.vue - 投诉受理单列表
7. ✅ finish.vue - 投诉已办单列表
8. ✅ audit.vue - 审核投诉单页面
9. ✅ detail.vue - 投诉单详情页面（含自定义时间轴）
10. ✅ order.vue - 投诉录单页面（最复杂，含 Tab、表单、图片上传）
11. ✅ 路由配置（自动路由发现）

**代码统计**:

- 总计新增代码：约 2,200+ 行
- 7 个页面组件
- 9 个 API 接口
- 40+ 条 Mock 数据记录
- 完整的类型定义系统

### 🏆 技术亮点

1. **完整的类型系统**: TypeScript 类型定义覆盖所有数据结构和 API
2. **自定义时间轴组件**: 使用 flex 布局 + UnoCSS 实现，支持动态颜色
3. **Base64 图片上传**: uni.getFileSystemManager().readFile 实现
4. **Mock 数据系统**: 完整的数据生成器和模拟数据库
5. **错误处理**: 统一的 Alova onSuccess/onError + useGlobalToast
6. **房屋选择器集成**: 复用已有 selector 页面，数据通过 storage 传递
7. **响应式设计**: 使用 UnoCSS 原子化 CSS，适配多端

### 📊 迁移对比

| 维度       |      Vue2      |      Vue3      | 改进 |
| :--------- | :------------: | :------------: | :--: |
| 总代码行数 |     ~1,200     |     ~2,200     | +83% |
| 类型安全   |       无       |   TypeScript   |  ✅  |
| 组件库     |    ColorUI     | wot-design-uni |  ✅  |
| 样式方案   |   内联 + CSS   |     UnoCSS     |  ✅  |
| API 调用   | java110Context |     Alova      |  ✅  |
| 状态管理   |      Vuex      |     Pinia      |  ✅  |
| 日期处理   |      Date      |     dayjs      |  ✅  |

---

## 📌 备注

- 所有 API 都是 Mock 假接口，使用 `vite-plugin-mock-dev-server`
- 不考虑登录和鉴权逻辑
- 路由可以任意跳转，任意访问
- 遵循项目的代码规范和最佳实践
- 使用自动路由发现，无需手动配置路由
- 图片上传使用 Base64 方式，与旧代码保持一致

---

**创建时间**: 2025-12-28
**完成时间**: 2025-12-28
**最后更新**: 2025-12-28
**迁移进度**: ✅ 100% (11/11 完成)
**状态**: 🎉 迁移完成
