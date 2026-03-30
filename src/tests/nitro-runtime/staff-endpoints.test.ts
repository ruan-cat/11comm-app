import { describe, expect, test } from 'vitest'
import { createStaffEndpointDefinitions } from '../../../server/modules/staff/endpoints'
import { createStaffMockRepository } from '../../../server/modules/staff/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('staff endpoints', () => {
  test('keeps literal routes ahead of the dynamic staff detail route', () => {
    const registry = createEndpointRegistry(createStaffEndpointDefinitions(createStaffMockRepository()))

    expect(findEndpointDefinition(registry, 'GET', '/app/staff/by-department')?.url).toBe('/app/staff/by-department')
    expect(findEndpointDefinition(registry, 'GET', '/app/staff/search')?.url).toBe('/app/staff/search')
    expect(findEndpointDefinition(registry, 'GET', '/app/staff/STAFF_001')?.url).toBe('/app/staff/:staffId')
  })

  test('keeps query list and dynamic detail response structures stable', async () => {
    const registry = createEndpointRegistry(createStaffEndpointDefinitions(createStaffMockRepository()))

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/query.staff.infos',
      query: {
        page: 1,
        row: 5,
      },
    })

    const staffId = listResponse.data.staffs[0].id

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: `/app/staff/${staffId}`,
    })

    expect(Array.isArray(listResponse.data.staffs)).toBe(true)
    expect(detailResponse.data).toMatchObject({
      id: staffId,
    })
  })
})
