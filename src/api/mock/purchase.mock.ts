/**
 * 采购模块 Mock 接口
 * 包含：内联数据 + 数据库对象 + 接口定义
 */

import dayjs from 'dayjs'
import {
  defineUniAppMock,
  errorResponse,
  formatDateTime,
  generateId,
  mockLog,
  ResultEnumMap,
  successResponse,
} from './shared/utils'

// ==================== 采购数据库对象 ====================

/** 采购申请列表 */
const purchaseApplyList: Array<{
  applyId: string
  resOrderType: string
  description: string
  status: string
  createTime: string
  userId: string
  userName: string
}> = []

/** 物资列表 */
const resourceStoreList: Array<{
  resId: string
  resName: string
  resCode: string
  price: number
  stock: number
  description: string
  parentRstName: string
  rstName: string
}> = [
  {
    resId: 'RES_001',
    resName: '办公桌',
    resCode: 'OFFICE_001',
    price: 599,
    stock: 50,
    description: '标准办公桌，1.2米×0.6米',
    parentRstName: '办公家具',
    rstName: '桌子',
  },
  {
    resId: 'RES_002',
    resName: '办公椅',
    resCode: 'OFFICE_002',
    price: 299,
    stock: 100,
    description: '人体工学办公椅',
    parentRstName: '办公家具',
    rstName: '椅子',
  },
  {
    resId: 'RES_003',
    resName: 'A4 打印纸',
    resCode: 'OFFICE_003',
    price: 25,
    stock: 500,
    description: '得力A4纸，500张/包',
    parentRstName: '办公用品',
    rstName: '纸张',
  },
  {
    resId: 'RES_004',
    resName: '中性笔',
    resCode: 'OFFICE_004',
    price: 2,
    stock: 1000,
    description: '晨光0.5mm中性笔',
    parentRstName: '办公用品',
    rstName: '文具',
  },
  {
    resId: 'RES_005',
    resName: '投影仪',
    resCode: 'OFFICE_005',
    price: 2999,
    stock: 10,
    description: '爱普生商用投影仪',
    parentRstName: '办公设备',
    rstName: '投影设备',
  },
  {
    resId: 'RES_006',
    resName: '碎纸机',
    resCode: 'OFFICE_006',
    price: 399,
    stock: 20,
    description: '科密碎纸机',
    parentRstName: '办公设备',
    rstName: '销毁设备',
  },
  {
    resId: 'RES_007',
    resName: '扫描仪',
    resCode: 'OFFICE_007',
    price: 1299,
    stock: 15,
    description: '佳能高速扫描仪',
    parentRstName: '办公设备',
    rstName: '输入设备',
  },
  {
    resId: 'RES_008',
    resName: '会议麦克风',
    resCode: 'OFFICE_008',
    price: 899,
    stock: 30,
    description: '会议专用无线麦克风',
    parentRstName: '办公设备',
    rstName: '音频设备',
  },
  {
    resId: 'RES_009',
    resName: '白板',
    resCode: 'OFFICE_009',
    price: 499,
    stock: 40,
    description: '标准白板，1.5米×1米',
    parentRstName: '办公家具',
    rstName: '展示设备',
  },
  {
    resId: 'RES_010',
    resName: '文件柜',
    resCode: 'OFFICE_010',
    price: 799,
    stock: 25,
    description: '四门文件柜',
    parentRstName: '办公家具',
    rstName: '储物柜',
  },
]

// ==================== 接口定义 ====================

/** 查询物资列表 */
function listResourceStores(params: {
  page?: number
  row?: number
  communityId?: string
}) {
  mockLog('listResourceStores', params)

  const page = params.page || 1
  const row = params.row || 15

  // 分页
  const start = (page - 1) * row
  const end = start + row
  const list = resourceStoreList.slice(start, end)

  return successResponse(
    { resourceStores: list },
    '查询成功',
  )
}

/** 提交采购申请 */
function savePurchaseApply(body: {
  resourceStores: Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    stock: number
    description: string
    quantity: number
  }>
  description: string
  resOrderType: string
}) {
  mockLog('savePurchaseApply', body)

  // 验证
  if (!body.resourceStores || body.resourceStores.length === 0) {
    return errorResponse('请选择采购物资', ResultEnumMap.BusinessError)
  }

  // 生成采购申请
  const applyId = generateId('APPLY_')
  const apply = {
    applyId,
    resOrderType: body.resOrderType || '10000',
    description: body.description || '',
    status: '10001', // 待审核
    createTime: formatDateTime(dayjs()),
    userId: 'USER_001',
    userName: '管理员',
  }

  purchaseApplyList.push(apply)

  return successResponse({ applyId }, '提交成功')
}

/** 提交紧急采购申请 */
function saveUrgentPurchaseApply(body: {
  resourceStores: Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    stock: number
    description: string
    quantity: number
    urgentPrice?: number
    remark?: string
  }>
  description: string
  resOrderType: string
  endUserName: string
  endUserTel: string
  communityId: string
}) {
  mockLog('saveUrgentPurchaseApply', body)

  // 验证
  if (!body.resourceStores || body.resourceStores.length === 0) {
    return errorResponse('请选择采购物资', ResultEnumMap.BusinessError)
  }

  if (!body.endUserName) {
    return errorResponse('请输入使用人', ResultEnumMap.BusinessError)
  }

  if (!body.endUserTel) {
    return errorResponse('请输入联系电话', ResultEnumMap.BusinessError)
  }

  if (!body.description) {
    return errorResponse('请输入申请说明', ResultEnumMap.BusinessError)
  }

  // 生成采购申请
  const applyId = generateId('URGENT_')
  const apply = {
    applyId,
    resOrderType: '20000', // 紧急采购
    description: body.description,
    status: '10001', // 待审核
    createTime: formatDateTime(dayjs()),
    userId: 'USER_001',
    userName: body.endUserName,
  }

  purchaseApplyList.push(apply)

  return successResponse({ applyId }, '提交成功')
}

// ==================== 注册 Mock 接口 ====================

export default defineUniAppMock({
  '/app/resourceStore.listResourceStores': listResourceStores,
  '/app/purchase/purchaseApply': savePurchaseApply,
  '/app/purchase/urgentPurchaseApply': saveUrgentPurchaseApply,
})
