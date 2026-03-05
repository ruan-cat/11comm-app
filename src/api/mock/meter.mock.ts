/**
 * 抄表模块 Mock 接口
 */

import type {
  FeeConfigItem,
  FeeTypeItem,
  FloorShareMeter,
  FloorShareReading,
  MeterReading,
  MeterTypeItem,
} from '@/types/meter'
import {
  createPaginationResponse,
  defineUniAppMock,
  formatDateTime,
  generateId,
  randomDelay,
  successResponse,
} from './shared/utils'

const feeTypes: FeeTypeItem[] = [
  { id: '888800010015', name: '水费' },
  { id: '888800010016', name: '电费' },
  { id: '888800010009', name: '燃气费' },
]

const feeConfigsMap: Record<string, FeeConfigItem[]> = {
  888800010015: [
    { configId: 'CFG_WATER_001', feeName: '居民生活用水' },
    { configId: 'CFG_WATER_002', feeName: '商业用水' },
  ],
  888800010016: [
    { configId: 'CFG_POWER_001', feeName: '居民生活用电' },
    { configId: 'CFG_POWER_002', feeName: '公共照明用电' },
  ],
  888800010009: [
    { configId: 'CFG_GAS_001', feeName: '居民燃气' },
  ],
}

const meterTypes: MeterTypeItem[] = [
  { typeId: '1010', typeName: '电表' },
  { typeId: '2020', typeName: '水表' },
  { typeId: '3030', typeName: '燃气表' },
]

const meterDatabase = {
  meterReadings: [] as MeterReading[],
  floorShareMeters: [] as FloorShareMeter[],
  floorShareReadings: [] as FloorShareReading[],

  init() {
    if (this.meterReadings.length > 0)
      return

    this.meterReadings = Array.from({ length: 60 }).map((_, index) => {
      const meterType = meterTypes[index % meterTypes.length]
      const floor = (index % 12) + 1
      const unit = (index % 4) + 1
      const room = ((index % 24) + 1).toString().padStart(2, '0')
      const pre = 100 + index * 3
      const cur = pre + 8 + (index % 5)
      return {
        readingId: `MR_${(index + 1).toString().padStart(5, '0')}`,
        objId: `ROOM_${(index + 1).toString().padStart(4, '0')}`,
        objName: `${floor}-${unit}-${room}`,
        meterType: meterType.typeId,
        meterTypeName: meterType.typeName,
        preDegrees: pre,
        curDegrees: cur,
        preReadingTime: formatDateTime(Date.now() - (index + 2) * 86400000),
        curReadingTime: formatDateTime(Date.now() - (index + 1) * 86400000),
        remark: '系统抄表记录',
      }
    })

    this.floorShareMeters = Array.from({ length: 16 }).map((_, index) => {
      const meterType = meterTypes[index % 2]
      return {
        fsmId: `FSM_${(index + 1).toString().padStart(4, '0')}`,
        floorNum: `${(index % 8) + 1}`,
        meterNum: `GSB-${(index + 11).toString().padStart(3, '0')}`,
        meterType: meterType.typeId,
        meterTypeName: meterType.typeName,
        curDegree: 1200 + index * 11,
        curReadingTime: formatDateTime(Date.now() - index * 86400000),
      }
    })

    this.floorShareReadings = Array.from({ length: 28 }).map((_, index) => {
      const meter = this.floorShareMeters[index % this.floorShareMeters.length]
      const pre = meter.curDegree + index
      const cur = pre + 12 + (index % 6)
      const state: FloorShareReading['state'] = index % 4 === 0 ? 'W' : 'C'
      return {
        readingId: `FSR_${(index + 1).toString().padStart(4, '0')}`,
        fsmId: meter.fsmId,
        floorNum: meter.floorNum,
        meterTypeName: meter.meterTypeName,
        preDegrees: pre,
        curDegrees: cur,
        preReadingTime: formatDateTime(Date.now() - (index + 2) * 86400000),
        curReadingTime: formatDateTime(Date.now() - (index + 1) * 86400000),
        state,
        stateName: state === 'W' ? '待审核' : '已通过',
        auditRemark: state === 'W' ? '' : '审核通过',
      }
    })
  },
}

meterDatabase.init()

export default defineUniAppMock([
  {
    url: '/app/meter.listMeterWaters',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)
      const params = { ...query, ...body }
      let list = [...meterDatabase.meterReadings]
      if (params.roomNum) {
        const roomNum = String(params.roomNum).trim()
        list = list.filter(item => item.objName.includes(roomNum))
      }
      return successResponse(
        createPaginationResponse(list, Number(params.page) || 1, Number(params.row) || 10),
        '查询成功',
      )
    },
  },
  {
    url: '/app/meter.queryFeeTypes',
    method: ['GET', 'POST'],
    body: async () => {
      await randomDelay(120, 240)
      return successResponse(feeTypes, '查询成功')
    },
  },
  {
    url: '/app/meter.queryFeeTypesItems',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(120, 260)
      const params = { ...query, ...body }
      const feeTypeCd = String(params.feeTypeCd || '')
      return successResponse(feeConfigsMap[feeTypeCd] || [], '查询成功')
    },
  },
  {
    url: '/app/meter.listMeterType',
    method: ['GET', 'POST'],
    body: async () => {
      await randomDelay(120, 260)
      return successResponse(meterTypes, '查询成功')
    },
  },
  {
    url: '/app/meter.queryPreMeterWater',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(120, 280)
      const params = { ...query, ...body }
      const objId = String(params.objId || '')
      const meterType = String(params.meterType || '')
      const found = meterDatabase.meterReadings.find(item => item.objId === objId && item.meterType === meterType)
      return successResponse({
        curDegrees: found?.curDegrees || 0,
        curReadingTime: found?.curReadingTime || formatDateTime(),
      }, '查询成功')
    },
  },
  {
    url: '/app/meter.saveMeterWater',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(200, 420)
      const data = body || {}
      meterDatabase.meterReadings.unshift({
        readingId: generateId('MR'),
        objId: String(data.objId || ''),
        objName: String(data.objName || ''),
        meterType: String(data.meterType || '2020'),
        meterTypeName: meterTypes.find(item => item.typeId === String(data.meterType || '2020'))?.typeName || '水表',
        preDegrees: Number(data.preDegrees || 0),
        curDegrees: Number(data.curDegrees || 0),
        preReadingTime: String(data.preReadingTime || formatDateTime()),
        curReadingTime: String(data.curReadingTime || formatDateTime()),
        remark: String(data.remark || ''),
      })
      return successResponse({ success: true }, '提交成功')
    },
  },
  {
    url: '/app/meter.listFloorShareReading',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(180, 420)
      const params = { ...query, ...body }
      return successResponse(
        createPaginationResponse(
          meterDatabase.floorShareReadings,
          Number(params.page) || 1,
          Number(params.row) || 10,
        ),
        '查询成功',
      )
    },
  },
  {
    url: '/app/meter.listFloorShareMeter',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(180, 420)
      const params = { ...query, ...body }
      let list = [...meterDatabase.floorShareMeters]
      if (params.fsmId) {
        list = list.filter(item => item.fsmId === String(params.fsmId))
      }
      return successResponse(
        createPaginationResponse(list, Number(params.page) || 1, Number(params.row) || 10),
        '查询成功',
      )
    },
  },
  {
    url: '/app/meter.saveFloorShareReading',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(180, 420)
      const data = body || {}
      const meter = meterDatabase.floorShareMeters.find(item => item.fsmId === String(data.fsmId))
      meterDatabase.floorShareReadings.unshift({
        readingId: generateId('FSR'),
        fsmId: String(data.fsmId || ''),
        floorNum: meter?.floorNum || '-',
        meterTypeName: meter?.meterTypeName || '-',
        preDegrees: Number(data.preDegrees || 0),
        curDegrees: Number(data.curDegrees || 0),
        preReadingTime: String(data.preReadingTime || formatDateTime()),
        curReadingTime: String(data.curReadingTime || formatDateTime()),
        state: 'W',
        stateName: '待审核',
        auditRemark: '',
      })
      return successResponse({ success: true }, '提交成功')
    },
  },
  {
    url: '/app/meter.auditFloorShareReading',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(150, 360)
      const data = body || {}
      const readingId = String(data.readingId || '')
      const state = String(data.state || 'C')
      const reading = meterDatabase.floorShareReadings.find(item => item.readingId === readingId)
      if (reading) {
        reading.state = state === 'F' ? 'F' : 'C'
        reading.stateName = state === 'F' ? '已拒绝' : '已通过'
        reading.auditRemark = String(data.auditRemark || '')
      }
      return successResponse({ success: true }, '审核成功')
    },
  },
])
