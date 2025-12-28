/**
 * form-section-title 组件类型定义
 */

/** 表单分区标题组件属性 */
export interface FormSectionTitleProps {
  /** 标题文本 */
  title: string
  /** 是否显示必填标记 */
  required?: boolean
  /** 是否启用呼吸动效 */
  animated?: boolean
  /** 图标名称 */
  icon?: string
  /** 图标的自定义类名 */
  iconClass?: string
  /** 副标题/描述文本 */
  subtitle?: string
}
