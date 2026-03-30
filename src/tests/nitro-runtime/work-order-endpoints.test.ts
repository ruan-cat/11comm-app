import { describe, expect, test } from 'vitest'
import {
  createWorkOrderEndpointDefinitions,
} from '../../../server/modules/work-order/endpoints'
import { createWorkOrderMockRepository } from '../../../server/modules/work-order/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('work-order endpoints', () => {
  test('registers shared work-order endpoints', () => {
    const registry = createEndpointRegistry(
      createWorkOrderEndpointDefinitions(createWorkOrderMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/workorder/todo/list')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/workorder/detail')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/workorder/cancel')).toBeTruthy()
  })

  test('keeps list and detail response structures stable', async () => {
    const registry = createEndpointRegistry(
      createWorkOrderEndpointDefinitions(createWorkOrderMockRepository()),
    )

    const listResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/workorder/todo/list',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/workorder/detail',
      query: {
        orderId: listResponse.data.list[0].orderId,
      },
    })

    expect(Array.isArray(listResponse.data.list)).toBe(true)
    expect(listResponse.data.list.length).toBeGreaterThan(0)
    expect(detailResponse).toMatchObject({
      success: true,
      data: {
        order: {
          orderId: listResponse.data.list[0].orderId,
        },
      },
    })
  })

  test('persists repository mutations across create, start, complete and audit endpoints', async () => {
    const registry = createEndpointRegistry(
      createWorkOrderEndpointDefinitions(createWorkOrderMockRepository()),
    )

    const createResponse = await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/workorder/create',
      body: {
        title: '测试工作单',
        type: '1',
        priority: '2',
        content: '巡检地下车库消防设施',
        planStartTime: '2026-03-30 09:00:00',
        planEndTime: '2026-03-30 18:00:00',
        communityId: 'COMM_001',
      },
    })
    const orderId = createResponse.data.orderId

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/workorder/start',
      body: {
        orderId,
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/workorder/complete',
      body: {
        orderId,
        remark: '已处理完成',
        photos: ['https://example.com/photo-1.jpg'],
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/workorder/audit',
      body: {
        orderId,
        result: 'pass',
      },
    })

    const detailResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/workorder/detail',
      query: {
        orderId,
      },
    })

    expect(detailResponse.data.order).toMatchObject({
      orderId,
      status: '10003',
      statusName: '已完成',
    })
  })
})
