/**
 * 资源管理模块 Mock 接口
 * 包含：内联数据 + 数据库对象 + 接口定义
 */

import dayjs from 'dayjs'
import {
  defineUniAppMock,
  formatDateTime,
  generateId,
  mockLog,
  randomDelay,
  successResponse,
} from './shared/utils'

// ==================== 物资数据库对象 ====================

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
    rstName: '笔类',
  },
  {
    resId: 'RES_005',
    resName: '台式电脑',
    resCode: 'ELECTRONIC_001',
    price: 3999,
    stock: 20,
    description: '联想台式机，i5处理器',
    parentRstName: '电子设备',
    rstName: '电脑',
  },
  {
    resId: 'RES_006',
    resName: '激光打印机',
    resCode: 'ELECTRONIC_002',
    price: 1299,
    stock: 15,
    description: '惠普激光打印机',
    parentRstName: '电子设备',
    rstName: '打印机',
  },
  {
    resId: 'RES_007',
    resName: '投影仪',
    resCode: 'ELECTRONIC_003',
    price: 2999,
    stock: 8,
    description: '爱普生投影仪，1080P',
    parentRstName: '电子设备',
    rstName: '投影仪',
  },
  {
    resId: 'RES_008',
    resName: '文件柜',
    resCode: 'OFFICE_005',
    price: 899,
    stock: 30,
    description: '四门铁皮文件柜',
    parentRstName: '办公家具',
    rstName: '柜子',
  },
]

/** 仓库列表 */
const storeHouseList: Array<{
  shId: string
  shName: string
  shCode: string
  address: string
  allowPurchase: string
}> = [
  {
    shId: 'SH_001',
    shName: '总部仓库',
    shCode: 'WH_001',
    address: '北京市朝阳区总部大厦',
    allowPurchase: 'ON',
  },
  {
    shId: 'SH_002',
    shName: '分部仓库',
    shCode: 'WH_002',
    address: '上海市浦东分部',
    allowPurchase: 'ON',
  },
  {
    shId: 'SH_003',
    shName: '临时仓库',
    shCode: 'WH_003',
    address: '广州市天河临时',
    allowPurchase: 'OFF',
  },
]

/** 采购申请列表 */
const purchaseApplyList: Array<{
  applyOrderId: string
  resourceNames: string
  state: number
  stateName: string
  createUserId: string
  createUserName: string
  createTime: string
  description: string
}> = [
  {
    applyOrderId: 'PA_20240301_001',
    resourceNames: '办公桌、办公椅',
    state: 1200,
    stateName: '待审核',
    createUserId: 'USER_001',
    createUserName: '张三',
    createTime: '2024-03-01 10:00:00',
    description: '办公室采购',
  },
  {
    applyOrderId: 'PA_20240302_001',
    resourceNames: 'A4打印纸、中性笔',
    state: 1300,
    stateName: '已完成',
    createUserId: 'USER_002',
    createUserName: '李四',
    createTime: '2024-03-02 14:30:00',
    description: '日常办公用品',
  },
]

/** 领用申请列表 */
const itemOutList: Array<{
  applyOrderId: string
  resourceNames: string
  state: number
  stateName: string
  createUserId: string
  createUserName: string
  createTime: string
  description: string
}> = [
  {
    applyOrderId: 'IO_20240301_001',
    resourceNames: '台式电脑',
    state: 1200,
    stateName: '待审核',
    createUserId: 'USER_003',
    createUserName: '王五',
    createTime: '2024-03-01 09:00:00',
    description: '新员工办公设备',
  },
  {
    applyOrderId: 'IO_20240302_001',
    resourceNames: '激光打印机',
    state: 1300,
    stateName: '已出库',
    createUserId: 'USER_004',
    createUserName: '赵六',
    createTime: '2024-03-02 11:00:00',
    description: '部门打印机更换',
  },
]

/** 调拨申请列表 */
const allocationList: Array<{
  allocationId: string
  resourceNames: string
  state: number
  stateName: string
  createUserId: string
  createUserName: string
  createTime: string
  fromShName: string
  toShName: string
  description: string
}> = [
  {
    allocationId: 'AL_20240301_001',
    resourceNames: '办公桌、文件柜',
    state: 1200,
    stateName: '待审核',
    createUserId: 'USER_001',
    createUserName: '张三',
    createTime: '2024-03-01 15:00:00',
    fromShName: '总部仓库',
    toShName: '分部仓库',
    description: '部门搬迁调拨',
  },
]

/** 审核任务列表（待办） */
const auditTaskList: Array<{
  taskId: string
  businessId: string
  businessType: string
  state: number
  stateName: string
  resourceNames: string
  createUserId: string
  createUserName: string
  createTime: string
}> = [
  {
    taskId: 'TASK_001',
    businessId: 'PA_20240301_001',
    businessType: '采购审核',
    state: 1200,
    stateName: '待审核',
    resourceNames: '办公桌、办公椅',
    createUserId: 'USER_001',
    createUserName: '张三',
    createTime: '2024-03-01 10:00:00',
  },
  {
    taskId: 'TASK_002',
    businessId: 'IO_20240301_001',
    businessType: '领用审核',
    state: 1200,
    stateName: '待审核',
    resourceNames: '台式电脑',
    createUserId: 'USER_003',
    createUserName: '王五',
    createTime: '2024-03-01 09:00:00',
  },
  {
    taskId: 'TASK_003',
    businessId: 'AL_20240301_001',
    businessType: '调拨审核',
    state: 1200,
    stateName: '待审核',
    resourceNames: '办公桌、文件柜',
    createUserId: 'USER_001',
    createUserName: '张三',
    createTime: '2024-03-01 15:00:00',
  },
]

// ==================== 接口定义 ====================

export default defineUniAppMock([
  // 查询物资列表
  {
    url: '/app/resourceStore.listResourceStores',
    method: 'GET',
    timeout: randomDelay(),
    response: ({ query }) => {
      mockLog('listResourceStores', query)
      const { page = 1, row = 10 } = query as { page?: number, row?: number }
      const start = (page - 1) * row
      const end = start + row
      const list = resourceStoreList.slice(start, end)
      return successResponse({
        list,
        total: resourceStoreList.length,
        page,
        row,
      })
    },
  },

  // 查询仓库列表
  {
    url: '/app/resourceStore.listStorehouses',
    method: 'GET',
    timeout: randomDelay(),
    response: ({ query }) => {
      mockLog('listStorehouses', query)
      const { page = 1, row = 10, allowPurchase } = query as { page?: number, row?: number, allowPurchase?: string }
      let filteredList = storeHouseList
      if (allowPurchase) {
        filteredList = storeHouseList.filter(item => item.allowPurchase === allowPurchase)
      }
      const start = (page - 1) * row
      const end = start + row
      const list = filteredList.slice(start, end)
      return successResponse({
        list,
        total: filteredList.length,
        page,
        row,
      })
    },
  },

  // 查询采购申请列表
  {
    url: '/app/purchaseApply.listPurchaseApplys',
    method: 'GET',
    timeout: randomDelay(),
    response: ({ query }) => {
      mockLog('queryPurchaseApplyList', query)
      const { page = 1, row = 10 } = query as { page?: number, row?: number }
      const start = (page - 1) * row
      const end = start + row
      const list = purchaseApplyList.slice(start, end)
      return successResponse({
        list,
        total: purchaseApplyList.length,
        page,
        row,
      })
    },
  },

  // 查询领用申请列表
  {
    url: '/app/itemRelease.listItemRelease',
    method: 'GET',
    timeout: randomDelay(),
    response: ({ query }) => {
      mockLog('queryItemOutList', query)
      const { page = 1, row = 10 } = query as { page?: number, row?: number }
      const start = (page - 1) * row
      const end = start + row
      const list = itemOutList.slice(start, end)
      return successResponse({
        list,
        total: itemOutList.length,
        page,
        row,
      })
    },
  },

  // 查询调拨申请列表
  {
    url: '/app/resourceStore.listAllocationStorehouseApplys',
    method: 'GET',
    timeout: randomDelay(),
    response: ({ query }) => {
      mockLog('listAllocationStorehouseApplys', query)
      const { page = 1, row = 10 } = query as { page?: number, row?: number }
      const start = (page - 1) * row
      const end = start + row
      const list = allocationList.slice(start, end)
      return successResponse({
        list,
        total: allocationList.length,
        page,
        row,
      })
    },
  },

  // 查询采购待办列表
  {
    url: '/app/purchaseApply.listMyAuditOrders',
    method: 'GET',
    timeout: randomDelay(),
    response: ({ query }) => {
      mockLog('listMyAuditOrders', query)
      const { page = 1, row = 10 } = query as { page?: number, row?: number }
      const purchaseTasks = auditTaskList.filter(item => item.businessType === '采购审核')
      const start = (page - 1) * row
      const end = start + row
      const list = purchaseTasks.slice(start, end)
      return successResponse({
        list,
        total: purchaseTasks.length,
        page,
        row,
      })
    },
  },

  // 查询领用待办列表
  {
    url: '/app/itemRelease.queryUndoItemRelease',
    method: 'GET',
    timeout: randomDelay(),
    response: ({ query }) => {
      mockLog('listMyItemOutOrders', query)
      const { page = 1, row = 10 } = query as { page?: number, row?: number }
      const itemOutTasks = auditTaskList.filter(item => item.businessType === '领用审核')
      const start = (page - 1) * row
      const end = start + row
      const list = itemOutTasks.slice(start, end)
      return successResponse({
        list,
        total: itemOutTasks.length,
        page,
        row,
      })
    },
  },

  // 查询调拨待办列表
  {
    url: '/app/resourceStore.listAllocationStoreAuditOrders',
    method: 'GET',
    timeout: randomDelay(),
    response: ({ query }) => {
      mockLog('listMyAllocationStoreAuditOrders', query)
      const { page = 1, row = 10 } = query as { page?: number, row?: number }
      const allocationTasks = auditTaskList.filter(item => item.businessType === '调拨审核')
      const start = (page - 1) * row
      const end = start + row
      const list = allocationTasks.slice(start, end)
      return successResponse({
        list,
        total: allocationTasks.length,
        page,
        row,
      })
    },
  },

  // 查询物品类型
  {
    url: '/app/resourceStoreType.listResourceStoreTypes',
    method: 'GET',
    timeout: randomDelay(),
    response: () => {
      const types = [
        { rstId: 'T001', rstName: '办公家具', parentRstId: '' },
        { rstId: 'T002', rstName: '办公用品', parentRstId: '' },
        { rstId: 'T003', rstName: '电子设备', parentRstId: '' },
      ]
      return successResponse({
        list: types,
        total: types.length,
        page: 1,
        row: 10,
      })
    },
  },

  // 提交采购申请
  {
    url: '/app/purchase/purchaseApply',
    method: 'POST',
    timeout: randomDelay(),
    response: ({ body }) => {
      mockLog('savePurchaseApply', body)
      const data = body as {
        resourceStores: Array<{ resId: string, resName: string }>
        description: string
        resOrderType: string
      }
      const newApply = {
        applyOrderId: `PA_${dayjs().format('YYYYMMDD')}_${generateId(3)}`,
        resourceNames: data.resourceStores.map(item => item.resName).join('、'),
        state: 1200,
        stateName: '待审核',
        createUserId: 'USER_001',
        createUserName: '当前用户',
        createTime: formatDateTime(new Date()),
        description: data.description,
      }
      purchaseApplyList.unshift(newApply)
      return successResponse(null, '提交成功')
    },
  },

  // 提交领用申请
  {
    url: '/app/collection/resourceOut',
    method: 'POST',
    timeout: randomDelay(),
    response: ({ body }) => {
      mockLog('saveItemOutApply', body)
      const data = body as {
        resourceStores: Array<{ resId: string, resName: string }>
        description: string
        resOrderType: string
      }
      const newApply = {
        applyOrderId: `IO_${dayjs().format('YYYYMMDD')}_${generateId(3)}`,
        resourceNames: data.resourceStores.map(item => item.resName).join('、'),
        state: 1200,
        stateName: '待审核',
        createUserId: 'USER_001',
        createUserName: '当前用户',
        createTime: formatDateTime(new Date()),
        description: data.description,
      }
      itemOutList.unshift(newApply)
      return successResponse(null, '提交成功')
    },
  },

  // 提交调拨申请
  {
    url: '/app/resourceStore.saveAllocationStorehouse',
    method: 'POST',
    timeout: randomDelay(),
    response: ({ body }) => {
      mockLog('saveAllocationStorehouse', body)
      const data = body as {
        resourceStores: Array<{ resId: string, resName: string }>
        description: string
      }
      const newApply = {
        allocationId: `AL_${dayjs().format('YYYYMMDD')}_${generateId(3)}`,
        resourceNames: data.resourceStores.map(item => item.resName).join('、'),
        state: 1200,
        stateName: '待审核',
        createUserId: 'USER_001',
        createUserName: '当前用户',
        createTime: formatDateTime(new Date()),
        fromShName: '总部仓库',
        toShName: '分部仓库',
        description: data.description,
      }
      allocationList.unshift(newApply)
      return successResponse(null, '提交成功')
    },
  },

  // 采购审核
  {
    url: '/app/purchaseApply.auditApplyOrder',
    method: 'POST',
    timeout: randomDelay(),
    response: ({ body }) => {
      mockLog('saveAuditOrders', body)
      const { taskId, status } = body as { taskId: string, status: string }
      const task = auditTaskList.find(item => item.taskId === taskId)
      if (task) {
        task.state = status === '1200' ? 1300 : 1400
        task.stateName = status === '1200' ? '已完成' : '已拒绝'
      }
      return successResponse(null, '审核成功')
    },
  },

  // 领用审核
  {
    url: '/app/itemRelease.auditUndoItemRelease',
    method: 'POST',
    timeout: randomDelay(),
    response: ({ body }) => {
      mockLog('auditUndoItemRelease', body)
      const { taskId, status } = body as { taskId: string, status: string }
      const task = auditTaskList.find(item => item.taskId === taskId)
      if (task) {
        task.state = status === '1200' ? 1300 : 1400
        task.stateName = status === '1200' ? '已出库' : '已拒绝'
      }
      return successResponse(null, '审核成功')
    },
  },

  // 调拨审核
  {
    url: '/app/resourceStore.auditAllocationStoreOrder',
    method: 'POST',
    timeout: randomDelay(),
    response: ({ body }) => {
      mockLog('saveAuditAllocationStoreOrder', body)
      const { taskId, status } = body as { taskId: string, status: string }
      const task = auditTaskList.find(item => item.taskId === taskId)
      if (task) {
        task.state = status === '1200' ? 1300 : 1400
        task.stateName = status === '1200' ? '已完成' : '已拒绝'
      }
      return successResponse(null, '审核成功')
    },
  },

  // 提交入库
  {
    url: '/app/purchase/resourceEnter',
    method: 'POST',
    timeout: randomDelay(),
    response: () => {
      mockLog('saveResourceEnter')
      return successResponse(null, '入库成功')
    },
  },

  // 取消采购申请
  {
    url: '/app/purchaseApply.deletePurchaseApply',
    method: 'POST',
    timeout: randomDelay(),
    response: ({ body }) => {
      mockLog('deletePurchaseApply', body)
      const { applyOrderId } = body as { applyOrderId: string }
      const index = purchaseApplyList.findIndex(item => item.applyOrderId === applyOrderId)
      if (index > -1) {
        purchaseApplyList.splice(index, 1)
      }
      return successResponse(null, '取消成功')
    },
  },

  // 取消调拨
  {
    url: '/app/resourceStore.deleteAllocationStorehouse',
    method: 'POST',
    timeout: randomDelay(),
    response: ({ body }) => {
      mockLog('deleteAllocationStorehouse', body)
      const { allocationId } = body as { allocationId: string }
      const index = allocationList.findIndex(item => item.allocationId === allocationId)
      if (index > -1) {
        allocationList.splice(index, 1)
      }
      return successResponse(null, '取消成功')
    },
  },

  // 调拨入库
  {
    url: '/app/resourceStore.allocationStoreEnter',
    method: 'POST',
    timeout: randomDelay(),
    response: () => {
      mockLog('allocationStoreEnter')
      return successResponse(null, '调拨入库成功')
    },
  },

  // 物品转赠
  {
    url: '/app/resourceStore.saveAllocationUserStorehouse',
    method: 'POST',
    timeout: randomDelay(),
    response: () => {
      mockLog('saveResourceStoreTransfer')
      return successResponse(null, '转赠成功')
    },
  },

  // 查询调拨物品列表
  {
    url: '/app/resourceStore.listAllocationStorehouses',
    method: 'GET',
    timeout: randomDelay(),
    response: ({ query }) => {
      mockLog('listAllocationStorehouses', query)
      const { page = 1, row = 10 } = query as { page?: number, row?: number }
      const start = (page - 1) * row
      const end = start + row
      const list = resourceStoreList.slice(start, end)
      return successResponse({
        list,
        total: resourceStoreList.length,
        page,
        row,
      })
    },
  },

  // 查询我的物资库存（个人物资）
  {
    url: '/app/resourceStore.queryMyResourceStoreInfo',
    method: 'GET',
    timeout: randomDelay(),
    response: ({ query }) => {
      mockLog('queryMyResourceStoreInfo', query)
      const { page = 1, row = 10, resName, searchUserName } = query as {
        page?: number
        row?: number
        resName?: string
        searchUserName?: string
      }

      // 个人物资库存数据
      const myResourceStoreList: Array<{
        resId: string
        resName: string
        parentRstName: string
        rstName: string
        stock: number
        unitCodeName: string
        miniStock: number
        miniUnitCodeName: string
        isFixed: string
        isFixedName: string
        userId: string
        userName: string
      }> = [
        {
          resId: 'RES_001',
          resName: '办公桌',
          parentRstName: '办公家具',
          rstName: '桌子',
          stock: 5,
          unitCodeName: '张',
          miniStock: 5,
          miniUnitCodeName: '张',
          isFixed: 'Y',
          isFixedName: '是',
          userId: 'USER_001',
          userName: '张三',
        },
        {
          resId: 'RES_002',
          resName: '办公椅',
          parentRstName: '办公家具',
          rstName: '椅子',
          stock: 8,
          unitCodeName: '把',
          miniStock: 8,
          miniUnitCodeName: '把',
          isFixed: 'Y',
          isFixedName: '是',
          userId: 'USER_001',
          userName: '张三',
        },
        {
          resId: 'RES_003',
          resName: 'A4 打印纸',
          parentRstName: '办公用品',
          rstName: '纸张',
          stock: 20,
          unitCodeName: '包',
          miniStock: 20,
          miniUnitCodeName: '包',
          isFixed: 'N',
          isFixedName: '否',
          userId: 'USER_001',
          userName: '张三',
        },
        {
          resId: 'RES_004',
          resName: '中性笔',
          parentRstName: '办公用品',
          rstName: '笔类',
          stock: 50,
          unitCodeName: '支',
          miniStock: 50,
          miniUnitCodeName: '支',
          isFixed: 'N',
          isFixedName: '否',
          userId: 'USER_002',
          userName: '李四',
        },
        {
          resId: 'RES_005',
          resName: '台式电脑',
          parentRstName: '电子设备',
          rstName: '电脑',
          stock: 2,
          unitCodeName: '台',
          miniStock: 2,
          miniUnitCodeName: '台',
          isFixed: 'Y',
          isFixedName: '是',
          userId: 'USER_001',
          userName: '张三',
        },
        {
          resId: 'RES_006',
          resName: '激光打印机',
          parentRstName: '电子设备',
          rstName: '打印机',
          stock: 1,
          unitCodeName: '台',
          miniStock: 1,
          miniUnitCodeName: '台',
          isFixed: 'Y',
          isFixedName: '是',
          userId: 'USER_002',
          userName: '李四',
        },
      ]

      let filteredList = myResourceStoreList
      if (resName) {
        filteredList = filteredList.filter(item => item.resName.includes(resName))
      }
      if (searchUserName) {
        filteredList = filteredList.filter(item => item.userName.includes(searchUserName))
      }

      const start = (page - 1) * row
      const end = start + row
      const list = filteredList.slice(start, end)
      return successResponse({
        list,
        total: filteredList.length,
        page,
        row,
      })
    },
  },

  // 物资退还
  {
    url: '/app/resourceStore.saveResourceReturn',
    method: 'POST',
    timeout: randomDelay(),
    response: ({ body }) => {
      mockLog('saveResourceReturn', body)
      return successResponse(null, '退还成功')
    },
  },

  // 物资报废
  {
    url: '/app/resourceStore.saveResourceScrap',
    method: 'POST',
    timeout: randomDelay(),
    response: ({ body }) => {
      mockLog('saveResourceScrap', body)
      return successResponse(null, '报废成功')
    },
  },
])
