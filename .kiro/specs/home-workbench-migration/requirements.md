# Requirements Document

## Introduction

本需求文档定义了 Vue2 旧项目（`gitee-example`）到 Vue3 新项目（`src`）的首页和工作台模块迁移需求。迁移范围包括：

1. **首页（Index）**：完善现有首页的入口跳转功能和待办数量显示
2. **工作台（Work）**：新建工作台页面，实现动态菜单功能
3. **缺失模块**：迁移首页/工作台依赖的所有缺失业务模块

本迁移遵循项目的技能规范体系，包括：

- `code-migration`：Vue2 Options API 到 Vue3 Composition API + TypeScript 迁移
- `component-migration`：ColorUI + uni-app 内置组件到 wot-design-uni 组件迁移
- `style-migration`：ColorUI 样式到 UnoCSS 原子化 CSS 迁移
- `api-migration`：Java110Context + uni.request 到 Alova + TypeScript + Mock 接口迁移
- `route-migration`：传统 pages.json 到约定式路由迁移
- `z-paging-integration`：z-paging 分页组件与 useRequest 集成
- `api-error-handling`：统一的接口错误提示处理
- `use-wd-form`：wd-form 表单组件编写规范
- `beautiful-component-design`：组件美化设计规范
- `use-uniapp-dynamic-page-title`：动态页面标题设置
- `add-new-component`：新建公共组件规范

## Glossary

- **Vue3 项目**：`package.json` 指代的 uniapp 项目，即 `src` 目录下的代码
- **Vue2 项目**：`gitee-example` 目录下的旧 uniapp 项目
- **TabBar**：底部导航栏，包含首页、工作台、通讯录、我的四个入口
- **分包（pages-sub）**：uni-app 的分包机制，用于优化小程序包体积
- **z-paging**：分页组件，用于实现列表的下拉刷新和上拉加载
- **wot-design-uni**：Vue3 项目使用的 UI 组件库
- **UnoCSS**：Vue3 项目使用的原子化 CSS 框架
- **Alova**：Vue3 项目使用的请求库
- **useRequest**：Alova 提供的请求状态管理 Hook
- **definePage**：uni-app Vue3 项目的页面配置宏
- **FormSectionTitle**：项目公共组件，用于表单分区标题
- **TypedRouter**：项目强类型路由跳转工具类
- **Carbon Icons**：项目使用的图标集（通过 UnoCSS + Iconify）
- **wd-picker**：wot-design-uni 的选择器组件，用于单选场景
- **wd-checkbox-group**：wot-design-uni 的复选框组组件，用于多选场景
- **wd-message-box**：wot-design-uni 的消息弹框组件，用于确认/提示/输入交互
- **wd-status-tip**：wot-design-uni 的状态提示组件，用于空状态展示
- **z-paging-loading**：项目公共组件，用于 z-paging 的加载状态展示

## Requirements

### Requirement 1: 工作台页面创建

**User Story:** As a 物业员工, I want 访问工作台页面, so that 我可以快速进入各个业务功能模块。

#### Acceptance Criteria

1. WHEN 用户点击 TabBar 的工作台入口 THEN THE 系统 SHALL 导航到工作台页面并显示功能菜单
2. WHEN 工作台页面加载完成 THEN THE 系统 SHALL 显示按分类组织的功能入口网格
3. WHEN 用户点击任意功能入口 THEN THE 系统 SHALL 导航到对应的业务页面或显示功能开发中提示
4. WHEN 工作台页面渲染 THEN THE 系统 SHALL 使用 wot-design-uni 组件和 UnoCSS 样式
5. WHEN 工作台页面创建 THEN THE 系统 SHALL 添加 definePage 配置设置页面标题为"工作台"
6. WHEN 工作台页面跳转 THEN THE 系统 SHALL 使用 TypedRouter 强类型路由方法

### Requirement 2: 首页入口跳转功能完善

**User Story:** As a 物业员工, I want 点击首页的各个入口按钮, so that 我可以快速进入对应的业务页面。

#### Acceptance Criteria

1. WHEN 用户点击首页顶部的投诉待办入口 THEN THE 系统 SHALL 导航到投诉列表页面
2. WHEN 用户点击首页顶部的报修待办入口 THEN THE 系统 SHALL 导航到维修待办页面
3. WHEN 用户点击首页顶部的巡检打卡入口 THEN THE 系统 SHALL 导航到巡检任务列表页面
4. WHEN 用户点击首页顶部的设备保养入口 THEN THE 系统 SHALL 显示功能开发中提示（模块未迁移时）或导航到设备保养页面（模块已迁移时）
5. WHEN 用户点击工作待办区域的任意入口 THEN THE 系统 SHALL 导航到对应的待办页面或显示功能开发中提示
6. WHEN 用户点击工作单区域的任意入口 THEN THE 系统 SHALL 导航到对应的工作单页面或显示功能开发中提示
7. WHEN 首页入口跳转 THEN THE 系统 SHALL 使用 TypedRouter 强类型路由方法而非字符串拼接 URL

### Requirement 3: 设备保养模块迁移

**User Story:** As a 物业员工, I want 使用设备保养功能, so that 我可以管理和执行设备保养任务。

#### Acceptance Criteria

1. WHEN 用户访问设备保养列表页 THEN THE 系统 SHALL 显示设备保养任务列表，使用 z-paging 组件实现下拉刷新和上拉加载
2. WHEN 设备保养列表加载 THEN THE 系统 SHALL 在 z-paging 的 #loading 插槽中使用 z-paging-loading 组件显示加载状态
3. WHEN 设备保养列表为空 THEN THE 系统 SHALL 在 z-paging 的 #empty 插槽中使用 wd-status-tip 组件显示空状态
4. WHEN 用户点击开始保养按钮 THEN THE 系统 SHALL 导航到保养执行页面
5. WHEN 用户点击任务流转按钮 THEN THE 系统 SHALL 导航到保养任务流转页面
6. WHEN 用户在保养执行页面点击单项保养 THEN THE 系统 SHALL 导航到单项保养页面
7. WHEN 设备保养页面创建 THEN THE 系统 SHALL 添加 definePage 配置设置正确的页面标题

### Requirement 4: 工作单模块迁移

**User Story:** As a 物业员工, I want 使用工作单功能, so that 我可以发起、办理和查看工作单。

#### Acceptance Criteria

1. WHEN 用户访问发工作单页面 THEN THE 系统 SHALL 显示工作单创建表单，使用 wd-form 组件包裹所有表单项
2. WHEN 发工作单表单渲染 THEN THE 系统 SHALL 使用 FormSectionTitle 组件作为表单分区标题
3. WHEN 发工作单表单包含选择功能 THEN THE 系统 SHALL 使用 wd-picker 组件而非 wd-radio-group
4. WHEN 用户访问办工作单页面 THEN THE 系统 SHALL 显示待办工作单列表，使用 z-paging 组件实现分页
5. WHEN 用户访问抄送工作单页面 THEN THE 系统 SHALL 显示抄送给我的工作单列表
6. WHEN 用户点击工作单详情 THEN THE 系统 SHALL 导航到工作单详情页面
7. WHEN 用户在工作单详情页点击审核 THEN THE 系统 SHALL 导航到工作单审核页面
8. WHEN 工作单审核需要用户输入 THEN THE 系统 SHALL 使用 wd-message-box.prompt() 而非 wd-popup 实现输入弹框

### Requirement 5: 资源采购管理模块迁移

**User Story:** As a 物业员工, I want 使用资源采购管理功能, so that 我可以管理采购申请、物品领用和调拨。

#### Acceptance Criteria

1. WHEN 用户访问采购待办页面 THEN THE 系统 SHALL 显示待审批的采购申请列表，使用 z-paging 组件实现分页
2. WHEN 用户访问领用待办页面 THEN THE 系统 SHALL 显示待审批的物品领用申请列表
3. WHEN 用户访问调拨待办页面 THEN THE 系统 SHALL 显示待审批的调拨申请列表
4. WHEN 用户访问采购申请管理页面 THEN THE 系统 SHALL 显示采购申请列表，支持新增、修改、查看详情
5. WHEN 用户新增采购申请 THEN THE 系统 SHALL 显示采购申请表单，使用 wd-form 和 FormSectionTitle 组件
6. WHEN 用户访问物品领用管理页面 THEN THE 系统 SHALL 显示物品领用列表，支持新增、审批
7. WHEN 用户访问调拨管理页面 THEN THE 系统 SHALL 显示调拨列表，支持新增、查看详情
8. WHEN 用户访问我的物品页面 THEN THE 系统 SHALL 显示个人物品列表，支持退还、损耗、转赠操作

### Requirement 6: OA 工作流模块迁移

**User Story:** As a 物业员工, I want 使用 OA 工作流功能, so that 我可以发起和处理 OA 审批流程。

#### Acceptance Criteria

1. WHEN 用户访问 OA 流程页面 THEN THE 系统 SHALL 显示 OA 流程入口，包括起草、待办、已办
2. WHEN 用户访问流程待办页面 THEN THE 系统 SHALL 显示待处理的 OA 流程列表，使用 z-paging 组件实现分页
3. WHEN 用户点击待办流程 THEN THE 系统 SHALL 导航到流程处理页面
4. WHEN 用户在流程处理页面提交审核 THEN THE 系统 SHALL 完成审核并返回列表
5. WHEN OA 流程表单渲染 THEN THE 系统 SHALL 使用 wd-form 组件和 FormSectionTitle 组件

### Requirement 7: 装修管理模块迁移

**User Story:** As a 物业员工, I want 使用装修管理功能, so that 我可以管理业主的装修申请和跟踪记录。

#### Acceptance Criteria

1. WHEN 用户访问装修记录列表页 THEN THE 系统 SHALL 显示装修申请列表，使用 z-paging 组件实现分页
2. WHEN 用户点击装修记录 THEN THE 系统 SHALL 导航到装修详情页面
3. WHEN 装修详情页渲染 THEN THE 系统 SHALL 使用 FormSectionTitle 组件和色彩编码系统区分不同信息区域
4. WHEN 用户在装修详情页点击查看跟踪记录 THEN THE 系统 SHALL 导航到跟踪记录列表页面
5. WHEN 用户在跟踪记录列表页点击添加跟踪 THEN THE 系统 SHALL 导航到添加跟踪记录页面

### Requirement 8: 费用管理模块迁移

**User Story:** As a 物业员工, I want 使用费用管理功能, so that 我可以管理物业费用收取和催缴。

#### Acceptance Criteria

1. WHEN 用户访问收银台页面 THEN THE 系统 SHALL 显示费用收取界面
2. WHEN 用户点击费用详情 THEN THE 系统 SHALL 导航到费用详情页面
3. WHEN 用户访问催缴登记列表页 THEN THE 系统 SHALL 显示催缴登记列表，使用 z-paging 组件实现分页
4. WHEN 用户点击添加催缴 THEN THE 系统 SHALL 导航到添加催缴登记页面
5. WHEN 添加催缴表单渲染 THEN THE 系统 SHALL 使用 wd-form 组件和 FormSectionTitle 组件

### Requirement 9: 抄表管理模块迁移

**User Story:** As a 物业员工, I want 使用抄表管理功能, so that 我可以进行水电抄表和公摊抄表。

#### Acceptance Criteria

1. WHEN 用户访问水电抄表列表页 THEN THE 系统 SHALL 显示抄表任务列表，使用 z-paging 组件实现分页
2. WHEN 用户点击手工抄表 THEN THE 系统 SHALL 导航到手工抄表页面
3. WHEN 用户点击二维码抄表 THEN THE 系统 SHALL 导航到二维码抄表页面
4. WHEN 用户访问公摊抄表页面 THEN THE 系统 SHALL 显示公摊抄表列表，支持添加和审核读数
5. WHEN 抄表表单渲染 THEN THE 系统 SHALL 使用 wd-form 组件和 FormSectionTitle 组件

### Requirement 10: 业主管理模块迁移

**User Story:** As a 物业员工, I want 使用业主管理功能, so that 我可以管理业主信息。

#### Acceptance Criteria

1. WHEN 用户访问业主列表页 THEN THE 系统 SHALL 显示业主列表，使用 z-paging 组件实现分页和搜索
2. WHEN 用户点击新增业主 THEN THE 系统 SHALL 导航到新增业主页面
3. WHEN 用户点击编辑业主 THEN THE 系统 SHALL 导航到编辑业主页面
4. WHEN 业主表单渲染 THEN THE 系统 SHALL 使用 wd-form 组件和 FormSectionTitle 组件

### Requirement 11: 车辆管理模块迁移

**User Story:** As a 物业员工, I want 使用车辆管理功能, so that 我可以管理业主车辆和道闸。

#### Acceptance Criteria

1. WHEN 用户访问业主车辆页面 THEN THE 系统 SHALL 显示业主车辆列表，使用 z-paging 组件实现分页
2. WHEN 用户访问道闸管理页面 THEN THE 系统 SHALL 显示道闸列表，支持查看视频、手工进出场
3. WHEN 用户点击手工进场 THEN THE 系统 SHALL 导航到手工进场页面
4. WHEN 用户点击手工出场 THEN THE 系统 SHALL 导航到手工出场页面

### Requirement 12: 核销模块迁移

**User Story:** As a 物业员工, I want 使用核销功能, so that 我可以核销优惠券和预约。

#### Acceptance Criteria

1. WHEN 用户访问预约核销页面 THEN THE 系统 SHALL 显示预约核销界面
2. WHEN 用户访问核销优惠券页面 THEN THE 系统 SHALL 显示优惠券核销界面
3. WHEN 用户访问核销预约页面 THEN THE 系统 SHALL 显示预约核销界面

### Requirement 13: 报表统计模块迁移

**User Story:** As a 物业员工, I want 使用报表统计功能, so that 我可以查看各类数据报表。

#### Acceptance Criteria

1. WHEN 用户访问数据统计页面 THEN THE 系统 SHALL 显示数据统计概览
2. WHEN 用户访问缴费明细表页面 THEN THE 系统 SHALL 显示缴费明细列表，使用 z-paging 组件实现分页
3. WHEN 用户访问房屋费用明细页面 THEN THE 系统 SHALL 显示房屋费用明细列表
4. WHEN 用户访问费用汇总表页面 THEN THE 系统 SHALL 显示费用汇总数据
5. WHEN 用户访问开门记录页面 THEN THE 系统 SHALL 显示开门记录列表
6. WHEN 用户访问充电桩订单页面 THEN THE 系统 SHALL 显示充电桩订单列表

### Requirement 14: 访客/物品放行模块迁移

**User Story:** As a 物业员工, I want 使用访客和物品放行功能, so that 我可以管理访客登记和物品放行。

#### Acceptance Criteria

1. WHEN 用户访问访客待办页面 THEN THE 系统 SHALL 显示访客登记列表，使用 z-paging 组件实现分页
2. WHEN 用户点击访客详情 THEN THE 系统 SHALL 导航到访客详情页面
3. WHEN 用户访问物品放行页面 THEN THE 系统 SHALL 显示物品放行列表
4. WHEN 用户点击物品放行详情 THEN THE 系统 SHALL 导航到物品放行详情页面

### Requirement 15: 公告管理模块迁移

**User Story:** As a 物业员工, I want 使用公告管理功能, so that 我可以管理小区公告。

#### Acceptance Criteria

1. WHEN 用户访问公告列表页 THEN THE 系统 SHALL 显示公告列表，使用 z-paging 组件实现分页
2. WHEN 用户点击公告 THEN THE 系统 SHALL 导航到公告详情页面

### Requirement 16: 个人中心相关页面迁移

**User Story:** As a 物业员工, I want 使用个人中心功能, so that 我可以管理个人信息和切换小区。

#### Acceptance Criteria

1. WHEN 用户访问切换小区页面 THEN THE 系统 SHALL 显示可切换的小区列表
2. WHEN 用户选择小区 THEN THE 系统 SHALL 切换当前小区并返回首页
3. WHEN 用户访问修改密码页面 THEN THE 系统 SHALL 显示修改密码表单，使用 wd-form 组件
4. WHEN 用户提交新密码 THEN THE 系统 SHALL 验证并更新密码

### Requirement 17: Mock 接口实现

**User Story:** As a 开发者, I want 所有迁移的模块都有对应的 Mock 接口, so that 我可以在没有后端的情况下进行开发和测试。

#### Acceptance Criteria

1. WHEN 迁移任意业务模块 THEN THE 系统 SHALL 在 `src/api/mock` 目录下创建对应的 Mock 文件
2. WHEN Mock 接口被调用 THEN THE 系统 SHALL 返回符合 `ApiResponse<T>` 格式的响应数据
3. WHEN Mock 接口返回列表数据 THEN THE 系统 SHALL 返回符合 `PaginationResponse<T>` 格式的分页数据
4. WHEN Mock 文件被修改 THEN THE 系统 SHALL 通过重启开发服务器使更改生效
5. WHEN Mock 接口实现 THEN THE 系统 SHALL 使用 successResponse/errorResponse/mockLog 统一响应格式函数
6. WHEN Mock 接口实现 THEN THE 系统 SHALL 使用 ResultEnumMap 而非 ResultEnum 枚举

### Requirement 18: 路由配置与强类型路由

**User Story:** As a 开发者, I want 所有迁移的页面都有正确的路由配置和强类型路由支持, so that 我可以安全地进行页面跳转。

#### Acceptance Criteria

1. WHEN 迁移任意页面 THEN THE 系统 SHALL 在页面文件中添加 definePage 配置设置页面标题
2. WHEN 迁移任意页面 THEN THE 系统 SHALL 在 `src/types/routes.ts` 中添加路由类型定义
3. WHEN 迁移任意页面 THEN THE 系统 SHALL 在 `src/router/helpers.ts` 中添加 TypedRouter 跳转方法
4. WHEN 页面需要接收参数 THEN THE 系统 SHALL 在 `PageParams` 接口中定义参数类型
5. WHEN 页面跳转 THEN THE 系统 SHALL 使用 TypedRouter 方法而非 uni.navigateTo 字符串拼接

### Requirement 19: 代码迁移规范

**User Story:** As a 开发者, I want 所有迁移的代码都遵循 Vue3 + TypeScript 规范, so that 代码质量和可维护性得到保证。

#### Acceptance Criteria

1. WHEN 迁移任意页面 THEN THE 系统 SHALL 使用 `<script setup lang="ts">` 语法
2. WHEN 迁移任意页面 THEN THE 系统 SHALL 使用 ref/reactive 替代 data() 定义响应式数据
3. WHEN 迁移任意页面 THEN THE 系统 SHALL 使用 computed 替代 computed: {} 定义计算属性
4. WHEN 迁移任意页面 THEN THE 系统 SHALL 使用 onMounted/onReady 等 Composition API 生命周期钩子
5. WHEN 迁移任意页面 THEN THE 系统 SHALL 移除所有 this 引用
6. WHEN 迁移任意页面 THEN THE 系统 SHALL 为所有变量和函数添加 TypeScript 类型注解
7. WHEN 迁移任意页面 THEN THE 系统 SHALL 禁止使用 any 类型（除非必要）

### Requirement 20: 组件迁移规范

**User Story:** As a 开发者, I want 所有迁移的组件都使用 wot-design-uni 组件库, so that 界面风格统一且符合项目规范。

#### Acceptance Criteria

1. WHEN 迁移按钮组件 THEN THE 系统 SHALL 使用 wd-button 替代 cu-btn 类名
2. WHEN 迁移列表组件 THEN THE 系统 SHALL 使用 wd-cell-group 和 wd-cell 替代 cu-list 和 cu-item
3. WHEN 迁移图标 THEN THE 系统 SHALL 使用 wd-icon 组件配合 i-carbon-_ 类名替代 cuIcon-_ 字体图标
4. WHEN 迁移图片组件 THEN THE 系统 SHALL 使用 wd-img 替代 image 标签
5. WHEN 迁移空状态 THEN THE 系统 SHALL 使用 wd-status-tip 替代 no-data-page 组件
6. WHEN 迁移表单 THEN THE 系统 SHALL 使用 wd-form 包裹所有表单项
7. WHEN 迁移选择器 THEN THE 系统 SHALL 使用 wd-picker 替代 wd-radio-group（单选场景）
8. WHEN 迁移多选 THEN THE 系统 SHALL 使用 wd-checkbox-group 配合 wd-checkbox
9. WHEN 迁移弹框交互 THEN THE 系统 SHALL 优先使用 wd-message-box 而非 wd-popup（标准场景）

### Requirement 21: 样式迁移规范

**User Story:** As a 开发者, I want 所有迁移的样式都使用 UnoCSS 原子化 CSS, so that 样式文件体积减小且易于维护。

#### Acceptance Criteria

1. WHEN 迁移布局样式 THEN THE 系统 SHALL 使用 flex/grid 等 UnoCSS 原子类替代 cu-flex 等 ColorUI 类名
2. WHEN 迁移颜色样式 THEN THE 系统 SHALL 使用 text-colorui-_/bg-colorui-_ 主题色替代 text-_/bg-_ ColorUI 类名
3. WHEN 迁移间距样式 THEN THE 系统 SHALL 使用 m-*rpx/p-*rpx 等 UnoCSS 原子类替代 margin-_/padding-_ ColorUI 类名
4. WHEN 迁移圆角样式 THEN THE 系统 SHALL 使用 rounded-_rpx 等 UnoCSS 原子类替代 radius-_ ColorUI 类名
5. WHEN 迁移样式 THEN THE 系统 SHALL 禁止滥用 UnoCSS shortcuts 功能定义业务性质的样式类
6. WHEN 迁移样式 THEN THE 系统 SHALL 禁止使用 CSS 通配符选择器 \*（微信小程序不支持）

### Requirement 22: API 接口迁移规范

**User Story:** As a 开发者, I want 所有迁移的接口调用都使用 Alova + useRequest, so that 请求状态管理统一且类型安全。

#### Acceptance Criteria

1. WHEN 迁移接口调用 THEN THE 系统 SHALL 使用 useRequest Hook 管理请求状态
2. WHEN 使用 useRequest THEN THE 系统 SHALL 设置 immediate: false 禁止自动执行
3. WHEN 使用 useRequest THEN THE 系统 SHALL 使用链式回调写法（onSuccess/onError）而非 try/catch
4. WHEN 接口调用失败 THEN THE 系统 SHALL 依赖全局拦截器自动显示错误提示
5. WHEN 接口调用失败 THEN THE 系统 SHALL 在 onError 回调中仅记录日志和处理业务逻辑
6. WHEN 需要静默请求 THEN THE 系统 SHALL 使用 setMeta({ toast: false }) 禁用自动错误提示

### Requirement 23: z-paging 分页组件规范

**User Story:** As a 开发者, I want 所有分页列表都正确集成 z-paging 组件, so that 分页功能统一且用户体验良好。

#### Acceptance Criteria

1. WHEN 使用 z-paging THEN THE 系统 SHALL 在 @query 事件中调用 useRequest 的 send 方法
2. WHEN 使用 z-paging THEN THE 系统 SHALL 在 onSuccess 回调中调用 complete(list) 通知加载完成
3. WHEN 使用 z-paging THEN THE 系统 SHALL 在 onError 回调中调用 complete(false) 通知加载失败
4. WHEN 使用 z-paging THEN THE 系统 SHALL 在 #loading 插槽中使用 z-paging-loading 组件
5. WHEN 使用 z-paging THEN THE 系统 SHALL 在 #empty 插槽中使用 wd-status-tip 组件
6. WHEN 使用 z-paging THEN THE 系统 SHALL 禁止在 @query 回调中调用 reload/refresh 方法（会导致无限循环）
7. WHEN 使用 z-paging THEN THE 系统 SHALL 禁止重复配置全局已配置的 props（如 default-page-size）

### Requirement 24: 表单页面规范

**User Story:** As a 开发者, I want 所有表单页面都遵循 wd-form 规范, so that 表单结构统一且校验功能完善。

#### Acceptance Criteria

1. WHEN 创建表单页面 THEN THE 系统 SHALL 使用 wd-form 组件包裹所有表单项，设置 ref/model/rules 三个必需属性
2. WHEN 创建表单页面 THEN THE 系统 SHALL 使用 wd-cell-group 分组表单项，添加 border 属性
3. WHEN 创建表单页面 THEN THE 系统 SHALL 使用 FormSectionTitle 组件作为表单分区标题
4. WHEN 创建表单页面 THEN THE 系统 SHALL 定义统一的 LABEL_WIDTH 常量保持标签宽度一致
5. WHEN 创建表单页面 THEN THE 系统 SHALL 导入 FormRules 类型定义校验规则
6. WHEN 表单包含选择功能 THEN THE 系统 SHALL 使用 wd-picker 组件（单选）或 wd-checkbox-group（多选）
7. WHEN 使用 wd-picker 自定义插槽 THEN THE 系统 SHALL 确保 wd-picker 包裹 wd-cell（而非反过来）
8. WHEN 表单提交 THEN THE 系统 SHALL 调用 formRef.validate() 进行校验

### Requirement 25: 组件美化规范

**User Story:** As a 开发者, I want 所有迁移的组件都遵循美化设计规范, so that 界面美观且用户体验良好。

#### Acceptance Criteria

1. WHEN 使用图标 THEN THE 系统 SHALL 使用 wd-icon 组件配合 custom-class 属性设置 i-carbon-\* 图标类名
2. WHEN 图标与文本组合 THEN THE 系统 SHALL 确保图标和文本垂直居中对齐（使用 flex + items-center）
3. WHEN 创建详情页卡片 THEN THE 系统 SHALL 使用 FormSectionTitle 作为卡片头部，移除卡片 padding 添加 overflow-hidden
4. WHEN 创建详情页卡片 THEN THE 系统 SHALL 使用色彩编码系统区分不同信息区域（蓝色-核心信息、青色-流转记录、橙色-附件）
5. WHEN 使用选择器组件 THEN THE 系统 SHALL 确保组件嵌套顺序正确（wd-picker 在外层）
6. WHEN 使用弹框交互 THEN THE 系统 SHALL 优先使用 wd-message-box 而非 wd-popup（标准场景）

### Requirement 26: 动态页面标题规范

**User Story:** As a 开发者, I want 需要动态标题的页面都正确实现标题设置, so that 页面标题能根据业务状态正确显示。

#### Acceptance Criteria

1. WHEN 页面需要动态标题 THEN THE 系统 SHALL 使用 computed 计算属性生成标题
2. WHEN 页面需要动态标题 THEN THE 系统 SHALL 在 onReady 生命周期中调用 uni.setNavigationBarTitle
3. WHEN 页面需要动态标题 THEN THE 系统 SHALL 在 definePage 中保留静态标题作为后备
4. WHEN 页面标题依赖 URL 参数 THEN THE 系统 SHALL 在 onLoad 中获取参数后计算标题

### Requirement 27: 公共组件创建规范

**User Story:** As a 开发者, I want 新建的公共组件都遵循统一规范, so that 组件结构清晰且易于维护。

#### Acceptance Criteria

1. WHEN 创建公共组件 THEN THE 系统 SHALL 在 src/components/common 目录下创建独立文件夹
2. WHEN 创建公共组件 THEN THE 系统 SHALL 包含 index.vue、types.ts、index.md 三个必需文件
3. WHEN 创建公共组件 THEN THE 系统 SHALL 使用短横杠命名法命名文件夹
4. WHEN 创建公共组件 THEN THE 系统 SHALL 在 types.ts 中导出 Props 接口类型
5. WHEN 创建公共组件 THEN THE 系统 SHALL 在 index.vue 顶部添加 HTML 注释说明组件用途
6. WHEN 创建公共组件 THEN THE 系统 SHALL 在 index.md 中提供完整的使用文档
7. WHEN 创建公共组件 THEN THE 系统 SHALL 在 src/pages/test-use 目录下创建测试页面
