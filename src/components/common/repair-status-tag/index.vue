<!--
  维修状态标签组件
  功能：显示维修工单状态标签，支持状态样式和呼吸动效

  功能点：
  - 统一管理维修状态标签的样式
  - 支持 5 种状态：待派单、已派单、处理中、已完成、已取消
  - 处理中状态支持丝绸呼吸动效
  - 做好向后的抽象扩展，可随时为其他状态增加动效
-->
<script setup lang="ts">
import type { REPAIR_STATUS_CONFIG_MAP, RepairStatusTagProps } from './types'

const props = withDefaults(defineProps<RepairStatusTagProps>(), {
  statusName: '',
  animated: true,
  plain: true,
})

/** 状态配置映射 */
const STATUS_CONFIG_MAP: typeof REPAIR_STATUS_CONFIG_MAP = {
  10001: { statusCd: '10001', statusName: '待派单', tagType: 'warning', animated: false },
  10002: { statusCd: '10002', statusName: '已派单', tagType: 'primary', animated: false },
  10003: { statusCd: '10003', statusName: '处理中', tagType: 'primary', animated: true },
  10004: { statusCd: '10004', statusName: '已完成', tagType: 'success', animated: false },
  10005: { statusCd: '10005', statusName: '已取消', tagType: 'danger', animated: false },
}

/** 获取状态配置 */
function getStatusConfig(statusCd: string) {
  return STATUS_CONFIG_MAP[statusCd] || STATUS_CONFIG_MAP[10001]
}

/** 获取显示文本 */
function getDisplayText(): string {
  if (props.statusName && props.statusName.trim()) {
    return props.statusName
  }
  return getStatusConfig(props.statusCd).statusName
}

/** 获取标签类型 */
function getTagType(): 'primary' | 'success' | 'warning' | 'danger' {
  return getStatusConfig(props.statusCd).tagType
}

/** 是否显示动效 */
function shouldAnimate(): boolean {
  if (!props.animated)
    return false
  return getStatusConfig(props.statusCd).animated || false
}

/** 获取状态对应的样式类 */
function getStatusClass(): string {
  const config = getStatusConfig(props.statusCd)
  switch (config.tagType) {
    case 'warning':
      return 'status-warning'
    case 'success':
      return 'status-success'
    case 'danger':
      return 'status-danger'
    default:
      return 'status-primary'
  }
}
</script>

<template>
  <view class="status-tag" :class="[getStatusClass()]">
    <!-- 处理中状态：丝绸动效 -->
    <template v-if="shouldAnimate()">
      <!-- 丝绸褶皱层：深浅蓝色交替流动 -->
      <view class="silk-folds" />
      <!-- 丝绸高光层：白色光带流转 -->
      <view class="silk-sheen" />
    </template>

    <text class="tag-text">{{ getDisplayText() }}</text>
  </view>
</template>

<style lang="scss" scoped>
// 统一尺寸
.status-tag {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 128rpx;
  height: 48rpx;
  border-radius: 8rpx;
  overflow: hidden;
  vertical-align: middle;
  box-sizing: border-box;
}

.tag-text {
  position: relative;
  z-index: 10;
  font-size: 28rpx;
  line-height: 1;
  font-weight: 500;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

// 待派单 - 橙色
.status-warning {
  background-color: #ff9900;
  color: #ffffff;
}

// 已派单 / 处理中 - 蓝色
.status-primary {
  background-color: #4a6cf7;
  color: #ffffff;
}

// 已完成 - 绿色
.status-success {
  background-color: #52c41a;
  color: #ffffff;
}

// 已取消 - 灰色
.status-danger {
  background-color: #f5f5f5;
  color: #999999;
  border: 2rpx solid #d9d9d9;
}

// ==================== 丝绸动效 ====================

// 丝绸褶皱层：深浅蓝色交替，模拟布料纹理
.silk-folds {
  position: absolute;
  inset: 0;
  width: 200%;
  height: 100%;
  z-index: 1;
  background: repeating-linear-gradient(115deg, #4a6cf7 0%, #5e7ff9 15%, #4a6cf7 30%, #3d5ce0 45%, #4a6cf7 60%);
  background-size: 50% 100%;
  animation: folds-flow 4s linear infinite;
}

// 丝绸高光层：半透明白色光带
.silk-sheen {
  position: absolute;
  inset: 0;
  width: 200%;
  height: 100%;
  z-index: 2;
  background: linear-gradient(
    115deg,
    transparent 20%,
    rgba(255, 255, 255, 0.12) 35%,
    rgba(255, 255, 255, 0.35) 50%,
    rgba(255, 255, 255, 0.12) 65%,
    transparent 80%
  );
  opacity: 0.9;
  animation: sheen-flow 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

// 褶皱层匀速流动
@keyframes folds-flow {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0%);
  }
}

// 高光层变速流动，产生丝绸飘动感
@keyframes sheen-flow {
  0% {
    transform: translateX(-100%) skewX(-10deg);
  }
  50% {
    transform: translateX(-20%) skewX(-20deg);
  }
  100% {
    transform: translateX(50%) skewX(-10deg);
  }
}
</style>
