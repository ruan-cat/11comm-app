/**
 * 工作单模块 Mock 接口
 * 包含：内联数据 + 数据库对象 + 接口定义
 */

import type {
  AuditWorkOrderParams,
  CompleteWorkOrderParams,
  CreateWorkOrderParams,
  UpdateWorkOrderParams,
  WorkOrder,
  WorkOrderCopyUser,
  WorkOrderDetail,
  WorkOrderLog,
} from '@/types/work-order'
import dayjs from 'dayjs'
import {
  createPaginationResponse,
  defineUniAppMock,
  errorResponse,
  formatDateTime,
  generateBusinessId,
  generateChineseName,
  mockLog,
  randomDelay,
  ResultEnumMap,
  successResponse,
} from './shared/utils'

// ==================== 内联数据存储 ====================

/** 工作单状态配置 */
const WORK_ORDER_STATES = [
  { value: '10001', label: '待处理' },
  { value: '10002', label: '处理中' },
  { value: '10003', label: '已完成' },
  { value: '10004', label: '已驳回' },
]

/** 工作单类型配置 */
const WORK_ORDER_TYPES = [
  { value: '1', label: '日常工作' },
  { value: '2', label: '临时任务' },
  { value: '3', label: '周期任务' },
]

/** 工作单优先级配置 */
const WORK_ORDER_PRIORITIES = [
  { value: '1', label: '低' },
  { value: '2', label: '中' },
  { value: '3', label: '高' },
  { value: '4', label: '紧急' },
]

/** 工作单标题模板 */
const WORK_ORDER_TITLES = [
  '园区绿化修剪',
  '公共区域清洁',
  '设备巡检任务',
  '安全隐患排查',
  '消防设施检查',
  '停车场管理',
  '门禁系统维护',
  '监控设备检查',
  '电梯日常巡检',
  '水电设施检修',
]

/** 工作单内容模板 */
const WORK_ORDER_CONTENTS = [
  '对园区内的绿化带进行修剪和维护，包括草坪修剪、灌木修剪等',
  '对公共区域进行全面清洁，包括楼道、电梯间、大堂等',
  '对小区内各类设备进行日常巡检，确保设备正常运行',
  '排查小区内的安全隐患，及时处理发现的问题',
  '检查消防设施是否完好，确保消防通道畅通',
  '管理停车场秩序，处理违规停车问题',
  '维护门禁系统，确保门禁正常使用',
  '检查监控设备运行状态，确保监控覆盖无死角',
  '对电梯进行日常巡检，记录运行状态',
  '检修水电设施，处理漏水、断电等问题',
]

// ==================== Mock 数据生成器 ====================

/** 生成工作单 */
function generateWorkOrder(index: number, isCopyToMe: boolean = false): WorkOrder {
  const statusItem = WORK_ORDER_STATES[Math.floor(Math.random() * WORK_ORDER_STATES.length)]
  const typeItem = WORK_ORDER_TYPES[Math.floor(Math.random() * WORK_ORDER_TYPES.length)]
  const priorityItem = WORK_ORDER_PRIORITIES[Math.floor(Math.random() * WORK_ORDER_PRIORITIES.length)]
  const titleIndex = Math.floor(Math.random() * WORK_ORDER_TITLES.length)

  const now = dayjs()
  const createTime = now.subtract(Math.floor(Math.random() * 30), 'day')
  const planStartTime = createTime.add(Math.floor(Math.random() * 7), 'day')
  const planEndTime = planStartTime.add(Math.floor(Math.random() * 3) + 1, 'day')

  return {
    orderId: `WO_${String(index).padStart(3, '0')}`,
    orderNo: generateBusinessId('WO'),
    title: WORK_ORDER_TITLES[titleIndex],
    type: typeItem.value,
    typeName: typeItem.label,
    status: statusItem.value,
    statusName: statusItem.label,
    priority: priorityItem.value,
    priorityName: priorityItem.label,
    content: WORK_ORDER_CONTENTS[titleIndex],
    staffId: statusItem.value !== '10001' ? `STAFF_${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}` : undefined,
    staffName: statusItem.value !== '10001' ? generateChineseName() : undefined,
    creatorId: `ADMIN_${String(Math.floor(Math.random() * 5) + 1).padStart(3, '0')}`,
    creatorName: generateChineseName(),
    planStartTime: formatDateTime(planStartTime),
    planEndTime: formatDateTime(planEndTime),
    createTime: formatDateTime(createTime),
    communityId: 'COMM_001',
    communityName: '阳光花园小区',
    isCopyToMe,
  }
}

/** 生成工作单操作记录 */
function generateWorkOrderLog(orderId: string, index: number): WorkOrderLog {
  const operationTypes = [
    { type: 'create', name: '创建工作单' },
    { type: 'assign', name: '分配任务' },
    { type: 'start', name: '开始处理' },
    { type: 'complete', name: '完成任务' },
    { type: 'audit', name: '审核通过' },
  ]
  const opItem = operationTypes[index % operationTypes.length]

  return {
    logId: `LOG_${orderId}_${String(index).padStart(2, '0')}`,
    orderId,
    operationType: opItem.type,
    operationTypeName: opItem.name,
    operatorId: `STAFF_${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}`,
    operatorName: generateChineseName(),
    operationTime: formatDateTime(dayjs().subtract(index, 'day')),
    remark: index === 0 ? '新建工作单' : undefined,
  }
}

// ==================== Mock 数据库对象 ====================

class WorkOrderDatabase {
  /** 待办工作单列表 */
  private todoOrders: WorkOrder[] = []

  /** 抄送工作单列表 */
  private copyOrders: WorkOrder[] = []

  /** 工作单详情缓存 */
  private orderDetails: Map<string, WorkOrderDetail> = new Map()

  constructor() {
    this.initData()
  }

  /** 初始化数据 */
  private initData() {
    // 生成 20 个待办工作单
    this.todoOrders = Array.from({ length: 20 }, (_, i) => generateWorkOrder(i + 1, false))

    // 生成 10 个抄送工作单
    this.copyOrders = Array.from({ length: 10 }, (_, i) => generateWorkOrder(i + 100, true))

    // 为每个工作单生成详情
    const allOrders = [...this.todoOrders, ...this.copyOrders]
    allOrders.forEach((order) => {
      const logCount = Math.floor(Math.random() * 3) + 1
      const logs = Array.from({ length: logCount }, (_, i) => generateWorkOrderLog(order.orderId, i))

      const copyUserCount = Math.floor(Math.random() * 3)
      const copyUsers: WorkOrderCopyUser[] = Array.from({ length: copyUserCount }, (_, i) => ({
        userId: `USER_${String(i + 1).padStart(3, '0')}`,
        userName: generateChineseName(),
      }))

      const detail: WorkOrderDetail = {
        ...order,
        attachments: Math.random() > 0.5
          ? [`https://picsum.photos/400/300?random=${order.orderId}_1`]
          : undefined,
        copyUsers,
        operationLogs: logs,
      }
      this.orderDetails.set(order.orderId, detail)
    })
  }

  /** 查询待办工作单列表 */
  getTodoList(params: { page: number, row: number, communityId: string, status?: string, type?: string, keyword?: string }) {
    let filteredOrders = [...this.todoOrders]

    if (params.status) {
      filteredOrders = filteredOrders.filter(order => order.status === params.status)
    }

    if (params.type) {
      filteredOrders = filteredOrders.filter(order => order.type === params.type)
    }

    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredOrders = filteredOrders.filter(order =>
        order.title.toLowerCase().includes(keyword)
        || order.content.toLowerCase().includes(keyword),
      )
    }

    return createPaginationResponse(filteredOrders, params.page, params.row)
  }

  /** 查询抄送工作单列表 */
  getCopyList(params: { page: number, row: number, communityId: string, status?: string, keyword?: string }) {
    let filteredOrders = [...this.copyOrders]

    if (params.status) {
      filteredOrders = filteredOrders.filter(order => order.status === params.status)
    }

    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredOrders = filteredOrders.filter(order =>
        order.title.toLowerCase().includes(keyword)
        || order.content.toLowerCase().includes(keyword),
      )
    }

    return createPaginationResponse(filteredOrders, params.page, params.row)
  }

  /** 获取工作单详情 */
  getOrderDetail(orderId: string): WorkOrderDetail | undefined {
    return this.orderDetails.get(orderId)
  }

  /** 创建工作单 */
  createOrder(params: CreateWorkOrderParams): string {
    const newIndex = this.todoOrders.length + this.copyOrders.length + 1
    const typeItem = WORK_ORDER_TYPES.find(t => t.value === params.type) || WORK_ORDER_TYPES[0]
    const priorityItem = WORK_ORDER_PRIORITIES.find(p => p.value === params.priority) || WORK_ORDER_PRIORITIES[1]

    const newOrder: WorkOrder = {
      orderId: `WO_${String(newIndex).padStart(3, '0')}`,
      orderNo: generateBusinessId('WO'),
      title: params.title,
      type: params.type,
      typeName: typeItem.label,
      status: '10001',
      statusName: '待处理',
      priority: params.priority,
      priorityName: priorityItem.label,
      content: params.content,
      staffId: params.staffId,
      staffName: params.staffId ? generateChineseName() : undefined,
      creatorId: 'CURRENT_USER',
      creatorName: '当前用户',
      planStartTime: params.planStartTime,
      planEndTime: params.planEndTime,
      createTime: formatDateTime(),
      communityId: params.communityId,
      communityName: '阳光花园小区',
    }

    this.todoOrders.unshift(newOrder)

    const detail: WorkOrderDetail = {
      ...newOrder,
      attachments: params.attachments,
      copyUsers: params.copyUserIds?.map((id, i) => ({
        userId: id,
        userName: generateChineseName(),
      })),
      operationLogs: [generateWorkOrderLog(newOrder.orderId, 0)],
    }
    this.orderDetails.set(newOrder.orderId, detail)

    return newOrder.orderId
  }

  /** 更新工作单 */
  updateOrder(params: UpdateWorkOrderParams): boolean {
    const order = this.todoOrders.find(o => o.orderId === params.orderId)
    if (!order)
      return false

    if (params.title)
      order.title = params.title
    if (params.type) {
      order.type = params.type
      const typeItem = WORK_ORDER_TYPES.find(t => t.value === params.type)
      if (typeItem)
        order.typeName = typeItem.label
    }
    if (params.priority) {
      order.priority = params.priority
      const priorityItem = WORK_ORDER_PRIORITIES.find(p => p.value === params.priority)
      if (priorityItem)
        order.priorityName = priorityItem.label
    }
    if (params.content)
      order.content = params.content
    if (params.staffId) {
      order.staffId = params.staffId
      order.staffName = generateChineseName()
    }
    if (params.planStartTime)
      order.planStartTime = params.planStartTime
    if (params.planEndTime)
      order.planEndTime = params.planEndTime

    order.updateTime = formatDateTime()

    // 更新详情
    const detail = this.orderDetails.get(params.orderId)
    if (detail) {
      Object.assign(detail, order)
      if (params.attachments)
        detail.attachments = params.attachments
    }

    return true
  }

  /** 开始处理工作单 */
  startOrder(orderId: string): boolean {
    const order = this.todoOrders.find(o => o.orderId === orderId)
    if (order && order.status === '10001') {
      order.status = '10002'
      order.statusName = '处理中'
      order.actualStartTime = formatDateTime()
      order.updateTime = formatDateTime()

      const detail = this.orderDetails.get(orderId)
      if (detail) {
        Object.assign(detail, order)
        detail.operationLogs?.unshift({
          logId: `LOG_${orderId}_${Date.now()}`,
          orderId,
          operationType: 'start',
          operationTypeName: '开始处理',
          operatorId: 'CURRENT_USER',
          operatorName: '当前用户',
          operationTime: formatDateTime(),
        })
      }
      return true
    }
    return false
  }

  /** 完成工作单 */
  completeOrder(params: CompleteWorkOrderParams): boolean {
    const order = this.todoOrders.find(o => o.orderId === params.orderId)
    if (order && order.status === '10002') {
      order.status = '10003'
      order.statusName = '已完成'
      order.actualEndTime = formatDateTime()
      order.updateTime = formatDateTime()

      const detail = this.orderDetails.get(params.orderId)
      if (detail) {
        Object.assign(detail, order)
        detail.completeRemark = params.remark
        detail.completePhotos = params.photos
        detail.operationLogs?.unshift({
          logId: `LOG_${params.orderId}_${Date.now()}`,
          orderId: params.orderId,
          operationType: 'complete',
          operationTypeName: '完成任务',
          operatorId: 'CURRENT_USER',
          operatorName: '当前用户',
          operationTime: formatDateTime(),
          remark: params.remark,
        })
      }
      return true
    }
    return false
  }

  /** 审核工作单 */
  auditOrder(params: AuditWorkOrderParams): boolean {
    const order = this.todoOrders.find(o => o.orderId === params.orderId)
    if (order) {
      if (params.result === 'pass') {
        order.status = '10003'
        order.statusName = '已完成'
      }
      else {
        order.status = '10004'
        order.statusName = '已驳回'
      }
      order.updateTime = formatDateTime()

      const detail = this.orderDetails.get(params.orderId)
      if (detail) {
        Object.assign(detail, order)
        detail.operationLogs?.unshift({
          logId: `LOG_${params.orderId}_${Date.now()}`,
          orderId: params.orderId,
          operationType: 'audit',
          operationTypeName: params.result === 'pass' ? '审核通过' : '审核驳回',
          operatorId: 'CURRENT_USER',
          operatorName: '当前用户',
          operationTime: formatDateTime(),
          remark: params.opinion,
        })
      }
      return true
    }
    return false
  }

  /** 取消工作单 */
  cancelOrder(orderId: string, reason?: string): boolean {
    const order = this.todoOrders.find(o => o.orderId === orderId)
    if (order && (order.status === '10001' || order.status === '10002')) {
      order.status = '10005'
      order.statusName = '已取消'
      order.updateTime = formatDateTime()

      const detail = this.orderDetails.get(orderId)
      if (detail) {
        Object.assign(detail, order)
        detail.operationLogs?.unshift({
          logId: `LOG_${orderId}_${Date.now()}`,
          orderId,
          operationType: 'cancel',
          operationTypeName: '取消工作单',
          operatorId: 'CURRENT_USER',
          operatorName: '当前用户',
          operationTime: formatDateTime(),
          remark: reason,
        })
      }
      return true
    }
    return false
  }
}

/** 创建数据库实例 */
const workOrderDB = new WorkOrderDatabase()

// ==================== Mock 接口定义 ====================

export default defineUniAppMock([
  /** 1. 查询待办工作单列表 */
  {
    url: '/app/workorder/todo/list',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await randomDelay(300, 800)
      const params = { ...query, ...body }
      mockLog('getWorkOrderTodoList', params)

      const result = workOrderDB.getTodoList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: params.communityId || 'COMM_001',
        status: params.status,
        type: params.type,
        keyword: params.keyword,
      })

      mockLog('getWorkOrderTodoList result', `${result.list.length} orders`)
      return successResponse(result)
    },
  },

  /** 2. 查询抄送工作单列表 */
  {
    url: '/app/workorder/copy/list',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await randomDelay(300, 800)
      const params = { ...query, ...body }
      mockLog('getWorkOrderCopyList', params)

      const result = workOrderDB.getCopyList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: params.communityId || 'COMM_001',
        status: params.status,
        keyword: params.keyword,
      })

      mockLog('getWorkOrderCopyList result', `${result.list.length} orders`)
      return successResponse(result)
    },
  },

  /** 3. 获取工作单详情 */
  {
    url: '/app/workorder/detail',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)
      const params = { ...query, ...body }
      const orderId = params.orderId
      mockLog('getWorkOrderDetail', orderId)

      const order = workOrderDB.getOrderDetail(orderId)
      if (!order) {
        return errorResponse('工作单不存在', ResultEnumMap.NotFound)
      }

      return successResponse({ order })
    },
  },

  /** 4. 创建工作单 */
  {
    url: '/app/workorder/create',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)
      const params = body as CreateWorkOrderParams
      mockLog('createWorkOrder', params)

      const orderId = workOrderDB.createOrder(params)
      return successResponse({ orderId }, '创建成功')
    },
  },

  /** 5. 更新工作单 */
  {
    url: '/app/workorder/update',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)
      const params = body as UpdateWorkOrderParams
      mockLog('updateWorkOrder', params)

      const success = workOrderDB.updateOrder(params)
      if (!success) {
        return errorResponse('更新失败', ResultEnumMap.Error)
      }

      return successResponse({ success: true }, '更新成功')
    },
  },

  /** 6. 开始处理工作单 */
  {
    url: '/app/workorder/start',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)
      const { orderId } = body as { orderId: string }
      mockLog('startWorkOrder', orderId)

      const success = workOrderDB.startOrder(orderId)
      if (!success) {
        return errorResponse('开始处理失败', ResultEnumMap.Error)
      }

      return successResponse({ success: true }, '开始处理')
    },
  },

  /** 7. 完成工作单 */
  {
    url: '/app/workorder/complete',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)
      const params = body as CompleteWorkOrderParams
      mockLog('completeWorkOrder', params)

      const success = workOrderDB.completeOrder(params)
      if (!success) {
        return errorResponse('完成失败', ResultEnumMap.Error)
      }

      return successResponse({ success: true }, '完成成功')
    },
  },

  /** 8. 审核工作单 */
  {
    url: '/app/workorder/audit',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)
      const params = body as AuditWorkOrderParams
      mockLog('auditWorkOrder', params)

      const success = workOrderDB.auditOrder(params)
      if (!success) {
        return errorResponse('审核失败', ResultEnumMap.Error)
      }

      return successResponse({ success: true }, params.result === 'pass' ? '审核通过' : '已驳回')
    },
  },

  /** 9. 取消工作单 */
  {
    url: '/app/workorder/cancel',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)
      const { orderId, reason } = body as { orderId: string, reason?: string }
      mockLog('cancelWorkOrder', { orderId, reason })

      const success = workOrderDB.cancelOrder(orderId, reason)
      if (!success) {
        return errorResponse('取消失败', ResultEnumMap.Error)
      }

      return successResponse({ success: true }, '已取消')
    },
  },
])
