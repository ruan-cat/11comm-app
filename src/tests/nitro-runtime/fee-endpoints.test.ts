import { describe, expect, test } from 'vitest'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'
import {
  createFeeEndpointDefinitions,
  feeRuntimeEndpointDefinitions,
} from '../../../server/modules/fee/endpoints'
import { createFeeMockRepository } from '../../../server/modules/fee/repository'

describe('fee endpoints', () => {
  test('registers shared fee endpoints', () => {
    const registry = createEndpointRegistry(
      createFeeEndpointDefinitions(createFeeMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/fee.queryFeeDetail')).toBeTruthy()
  })

  test('keeps the duplicate fee detail URL out of the Nitro priority layer', () => {
    expect(feeRuntimeEndpointDefinitions).toHaveLength(0)
  })

  test('keeps fee detail response structures stable', async () => {
    const registry = createEndpointRegistry(
      createFeeEndpointDefinitions(createFeeMockRepository()),
    )

    const response = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/fee.queryFeeDetail',
      query: {
        page: 1,
        row: 10,
        communityId: 'COMM_001',
        feeId: 'FEE_001',
      },
    })

    expect(Array.isArray(response.data.list)).toBe(true)
    expect(response.data.list[0]).toMatchObject({
      feeId: 'FEE_001',
      communityId: 'COMM_001',
    })
  })
})
