import { describe, expect, test } from 'vitest'
import config from '../../uno.config'

describe('uno config dynamic color support', () => {
  test('includes workbench dynamic color classes in safelist', () => {
    const safelist = config.safelist as string[]

    expect(safelist).toContain('text-colorui-red')
    expect(safelist).toContain('text-colorui-cyan')
    expect(safelist).toContain('bg-colorui-blue/10')
    expect(safelist).toContain('bg-colorui-cyan/10')
  })

  test('defines colorui cyan theme token', () => {
    const colors = config.theme?.colors as Record<string, string>

    expect(colors['colorui-cyan']).toBeTruthy()
  })
})
