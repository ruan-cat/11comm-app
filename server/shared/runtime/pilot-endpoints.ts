import repairMockDefinitions from '@/api/mock/repair.mock'
import workOrderMockDefinitions from '@/api/mock/work-order.mock'
import { createPilotRuntimeRepositories, resolveRuntimeDataSource } from './memory-repository'
import { adaptLegacyMockDefinitions } from './mock-definition-adapter'

/**
 * 当前试点模块的运行时仓储集合。
 *
 * 现阶段这份仓储还没有全面接入到旧 mock 逻辑里，
 * 但它已经作为 Nitro 试点的明确边界存在，确保后续切换 Neon 时有稳定扩展点。
 */
export const pilotRuntimeRepositories = createPilotRuntimeRepositories(resolveRuntimeDataSource())

/**
 * 当前试点模块的共享 endpoint 定义集合。
 *
 * 这里只纳入 `repair` 与 `work-order` 两个首批试点模块，
 * 避免首轮 Nitro 改造一开始就把全部 mock 目录同时卷进来。
 */
export const pilotEndpointDefinitions = [
  ...adaptLegacyMockDefinitions(repairMockDefinitions),
  ...adaptLegacyMockDefinitions(workOrderMockDefinitions),
]
