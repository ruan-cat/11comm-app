/**
 * 车辆管理 Mock 接口
 */

import type {
  BarrierMachine,
  CarInoutDetail,
  CarInoutPayment,
  OwnerCar,
  ParkingArea,
  ParkingCoupon,
  TempCarInArea,
} from '@/types/parking'
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

const parkingDatabase = {
  ownerCars: [] as OwnerCar[],
  parkingAreas: [] as ParkingArea[],
  machines: [] as Array<BarrierMachine & { paNum: string }>,
  inouts: [] as CarInoutDetail[],
  payments: [] as CarInoutPayment[],
  tempInArea: [] as TempCarInArea[],
  coupons: [] as ParkingCoupon[],

  init() {
    if (this.ownerCars.length > 0)
      return

    this.parkingAreas = [
      { paId: 'PA_001', num: 'P1', name: '一期地下停车场' },
      { paId: 'PA_002', num: 'P2', name: '二期地面停车场' },
    ]

    this.machines = [
      {
        machineId: 'M_001',
        machineCode: 'MC_001',
        machineName: 'P1 入口道闸',
        boxId: 'BOX_001',
        direction: '3306',
        status: 'online',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        paNum: 'P1',
      },
      {
        machineId: 'M_002',
        machineCode: 'MC_002',
        machineName: 'P1 出口道闸',
        boxId: 'BOX_002',
        direction: '3307',
        status: 'online',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
        paNum: 'P1',
      },
      {
        machineId: 'M_003',
        machineCode: 'MC_003',
        machineName: 'P2 入口道闸',
        boxId: 'BOX_003',
        direction: '3306',
        status: 'online',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        paNum: 'P2',
      },
      {
        machineId: 'M_004',
        machineCode: 'MC_004',
        machineName: 'P2 出口道闸',
        boxId: 'BOX_004',
        direction: '3307',
        status: 'online',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
        paNum: 'P2',
      },
    ]

    for (let i = 1; i <= 40; i++) {
      const plate = `粤B${Math.floor(10000 + Math.random() * 89999)}`
      const owner = generateChineseName()
      const pa = this.parkingAreas[i % this.parkingAreas.length]

      this.ownerCars.push({
        carId: `CAR_${i.toString().padStart(4, '0')}`,
        carNum: plate,
        ownerName: owner,
        link: generatePhoneNumber(),
        roomName: `${Math.floor(i / 3) + 1}栋${(i % 6) + 1}${((i % 20) + 1).toString().padStart(2, '0')}室`,
        areaNum: pa.num,
        num: `P-${i.toString().padStart(3, '0')}`,
        state: i % 7 === 0 ? '2000' : '1001',
        stateName: i % 7 === 0 ? '已释放' : '正常',
        leaseType: i % 4 === 0 ? 'T' : 'H',
        leaseTypeName: i % 4 === 0 ? '临时车' : '月租车',
        startTime: formatDateTime(Date.now() - i * 86400000),
        endTime: formatDateTime(Date.now() + i * 86400000),
      })

      this.inouts.push({
        inoutId: `IO_${i.toString().padStart(4, '0')}`,
        carNum: plate,
        stateName: i % 2 === 0 ? '在场' : '已离场',
        paNum: pa.num,
        carTypeName: i % 4 === 0 ? '临时车' : '月租车',
        inTime: formatDateTime(Date.now() - i * 3600000),
        openTime: i % 2 === 0 ? '' : formatDateTime(Date.now() - i * 2400000),
        payCharge: Number((Math.random() * 30 + 5).toFixed(2)),
        hours: Math.floor(Math.random() * 5) + 1,
        min: Math.floor(Math.random() * 60),
        remark: '系统记录',
        photoJpg: `https://picsum.photos/seed/car-${i}/240/180`,
      })

      this.payments.push({
        inoutId: `IO_${i.toString().padStart(4, '0')}`,
        carNum: plate,
        stateName: '已支付',
        inTime: formatDateTime(Date.now() - i * 3600000),
        createTime: formatDateTime(Date.now() - i * 1800000),
        payTypeName: i % 3 === 0 ? '现金' : '扫码支付',
        payCharge: Number((Math.random() * 30 + 5).toFixed(2)),
        realCharge: Number((Math.random() * 28 + 3).toFixed(2)),
      })
    }

    this.tempInArea = this.inouts.slice(0, 12).map(item => ({
      inoutId: item.inoutId,
      paId: item.paNum === 'P1' ? 'PA_001' : 'PA_002',
      carNum: item.carNum,
      payCharge: item.payCharge,
      hours: item.hours,
      min: item.min,
    }))

    this.coupons = [
      { pccId: 'PCC_001', couponName: '停车优惠券A', typeCd: '2002', value: 5, state: '1001' },
      { pccId: 'PCC_002', couponName: '停车优惠券B', typeCd: '1001', value: 30, state: '1001' },
      { pccId: 'PCC_003', couponName: '停车优惠券C', typeCd: '3003', value: 8, state: '1001' },
    ]
  },
}

parkingDatabase.init()

export default defineUniAppMock([
  {
    url: '/app/owner.queryOwnerCars',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(300, 600)
      const params = { ...query, ...body }
      mockLog('queryOwnerCars', params)

      let list = [...parkingDatabase.ownerCars]
      if (params.carNumLike) {
        list = list.filter(item => item.carNum.includes(String(params.carNumLike)))
      }
      if (params.ownerName) {
        list = list.filter(item => item.ownerName.includes(String(params.ownerName)))
      }
      if (params.memberCarNumLike) {
        list = list.filter(item => item.carNum.includes(String(params.memberCarNumLike)))
      }
      if (params.num) {
        list = list.filter(item => item.num?.includes(String(params.num)))
      }
      if (params.link) {
        list = list.filter(item => item.link.includes(String(params.link)))
      }

      return successResponse(createPaginationResponse(list, Number(params.page) || 1, Number(params.row) || 10), '查询成功')
    },
  },
  {
    url: '/app/parkingArea.listParkingAreas',
    method: ['GET', 'POST'],
    body: async () => {
      await randomDelay(200, 500)
      return successResponse(parkingDatabase.parkingAreas, '查询成功')
    },
  },
  {
    url: '/app/machine.listParkingAreaMachines',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)
      const params = { ...query, ...body }
      let list = [...parkingDatabase.machines]
      if (params.paNum) {
        list = list.filter(item => item.paNum === params.paNum)
      }
      return successResponse(list, '查询成功')
    },
  },
  {
    url: '/app/machine/openDoor',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(200, 400)
      const data = body || {}
      if (!data.machineCode) {
        return errorResponse('machineCode 不能为空', ResultEnumMap.Error)
      }
      return successResponse({ success: true }, '开闸成功')
    },
  },
  {
    url: '/app/machine/closeDoor',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(200, 400)
      const data = body || {}
      if (!data.machineCode) {
        return errorResponse('machineCode 不能为空', ResultEnumMap.Error)
      }
      return successResponse({ success: true }, '关闸成功')
    },
  },
  {
    url: '/app/machine.customCarInOutCmd',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(300, 600)
      const data = body || {}
      mockLog('customCarInOut', data)

      if (!data.carNum || !data.type) {
        return errorResponse('参数不完整', ResultEnumMap.Error)
      }

      return successResponse({ success: true }, data.type === '1101' ? '车辆进场成功' : '车辆出场成功')
    },
  },
  {
    url: '/app/carInout.listCarInParkingAreaCmd',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(200, 400)
      const params = { ...query, ...body }
      let list = [...parkingDatabase.tempInArea]
      if (params.carNum) {
        list = list.filter(item => item.carNum.includes(String(params.carNum)))
      }
      if (params.paId) {
        list = list.filter(item => item.paId === params.paId)
      }
      return successResponse(list, '查询成功')
    },
  },
  {
    url: '/app/parkingCoupon.listParkingCouponCar',
    method: ['GET', 'POST'],
    body: async () => {
      await randomDelay(200, 400)
      return successResponse(parkingDatabase.coupons, '查询成功')
    },
  },
  {
    url: '/app/tempCarFee.getTempCarFeeOrder',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(200, 400)
      const params = { ...query, ...body }
      const couponCount = params.pccIds ? String(params.pccIds).split(',').filter(Boolean).length : 0
      const amount = Number(Math.max(0, 20 - couponCount * 3).toFixed(2))
      return successResponse({ amount }, '计算成功')
    },
  },
  {
    url: '/app/carInoutDetail.listCarInoutDetail',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(300, 600)
      const params = { ...query, ...body }
      let list = [...parkingDatabase.inouts]
      if (params.paNum) {
        list = list.filter(item => item.paNum === params.paNum)
      }
      return successResponse(createPaginationResponse(list, Number(params.page) || 1, Number(params.row) || 10), '查询成功')
    },
  },
  {
    url: '/app/carInoutPayment.listCarInoutPayment',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(300, 600)
      const params = { ...query, ...body }
      let list = [...parkingDatabase.payments]
      if (params.paNum) {
        list = list.filter(item => item.inoutId && item.carNum && params.paNum)
      }
      return successResponse(createPaginationResponse(list, Number(params.page) || 1, Number(params.row) || 10), '查询成功')
    },
  },
  {
    url: '/app/machine.getBarrierCloudVideo',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(200, 400)
      const params = { ...query, ...body }
      const machine = parkingDatabase.machines.find(item => item.machineId === params.machineId)
      if (!machine) {
        return errorResponse('设备不存在', ResultEnumMap.NotFound)
      }
      return successResponse({ url: machine.videoUrl }, '查询成功')
    },
  },
])
