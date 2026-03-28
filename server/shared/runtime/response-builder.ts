import {
  errorResponse as sharedErrorResponse,
  successResponse as sharedSuccessResponse,
} from '@/api/mock/shared/utils'

/**
 * 共享成功响应构造器。
 *
 * 当前仍直接复用 mock 层的响应结构，
 * 目的是保证前端在切换到 Nitro 运行时后不需要额外适配响应契约。
 */
export const successResponse = sharedSuccessResponse

/**
 * 共享失败响应构造器。
 *
 * 显式在 `server/` 目录下重导出，是为了把“服务端与 mock 共用响应格式”这层设计意图保留下来。
 */
export const errorResponse = sharedErrorResponse
