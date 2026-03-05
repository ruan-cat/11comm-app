/**
 * 优惠券核销模块 Mock 接口
 */

import type {
  CouponWriteOffOrder,
  IntegralSetting,
  IntegralWriteOffLog,
  ReserveWriteOffOrder,
} from '@/types/coupon'
import {
  createPaginationResponse,
  defineUniAppMock,
  formatDateTime,
  generateChineseName,
  generateId,
  generatePhoneNumber,
  randomDelay,
  successResponse,
} from './shared/utils'

const couponDatabase = {
  couponOrders: [] as CouponWriteOffOrder[],
  reserveOrders: [] as ReserveWriteOffOrder[],
  integralSettings: [] as IntegralSetting[],
  integralLogs: [] as IntegralWriteOffLog[],

  init() {
    if (this.couponOrders.length > 0)
      return

    this.couponOrders = Array.from({ length: 42 }).map((_, index) => ({
      uoId: `UO_${(index + 1).toString().padStart(5, '0')}`,
      couponQrcode: `CPN${(100000 + index).toString()}`,
      couponName: index % 2 === 0 ? '停车抵扣券' : '保洁服务券',
      value: index % 2 === 0 ? '30元' : '1次',
      userName: generateChineseName(),
      tel: generatePhoneNumber(),
      createTime: formatDateTime(Date.now() - index * 3600 * 1000),
      remark: index % 2 === 0 ? '停车缴费使用' : '家政服务预约',
    }))

    this.reserveOrders = Array.from({ length: 36 }).map((_, index) => ({
      orderId: `RO_${(index + 1).toString().padStart(5, '0')}`,
      reserveQrcode: `RSV${(200000 + index).toString()}`,
      goodsName: index % 2 === 0 ? '羽毛球场' : '会议室',
      quantity: (index % 3) + 1,
      appointmentTime: formatDateTime(Date.now() + (index % 7) * 86400000).slice(0, 10),
      hours: `${9 + (index % 6)}:00-${10 + (index % 6)}:00`,
      personName: generateChineseName(),
      personTel: generatePhoneNumber(),
      createTime: formatDateTime(Date.now() - index * 1800 * 1000),
    }))

    this.integralSettings = [
      { settingId: 'IS_001', settingName: '员工积分核销', onceMaxIntegral: 200 },
    ]

    this.integralLogs = Array.from({ length: 28 }).map((_, index) => ({
      logId: `IL_${(index + 1).toString().padStart(5, '0')}`,
      ownerName: generateChineseName(),
      ownerTel: generatePhoneNumber(),
      integral: (index % 5 + 1) * 10,
      operatorName: '系统管理员',
      createTime: formatDateTime(Date.now() - index * 7200 * 1000),
      remark: '积分核销',
    }))
  },
}

couponDatabase.init()

export default defineUniAppMock([
  {
    url: '/app/couponProperty.listCouponPropertyUserDetail',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(180, 420)
      const params = { ...query, ...body }
      let list = [...couponDatabase.couponOrders]

      if (params.couponQrcode) {
        const code = String(params.couponQrcode).trim()
        list = list.filter(item => item.couponQrcode.includes(code))
      }

      return successResponse(
        createPaginationResponse(list, Number(params.page) || 1, Number(params.row) || 10),
        '查询成功',
      )
    },
  },
  {
    url: '/app/couponProperty.writeOffCouponPropertyUser',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(160, 360)
      const data = body || {}
      const code = String(data.couponQrcode || '').trim()
      if (code) {
        couponDatabase.couponOrders.unshift({
          uoId: generateId('UO'),
          couponQrcode: code,
          couponName: '扫码核销券',
          value: '50元',
          userName: '扫码用户',
          tel: generatePhoneNumber(),
          createTime: formatDateTime(),
          remark: '扫码核销',
        })
      }
      return successResponse({ success: true }, '核销成功')
    },
  },
  {
    url: '/app/integral.listIntegralSetting',
    method: ['GET', 'POST'],
    body: async () => {
      await randomDelay(120, 280)
      return successResponse(couponDatabase.integralSettings, '查询成功')
    },
  },
  {
    url: '/app/integral.useIntegral',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(160, 360)
      const data = body || {}
      couponDatabase.integralLogs.unshift({
        logId: generateId('IL'),
        ownerName: String(data.ownerName || '未命名用户'),
        ownerTel: String(data.ownerTel || ''),
        integral: Number(data.integral || 0),
        operatorName: '当前员工',
        createTime: formatDateTime(),
        remark: String(data.remark || '积分核销'),
      })
      return successResponse({ success: true }, '核销成功')
    },
  },
  {
    url: '/app/integral.listIntegralUserDetail',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(160, 360)
      const params = { ...query, ...body }
      let list = [...couponDatabase.integralLogs]
      if (params.ownerTel) {
        const ownerTel = String(params.ownerTel).trim()
        list = list.filter(item => item.ownerTel.includes(ownerTel))
      }
      return successResponse(
        createPaginationResponse(list, Number(params.page) || 1, Number(params.row) || 10),
        '查询成功',
      )
    },
  },
  {
    url: '/app/reserveOrder.listReserveGoodsConfirmOrder',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(160, 360)
      const params = { ...query, ...body }
      let list = [...couponDatabase.reserveOrders]
      if (params.reserveQrcode) {
        const code = String(params.reserveQrcode).trim()
        list = list.filter(item => item.reserveQrcode.includes(code))
      }
      return successResponse(
        createPaginationResponse(list, Number(params.page) || 1, Number(params.row) || 10),
        '查询成功',
      )
    },
  },
  {
    url: '/app/reserveOrder.saveReserveGoodsConfirmOrder',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(160, 360)
      const data = body || {}
      const code = String(data.timeId || '').trim()
      if (code) {
        couponDatabase.reserveOrders.unshift({
          orderId: generateId('RO'),
          reserveQrcode: code,
          goodsName: '扫码预约服务',
          quantity: 1,
          appointmentTime: formatDateTime().slice(0, 10),
          hours: '09:00-10:00',
          personName: '扫码用户',
          personTel: generatePhoneNumber(),
          createTime: formatDateTime(),
        })
      }
      return successResponse({ success: true }, '核销成功')
    },
  },
])
