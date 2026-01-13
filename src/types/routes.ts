/**
 * 路由系统类型定义
 * 支持约定式路由和强类型推断
 */

/** 页面路由类型（完整版本，包含主包和分包） */
export type PageRoute
/** 主包页面 */
  = | '/pages/index/index'
    | '/pages/work/index'
    | '/pages/about/about'
    | '/pages/me/me'
    | '/pages/login/login'
    | '/pages/address/list'
    | '/pages/activity/index'
    | '/pages/activity/detail'
	/** 分包页面 */
	/** 维修管理模块 (10个页面) */
    | '/pages-sub/repair/order-list' // 维修工单池
    | '/pages-sub/repair/dispatch' // 维修待办单
    | '/pages-sub/repair/finish' // 维修已办
    | '/pages-sub/repair/order-detail' // 维修详情
    | '/pages-sub/repair/add-order' // 添加维修记录
    | '/pages-sub/repair/handle' // 订单处理
    | '/pages-sub/repair/select-resource' // 选择物品
    | '/pages-sub/repair/end-order' // 结束订单
    | '/pages-sub/repair/appraise' // 回访工单
    | '/pages-sub/repair/appraise-reply' // 回复评价
	/** 投诉管理模块 */
    | '/pages-sub/complaint/list'
    | '/pages-sub/complaint/detail'
    | '/pages-sub/complaint/handle'
	/** 巡检管理模块 (8个页面) */
    | '/pages-sub/inspection/task-list' // 巡检任务列表
    | '/pages-sub/inspection/execute' // 巡检过程页
    | '/pages-sub/inspection/execute-qrcode' // 二维码巡检
    | '/pages-sub/inspection/execute-single' // 执行单项巡检
    | '/pages-sub/inspection/reexamine' // 补检页
    | '/pages-sub/inspection/transfer' // 任务流转
    | '/pages-sub/inspection/staff-no-task' // 员工未巡检详情
    | '/pages-sub/inspection/today-report' // 今日巡检统计
    | '/pages-sub/property/apply-room'
    | '/pages-sub/property/apply-room-detail'
    | '/pages-sub/property/apply-room-record'
    | '/pages-sub/property/apply-room-record-handle'
    | '/pages-sub/property/apply-room-record-detail'
	/** 选择器模块 (3个页面) - 级联选择功能 */
    | '/pages-sub/selector/select-floor' // 选择楼栋 (无参数)
    | '/pages-sub/selector/select-unit' // 选择单元 (需要 floorId 参数)
    | '/pages-sub/selector/select-room' // 选择房屋 (需要 floorId 和 unitId 参数)
	/** 设备保养模块 (4个页面) */
    | '/pages-sub/maintenance/task-list' // 设备保养任务列表 ← gitee-example/pages/maintainance/maintainance.vue
    | '/pages-sub/maintenance/execute' // 保养执行页 ← gitee-example/pages/maintainance/excuteMaintainance.vue
    | '/pages-sub/maintenance/execute-single' // 单项保养页 ← gitee-example/pages/maintainance/excuteOneMaintainance.vue
    | '/pages-sub/maintenance/transfer' // 任务流转页 ← gitee-example/pages/maintainance/maintainanceTransfer.vue
	/** 工作单模块 (8个页面) */
    | '/pages-sub/work/task-list' // 工作任务列表 ← gitee-example/pages/work/workTask.vue
    | '/pages-sub/work/start-work' // 发工作单 ← gitee-example/pages/work/startWork.vue
    | '/pages-sub/work/do-work' // 办工作单 ← gitee-example/pages/work/doWork.vue
    | '/pages-sub/work/work-detail' // 工作单详情 ← gitee-example/pages/work/workDetail.vue
    | '/pages-sub/work/edit-work' // 编辑工作单 ← gitee-example/pages/work/editWrok.vue
    | '/pages-sub/work/copy-work' // 抄送工作单 ← gitee-example/pages/work/copyWork.vue
    | '/pages-sub/work/do-copy-work' // 处理抄送工作单 ← gitee-example/pages/work/doCopyWork.vue
    | '/pages-sub/work/audit-work' // 工作单审核 ← gitee-example/pages/work/doWorkAudit.vue

/** Tab页面路由类型 */
export type TabRoute = '/pages/index/index' | '/pages/work/index' | '/pages/address/list' | '/pages/me/me'

/** 页面参数类型映射（强类型约束） */
export interface PageParams {
  '/pages/index/index': {}
  '/pages/work/index': {}
  '/pages/about/about': {}
  '/pages/me/me': {}
  '/pages/login/login': {
    redirect?: string
  }
  '/pages/address/list': {}
  '/pages/activity/index': {
    currentCommunityId: string
  }
  '/pages/activity/detail': {
    activitiesId: string
    currentCommunityId: string
  }
  /** 维修管理模块参数 (10个页面) */
  '/pages-sub/repair/order-list': {
    statusCd?: string /** 工单状态代码（如 10001=待派单, 10002=已派单） */
    page?: number
    row?: number
    repairName?: string
  }
  '/pages-sub/repair/dispatch': {
    statusCd?: string /** 工单状态代码 */
    page?: number
    row?: number
    repairName?: string
  }
  '/pages-sub/repair/finish': {
    page?: number
    row?: number
  }
  '/pages-sub/repair/order-detail': {
    repairId: string
    storeId: string
  }
  '/pages-sub/repair/add-order': {
    communityId?: string
  }
  '/pages-sub/repair/handle': {
    /** 操作类型: DISPATCH-派单, TRANSFER-转单, BACK-退单, FINISH-办结 */
    action: 'DISPATCH' | 'TRANSFER' | 'BACK' | 'FINISH'
    repairId: string
    repairType: string
    preStaffId?: string
    preStaffName?: string
    repairObjType?: string
    publicArea?: string
    repairChannel?: string
  }
  '/pages-sub/repair/select-resource': {
    feeFlag: string
  }
  '/pages-sub/repair/end-order': {
    repairId: string
    communityId: string
  }
  '/pages-sub/repair/appraise': {
    repairId: string
    repairType: string
    repairChannel?: string
    publicArea?: string
    communityId: string
  }
  '/pages-sub/repair/appraise-reply': {
    ruId: string
    repairId: string
  }
  /** 投诉模块参数 */
  '/pages-sub/complaint/list': {
    status?: 'pending' | 'processing' | 'resolved'
  }
  '/pages-sub/complaint/detail': {
    complaintId: string
  }
  '/pages-sub/complaint/handle': {
    complaintId: string
  }
  /** 巡检模块参数 (8个页面) */
  '/pages-sub/inspection/task-list': {} // 巡检任务列表，无参数
  '/pages-sub/inspection/execute': {
    taskId: string
    inspectionPlanName?: string
  }
  '/pages-sub/inspection/execute-qrcode': {
    inspectionId: string
    inspectionName: string
    itemId: string
  }
  '/pages-sub/inspection/execute-single': {
    taskDetailId: string
    taskId: string
    inspectionId: string
    inspectionName: string
    itemId: string
    fromPage?: string // 来源页面标识
  }
  '/pages-sub/inspection/reexamine': {} // 补检页，无参数
  '/pages-sub/inspection/transfer': {
    task: string // JSON字符串，包含任务信息
  }
  '/pages-sub/inspection/staff-no-task': {
    staffId: string
    staffName: string
    queryTime: string
  }
  '/pages-sub/inspection/today-report': {} // 今日巡检统计，无参数
  /** 物业管理模块参数 */
  '/pages-sub/property/apply-room': {}
  '/pages-sub/property/apply-room-detail': {
    ardId: string
    communityId: string
  }
  '/pages-sub/property/apply-room-record': {
    ardId: string
    communityId: string
    roomId: string
    roomName: string
    state: string
    stateName: string
  }
  '/pages-sub/property/apply-room-record-handle': {
    ardId: string
    communityId: string
    roomId: string
    roomName: string
    state: string
    stateName: string
  }
  '/pages-sub/property/apply-room-record-detail': {
    ardrId: string
    applicationId: string
    roomId: string
    roomName: string
    communityId: string
    state: string
    stateName: string
  }
  /** 选择器模块参数 - 级联选择页面参数 */
  '/pages-sub/selector/select-floor': {} // 选择楼栋页面，无需参数
  '/pages-sub/selector/select-unit': {
    floorId: string // 楼栋ID，必填参数
  }
  '/pages-sub/selector/select-room': {
    floorId: string // 楼栋ID，必填参数
    unitId: string // 单元ID，必填参数
  }
  /** 设备保养模块参数 (4个页面) */
  '/pages-sub/maintenance/task-list': {
    status?: string // 状态筛选
  }
  '/pages-sub/maintenance/execute': {
    taskId: string // 任务ID
  }
  '/pages-sub/maintenance/execute-single': {
    taskDetailId: string // 详情ID
    taskId: string // 任务ID
    itemName: string // 保养项名称
  }
  '/pages-sub/maintenance/transfer': {
    taskId: string // 任务ID
  }
  /** 工作单模块参数 (8个页面) */
  '/pages-sub/work/task-list': {
    workId: string // 工作单ID
  }
  '/pages-sub/work/start-work': {} // 发工作单，无参数
  '/pages-sub/work/do-work': {} // 办工作单，无参数
  '/pages-sub/work/work-detail': {
    orderId: string // 工作单ID
  }
  '/pages-sub/work/edit-work': {
    orderId: string // 工作单ID
  }
  '/pages-sub/work/copy-work': {} // 抄送工作单，无参数
  '/pages-sub/work/do-copy-work': {
    copyId: string // 抄送ID
    workId?: string // 工作单ID
  }
  '/pages-sub/work/audit-work': {
    taskId: string // 任务ID
  }
}

/** 页面配置类型 */
export interface PageConfig {
  navigationBarTitleText?: string
  navigationBarBackgroundColor?: string
  navigationBarTextStyle?: 'black' | 'white'
  navigationStyle?: 'default' | 'custom'
  backgroundColor?: string
  backgroundTextStyle?: 'dark' | 'light'
  enablePullDownRefresh?: boolean
  onReachBottomDistance?: number
  backgroundColorTop?: string
  backgroundColorBottom?: string
  titlePenetrate?: 'YES' | 'NO'
  app?: {
    titleNView?: any
    subNVues?: any[]
  }
  h5?: {
    titleNView?: any
    pullToRefresh?: any
  }
  mp?: {
    navigationStyle?: 'default' | 'custom'
  }
}

/** 路由跳转选项 */
export interface NavigationOptions {
  animationType?:
    | 'pop-in'
    | 'fade-in'
    | 'slide-in-right'
    | 'slide-in-left'
    | 'slide-in-top'
    | 'slide-in-bottom'
    | 'none'
  animationDuration?: number
  success?: () => void
  fail?: (err: any) => void
  complete?: () => void
}

/** 路由守卫类型 */
export type RouteGuard = (to: string, from: string) => boolean | Promise<boolean>

/** 路由信息类型 */
export interface RouteInfo {
  path: string
  query: Record<string, string>
  params: Record<string, any>
}

/** 路由历史记录类型 */
export interface RouteHistory {
  path: string
  timestamp: number
  params?: Record<string, any>
}
