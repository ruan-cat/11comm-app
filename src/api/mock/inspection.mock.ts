/**
 * 巡检模块 Mock 接口
 * 包含：内联数据 + 数据库对象 + 接口定义
 */

import type {
  InspectionItemTitle,
  InspectionSubmitParams,
  InspectionTask,
  InspectionTaskDetail,
  InspectionTodayReport,
  InspectionTransferParams,
} from '@/types/inspection'
import dayjs from 'dayjs'
import {
  INSPECTION_SIGN_TYPES,
  INSPECTION_STATES,
  INSPECTION_TITLE_TYPES,
} from '../../constants/inspection'
import {
  createPaginationResponse,
  defineUniAppMock,
  errorResponse,
  formatDateTime,
  generateChineseName,
  generateId,
  mockLog,
  randomDelay,
  ResultEnumMap,
  successResponse,
} from './shared/utils'

// ==================== 内联数据存储 ====================

/** 巡检计划名称库 */
const INSPECTION_PLAN_NAMES = [
  '小区日常巡检',
  '消防设施检查',
  '电梯运行检查',
  '公共区域巡查',
  '绿化环境检查',
  '安防设备巡检',
  '车库安全巡查',
  '垃圾分类检查',
  '水电设施巡检',
  '楼道安全检查',
]

/** 巡检项名称库 */
const INSPECTION_ITEM_NAMES = [
  '大门岗亭检查',
  '消防通道检查',
  '电梯运行检查',
  '监控设备检查',
  '路灯照明检查',
  '绿化养护检查',
  '垃圾清运检查',
  '停车秩序检查',
  '水电设施检查',
  '公共设施检查',
]

/** 巡检项标题库 */
const INSPECTION_TITLE_LIBRARY = {
  radio: [
    { title: '设施状态', values: ['完好', '损坏', '需维修'] },
    { title: '卫生情况', values: ['良好', '一般', '较差'] },
    { title: '安全状况', values: ['安全', '存在隐患', '危险'] },
  ],
  checkbox: [
    { title: '存在问题', values: ['设备异常', '卫生问题', '安全隐患', '其他问题'] },
    { title: '需要改进', values: ['增加设施', '加强管理', '定期维护', '人员培训'] },
  ],
  text: [
    { title: '详细说明', placeholder: '请详细描述巡检情况' },
    { title: '整改建议', placeholder: '请填写整改建议' },
    { title: '备注信息', placeholder: '其他需要说明的内容' },
  ],
}

// ==================== Mock 数据生成器 ====================

/** 生成巡检任务 */
function generateInspectionTask(index: number): InspectionTask {
  const statusItem = INSPECTION_STATES[Math.floor(Math.random() * INSPECTION_STATES.length)]
  const signTypeItem = INSPECTION_SIGN_TYPES[Math.floor(Math.random() * INSPECTION_SIGN_TYPES.length)]
  const planName = INSPECTION_PLAN_NAMES[Math.floor(Math.random() * INSPECTION_PLAN_NAMES.length)]
  const now = dayjs()
  const planTime = now.add(Math.floor(Math.random() * 7) - 3, 'day').hour(9 + Math.floor(Math.random() * 9))

  return {
    taskId: `TASK_${String(index).padStart(3, '0')}`,
    inspectionPlanId: `PLAN_${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
    inspectionPlanName: planName,
    planUserName: generateChineseName(),
    planInsTime: formatDateTime(planTime),
    signTypeName: signTypeItem.label,
    stateName: statusItem.label,
    state: statusItem.value,
  }
}

/** 生成巡检任务详情 */
function generateInspectionTaskDetail(taskId: string, index: number): InspectionTaskDetail {
  // 只使用待开始、进行中、已完成三种状态
  const states = INSPECTION_STATES.slice(0, 3)
  const statusItem = states[Math.floor(Math.random() * states.length)]
  const itemName = INSPECTION_ITEM_NAMES[Math.floor(Math.random() * INSPECTION_ITEM_NAMES.length)]
  const startHour = 9 + Math.floor(Math.random() * 8)
  const pointStartTime = `${String(startHour).padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
  const pointEndTime = `${String(startHour + 1).padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`

  const detail: InspectionTaskDetail = {
    taskDetailId: `DETAIL_${String(index).padStart(3, '0')}`,
    taskId,
    inspectionId: `INSP_${String(index).padStart(3, '0')}`,
    inspectionName: itemName,
    itemId: `ITEM_${String(index).padStart(3, '0')}`,
    state: statusItem.value,
    stateName: statusItem.label,
    pointStartTime,
    pointEndTime,
  }

  // 已完成的巡检项添加处理意见和照片
  if (statusItem.value === '20200407') {
    detail.description = '巡检情况: 正常; 备注: 无异常'
    detail.photos = [
      { url: `https://picsum.photos/400/300?random=${index}_1`, fileId: `FILE_${index}_1` },
      { url: `https://picsum.photos/400/300?random=${index}_2`, fileId: `FILE_${index}_2` },
    ]
  }

  return detail
}

/** 生成今日巡检统计 */
function generateTodayReport(index: number): InspectionTodayReport {
  return {
    staffId: `STAFF_${String(index).padStart(3, '0')}`,
    staffName: generateChineseName(),
    finishCount: Math.floor(Math.random() * 10),
    waitCount: Math.floor(Math.random() * 5),
  }
}

/** 生成巡检项标题 */
function generateInspectionItemTitle(index: number, type: 'radio' | 'checkbox' | 'text'): InspectionItemTitle {
  const titleId = `TITLE_${type.toUpperCase()}_${String(index).padStart(3, '0')}`
  const titleTypeItem = INSPECTION_TITLE_TYPES.find(t => t.label === (type === 'radio' ? '单选' : type === 'checkbox' ? '多选' : '文本'))!

  if (type === 'radio') {
    const item = INSPECTION_TITLE_LIBRARY.radio[Math.floor(Math.random() * INSPECTION_TITLE_LIBRARY.radio.length)]
    return {
      titleId,
      itemTitle: item.title,
      titleType: titleTypeItem.value,
      radio: '',
      inspectionItemTitleValueDtos: item.values.map(v => ({ itemValue: v })),
    }
  }

  if (type === 'checkbox') {
    const item = INSPECTION_TITLE_LIBRARY.checkbox[Math.floor(Math.random() * INSPECTION_TITLE_LIBRARY.checkbox.length)]
    return {
      titleId,
      itemTitle: item.title,
      titleType: titleTypeItem.value,
      radio: [],
      inspectionItemTitleValueDtos: item.values.map(v => ({ itemValue: v })),
    }
  }

  // text
  const item = INSPECTION_TITLE_LIBRARY.text[Math.floor(Math.random() * INSPECTION_TITLE_LIBRARY.text.length)]
  return {
    titleId,
    itemTitle: item.title,
    titleType: titleTypeItem.value,
    radio: '',
    inspectionItemTitleValueDtos: [],
  }
}

// ==================== Mock 数据库对象 ====================

class InspectionDatabase {
  /** 巡检任务列表 */
  private tasks: InspectionTask[] = []

  /** 巡检任务详情列表 */
  private taskDetails: Map<string, InspectionTaskDetail[]> = new Map()

  /** 今日巡检统计列表 */
  private todayReports: InspectionTodayReport[] = []

  /** 巡检项标题列表 */
  private itemTitles: Map<string, InspectionItemTitle[]> = new Map()

  /** 员工列表 */
  private staffList: Array<{ userId: string, userName: string }> = []

  constructor() {
    this.initData()
  }

  /** 初始化数据 */
  private initData() {
    // 生成 20 个巡检任务
    this.tasks = Array.from({ length: 20 }, (_, i) => generateInspectionTask(i + 1))

    // 为每个任务生成详情
    this.tasks.forEach((task) => {
      const detailCount = Math.floor(Math.random() * 5) + 3 // 每个任务 3-7 个巡检项
      const details = Array.from({ length: detailCount }, (_, i) =>
        generateInspectionTaskDetail(task.taskId, i + 1))
      this.taskDetails.set(task.taskId, details)
    })

    // 生成 10 个员工的今日巡检统计
    this.todayReports = Array.from({ length: 10 }, (_, i) => generateTodayReport(i + 1))

    // 为每个巡检项生成标题（3-5 个标题）
    const itemIds = ['ITEM_001', 'ITEM_002', 'ITEM_003', 'ITEM_004', 'ITEM_005']
    itemIds.forEach((itemId) => {
      const titles: InspectionItemTitle[] = [
        generateInspectionItemTitle(1, 'radio'),
        generateInspectionItemTitle(2, 'checkbox'),
        generateInspectionItemTitle(3, 'text'),
      ]
      this.itemTitles.set(itemId, titles)
    })

    // 生成 20 个员工
    this.staffList = Array.from({ length: 20 }, (_, i) => ({
      userId: `USER_${String(i + 1).padStart(3, '0')}`,
      userName: generateChineseName(),
    }))
  }

  /** 查询巡检任务列表 */
  getTaskList(params: {
    page: number
    row: number
    moreState?: string
    isToday?: number
    canReexamine?: string
    planInsTime?: string
  }) {
    let filteredTasks = [...this.tasks]

    // 按状态过滤
    if (params.moreState) {
      const states = params.moreState.split(',')
      filteredTasks = filteredTasks.filter(task => states.includes(task.state))
    }

    // 过滤今日任务
    if (params.isToday === 1) {
      const today = dayjs().format('YYYY-MM-DD')
      filteredTasks = filteredTasks.filter(task => task.planInsTime.startsWith(today))
    }

    // 过滤可补检任务（待开始或待补检状态）
    if (params.canReexamine === '2000') {
      filteredTasks = filteredTasks.filter(task =>
        task.state === '20200405' || task.state === '20200408',
      )
    }

    // 按日期过滤
    if (params.planInsTime) {
      filteredTasks = filteredTasks.filter(task => task.planInsTime.startsWith(params.planInsTime!))
    }

    return createPaginationResponse(filteredTasks, params.page, params.row)
  }

  /** 查询今日巡检统计 */
  getTodayReport(params: { communityId?: string, queryTime?: string }) {
    mockLog('getTodayReport params', params)
    return this.todayReports
  }

  /** 查询巡检任务详情 */
  getTaskDetail(params: {
    communityId?: string
    taskId?: string
    planUserId?: string
    queryTime?: string
    inspectionId?: string
    state?: string
    qrCodeTime?: string
    page: number
    row: number
  }) {
    let details: InspectionTaskDetail[] = []

    // 按任务ID查询
    if (params.taskId) {
      details = this.taskDetails.get(params.taskId) || []
    }
    // 按员工ID查询（返回所有任务的详情）
    else if (params.planUserId) {
      this.taskDetails.forEach((taskDetails) => {
        details.push(...taskDetails)
      })
    }
    // 按巡检ID查询
    else if (params.inspectionId) {
      this.taskDetails.forEach((taskDetails) => {
        const found = taskDetails.filter(d => d.inspectionId === params.inspectionId)
        details.push(...found)
      })
    }
    else {
      // 返回所有详情
      this.taskDetails.forEach((taskDetails) => {
        details.push(...taskDetails)
      })
    }

    // 按状态过滤
    if (params.state) {
      details = details.filter(d => d.state === params.state)
    }

    // 按时间过滤（二维码扫描场景）
    if (params.qrCodeTime) {
      const [hour] = params.qrCodeTime.split(':')
      details = details.filter((d) => {
        if (!d.pointStartTime)
          return false
        const [startHour] = d.pointStartTime.split(':')
        return startHour === hour
      })
    }

    return createPaginationResponse(details, params.page, params.row)
  }

  /** 查询巡检项标题 */
  getItemTitles(params: { communityId?: string, itemId: string, page: number, row: number }) {
    const titles = this.itemTitles.get(params.itemId) || []
    return createPaginationResponse(titles, params.page, params.row)
  }

  /** 提交巡检结果 */
  submitInspection(data: InspectionSubmitParams) {
    mockLog('submitInspection data', data)

    // 找到对应的任务详情并更新状态
    const details = this.taskDetails.get(data.taskId)
    if (details) {
      const detail = details.find(d => d.taskDetailId === data.taskDetailId)
      if (detail) {
        // 更新为已完成状态
        const completedStatus = INSPECTION_STATES.find(s => s.value === '20200407')!
        detail.state = completedStatus.value
        detail.stateName = completedStatus.label
        detail.description = data.description
        detail.photos = data.photos.map((url, i) => ({
          url,
          fileId: generateId('FILE'),
        }))
      }
    }

    return true
  }

  /** 获取员工列表 */
  getStaffList(params: { communityId?: string }) {
    mockLog('getStaffList params', params)
    return this.staffList
  }

  /** 流转巡检任务 */
  transferTask(data: InspectionTransferParams) {
    mockLog('transferTask data', data)

    // 找到对应的任务并更新执行人
    const task = this.tasks.find(t => t.taskId === data.taskId)
    if (task) {
      task.planUserName = data.staffName
    }

    return true
  }
}

/** 创建数据库实例 */
const inspectionDB = new InspectionDatabase()

// ==================== Mock 接口定义 ====================

export default defineUniAppMock([
  /** 1. 查询巡检任务列表 */
  {
    url: '/app/inspection.listInspectionTasks',
    method: 'GET',
    response: async (req) => {
      await randomDelay()
      const params = req.query as any
      mockLog('getInspectionTaskList', params)

      const result = inspectionDB.getTaskList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        moreState: params.moreState,
        isToday: params.isToday ? Number(params.isToday) : undefined,
        canReexamine: params.canReexamine,
        planInsTime: params.planInsTime,
      })

      mockLog('getInspectionTaskList result', `${result.list.length} tasks`)
      return successResponse(result)
    },
  },

  /** 2. 查询今日巡检统计 */
  {
    url: '/app/inspection.getTodayReport',
    method: 'GET',
    response: async (req) => {
      await randomDelay()
      const params = req.query as any
      mockLog('getTodayReport', params)

      const data = inspectionDB.getTodayReport({
        communityId: params.communityId,
        queryTime: params.queryTime,
      })

      mockLog('getTodayReport result', `${data.length} staffs`)
      return successResponse(data)
    },
  },

  /** 3. 查询巡检任务详情 */
  {
    url: '/app/inspection.listInspectionTaskDetails',
    method: 'GET',
    response: async (req) => {
      await randomDelay()
      const params = req.query as any
      mockLog('getInspectionTaskDetail', params)

      const result = inspectionDB.getTaskDetail({
        communityId: params.communityId,
        taskId: params.taskId,
        planUserId: params.planUserId,
        queryTime: params.queryTime,
        inspectionId: params.inspectionId,
        state: params.state,
        qrCodeTime: params.qrCodeTime,
        page: Number(params.page) || 1,
        row: Number(params.row) || 100,
      })

      mockLog('getInspectionTaskDetail result', `${result.list.length} details`)
      return successResponse(result)
    },
  },

  /** 4. 查询巡检项标题 */
  {
    url: '/app/inspection.listInspectionItemTitles',
    method: 'GET',
    response: async (req) => {
      await randomDelay()
      const params = req.query as any
      mockLog('getInspectionItemTitles', params)

      const result = inspectionDB.getItemTitles({
        communityId: params.communityId,
        itemId: params.itemId,
        page: Number(params.page) || 1,
        row: Number(params.row) || 100,
      })

      mockLog('getInspectionItemTitles result', `${result.list.length} titles`)
      return successResponse(result)
    },
  },

  /** 5. 提交巡检结果 */
  {
    url: '/app/inspection.submitInspection',
    method: 'POST',
    response: async (req) => {
      await randomDelay()
      const data = req.body as InspectionSubmitParams
      mockLog('submitInspection', data)

      const success = inspectionDB.submitInspection(data)

      if (!success) {
        return errorResponse('提交失败', ResultEnumMap.Error)
      }

      mockLog('submitInspection result', 'success')
      return successResponse({ success: true }, '提交成功')
    },
  },

  /** 6. 查询员工列表 */
  {
    url: '/app/staff.listStaffs',
    method: 'GET',
    response: async (req) => {
      await randomDelay()
      const params = req.query as any
      mockLog('getStaffList', params)

      const data = inspectionDB.getStaffList({
        communityId: params.communityId,
      })

      mockLog('getStaffList result', `${data.length} staffs`)
      return successResponse(data)
    },
  },

  /** 7. 流转巡检任务 */
  {
    url: '/app/inspection.transferTask',
    method: 'POST',
    response: async (req) => {
      await randomDelay()
      const data = req.body as InspectionTransferParams
      mockLog('transferInspectionTask', data)

      const success = inspectionDB.transferTask(data)

      if (!success) {
        return errorResponse('流转失败', ResultEnumMap.Error)
      }

      mockLog('transferInspectionTask result', 'success')
      return successResponse({ success: true }, '流转成功')
    },
  },
])
