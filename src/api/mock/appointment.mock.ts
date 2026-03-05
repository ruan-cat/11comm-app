/**
 * 预约核销模块 Mock 接口
 */

import type { AppointmentOrder } from '@/types/appointment'
import { createPaginationResponse, defineUniAppMock, formatDateTime, randomDelay, successResponse } from './shared/utils'

const appointmentDatabase = {
  orders: [] as AppointmentOrder[],

  init() {
    if (this.orders.length > 0)
      return

    this.orders = Array.from({ length: 48 }).map((_, index) => {
      const baseDay = (index % 20) + 1
      const startHour = 8 + (index % 8)
      return {
        orderId: `ORDER_${(index + 1).toString().padStart(5, '0')}`,
        timeId: `HEXIAO_${(100000 + index).toString()}`,
        spaceName: index % 2 === 0 ? '羽毛球馆' : '篮球场',
        appointmentDate: `2026-03-${baseDay.toString().padStart(2, '0')}`,
        hours: `${startHour.toString().padStart(2, '0')}:00-${(startHour + 1).toString().padStart(2, '0')}:00`,
        personName: index % 2 === 0 ? '张先生' : '李女士',
        personTel: `1380000${(1000 + index).toString().slice(-4)}`,
        createTime: formatDateTime(Date.now() - index * 7200000),
        state: index % 3 === 0 ? 'CONFIRMED' : 'WAIT_CONFIRM',
      }
    })
  },
}

appointmentDatabase.init()

export default defineUniAppMock([
  {
    url: '/app/communitySpace.listCommunitySpaceConfirmOrder',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(200, 480)
      const params = { ...query, ...body }

      let list = [...appointmentDatabase.orders]
      if (params.timeId) {
        list = list.filter(item => item.timeId.includes(String(params.timeId)))
      }

      return successResponse(
        createPaginationResponse(
          list,
          Number(params.page) || 1,
          Number(params.row) || 10,
        ),
        '查询成功',
      )
    },
  },
  {
    url: '/app/communitySpace.saveCommunitySpaceConfirmOrder',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(180, 360)
      const timeId = String(body?.timeId || '')
      const target = appointmentDatabase.orders.find(item => item.timeId === timeId)
      if (target) {
        target.state = 'CONFIRMED'
        target.createTime = formatDateTime()
      }
      return successResponse({ success: true }, '核销成功')
    },
  },
])
