<!--
  表单分区标题组件
  用于表单页面的分区标题，提供统一美观的标题样式

  功能：
  - 提供统一的标题样式
  - 支持呼吸动效
  - 支持图标和必填标记
  - 淡灰色背景与白色表单项形成对比
-->

<script setup lang="ts">
import type { FormSectionTitleProps } from './types'

const props = withDefaults(defineProps<FormSectionTitleProps>(), {
  required: false,
  animated: true,
  icon: '',
  iconClass: '',
  subtitle: '',
})
</script>

<template>
  <wd-cell custom-class="form-section-title-cell">
    <template #title>
      <view class="flex items-center gap-2">
        <!-- 左侧装饰条 -->
        <view
          class="h-4 w-1 rounded-full"
          :class="animated ? 'animate-pulse bg-gradient-to-b from-blue-400 to-blue-600' : 'bg-blue-500'"
        />

        <!-- 图标（可选） -->
        <wd-icon
          v-if="icon"
          :name="icon"
          :custom-class="iconClass || 'text-blue-500'"
          size="18px"
        />

        <!-- 标题文本 -->
        <view class="flex items-center gap-1">
          <text
            class="text-base font-semibold"
            :class="animated ? 'text-gray-800' : 'text-gray-700'"
          >
            {{ title }}
          </text>
          <!-- 必填标记 -->
          <text v-if="required" class="text-base text-red-500">*</text>
        </view>

        <!-- 副标题（可选） -->
        <text v-if="subtitle" class="ml-1 text-xs text-gray-400">
          {{ subtitle }}
        </text>
      </view>
    </template>
  </wd-cell>
</template>

<style scoped>
/* 自定义 wd-cell 样式 */
:deep(.form-section-title-cell) {
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
  padding: 12px 16px;
  margin-bottom: 2px;
  border-radius: 0;
}

/* 呼吸动效增强 */
@keyframes breathe {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

:deep(.form-section-title-cell)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
  animation: breathe 3s ease-in-out infinite;
  pointer-events: none;
}
</style>
