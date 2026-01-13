/**
 * 设备保养模块 Mock 接口
 * 包含：内联数据 + 数据库对象 + 接口定义
 */

import type {
  MaintenanceSingleSubmitParams,
  MaintenanceTask,
  MaintenanceTaskDetail,
  MaintenanceTransferParams,
} from '@/types/maintenance'
import dayjs from 'dayjs'
import {
  createPaginationResponse,
  defineUniAppMock,
  errorResponse,
  formatDateTime,
  generateChineseName,
  mockLog,
  randomDelay,
  ResultEnumMap,
  successResponse,
} from './shared/utils'

// ==================== 内联数据存储 ====================

/** 设备名称库 */
const MACHINE_NAMES = [
  '1号电梯',
  '2号电梯',
  '3号电梯',
  '消防水泵',
  '生活水泵',
  '配电房设备',
  '中央空调主机',
  '发电机组',
  '监控主机',
  '门禁系统',
  '车库道闸',
  '污水处理设备',
]

/** 保养项名称库 */
const MAINTENANCE_ITEM_NAMES = [
  '外观检查',
  '运行状态检查',
  '润滑保养',
  '清洁保养',
  '紧固件检查',
  '电气系统检查',
  '安全装置检查',
  '性能测试',
]

/** 保养项内容库 */
const MAINTENANCE_ITEM_CONTENTS = [
  '检查设备外观是否完好，有无损坏、锈蚀',
  '检查设备运行是否正常，有无异响、振动',
  '对运动部件进行润滑，更换润滑油',
  '清洁设备表面及内部灰尘、污垢',
  '检查各紧固件是否松动，必要时紧固',
  '检查电气线路、接头是否正常',
  '检查安全保护装置是否有效',
  '进行设备性能测试，记录测试数据',
]

/** 保养状态配置 */
const MAINTENANCE_STATES = [
  { value: '10001', label: '待保养' },
  { value: '10002', label: '保养中' },
  { value: '10003', label: '已完成' },
]

// ==================== Mock 数据生成器 ====================

/** 生成保养任务 */
function generateMaintenanceTask(index: number): MaintenanceTask {
  const statusItem = MAINTENANCE_STATES[Math.floor(Math.random() * MAINTENANCE_STATES.length)]
  const machineName = MACHINE_NAMES[Math.floor(Math.random() * MACHINE_NAMES.length)]
  const now = dayjs()
  const planTime = now.add(Math.floor(Math.random() * 14) - 7, 'day')

  return {
    taskId: `MT_${String(index).padStart(3, '0')}`,
    taskName: `${machineName}定期保养`,
    machineName,
    machineId: `MACHINE_${String(index).padStart(3, '0')}`,
    planTime: formatDateTime(planTime),
    status: statusItem.value as string,
    statusName: statusItem.label,
    staffId: statusItem.value !== '10001' ? `STAFF_${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}` : undefined,
    staffName: statusItem.value !== '10001' ? generateChineseName() : undefined,
    communityId: 'COMM_001',
  }
}

/** 生成保养任务详情项 */
function generateMaintenanceTaskDetail(taskId: string, index: number): MaintenanceTaskDetail {
  const itemName = MAINTENANCE_ITEM_NAMES[index % MAINTENANCE_ITEM_NAMES.length]
  const itemContent = MAINTENANCE_ITEM_CONTENTS[index % MAINTENANCE_ITEM_CONTENTS.length]

  return {
    taskDetailId: `MTD_${taskId}_${String(index).padStart(2, '0')}`,
    taskId,
    itemName,
    itemContent,
    result: Math.random() > 0.5 ? '正常' : undefined,
    remark: Math.random() > 0.7 ? '无异常' : undefined,
    photos: Math.random() > 0.6
      ? [
          `https://picsum.photos/400/300?random=${index}_1`,
          `https://picsum.photos/400/300?random=${index}_2`,
        ]
      : undefined,
  }
}

// ==================== Mock 数据库对象 ====================

class MaintenanceDatabase {
  /** 保养任务列表 */
  private tasks: MaintenanceTask[] = []

  /** 保养任务详情列表 */
  private taskDetails: Map<string, MaintenanceTaskDetail[]> = new Map()

  constructor() {
    this.initData()
  }

  /** 初始化数据 */
  private initData() {
    // 生成 15 个保养任务
    this.tasks = Array.from({ length: 15 }, (_, i) => generateMaintenanceTask(i + 1))

    // 为每个任务生成详情项
    this.tasks.forEach((task) => {
      const detailCount = Math.floor(Math.random() * 4) + 4 // 每个任务 4-7 个保养项
      const details = Array.from({ length: detailCount }, (_, i) =>
        generateMaintenanceTaskDetail(task.taskId, i + 1))
      this.taskDetails.set(task.taskId, details)
    })
  }

  /** 查询保养任务列表 */
  getTaskList(params: { page: number, row: number, communityId: string, status?: string }) {
    let filteredTasks = [...this.tasks]

    // 按状态过滤
    if (params.status) {
      filteredTasks = filteredTasks.filter(task => task.status === params.status)
    }

    // 按小区过滤
    if (params.communityId) {
      filteredTasks = filteredTasks.filter(task => task.communityId === params.communityId)
    }

    return createPaginationResponse(filteredTasks, params.page, params.row)
  }

  /** 获取任务详情 */
  getTaskDetail(taskId: string): MaintenanceTask | undefined {
    return this.tasks.find(t => t.taskId === taskId)
  }

  /** 获取任务详情项列表 */
  getTaskDetailItems(taskId: string): MaintenanceTaskDetail[] {
    return this.taskDetails.get(taskId) || []
  }

  /** 开始保养任务 */
  startTask(taskId: string): boolean {
    const task = this.tasks.find(t => t.taskId === taskId)
    if (task && task.status === '10001') {
      task.status = '10002'
      task.statusName = '保养中'
      task.staffId = 'STAFF_001'
      task.staffName = generateChineseName()
      return true
    }
    return false
  }

  /** 完成保养任务 */
  completeTask(taskId: string): boolean {
    const task = this.tasks.find(t => t.taskId === taskId)
    if (task && task.status === '10002') {
      task.status = '10003'
      task.statusName = '已完成'
      return true
    }
    return false
  }

  /** 提交单项保养 */
  submitSingle(params: MaintenanceSingleSubmitParams): boolean {
    const details = this.taskDetails.get(params.taskId)
    if (details) {
      const detail = details.find(d => d.taskDetailId === params.taskDetailId)
      if (detail) {
        detail.result = params.result
        detail.remark = params.remark
        detail.photos = params.photos
        return true
      }
    }
    return false
  }

  /** 任务流转 */
  transferTask(params: MaintenanceTransferParams): boolean {
    const task = this.tasks.find(t => t.taskId === params.taskId)
    if (task) {
      task.staffId = params.targetStaffId
      task.staffName = generateChineseName()
      return true
    }
    return false
  }
}

/** 创建数据库实例 */
const maintenanceDB = new MaintenanceDatabase()

// ==================== Mock 接口定义 ====================

export default defineUniAppMock([
  /** 1. 查询保养任务列表 */
  {
    url: '/app/maintenance.listMaintenanceTasks',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await randomDelay(300, 800)
      const params = { ...query, ...body }
      mockLog('getMaintenanceList', params)

      const result = maintenanceDB.getTaskList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: params.communityId || 'COMM_001',
        status: params.status,
      })

      mockLog('getMaintenanceList result', `${result.list.length} tasks`)
      return successResponse(result)
    },
  },

  /** 2. 获取任务详情 */
  {
    url: '/app/maintenance.queryMaintenanceTask',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)
      const params = { ...query, ...body }
      const taskId = params.taskId
      mockLog('getMaintenanceDetail', taskId)

      const task = maintenanceDB.getTaskDetail(taskId)
      if (!task) {
        return errorResponse('任务不存在', ResultEnumMap.NotFound)
      }

      return successResponse({ task })
    },
  },

  /** 3. 获取任务详情项列表 */
  {
    url: '/app/maintenance.listMaintenanceTaskDetails',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)
      const params = { ...query, ...body }
      const taskId = params.taskId
      mockLog('getMaintenanceDetailItems', taskId)

      const items = maintenanceDB.getTaskDetailItems(taskId)
      return successResponse({ items })
    },
  },

  /** 4. 开始保养任务 */
  {
    url: '/app/maintenance.startMaintenanceTask',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)
      const { taskId } = body as { taskId: string }
      mockLog('startMaintenanceTask', taskId)

      const success = maintenanceDB.startTask(taskId)
      if (!success) {
        return errorResponse('开始任务失败', ResultEnumMap.Error)
      }

      return successResponse({ success: true }, '开始保养成功')
    },
  },

  /** 5. 完成保养任务 */
  {
    url: '/app/maintenance.completeMaintenanceTask',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)
      const { taskId } = body as { taskId: string }
      mockLog('completeMaintenanceTask', taskId)

      const success = maintenanceDB.completeTask(taskId)
      if (!success) {
        return errorResponse('完成任务失败', ResultEnumMap.Error)
      }

      return successResponse({ success: true }, '保养完成')
    },
  },

  /** 6. 提交单项保养 */
  {
    url: '/app/maintenance.submitMaintenanceSingle',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)
      const params = body as MaintenanceSingleSubmitParams
      mockLog('submitMaintenanceSingle', params)

      const success = maintenanceDB.submitSingle(params)
      if (!success) {
        return errorResponse('提交失败', ResultEnumMap.Error)
      }

      return successResponse({ success: true }, '提交成功')
    },
  },

  /** 7. 任务流转 */
  {
    url: '/app/maintenance.transferMaintenanceTask',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)
      const params = body as MaintenanceTransferParams
      mockLog('transferMaintenanceTask', params)

      const success = maintenanceDB.transferTask(params)
      if (!success) {
        return errorResponse('流转失败', ResultEnumMap.Error)
      }

      return successResponse({ success: true }, '流转成功')
    },
  },
])
