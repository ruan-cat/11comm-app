/**
 * 访客模块 Mock 接口
 */

import type { AuditVisitParams, VisitDetail } from '@/types/visit'
import {
  createPaginationResponse,
  defineUniAppMock,
  formatDateTime,
  generateChineseName,
  generatePhoneNumber,
  randomDelay,
  successResponse,
} from './shared/utils'

const visitDatabase = {
  details: [] as VisitDetail[],

  init() {
    if (this.details.length > 0)
      return

    this.details = Array.from({ length: 30 }).map((_, index) => {
      const state = index % 3 === 0 ? '0' : index % 3 === 1 ? '1' : '2'
      const ownerName = generateChineseName()
      const visitorName = generateChineseName()

      return {
        visitId: `VISIT_${(index + 1).toString().padStart(5, '0')}`,
        name: visitorName,
        phoneNumber: generatePhoneNumber(),
        ownerName,
        roomName: `${(index % 5) + 1}-${(index % 3) + 1}-${(101 + index).toString().slice(-3)}`,
        carNum: `粤B${(30000 + index).toString()}`,
        visitTime: formatDateTime(Date.now() + index * 7200000),
        state,
        stateName: state === '0' ? '待审核' : state === '1' ? '审核通过' : '已拒绝',
        taskId: state === '0' ? `TASK_V_${(index + 1).toString().padStart(4, '0')}` : undefined,
        departureTime: formatDateTime(Date.now() + (index + 2) * 7200000),
        visitCase: index % 2 === 0 ? '亲友来访' : '送货上门',
      }
    })
  },
}

visitDatabase.init()

export default defineUniAppMock([
  {
    url: '/app/visit.getVisit',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(160, 320)
      const params = { ...query, ...body }
      let list = [...visitDatabase.details]

      if (params.state !== undefined && params.state !== '') {
        list = list.filter(item => item.state === String(params.state))
      }

      if (params.visitId) {
        list = list.filter(item => item.visitId === String(params.visitId))
      }

      return successResponse(
        createPaginationResponse(
          list.map(item => ({
            visitId: item.visitId,
            name: item.name,
            phoneNumber: item.phoneNumber,
            ownerName: item.ownerName,
            roomName: item.roomName,
            carNum: item.carNum,
            visitTime: item.visitTime,
            state: item.state,
            stateName: item.stateName,
            taskId: item.taskId,
          })),
          Number(params.page) || 1,
          Number(params.row) || 10,
        ),
        '查询成功',
      )
    },
  },
  {
    url: '/app/visit.getVisitDetail',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(160, 320)
      const params = { ...query, ...body }
      const list = visitDatabase.details.filter(item => item.visitId === String(params.visitId || ''))
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
    url: '/app/visit.auditVisit',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(140, 280)
      const data = (body || {}) as AuditVisitParams
      const target = visitDatabase.details.find(item => item.visitId === data.visitId)
      if (target) {
        target.state = data.state
        target.stateName = data.state === '1' ? '审核通过' : '已拒绝'
      }
      return successResponse({ success: true }, '审核成功')
    },
  },
])
