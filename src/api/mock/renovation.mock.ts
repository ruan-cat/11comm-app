/**
 * 装修管理 Mock 接口
 */

import type {
  RenovationApplication,
  RenovationRecord,
  RenovationRecordMedia,
} from '@/types/property-management'
import {
  createPaginationResponse,
  defineUniAppMock,
  errorResponse,
  formatDateTime,
  generateChineseName,
  generatePhoneNumber,
  mockLog,
  randomDelay,
  ResultEnumMap,
  successResponse,
} from './shared/utils'

function getStateName(state: number) {
  const stateMap: Record<number, string> = {
    1000: '待审核',
    2000: '审核不通过',
    3000: '施工中',
    4000: '待验收',
    5000: '验收通过',
    6000: '验收不通过',
  }
  return stateMap[state] || '未知状态'
}

const renovationDatabase = {
  renovations: [] as RenovationApplication[],
  records: [] as RenovationRecord[],
  recordMedia: [] as RenovationRecordMedia[],

  init() {
    if (this.renovations.length > 0)
      return

    for (let i = 1; i <= 36; i++) {
      const state = [1000, 3000, 4000, 5000][i % 4]
      const rId = `REN_${i.toString().padStart(4, '0')}`
      const roomId = `ROOM_${i.toString().padStart(4, '0')}`
      const roomName = `${Math.floor((i - 1) / 6) + 1}栋${(i % 6) + 1}${((i % 28) + 1).toString().padStart(2, '0')}室`

      const renovation: RenovationApplication = {
        rId,
        communityId: 'COMM_001',
        roomId,
        roomName,
        userId: `U_${i.toString().padStart(4, '0')}`,
        personName: generateChineseName(),
        personTel: generatePhoneNumber(),
        startTime: formatDateTime(Date.now() - i * 86400000 * 3),
        endTime: formatDateTime(Date.now() + i * 86400000),
        renovationCompany: `筑家装修公司${(i % 5) + 1}`,
        personMain: generateChineseName(),
        personMainTel: generatePhoneNumber(),
        isPostpone: i % 7 === 0 ? 'Y' : 'N',
        postponeTime: i % 7 === 0 ? formatDateTime(Date.now() + i * 86400000 * 2) : '',
        remark: '房屋装修申请',
        state,
        stateName: getStateName(state),
        isViolation: i % 9 === 0 ? 'Y' : 'N',
      }

      this.renovations.push(renovation)

      const recordId = `RR_${i.toString().padStart(4, '0')}`
      this.records.push({
        recordId,
        rId,
        communityId: renovation.communityId,
        roomId,
        roomName,
        state,
        stateName: renovation.stateName,
        staffName: generateChineseName(),
        remark: `${renovation.stateName}跟踪记录`,
        createTime: formatDateTime(Date.now() - i * 3600000),
        isTrue: renovation.isViolation === 'Y' ? 'true' : 'false',
      })

      if (i % 2 === 0) {
        this.recordMedia.push({
          detailId: `RM_IMG_${i}`,
          recordId,
          relTypeCd: 19000,
          url: `https://picsum.photos/seed/renovation-${i}/400/300`,
          remark: '现场图片',
        })
      }

      if (i % 5 === 0) {
        this.recordMedia.push({
          detailId: `RM_VIDEO_${i}`,
          recordId,
          relTypeCd: 21000,
          url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          remark: '现场视频',
        })
      }
    }
  },

  queryRenovations(params: { page: number, row: number, communityId?: string, roomName?: string, state?: string }) {
    let list = [...this.renovations]

    if (params.communityId) {
      list = list.filter(item => item.communityId === params.communityId)
    }

    if (params.roomName) {
      list = list.filter(item => item.roomName.includes(params.roomName as string))
    }

    if (params.state) {
      list = list.filter(item => String(item.state) === String(params.state))
    }

    return createPaginationResponse(list, params.page, params.row)
  },

  queryRecords(params: { page: number, row: number, rId: string, communityId?: string, roomName?: string, roomId?: string }) {
    let list = this.records.filter(item => item.rId === params.rId)

    if (params.communityId) {
      list = list.filter(item => item.communityId === params.communityId)
    }

    if (params.roomName) {
      list = list.filter(item => item.roomName.includes(params.roomName as string))
    }

    if (params.roomId) {
      list = list.filter(item => item.roomId === params.roomId)
    }

    return createPaginationResponse(list, params.page, params.row)
  },

  updateExamine(rId: string, state: number, remark: string) {
    const renovation = this.renovations.find(item => item.rId === rId)
    if (!renovation)
      return false

    renovation.state = state
    renovation.stateName = getStateName(state)
    renovation.remark = remark || renovation.remark

    this.records.unshift({
      recordId: `RR_${Date.now()}`,
      rId: renovation.rId,
      communityId: renovation.communityId,
      roomId: renovation.roomId,
      roomName: renovation.roomName,
      state,
      stateName: renovation.stateName,
      staffName: '系统审核员',
      remark,
      createTime: formatDateTime(),
      isTrue: renovation.isViolation === 'Y' ? 'true' : 'false',
    })

    return true
  },

  finishRenovation(rId: string) {
    const renovation = this.renovations.find(item => item.rId === rId)
    if (!renovation)
      return false

    renovation.state = 4000
    renovation.stateName = getStateName(4000)
    return true
  },

  addRecord(payload: {
    rId: string
    communityId: string
    roomId: string
    roomName: string
    state: number
    stateName: string
    remark: string
    isTrue?: string
    photos?: string[]
  }) {
    const recordId = `RR_${Date.now()}`
    this.records.unshift({
      recordId,
      rId: payload.rId,
      communityId: payload.communityId,
      roomId: payload.roomId,
      roomName: payload.roomName,
      state: payload.state,
      stateName: payload.stateName,
      staffName: '巡检人员',
      remark: payload.remark,
      createTime: formatDateTime(),
      isTrue: payload.isTrue,
    })

    ;(payload.photos || []).forEach((photoId, index) => {
      this.recordMedia.push({
        detailId: `RM_${photoId}_${index}`,
        recordId,
        relTypeCd: 19000,
        url: `https://picsum.photos/seed/${photoId}/400/300`,
      })
    })
  },

  deleteRecord(recordId: string) {
    const index = this.records.findIndex(item => item.recordId === recordId)
    if (index < 0)
      return false

    this.records.splice(index, 1)
    this.recordMedia = this.recordMedia.filter(item => item.recordId !== recordId)
    return true
  },

  getRecordMedia(recordId: string) {
    return this.recordMedia.filter(item => item.recordId === recordId)
  },
}

renovationDatabase.init()

export default defineUniAppMock([
  {
    url: '/app/roomRenovation/queryRoomRenovation',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(300, 600)
      const params = { ...query, ...body }
      mockLog('queryRoomRenovation', params)

      const result = renovationDatabase.queryRenovations({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: params.communityId || 'COMM_001',
        roomName: params.roomName,
        state: params.state,
      })

      return successResponse(result, '查询成功')
    },
  },
  {
    url: '/app/roomRenovation/updateRoomToExamine',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(300, 600)
      const data = body || {}
      mockLog('updateRoomToExamine', data)

      if (!data.rId || !data.state) {
        return errorResponse('参数不完整', ResultEnumMap.Error)
      }

      const success = renovationDatabase.updateExamine(data.rId, Number(data.state), data.examineRemark || '')
      if (!success) {
        return errorResponse('装修申请不存在', ResultEnumMap.NotFound)
      }

      return successResponse({ success: true }, '审核成功')
    },
  },
  {
    url: '/app/roomRenovation/saveRoomRenovationDetail',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(300, 600)
      const data = body || {}
      mockLog('saveRoomRenovationDetail', data)

      if (!data.rId || !data.state) {
        return errorResponse('参数不完整', ResultEnumMap.Error)
      }

      const success = renovationDatabase.updateExamine(data.rId, Number(data.state), data.examineRemark || '')
      if (!success) {
        return errorResponse('装修申请不存在', ResultEnumMap.NotFound)
      }

      return successResponse({ success: true }, '验收成功')
    },
  },
  {
    url: '/app/roomRenovation/updateRoomRenovationState',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(200, 500)
      const data = body || {}
      mockLog('updateRoomRenovationState', data)

      if (!data.rId) {
        return errorResponse('rId 不能为空', ResultEnumMap.Error)
      }

      const success = renovationDatabase.finishRenovation(data.rId)
      if (!success) {
        return errorResponse('装修申请不存在', ResultEnumMap.NotFound)
      }

      return successResponse({ success: true }, '状态更新成功')
    },
  },
  {
    url: '/app/roomRenovation/queryRoomRenovationRecord',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(300, 600)
      const params = { ...query, ...body }
      mockLog('queryRoomRenovationRecord', params)

      if (!params.rId) {
        return errorResponse('rId 不能为空', ResultEnumMap.Error)
      }

      const result = renovationDatabase.queryRecords({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        rId: String(params.rId),
        communityId: params.communityId,
        roomName: params.roomName,
        roomId: params.roomId,
      })

      return successResponse(result, '查询成功')
    },
  },
  {
    url: '/app/roomRenovation/queryRoomRenovationRecordDetail',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(200, 400)
      const params = { ...query, ...body }
      mockLog('queryRoomRenovationRecordDetail', params)

      if (!params.recordId) {
        return errorResponse('recordId 不能为空', ResultEnumMap.Error)
      }

      const media = renovationDatabase.getRecordMedia(String(params.recordId))
      return successResponse(media, '查询成功')
    },
  },
  {
    url: '/app/roomRenovation/updateRoomDecorationRecord',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(300, 600)
      const data = body || {}
      mockLog('updateRoomDecorationRecord', data)

      if (!data.rId || !data.roomId || !data.roomName || !data.communityId || !data.remark) {
        return errorResponse('参数不完整', ResultEnumMap.Error)
      }

      renovationDatabase.addRecord({
        rId: data.rId,
        communityId: data.communityId,
        roomId: data.roomId,
        roomName: data.roomName,
        state: Number(data.state) || 3000,
        stateName: data.stateName || getStateName(Number(data.state) || 3000),
        remark: data.remark,
        isTrue: data.isTrue,
        photos: data.photos || [],
      })

      return successResponse({ success: true }, '添加成功')
    },
  },
  {
    url: '/app/roomRenovation/deleteRoomRenovationRecord',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(200, 400)
      const data = body || {}
      mockLog('deleteRoomRenovationRecord', data)

      if (!data.recordId) {
        return errorResponse('recordId 不能为空', ResultEnumMap.Error)
      }

      const success = renovationDatabase.deleteRecord(String(data.recordId))
      if (!success) {
        return errorResponse('记录不存在', ResultEnumMap.NotFound)
      }

      return successResponse({ success: true }, '删除成功')
    },
  },
])
