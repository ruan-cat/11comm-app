import type { EndpointDefinition } from './endpoint-registry'

/**
 * 旧版 Vite mock 定义的最小形态。
 *
 * 当前试点阶段不直接重写全部 `*.mock.ts`，
 * 而是先通过 adapter 把旧定义接到共享 registry 上，控制首批改造范围。
 */
export interface LegacyMockDefinition {
  body: (context: { body?: Record<string, any>, query?: Record<string, any> }) => any
  method: string | string[]
  url: string
}

/**
 * 把旧版 Vite mock 定义适配成共享 endpoint 定义。
 *
 * 这里最关键的处理不是函数包装，而是路径前缀剥离。
 * 现有 mock 文件为了兼容 H5 代理与前端 baseURL，可能会带双重 prefix；
 * Nitro 接入后必须把这些运行时耦合从路径层面剥掉，才能复用同一份业务逻辑。
 */
export function adaptLegacyMockDefinitions(
  definitions: LegacyMockDefinition[],
  prefix: string = import.meta.env?.VITE_APP_PROXY_PREFIX || '',
): EndpointDefinition[] {
  return definitions.map(definition => ({
    url: stripLegacyPrefix(definition.url, prefix),
    method: definition.method,
    handler: ({ query, body }) =>
      definition.body({
        query,
        body,
      }),
  }))
}

/**
 * 剥离旧版 mock 定义中的代理前缀。
 *
 * 这里同时处理单前缀与双前缀，
 * 是因为当前仓库的历史 mock 方案既受 Vite proxy 影响，也受请求层 baseURL 影响。
 */
function stripLegacyPrefix(url: string, prefix: string): string {
  if (!prefix) {
    return url
  }

  const doublePrefix = `${prefix}${prefix}`
  if (url.startsWith(doublePrefix)) {
    return url.slice(doublePrefix.length)
  }

  if (url.startsWith(prefix)) {
    return url.slice(prefix.length)
  }

  return url
}
