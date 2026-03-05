/**
 * OA 工作流模块 Mock 接口
 */

import type {
  OaWorkflowAuditReq,
  OaWorkflowComment,
  OaWorkflowFlow,
  OaWorkflowFormDataRecord,
  OaWorkflowFormMeta,
  OaWorkflowFormSchema,
  OaWorkflowNextTask,
  OaWorkflowStateCode,
  SaveOaWorkflowFormDataReq,
  UpdateOaWorkflowFormDataReq,
} from '@/types/oa-workflow'
import dayjs from 'dayjs'
import {
  createPaginationResponse,
  defineUniAppMock,
  errorResponse,
  formatDateTime,
  generateChineseName,
  generateId,
  mockLog,
  ResultEnumMap,
  successResponse,
} from './shared/utils'

/** 状态名称映射 */
const WORKFLOW_STATE_NAME_MAP: Record<OaWorkflowStateCode, string> = {
  1001: '申请',
  1002: '待审核',
  1003: '退回',
  1004: '委托',
  1005: '办结',
}

/** 工作流定义 */
const workflowFlows: OaWorkflowFlow[] = [
  { flowId: 'FLOW_001', flowName: '请假申请', undoCount: 0, flowType: '1001' },
  { flowId: 'FLOW_002', flowName: '采购审批', undoCount: 0, flowType: '1001' },
  { flowId: 'FLOW_003', flowName: '用印申请', undoCount: 0, flowType: '1001' },
]

/** 表单模板 */
const formSchemaMap: Record<string, OaWorkflowFormSchema> = {
  FLOW_001: {
    components: [
      { type: 'text', text: '请假信息' },
      { type: 'textfield', key: 'applicantName', label: '申请人', description: '请输入申请人', validate: { required: true } },
      { type: 'textdate', key: 'startDate', label: '开始日期', value: '请选择', validate: { required: true } },
      { type: 'textdate', key: 'endDate', label: '结束日期', value: '请选择', validate: { required: true } },
      {
        type: 'radio',
        key: 'leaveType',
        label: '请假类型',
        valueIndex: 0,
        values: [
          { value: 'annual', label: '年假' },
          { value: 'sick', label: '病假' },
          { value: 'other', label: '其他' },
        ],
        validate: { required: true },
      },
      { type: 'textarea', key: 'reason', label: '请假原因', description: '请输入请假原因', validate: { required: true } },
      { type: 'button', label: '提交申请', action: 'submit' },
      { type: 'button', label: '重置', action: 'reset' },
    ],
  },
  FLOW_002: {
    components: [
      { type: 'text', text: '采购审批信息' },
      { type: 'textfield', key: 'applicantName', label: '申请人', description: '请输入申请人', validate: { required: true } },
      { type: 'textfield', key: 'itemName', label: '采购物品', description: '请输入采购物品', validate: { required: true } },
      { type: 'number', key: 'amount', label: '采购金额', description: '请输入采购金额', validate: { required: true } },
      {
        type: 'select',
        key: 'priority',
        label: '优先级',
        valueIndex: 0,
        values: [
          { value: 'normal', label: '普通' },
          { value: 'urgent', label: '紧急' },
        ],
      },
      { type: 'textarea', key: 'reason', label: '采购说明', description: '请输入采购说明', validate: { required: true } },
      { type: 'button', label: '提交申请', action: 'submit' },
      { type: 'button', label: '重置', action: 'reset' },
    ],
  },
  FLOW_003: {
    components: [
      { type: 'text', text: '用印申请信息' },
      { type: 'textfield', key: 'applicantName', label: '申请人', description: '请输入申请人', validate: { required: true } },
      { type: 'textfield', key: 'documentName', label: '文件名称', description: '请输入文件名称', validate: { required: true } },
      {
        type: 'checkbox',
        key: 'stampType',
        label: '印章类型',
        values: [{ value: '公章', label: '公章' }],
      },
      { type: 'textarea', key: 'reason', label: '用印说明', description: '请输入用印说明', validate: { required: true } },
      { type: 'button', label: '提交申请', action: 'submit' },
      { type: 'button', label: '重置', action: 'reset' },
    ],
  },
}

/** 初始化表单记录 */
const workflowRecords: OaWorkflowFormDataRecord[] = [
  {
    id: 'OA_001',
    flowId: 'FLOW_001',
    state: '1002',
    stateName: '待审核',
    createUserId: 'USER_001',
    createUserName: '张三',
    createTime: formatDateTime(dayjs().subtract(2, 'day')),
    taskId: 'TASK_001',
    startUserId: 'USER_001',
    business: 'oaWorkflow',
    files: [],
    formData: {
      applicantName: '张三',
      startDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      endDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
      leaveType: 'annual',
      reason: '外出办事',
    },
  },
  {
    id: 'OA_002',
    flowId: 'FLOW_002',
    state: '1005',
    stateName: '办结',
    createUserId: 'USER_002',
    createUserName: '李四',
    createTime: formatDateTime(dayjs().subtract(4, 'day')),
    taskId: 'TASK_002',
    startUserId: 'USER_002',
    business: 'purchaseApply',
    files: [
      {
        fileName: '采购清单.xlsx',
        realFileName: 'https://example.com/mock-files/purchase.xlsx',
      },
    ],
    formData: {
      applicantName: '李四',
      itemName: '打印机耗材',
      amount: '1200',
      priority: 'normal',
      reason: '本月办公耗材补充',
    },
  },
  {
    id: 'OA_003',
    flowId: 'FLOW_003',
    state: '1004',
    stateName: '委托',
    createUserId: 'USER_003',
    createUserName: '王五',
    createTime: formatDateTime(dayjs().subtract(1, 'day')),
    taskId: 'TASK_003',
    startUserId: 'USER_003',
    business: 'allocation',
    files: [],
    formData: {
      applicantName: '王五',
      documentName: '供应商合同',
      stampType: '公章',
      reason: '合同盖章走流程',
    },
  },
]

/** 流转记录缓存 */
const workflowCommentsMap: Record<string, OaWorkflowComment[]> = {
  OA_001: [
    {
      staffName: '流程发起人',
      startTime: formatDateTime(dayjs().subtract(2, 'day')),
      endTime: formatDateTime(dayjs().subtract(2, 'day').add(5, 'minute')),
      context: '提交申请',
    },
  ],
  OA_002: [
    {
      staffName: '流程发起人',
      startTime: formatDateTime(dayjs().subtract(4, 'day')),
      endTime: formatDateTime(dayjs().subtract(4, 'day').add(10, 'minute')),
      context: '提交申请',
    },
    {
      staffName: '部门主管',
      startTime: formatDateTime(dayjs().subtract(3, 'day')),
      endTime: formatDateTime(dayjs().subtract(3, 'day').add(15, 'minute')),
      context: '审核通过',
    },
  ],
  OA_003: [
    {
      staffName: '流程发起人',
      startTime: formatDateTime(dayjs().subtract(1, 'day')),
      endTime: formatDateTime(dayjs().subtract(1, 'day').add(20, 'minute')),
      context: '提交申请',
    },
    {
      staffName: '部门主管',
      startTime: formatDateTime(dayjs().subtract(12, 'hour')),
      endTime: formatDateTime(dayjs().subtract(12, 'hour').add(8, 'minute')),
      context: '转交处理',
    },
  ],
}

/** 计算流程待办数 */
function calcFlowUndoCount(flowId: string) {
  return workflowRecords.filter(record => record.flowId === flowId && (record.state === '1002' || record.state === '1004')).length
}

/** 获取流程定义 */
function getWorkflowFlows(_params: {
  page?: number
  row?: number
  state?: string
  flowType?: string
}) {
  const flowData = workflowFlows.map(flow => ({
    ...flow,
    undoCount: calcFlowUndoCount(flow.flowId),
  }))

  return successResponse({ data: flowData }, '查询成功')
}

/** 获取流程表单定义 */
function getWorkflowForm(params: {
  flowId: string
}) {
  const flow = workflowFlows.find(item => item.flowId === params.flowId)
  if (!flow) {
    return errorResponse('流程不存在', ResultEnumMap.NotFound)
  }

  const formSchema = formSchemaMap[params.flowId]
  if (!formSchema) {
    return errorResponse('表单不存在', ResultEnumMap.NotFound)
  }

  const formMeta: OaWorkflowFormMeta = {
    flowId: flow.flowId,
    flowName: flow.flowName,
    formJson: JSON.stringify(formSchema),
  }

  return successResponse({ data: [formMeta] }, '查询成功')
}

/** 查询表单数据 */
function getWorkflowFormData(params: {
  page?: number
  row?: number
  flowId: string
  id?: string
}) {
  const page = Number(params.page || 1)
  const row = Number(params.row || 10)

  let records = workflowRecords.filter(item => item.flowId === params.flowId)
  if (params.id) {
    records = records.filter(item => item.id === params.id)
  }

  const pagination = createPaginationResponse(records, page, row)

  return successResponse({
    data: pagination.list,
    total: pagination.total,
  }, '查询成功')
}

/** 新增表单数据 */
function saveWorkflowFormData(body: SaveOaWorkflowFormDataReq) {
  if (!body.flowId) {
    return errorResponse('flowId 不能为空', ResultEnumMap.Error)
  }

  if (!body.formData || Object.keys(body.formData).length === 0) {
    return errorResponse('表单内容不能为空', ResultEnumMap.Error)
  }

  const flow = workflowFlows.find(item => item.flowId === body.flowId)
  if (!flow) {
    return errorResponse('流程不存在', ResultEnumMap.NotFound)
  }

  const newId = generateId('OA')
  const newTaskId = generateId('TASK')
  const currentTime = formatDateTime()

  const record: OaWorkflowFormDataRecord = {
    id: newId,
    flowId: body.flowId,
    state: '1001',
    stateName: '申请',
    createUserId: 'CURRENT_USER',
    createUserName: generateChineseName(),
    createTime: currentTime,
    taskId: newTaskId,
    startUserId: 'CURRENT_USER',
    business: 'oaWorkflow',
    files: body.fileName && body.realFileName
      ? [{ fileName: body.fileName, realFileName: body.realFileName }]
      : [],
    formData: body.formData,
  }

  workflowRecords.unshift(record)
  workflowCommentsMap[newId] = [
    {
      staffName: '流程发起人',
      startTime: currentTime,
      endTime: currentTime,
      context: '提交申请',
    },
  ]

  return successResponse({ id: newId }, '提交成功')
}

/** 更新表单数据 */
function updateWorkflowFormData(body: UpdateOaWorkflowFormDataReq) {
  const target = workflowRecords.find(item => item.id === body.id)
  if (!target) {
    return errorResponse('记录不存在', ResultEnumMap.NotFound)
  }

  target.formData = body.formData
  target.files = body.fileName && body.realFileName
    ? [{ fileName: body.fileName, realFileName: body.realFileName }]
    : target.files

  return successResponse({ success: true }, '保存成功')
}

/** 查询待办记录 */
function getWorkflowUndoList(params: {
  page?: number
  row?: number
  flowId: string
}) {
  const page = Number(params.page || 1)
  const row = Number(params.row || 10)

  const list = workflowRecords.filter(item => item.flowId === params.flowId && (item.state === '1002' || item.state === '1004'))
  const pagination = createPaginationResponse(list, page, row)

  return successResponse({
    data: pagination.list,
    total: pagination.total,
  }, '查询成功')
}

/** 查询已办记录 */
function getWorkflowFinishList(params: {
  page?: number
  row?: number
  flowId: string
}) {
  const page = Number(params.page || 1)
  const row = Number(params.row || 10)

  const list = workflowRecords.filter(item => item.flowId === params.flowId && (item.state === '1003' || item.state === '1005'))
  const pagination = createPaginationResponse(list, page, row)

  return successResponse({
    data: pagination.list,
    total: pagination.total,
  }, '查询成功')
}

/** 查询流转记录 */
function getWorkflowComments(params: {
  id: string
}) {
  const comments = workflowCommentsMap[params.id] || []
  return successResponse({ data: comments }, '查询成功')
}

/** 查询流程图 */
function getWorkflowImage(_params: {
  businessKey: string
  communityId?: string
}) {
  /** 1x1 png base64 */
  const imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////fwAJ+wP+LkY3WQAAAABJRU5ErkJggg=='
  return successResponse({ data: imageBase64 }, '查询成功')
}

/** 查询下一任务动作 */
function getWorkflowNextTask(_params: {
  taskId: string
  flowId: string
  id: string
}) {
  const nextTask: OaWorkflowNextTask = {
    assignee: '-2',
    next: true,
    back: true,
    backIndex: true,
    exit: true,
  }

  return successResponse({ data: [nextTask] }, '查询成功')
}

/** 根据审核动作映射状态 */
function mapAuditCodeToState(auditCode: OaWorkflowAuditReq['auditCode']): OaWorkflowStateCode {
  const mapper: Record<OaWorkflowAuditReq['auditCode'], OaWorkflowStateCode> = {
    1100: '1002',
    1200: '1003',
    1300: '1004',
    1400: '1003',
    1500: '1005',
  }

  return mapper[auditCode]
}

/** 提交流程审核 */
function submitWorkflowAudit(body: OaWorkflowAuditReq) {
  const target = workflowRecords.find(item => item.id === body.id)
  if (!target) {
    return errorResponse('记录不存在', ResultEnumMap.NotFound)
  }

  const nextState = mapAuditCodeToState(body.auditCode)
  target.state = nextState
  target.stateName = WORKFLOW_STATE_NAME_MAP[nextState]

  const currentTime = formatDateTime()
  if (!workflowCommentsMap[target.id]) {
    workflowCommentsMap[target.id] = []
  }

  workflowCommentsMap[target.id].push({
    staffName: body.staffId ? `处理人-${body.staffId}` : '当前处理人',
    startTime: currentTime,
    endTime: currentTime,
    context: body.auditMessage,
  })

  return successResponse({ success: true }, '提交成功')
}

/** 查询通用审核下一处理人 */
function getNextDealUser(_params: {
  taskId: string
  flowId: string
  id: string
  startUserId?: string
}) {
  const nextTask: OaWorkflowNextTask = {
    assignee: '-2',
    next: true,
    back: true,
    backIndex: true,
    exit: true,
  }

  return successResponse({ data: [nextTask] }, '查询成功')
}

export default defineUniAppMock([
  {
    url: '/app/oa/workflow/query',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: ({ query, body }) => {
      const params = { ...query, ...body } as { page?: number, row?: number, state?: string, flowType?: string }
      mockLog('queryOaWorkflow', params)
      return getWorkflowFlows(params)
    },
  },
  {
    url: '/app/oa/workflow/form/query',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: ({ query, body }) => {
      const params = { ...query, ...body } as { flowId: string }
      mockLog('queryOaWorkflowForm', params)
      return getWorkflowForm(params)
    },
  },
  {
    url: '/app/oa/workflow/form/data/query',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: ({ query, body }) => {
      const params = { ...query, ...body } as { page?: number, row?: number, flowId: string, id?: string }
      mockLog('queryOaWorkflowFormData', params)
      return getWorkflowFormData(params)
    },
  },
  {
    url: '/app/oa/workflow/form/save',
    method: 'POST',
    delay: [300, 800],
    body: ({ body }) => {
      mockLog('saveOaWorkflowFormData', body)
      return saveWorkflowFormData(body as SaveOaWorkflowFormDataReq)
    },
  },
  {
    url: '/app/oa/workflow/form/update',
    method: 'POST',
    delay: [300, 800],
    body: ({ body }) => {
      mockLog('updateOaWorkflowFormData', body)
      return updateWorkflowFormData(body as UpdateOaWorkflowFormDataReq)
    },
  },
  {
    url: '/app/oa/workflow/task/undo/query',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: ({ query, body }) => {
      const params = { ...query, ...body } as { page?: number, row?: number, flowId: string }
      mockLog('queryOaWorkflowUserTaskFormData', params)
      return getWorkflowUndoList(params)
    },
  },
  {
    url: '/app/oa/workflow/task/his/query',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: ({ query, body }) => {
      const params = { ...query, ...body } as { page?: number, row?: number, flowId: string }
      mockLog('queryOaWorkflowUserHisTaskFormData', params)
      return getWorkflowFinishList(params)
    },
  },
  {
    url: '/app/oa/workflow/user/query',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: ({ query, body }) => {
      const params = { ...query, ...body } as { id: string }
      mockLog('queryOaWorkflowUser', params)
      return getWorkflowComments(params)
    },
  },
  {
    url: '/app/oa/workflow/image/run',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: ({ query, body }) => {
      const params = { ...query, ...body } as { businessKey: string, communityId?: string }
      mockLog('listRunWorkflowImage', params)
      return getWorkflowImage(params)
    },
  },
  {
    url: '/app/oa/workflow/task/next',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: ({ query, body }) => {
      const params = { ...query, ...body } as { taskId: string, flowId: string, id: string }
      mockLog('getNextTask', params)
      return getWorkflowNextTask(params)
    },
  },
  {
    url: '/app/oa/workflow/audit',
    method: 'POST',
    delay: [300, 800],
    body: ({ body }) => {
      mockLog('auditOaWorkflow', body)
      return submitWorkflowAudit(body as OaWorkflowAuditReq)
    },
  },
  {
    url: '/app/oa/workflow/undo/next-deal-user',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: ({ query, body }) => {
      const params = { ...query, ...body } as { taskId: string, flowId: string, id: string, startUserId?: string }
      mockLog('queryNextDealUser', params)
      return getNextDealUser(params)
    },
  },
  {
    url: '/app/oa/workflow/undo/audit',
    method: 'POST',
    delay: [300, 800],
    body: ({ body }) => {
      mockLog('auditUndo', body)
      return submitWorkflowAudit(body as OaWorkflowAuditReq)
    },
  },
])
