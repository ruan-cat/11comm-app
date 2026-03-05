/**
 * 视频监控模块 Mock 接口
 */

import type { MonitorArea, MonitorMachine } from '@/types/video'
import {
  createPaginationResponse,
  defineUniAppMock,
  randomDelay,
  successResponse,
} from './shared/utils'

const areaList: MonitorArea[] = [
  { maId: '', maName: '全部区域' },
  { maId: 'AREA_001', maName: '北门通道' },
  { maId: 'AREA_002', maName: '南门广场' },
  { maId: 'AREA_003', maName: '地下车库' },
]

const machineList: MonitorMachine[] = Array.from({ length: 26 }).map((_, index) => ({
  machineId: `MACHINE_${(index + 1).toString().padStart(4, '0')}`,
  communityId: 'COMM_001',
  machineName: `监控设备-${(index + 1).toString().padStart(2, '0')}`,
  maId: index % 3 === 0 ? 'AREA_001' : index % 3 === 1 ? 'AREA_002' : 'AREA_003',
  maName: index % 3 === 0 ? '北门通道' : index % 3 === 1 ? '南门广场' : '地下车库',
  photoUrl: `https://picsum.photos/seed/video-${index + 1}/640/360`,
}))

export default defineUniAppMock([
  {
    url: '/app/video.listMonitorArea',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(160, 300)
      const params = { ...query, ...body }
      return successResponse(
        createPaginationResponse(
          areaList,
          Number(params.page) || 1,
          Number(params.row) || 20,
        ),
        '查询成功',
      )
    },
  },
  {
    url: '/app/video.listStaffMonitorMachine',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(180, 320)
      const params = { ...query, ...body }
      let list = [...machineList]

      if (params.maId) {
        list = list.filter(item => item.maId === String(params.maId))
      }

      if (params.machineNameLike) {
        const keyword = String(params.machineNameLike).trim()
        list = list.filter(item => item.machineName.includes(keyword))
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
    url: '/app/video.getPlayVideoUrl',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(120, 260)
      const params = { ...query, ...body }
      const machineId = String(params.machineId || 'MACHINE_0001')
      return successResponse(
        {
          url: `https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4?machineId=${encodeURIComponent(machineId)}`,
        },
        '查询成功',
      )
    },
  },
])
