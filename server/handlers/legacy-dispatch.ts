import type { H3Event } from 'h3'
import { defineEventHandler } from 'h3'
import { createEndpointRegistry, dispatchEndpoint } from '../shared/runtime/endpoint-registry'
import { createDispatchInputFromNitroEvent } from '../shared/runtime/nitro-request-context'
import { pilotEndpointDefinitions } from '../shared/runtime/pilot-endpoints'

/**
 * 统一承接旧业务路径的 Nitro dispatcher。
 *
 * 设计目的：
 * 1. 当前阶段优先兼容 `/app/**`、`/callComponent/**` 等历史接口路径。
 * 2. 避免在 Nitro 首批试点阶段为每个旧接口都单独创建文件路由。
 * 3. 让 mock 与 Nitro 共享同一份 endpoint registry，先把运行时打通，再逐步细化模块结构。
 */
const registry = createEndpointRegistry(pilotEndpointDefinitions)

/** 把 Nitro 请求归一化后交给共享 registry 分发。 */
export default defineEventHandler(async (event: H3Event) => {
  const input = await createDispatchInputFromNitroEvent(event)
  return await dispatchEndpoint(registry, input)
})
