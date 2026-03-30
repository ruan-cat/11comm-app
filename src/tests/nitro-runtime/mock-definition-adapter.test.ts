import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineUniAppMock } from '@/api/mock/shared/utils'

describe('mock definition adapter', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test('adds a single proxy prefix for vite mock urls', () => {
    vi.stubEnv('VITE_APP_PROXY_PREFIX', '/dev-api')

    const definitions = defineUniAppMock([
      {
        url: '/app/example/list',
        method: 'GET',
        body: () => ({ ok: true }),
      },
    ])

    expect(definitions[0].url).toBe(`${import.meta.env.VITE_APP_PROXY_PREFIX}/app/example/list`)
  })
})
