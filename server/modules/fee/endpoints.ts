import type { FeeDetailParams } from '../../../src/types/fee.ts'
import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { FeeModuleRepository } from './repository.ts'
import { successResponse } from '../../shared/runtime/response-builder.ts'
import { feeMockRepository } from './repository.ts'

/** 创建 `fee` 模块的共享 endpoint 定义。 */
export function createFeeEndpointDefinitions(
  repository: FeeModuleRepository = feeMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/fee.queryFeeDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getFeeDetailList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 50,
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        feeId: asOptionalString(params.feeId) || '',
      } satisfies FeeDetailParams), '查询费用详情成功'),
    },
  ]
}

/** 默认供 shared registry 直接注册的 fee 端点集合。 */
export const feeEndpointDefinitions = createFeeEndpointDefinitions()

/**
 * fee 的唯一旧 URL 与 property-application 共用，
 * 继续交由 legacy compatibility 合并处理。
 */
export const feeRuntimeEndpointDefinitions: EndpointDefinition[] = []

/** 把未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
