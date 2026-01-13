<!--
  表单分区标题组件
  用于表单页面的分区标题，提供统一美观的标题样式

  功能：
  - 提供统一的标题样式
  - 支持呼吸动效
  - 支持图标和必填标记
  - 支持 wot-design-uni 内置图标和 UnoCSS Iconify 图标
  - 淡灰色背景与白色表单项形成对比
-->

<script setup lang="ts">
import type { FormSectionTitleProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<FormSectionTitleProps>(), {
  required: false,
  animated: true,
  icon: '',
  iconClass: '',
  subtitle: '',
})

/** 判断是否为 Iconify 图标（以 'i-' 开头） */
const isIconifyIcon = computed(() => props.icon.startsWith('i-'))
</script>

<template>
  <wd-cell custom-class="form-section-title-cell">
    <template #title>
      <view class="flex items-center gap-2">
        <!-- 左侧装饰条 -->
        <view
          class="h-4 w-1 flex-shrink-0 rounded-full"
          :class="animated ? 'animate-pulse bg-gradient-to-b from-blue-400 to-blue-600' : 'bg-blue-500'"
        />

        <!-- 图标（可选） -->
        <!-- Iconify 图标（以 'i-' 开头） -->
        <view
          v-if="icon && isIconifyIcon"
          :class="[icon, iconClass || 'text-blue-500']"
          class="flex-shrink-0 text-lg"
        />
        <!-- wot-design-uni 内置图标 -->
        <wd-icon
          v-else-if="icon"
          :name="icon"
          :custom-class="iconClass || 'text-blue-500'"
          size="18px"
          custom-style="flex-shrink: 0;"
        />

        <!-- 主标题（不换行） -->
        <view class="flex flex-shrink-0 items-center gap-1">
          <text
            class="whitespace-nowrap text-base font-semibold"
            :class="animated ? 'text-gray-800' : 'text-gray-700'"
          >
            {{ title }}
          </text>
          <!-- 必填标记 -->
          <text v-if="required" class="text-base text-red-500">*</text>
        </view>

        <!-- 副标题（可选，同行显示） -->
        <text v-if="subtitle" class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
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
