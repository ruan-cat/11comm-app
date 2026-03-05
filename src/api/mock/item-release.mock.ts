/**
 * 物品放行模块 Mock 接口
 */

import type {
  AuditItemReleaseParams,
  ItemReleaseComment,
  ItemReleaseDetail,
  ItemReleaseResource,
  ItemReleaseTask,
} from '@/types/item-release'
import {
  createPaginationResponse,
  defineUniAppMock,
  formatDateTime,
  generateChineseName,
  generateId,
  randomDelay,
  successResponse,
} from './shared/utils'

const itemReleaseDatabase = {
  undoTasks: [] as ItemReleaseTask[],
  finishTasks: [] as ItemReleaseTask[],
  details: [] as ItemReleaseDetail[],
  resources: new Map<string, ItemReleaseResource[]>(),
  comments: new Map<string, ItemReleaseComment[]>(),

  init() {
    if (this.undoTasks.length > 0)
      return

    this.undoTasks = Array.from({ length: 18 }).map((_, index) => {
      const irId = `IR_${(index + 1).toString().padStart(5, '0')}`
      const flowId = `FLOW_${(index + 1).toString().padStart(5, '0')}`
      const taskId = `TASK_${(index + 1).toString().padStart(5, '0')}`
      const personName = generateChineseName()

      this.details.push({
        irId,
        flowId,
        typeName: index % 2 === 0 ? '住户搬家放行' : '装修物料放行',
        applyCompany: index % 2 === 0 ? '绿地物业服务中心' : '绿地装修服务部',
        applyPerson: personName,
        applyTel: `1380000${(2000 + index).toString().slice(-4)}`,
        idCard: `4401011990${(index + 11).toString().padStart(2, '0')}0012`,
        carNum: `粤B${(12000 + index).toString()}`,
        passTime: formatDateTime(Date.now() + (index % 7) * 3600000),
        remark: index % 2 === 0 ? '搬家家具放行' : '装修物料运输',
        createUserId: `USER_${(index + 1).toString().padStart(4, '0')}`,
      })

      this.resources.set(irId, [
        {
          resId: generateId('RES'),
          resName: index % 2 === 0 ? '木质衣柜' : '瓷砖',
          amount: (index % 3) + 1,
        },
        {
          resId: generateId('RES'),
          resName: index % 2 === 0 ? '书桌' : '水泥',
          amount: (index % 5) + 1,
        },
      ])

      this.comments.set(irId, [
        {
          staffName: '申请人',
          context: '提交放行申请',
          endTime: formatDateTime(Date.now() - 3600000),
        },
        {
          staffName: '物业前台',
          context: '待审核',
        },
      ])

      return {
        irId,
        flowId,
        taskId,
        typeName: this.details[index].typeName,
        stateName: '待审核',
        passTime: this.details[index].passTime,
        amount: this.resources.get(irId)?.reduce((sum, item) => sum + item.amount, 0) || 0,
        action: 'Audit',
      }
    })

    this.finishTasks = Array.from({ length: 12 }).map((_, index) => {
      const irId = `IR_F_${(index + 1).toString().padStart(5, '0')}`
      const flowId = `FLOW_F_${(index + 1).toString().padStart(5, '0')}`
      const personName = generateChineseName()

      this.details.push({
        irId,
        flowId,
        typeName: index % 2 === 0 ? '住户搬家放行' : '装修物料放行',
        applyCompany: index % 2 === 0 ? '绿地物业服务中心' : '绿地装修服务部',
        applyPerson: personName,
        applyTel: `1390000${(3000 + index).toString().slice(-4)}`,
        idCard: `4401011992${(index + 15).toString().padStart(2, '0')}0013`,
        carNum: `粤A${(23000 + index).toString()}`,
        passTime: formatDateTime(Date.now() - (index % 7) * 3600000),
        remark: '历史放行记录',
        createUserId: `USER_F_${(index + 1).toString().padStart(4, '0')}`,
      })

      this.resources.set(irId, [
        {
          resId: generateId('RES'),
          resName: index % 2 === 0 ? '沙发' : '石膏板',
          amount: (index % 3) + 1,
        },
      ])

      this.comments.set(irId, [
        {
          staffName: '申请人',
          context: '提交放行申请',
          endTime: formatDateTime(Date.now() - 7200000),
        },
        {
          staffName: '物业前台',
          context: '审核通过',
          endTime: formatDateTime(Date.now() - 3600000),
        },
      ])

      return {
        irId,
        flowId,
        typeName: this.details[this.details.length - 1].typeName,
        stateName: '已办结',
        passTime: this.details[this.details.length - 1].passTime,
        amount: this.resources.get(irId)?.reduce((sum, item) => sum + item.amount, 0) || 0,
        action: 'View',
      }
    })
  },
}

itemReleaseDatabase.init()

export default defineUniAppMock([
  {
    url: '/app/itemRelease.queryUndoItemReleaseV2',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(160, 320)
      const params = { ...query, ...body }
      return successResponse(
        createPaginationResponse(
          itemReleaseDatabase.undoTasks,
          Number(params.page) || 1,
          Number(params.row) || 10,
        ),
        '查询成功',
      )
    },
  },
  {
    url: '/app/itemRelease.queryFinishItemReleaseV2',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(160, 320)
      const params = { ...query, ...body }
      return successResponse(
        createPaginationResponse(
          itemReleaseDatabase.finishTasks,
          Number(params.page) || 1,
          Number(params.row) || 10,
        ),
        '查询成功',
      )
    },
  },
  {
    url: '/app/itemRelease.getItemRelease',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(140, 260)
      const params = { ...query, ...body }
      const list = itemReleaseDatabase.details.filter(item => item.irId === String(params.irId || ''))
      return successResponse(
        createPaginationResponse(
          list,
          Number(params.page) || 1,
          Number(params.row) || 1,
        ),
        '查询成功',
      )
    },
  },
  {
    url: '/app/itemRelease.getItemReleaseRes',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(140, 260)
      const params = { ...query, ...body }
      const irId = String(params.irId || '')
      const list = itemReleaseDatabase.resources.get(irId) || []
      return successResponse(
        createPaginationResponse(
          list,
          Number(params.page) || 1,
          Number(params.row) || 20,
        ),
        '查询成功',
      )
    },
  },
  {
    url: '/app/itemRelease.queryOaWorkflowUser',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(140, 260)
      const params = { ...query, ...body }
      const irId = String(params.id || '')
      const list = itemReleaseDatabase.comments.get(irId) || []
      return successResponse(
        createPaginationResponse(
          list,
          Number(params.page) || 1,
          Number(params.row) || 20,
        ),
        '查询成功',
      )
    },
  },
  {
    url: '/app/itemRelease.auditItemRelease',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(140, 260)
      const data = (body || {}) as AuditItemReleaseParams
      const target = itemReleaseDatabase.undoTasks.find(item => item.irId === data.irId)
      if (target) {
        target.stateName = data.auditCode === '1100' ? '审核通过' : '已拒绝'
        target.action = 'View'
        itemReleaseDatabase.finishTasks.unshift({
          ...target,
          stateName: data.auditCode === '1100' ? '已办结' : '已拒绝',
        })
        itemReleaseDatabase.undoTasks = itemReleaseDatabase.undoTasks.filter(item => item.irId !== data.irId)
      }
      return successResponse({ success: true }, '审核完成')
    },
  },
])
