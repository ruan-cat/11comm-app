/**
 * 投诉模块 Mock 接口
 *
 * 基于 Vue2 项目的实际 API 结构
 * 旧代码：gitee-example/api/complaint/complaint.js
 */

import type {
  Complaint,
  ComplaintAppraise,
  ComplaintEvent,
} from '@/types/complaint'
import dayjs from 'dayjs'
import { ComplaintAppraiseState, ComplaintEventType, ComplaintTypeCode } from '@/types/complaint'

import {
  createPaginationResponse,
  defineUniAppMock,
  errorResponse,
  formatDateTime,
  generateChineseName,
  generateId,
  generatePhoneNumber,
  generateTimeRange,
  randomDelay,
  ResultEnumMap,
  successResponse,
} from './shared/utils'

/** ==================== 数据生成器 ==================== */

/**
 * 生成投诉内容
 * @example generateComplaintContext('809001')
 */
function generateComplaintContext(typeCd: string): string {
  const complaints = {
    [ComplaintTypeCode.COMPLAINT]: [
      '楼上邻居深夜装修噪音严重，影响正常休息，请尽快处理',
      '小区物业费收取不合理，且未提前通知业主',
      '电梯频繁故障，存在安全隐患，急需维修',
      '楼道垃圾未及时清理，异味严重，影响居住环境',
      '小区保安人员服务态度恶劣，需要加强管理',
      '停车位被外来车辆占用，物业不作为',
      '公共区域照明设施损坏多日未修复',
      '小区绿化带卫生差，杂草丛生，无人管理',
    ],
    [ComplaintTypeCode.SUGGESTION]: [
      '建议增加小区监控摄像头数量，提升安全防护',
      '希望优化小区停车管理制度，缓解停车难问题',
      '建议定期举办社区活动，增进邻里关系',
      '希望改善小区物业服务质量，提高业主满意度',
      '建议增加快递柜数量，方便业主取件',
      '希望加强小区巡逻频次，保障居民安全',
      '建议改造小区健身器材，增加适合老年人的设施',
    ],
  }
  const list = complaints[typeCd] || complaints[ComplaintTypeCode.COMPLAINT]
  return list[Math.floor(Math.random() * list.length)]
}

/**
 * 生成处理意见
 * @example generateHandleRemark()
 */
function generateHandleRemark(): string {
  const remarks = [
    '已安排相关人员处理，预计3个工作日内解决',
    '问题已记录，将在24小时内给予回复',
    '感谢您的反馈，我们会立即核实并处理',
    '已联系相关部门，正在积极协调解决',
    '此问题属于紧急情况，已加急处理',
    '经核实，问题属实，我们会尽快整改',
    '您反映的问题我们非常重视，已安排专人跟进',
  ]
  return remarks[Math.floor(Math.random() * remarks.length)]
}

/**
 * 生成投诉评价
 * @example generateAppraiseContext()
 */
function generateAppraiseContext(): string {
  const appraises = [
    '处理及时，态度很好，问题已经解决，非常满意',
    '物业响应速度快，服务态度好，值得表扬',
    '问题得到圆满解决，感谢物业的努力',
    '处理效率高，工作人员认真负责',
    '服务态度一般，但问题最终解决了',
    '处理速度比较慢，希望能改进',
  ]
  return appraises[Math.floor(Math.random() * appraises.length)]
}

/**
 * 生成回复内容
 * @example generateReplyContext()
 */
function generateReplyContext(): string {
  const replies = [
    '非常感谢您的理解和支持，我们会继续努力改进服务',
    '您的满意是我们最大的动力，感谢您的评价',
    '感谢您的宝贵意见，我们会不断优化服务流程',
    '非常抱歉给您带来不便，我们会加强管理',
    '您的建议我们已收到，将在今后工作中改进',
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}

/**
 * 生成单条投诉记录
 * @example createMockComplaint('001')
 */
function createMockComplaint(index: number): Complaint {
  const typeCd = Math.random() > 0.3 ? ComplaintTypeCode.COMPLAINT : ComplaintTypeCode.SUGGESTION
  const typeName = typeCd === ComplaintTypeCode.COMPLAINT ? '投诉' : '建议'
  const complaintId = `COMP_${index.toString().padStart(3, '0')}`
  const floorNum = `${Math.floor(Math.random() * 10 + 1)}`
  const unitNum = `${Math.floor(Math.random() * 4 + 1)}`
  const roomNum = `${Math.floor(Math.random() * 12 + 1)}0${Math.floor(Math.random() * 4 + 1)}`

  return {
    complaintId,
    communityId: 'COMM_001',
    storeId: 'STORE_001',
    userId: `USER_${Math.floor(Math.random() * 20 + 1)}`,
    typeCd,
    typeName,
    complaintName: generateChineseName(),
    tel: generatePhoneNumber(),
    roomId: `ROOM_${index}`,
    roomName: `${floorNum}号楼${unitNum}单元${roomNum}室`,
    floorNum,
    unitNum,
    roomNum,
    context: generateComplaintContext(typeCd),
    createTime: generateTimeRange(-30, 0),
    taskId: `TASK_${complaintId}`,
    photos: Math.random() > 0.6
      ? [
          {
            photoId: `PHOTO_${index}_1`,
            complaintId,
            url: `https://picsum.photos/400/300?random=${index}1`,
            photo: '',
          },
        ]
      : [],
  }
}

/**
 * 生成投诉事件记录
 * @example createMockComplaintEvent('COMP_001', 1)
 */
function createMockComplaintEvent(complaintId: string, index: number): ComplaintEvent {
  const eventTypes = [
    ComplaintEventType.CREATE,
    ComplaintEventType.HANDLE,
    ComplaintEventType.APPRAISE,
    ComplaintEventType.REPLY,
  ]
  const eventType = eventTypes[index % eventTypes.length]

  const eventTypeNames: Record<string, string> = {
    [ComplaintEventType.CREATE]: '创建',
    [ComplaintEventType.HANDLE]: '处理',
    [ComplaintEventType.APPRAISE]: '评价',
    [ComplaintEventType.REPLY]: '回复',
  }

  let remark = ''
  if (eventType === ComplaintEventType.HANDLE) {
    remark = generateHandleRemark()
  }
  else if (eventType === ComplaintEventType.APPRAISE) {
    remark = generateAppraiseContext()
  }
  else if (eventType === ComplaintEventType.REPLY) {
    remark = generateReplyContext()
  }

  return {
    eventId: `EVENT_${complaintId}_${index}`,
    complaintId,
    communityId: 'COMM_001',
    eventType,
    eventTypeName: eventTypeNames[eventType],
    createUserId: `USER_${Math.floor(Math.random() * 20 + 1)}`,
    createUserName: generateChineseName(),
    createTime: generateTimeRange(-20 + index, -15 + index),
    remark,
  }
}

/**
 * 生成投诉评价记录
 * @example createMockComplaintAppraise('COMP_001', 1)
 */
function createMockComplaintAppraise(complaintId: string, index: number): ComplaintAppraise {
  const state = Math.random() > 0.5 ? ComplaintAppraiseState.COMPLETED : ComplaintAppraiseState.WAITING
  const stateName = state === ComplaintAppraiseState.COMPLETED ? '已回复' : '待回复'

  return {
    appraiseId: `APPR_${complaintId}_${index}`,
    complaintId,
    communityId: 'COMM_001',
    context: generateAppraiseContext(),
    score: Math.floor(Math.random() * 2) + 4, // 4-5 分
    state,
    stateName,
    replyContext: state === ComplaintAppraiseState.COMPLETED ? generateReplyContext() : undefined,
    createTime: generateTimeRange(-10, 0),
    createUserName: generateChineseName(),
  }
}

/** ==================== Mock 数据库 ==================== */

const mockComplaintDatabase = {
  /** 投诉数据 */
  complaints: Array.from({ length: 40 }, (_, index) => createMockComplaint(index + 1)),

  /** 投诉事件数据 */
  events: [] as ComplaintEvent[],

  /** 投诉评价数据 */
  appraises: [] as ComplaintAppraise[],

  /** 初始化事件和评价数据 */
  init() {
    this.complaints.slice(0, 15).forEach((complaint, index) => {
      // 为每个投诉生成 2-4 个事件
      const eventCount = Math.floor(Math.random() * 3) + 2
      for (let i = 0; i < eventCount; i++) {
        this.events.push(createMockComplaintEvent(complaint.complaintId, i))
      }

      // 30% 的投诉有评价
      if (Math.random() > 0.7) {
        this.appraises.push(createMockComplaintAppraise(complaint.complaintId, index))
      }
    })
  },

  /** 根据ID获取投诉 */
  getComplaintById(complaintId: string): Complaint | undefined {
    return this.complaints.find(c => c.complaintId === complaintId)
  },

  /** 添加投诉 */
  addComplaint(complaint: Complaint) {
    this.complaints.unshift(complaint)
    // 自动创建一个创建事件
    this.events.push({
      eventId: `EVENT_${complaint.complaintId}_0`,
      complaintId: complaint.complaintId,
      communityId: complaint.communityId,
      eventType: ComplaintEventType.CREATE,
      eventTypeName: '创建',
      createUserId: complaint.userId,
      createUserName: complaint.complaintName,
      createTime: complaint.createTime,
      remark: complaint.context,
    })
  },

  /** 添加投诉事件 */
  addEvent(event: ComplaintEvent) {
    this.events.push(event)
  },

  /** 添加投诉评价回复 */
  replyAppraise(appraiseId: string, replyContext: string) {
    const appraise = this.appraises.find(a => a.appraiseId === appraiseId)
    if (appraise) {
      appraise.state = ComplaintAppraiseState.COMPLETED
      appraise.stateName = '已回复'
      appraise.replyContext = replyContext
    }
  },
}

// 初始化数据
mockComplaintDatabase.init()

/** ==================== Mock 接口定义 ==================== */

export default defineUniAppMock([
  /** 1. 查询待办投诉列表 */
  {
    url: '/app/auditUser.listAuditComplaints',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await randomDelay(300, 800)

      const params = { ...query, ...body }

      try {
        const page = Number(params.page) || 1
        const row = Number(params.row) || 15

        // 筛选出待办投诉（模拟有 taskId 的为待办）
        const filtered = mockComplaintDatabase.complaints.filter(c => c.taskId)

        // 按创建时间倒序
        const sorted = filtered.sort((a, b) =>
          dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf(),
        )

        const result = createPaginationResponse(sorted, page, row)

        console.log('🚀 Mock API: listAuditComplaints', params, '→', `${result.list.length} items`)
        return successResponse(
          {
            data: result.list,
            total: result.total,
            page: result.page,
            records: result.pageSize,
          },
          '获取待办投诉列表成功',
        )
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listAuditComplaints', error)
        return errorResponse(error.message || '获取待办投诉列表失败')
      }
    },
  },

  /** 2. 查询已办投诉列表 / 用户投诉历史 */
  {
    url: '/app/auditUser.listAuditHistoryComplaints',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await randomDelay(300, 800)

      const params = { ...query, ...body }

      try {
        const page = Number(params.page) || 1
        const row = Number(params.row) || 15

        let filtered = mockComplaintDatabase.complaints

        // 如果有 process 参数，筛选进行中的
        if (params.process === 'START') {
          filtered = filtered.filter(c => c.taskId)
        }

        // 按创建时间倒序
        const sorted = filtered.sort((a, b) =>
          dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf(),
        )

        const result = createPaginationResponse(sorted, page, row)

        // 格式化时间为 MM-DD 格式
        const formattedList = result.list.map((item) => {
          const date = dayjs(item.createTime)
          return {
            ...item,
            createTime: `${date.month() + 1}-${date.date()}`,
          }
        })

        console.log('🚀 Mock API: listAuditHistoryComplaints', params, '→', `${formattedList.length} items`)
        return successResponse(
          {
            complaints: formattedList,
            total: result.total,
            page: result.page,
            records: result.pageSize,
          },
          '获取投诉历史成功',
        )
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listAuditHistoryComplaints', error)
        return errorResponse(error.message || '获取投诉历史失败')
      }
    },
  },

  /** 3. 保存投诉 */
  {
    url: '/app/complaint',
    method: 'POST',
    delay: [600, 1200],
    body: async ({ body }) => {
      await randomDelay(600, 1200)

      try {
        // 数据验证
        if (!body.typeCd?.trim()) {
          return errorResponse('请选择投诉类型', ResultEnumMap.Error)
        }
        if (!body.complaintName?.trim()) {
          return errorResponse('请填写投诉人', ResultEnumMap.Error)
        }
        if (!body.tel?.trim()) {
          return errorResponse('请填写手机号', ResultEnumMap.Error)
        }
        if (!body.context?.trim()) {
          return errorResponse('请填写投诉内容', ResultEnumMap.Error)
        }
        if (!body.roomId?.trim()) {
          return errorResponse('请选择房屋信息', ResultEnumMap.Error)
        }

        const newComplaint: Complaint = {
          complaintId: generateId('COMP'),
          communityId: body.communityId || 'COMM_001',
          storeId: body.storeId || 'STORE_001',
          userId: body.userId || 'USER_001',
          typeCd: body.typeCd,
          typeName: body.typeCd === ComplaintTypeCode.COMPLAINT ? '投诉' : '建议',
          complaintName: body.complaintName,
          tel: body.tel,
          roomId: body.roomId,
          roomName: `房间-${body.roomId}`,
          context: body.context,
          createTime: formatDateTime(),
          taskId: generateId('TASK'),
          photos: (body.photos || []).map((p: any, index: number) => ({
            photoId: generateId('PHOTO'),
            complaintId: '',
            photo: p.photo,
            url: '',
          })),
        }

        mockComplaintDatabase.addComplaint(newComplaint)

        console.log('🚀 Mock API: saveComplaint', body, '→', newComplaint)
        return successResponse(
          {
            complaint: newComplaint,
          },
          '投诉提交成功',
        )
      }
      catch (error: any) {
        console.error('❌ Mock API Error: saveComplaint', error)
        return errorResponse(error.message || '投诉提交失败')
      }
    },
  },

  /** 4. 处理/审核投诉 */
  {
    url: '/app/complaint.auditComplaint',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)

      try {
        if (!body.complaintId) {
          return errorResponse('投诉ID不能为空', ResultEnumMap.Error)
        }
        if (!body.context && !body.remark) {
          return errorResponse('请填写处理意见', ResultEnumMap.Error)
        }

        const complaint = mockComplaintDatabase.getComplaintById(body.complaintId)
        if (!complaint) {
          return errorResponse('投诉记录不存在', ResultEnumMap.NotFound)
        }

        // 添加处理事件
        const handleEvent: ComplaintEvent = {
          eventId: generateId('EVENT'),
          complaintId: body.complaintId,
          communityId: body.communityId || complaint.communityId,
          eventType: ComplaintEventType.HANDLE,
          eventTypeName: '处理',
          createUserId: body.userId || 'USER_STAFF',
          createUserName: '物业工作人员',
          createTime: formatDateTime(),
          remark: body.context || body.remark,
        }
        mockComplaintDatabase.addEvent(handleEvent)

        console.log('🚀 Mock API: auditComplaint', body, '→', 'success')
        return successResponse(
          {
            success: true,
          },
          '投诉处理成功',
        )
      }
      catch (error: any) {
        console.error('❌ Mock API Error: auditComplaint', error)
        return errorResponse(error.message || '投诉处理失败')
      }
    },
  },

  /** 5. 查询投诉事件/流转记录 */
  {
    url: '/app/complaint.listComplaintEvent',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      const params = { ...query, ...body }

      try {
        if (!params.complaintId) {
          return errorResponse('投诉ID不能为空', ResultEnumMap.Error)
        }

        const page = Number(params.page) || 1
        const row = Number(params.row) || 100

        // 筛选该投诉的事件
        const filtered = mockComplaintDatabase.events.filter(e => e.complaintId === params.complaintId)

        // 按时间正序（最早的在前面）
        const sorted = filtered.sort((a, b) =>
          dayjs(a.createTime).valueOf() - dayjs(b.createTime).valueOf(),
        )

        const result = createPaginationResponse(sorted, page, row)

        console.log('🚀 Mock API: listComplaintEvent', params, '→', `${result.list.length} items`)
        return successResponse(
          {
            list: result.list,
            total: result.total,
          },
          '获取投诉事件成功',
        )
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listComplaintEvent', error)
        return errorResponse(error.message || '获取投诉事件失败')
      }
    },
  },

  /** 6. 查询投诉评价列表 */
  {
    url: '/app/complaintAppraise.listComplaintAppraise',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      const params = { ...query, ...body }

      try {
        if (!params.complaintId) {
          return errorResponse('投诉ID不能为空', ResultEnumMap.Error)
        }

        const page = Number(params.page) || 1
        const row = Number(params.row) || 100

        // 筛选该投诉的评价
        const filtered = mockComplaintDatabase.appraises.filter(a => a.complaintId === params.complaintId)

        const result = createPaginationResponse(filtered, page, row)

        console.log('🚀 Mock API: listComplaintAppraise', params, '→', `${result.list.length} items`)
        return successResponse(
          {
            list: result.list,
            total: result.total,
          },
          '获取投诉评价成功',
        )
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listComplaintAppraise', error)
        return errorResponse(error.message || '获取投诉评价失败')
      }
    },
  },

  /** 7. 回复投诉评价 */
  {
    url: '/app/complaintAppraise.replyComplaintAppraise',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)

      try {
        if (!body.appraiseId) {
          return errorResponse('评价ID不能为空', ResultEnumMap.Error)
        }
        if (!body.replyContext?.trim()) {
          return errorResponse('请填写回复内容', ResultEnumMap.Error)
        }

        mockComplaintDatabase.replyAppraise(body.appraiseId, body.replyContext)

        console.log('🚀 Mock API: replyComplaintAppraise', body, '→', 'success')
        return successResponse(
          {
            success: true,
          },
          '回复评价成功',
        )
      }
      catch (error: any) {
        console.error('❌ Mock API Error: replyComplaintAppraise', error)
        return errorResponse(error.message || '回复评价失败')
      }
    },
  },
])
