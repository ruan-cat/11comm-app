import type { FeeDetail, FeeDetailParams, FeeDetailResponse } from '../../../src/types/fee.ts'
import { FEE_NAME_OPTIONS, FEE_PAY_METHOD_OPTIONS } from '../../../src/constants/fee.ts'
import {
  generateId,
  generateTimeRange,
} from '../../shared/runtime/common-utils.ts'

export interface FeeModuleRepository {
  getFeeDetailList: (params: FeeDetailParams) => FeeDetailResponse
}

/** 创建 `fee` 模块的 mock 内存仓储。 */
export function createFeeMockRepository(): FeeModuleRepository {
  return new FeeDatabase()
}

/** fee 模块的 mock 内存仓储实现。 */
class FeeDatabase implements FeeModuleRepository {
  private readonly feeDetails: FeeDetail[] = [
    {
      detailId: 'FEE_DETAIL_001',
      feeId: 'FEE_001',
      feeName: '物业管理费',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      communityId: 'COMM_001',
      ownerName: '张三',
      receivedAmount: 300,
      payTime: '2024-01-15 10:30:00',
      payMethod: '微信支付',
      payState: 'PAID',
      createTime: '2024-01-15 10:30:00',
    },
    {
      detailId: 'FEE_DETAIL_002',
      feeId: 'FEE_001',
      feeName: '垃圾处理费',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      communityId: 'COMM_001',
      ownerName: '张三',
      receivedAmount: 50,
      payTime: '2024-01-15 10:31:00',
      payMethod: '微信支付',
      payState: 'PAID',
      createTime: '2024-01-15 10:31:00',
    },
    {
      detailId: 'FEE_DETAIL_003',
      feeId: 'FEE_001',
      feeName: '公共区域维护费',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      communityId: 'COMM_001',
      ownerName: '张三',
      receivedAmount: 100,
      payTime: '2024-01-15 10:32:00',
      payMethod: '微信支付',
      payState: 'PAID',
      createTime: '2024-01-15 10:32:00',
    },
    {
      detailId: 'FEE_DETAIL_004',
      feeId: 'FEE_002',
      feeName: '物业管理费',
      roomId: 'ROOM_002',
      roomName: '2栋202B室',
      communityId: 'COMM_001',
      ownerName: '李四',
      receivedAmount: 320,
      payTime: '2024-02-01 14:20:00',
      payMethod: '支付宝',
      payState: 'PAID',
      createTime: '2024-02-01 14:20:00',
    },
    {
      detailId: 'FEE_DETAIL_005',
      feeId: 'FEE_002',
      feeName: '垃圾处理费',
      roomId: 'ROOM_002',
      roomName: '2栋202B室',
      communityId: 'COMM_001',
      ownerName: '李四',
      receivedAmount: 60,
      payTime: '2024-02-01 14:21:00',
      payMethod: '支付宝',
      payState: 'PAID',
      createTime: '2024-02-01 14:21:00',
    },
    {
      detailId: 'FEE_DETAIL_006',
      feeId: 'FEE_003',
      feeName: '物业管理费',
      roomId: 'ROOM_003',
      roomName: '3栋303C室',
      communityId: 'COMM_001',
      ownerName: '王五',
      receivedAmount: 280,
      payTime: '2024-01-20 09:15:00',
      payMethod: '现金',
      payState: 'PAID',
      createTime: '2024-01-20 09:15:00',
    },
  ]

  constructor() {
    this.initMoreData()
  }

  getFeeDetailList(params: FeeDetailParams): FeeDetailResponse {
    let filteredData = [...this.feeDetails]

    if (params.communityId) {
      filteredData = filteredData.filter(item => item.communityId === params.communityId)
    }

    if (params.feeId) {
      filteredData = filteredData.filter(item => item.feeId === params.feeId)
    }

    const start = (params.page - 1) * params.row
    const end = start + params.row

    return cloneValue({
      list: filteredData.slice(start, end),
    })
  }

  /** 初始化更多费用明细。 */
  private initMoreData() {
    if (this.feeDetails.length < 200) {
      const additionalData = Array.from({ length: 194 }, (_, index) => {
        const roomId = `ROOM_${(index % 10) + 1}`
        const roomName = `${(index % 20) + 1}栋${String((index % 30) + 1).padStart(2, '0')}${String.fromCharCode(65 + (index % 8))}室`
        const ownerName = `业主${(index % 50) + 1}`
        const feeId = `FEE_${(index % 10) + 1}`

        return this.createMockFeeDetail(feeId, roomId, roomName, ownerName)
      })

      this.feeDetails.push(...additionalData)
    }
  }

  /** 生成模拟费用明细。 */
  private createMockFeeDetail(feeId: string, roomId: string, roomName: string, ownerName: string): FeeDetail {
    const feeNameItem = FEE_NAME_OPTIONS[Math.floor(Math.random() * FEE_NAME_OPTIONS.length)]
    const payMethodItem = FEE_PAY_METHOD_OPTIONS[Math.floor(Math.random() * FEE_PAY_METHOD_OPTIONS.length)]

    return {
      detailId: generateId('FEE_DETAIL'),
      feeId,
      feeName: `${feeNameItem.value}`,
      roomId,
      roomName,
      communityId: 'COMM_001',
      ownerName,
      receivedAmount: Math.floor(Math.random() * 500 + 50),
      payTime: generateTimeRange(-90, 0),
      payMethod: `${payMethodItem.value}`,
      payState: 'PAID',
      createTime: generateTimeRange(-90, 0),
    }
  }
}

/** 默认供运行时直接复用的 fee 仓储实例。 */
export const feeMockRepository = createFeeMockRepository()

/** 克隆仓储返回值，避免外部篡改内部引用。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
