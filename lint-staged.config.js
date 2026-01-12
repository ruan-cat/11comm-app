/**
 * @filename: lint-staged.config.js
 * @description 用于配置lint-staged的配置文件。
 * @type {import('lint-staged').Configuration}
 * @see https://github.com/lint-staged/lint-staged/blob/main/README.md#typescript
 */
export default {
  /**
   * 排除 gitee-example 目录，对非 md 文件执行 lint:fix
   * @see https://github.com/lint-staged/lint-staged/blob/main/README.md#automatically-fix-code-style-with-prettier-for-any-format-prettier-supports
   * @description
   * 使用明确的文件扩展名匹配，避免 glob 模式的歧义
   * - 非 md 文件：执行 oxlint + eslint
   * - md 文件：仅执行 prettier 格式化
   */
  '*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,json,css,scss,html,yaml,yml}': 'pnpm run lint:fix',
  '*.md': 'prettier --ignore-unknown --experimental-cli --write',
  // gitee-example 目录下的文件不做任何处理
  'gitee-example/**': () => [],
}
