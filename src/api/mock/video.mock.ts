/**
 * 视频监控模块 Mock 接口
 * 共享业务逻辑已经迁移到 `server/modules/video`，这里只保留 Vite mock 包装层。
 */

import { createLegacyMockDefinitionsFromEndpoints } from '../../../server/shared/runtime/mock-definition-adapter'
import { createVideoEndpointDefinitions } from '../../../server/modules/video/endpoints'
import { defineUniAppMock } from './shared/utils'

export default defineUniAppMock(
  createLegacyMockDefinitionsFromEndpoints(createVideoEndpointDefinitions()),
)
