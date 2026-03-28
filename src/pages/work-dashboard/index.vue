<!--
  工作台页面
  功能：聚合可直接进入的业务入口，便于物业人员从工作台访问常用模块

  访问地址: http://localhost:3000/#/pages/work-dashboard/index

  旧代码：gitee-example/pages/index/work.vue
-->

<script setup lang="ts">
import type { WorkbenchCategory, WorkbenchMenu } from './menu-config'
import { storeToRefs } from 'pinia'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { useUserStore } from '@/store'
import { getCurrentCommunity } from '@/utils/user'
import { workbenchCategories } from './menu-config'
import { getSurfaceThemeVars, resolveSurfaceTheme } from './menu-surface-theme'
import { createWorkbenchMenuNavigators } from './navigation'

definePage({
  style: {
    navigationStyle: 'custom',
    backgroundColor: '#F3F4F6',
  },
})

const toast = useGlobalToast()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

/** 获取当前小区 ID */
function getCurrentCommunityId() {
  return getCurrentCommunity().communityId
}

/** 工作台菜单导航映射 */
const workbenchMenuNavigators = createWorkbenchMenuNavigators({
  toActivityList: () => TypedRouter.toActivityList(),
  toAllocationAudit: () => TypedRouter.toAllocationAudit(),
  toAllocationManage: () => TypedRouter.toAllocationManage(),
  toAppointment: () => TypedRouter.toAppointment(),
  toApplyRoomList: () => TypedRouter.toApplyRoomList(),
  toBarrierGate: () => TypedRouter.toBarrierGate(),
  toChargeMachineOrder: () => TypedRouter.toChargeMachineOrder(),
  toComplaintFinish: () => TypedRouter.toComplaintFinish(),
  toComplaintList: () => TypedRouter.toComplaintList(),
  toComplaintOrder: () => TypedRouter.toComplaintOrder(),
  toDataReport: () => TypedRouter.toDataReport(),
  toFeeRoomPay: () => TypedRouter.toFeeRoomPay({ communityId: getCurrentCommunityId() }),
  toFeeSummary: () => TypedRouter.toFeeSummary(),
  toInspectionTaskList: () => TypedRouter.toInspectionTaskList(),
  toItemOutAudit: () => TypedRouter.toItemOutAudit(),
  toItemOutManage: () => TypedRouter.toItemOutManage(),
  toItemRelease: () => TypedRouter.toItemRelease(),
  toMaintenanceTaskList: () => TypedRouter.toMaintenanceTaskList(),
  toMeterReading: () => TypedRouter.toMeterReading(),
  toNoticeList: () => TypedRouter.toNoticeList(),
  toOaWorkflow: () => TypedRouter.toOaWorkflow(),
  toOpenDoorLog: () => TypedRouter.toOpenDoorLog(),
  toOwnerCar: () => TypedRouter.toOwnerCar(),
  toOwnerList: () => TypedRouter.toOwnerList(),
  toPayFeeDetail: () => TypedRouter.toPayFeeDetail(),
  toPropertyRenovation: () => TypedRouter.toPropertyRenovation(),
  toPurchaseApplyAudit: () => TypedRouter.toPurchaseApplyAudit(),
  toPurchaseApplyManage: () => TypedRouter.toPurchaseApplyManage(),
  toRepairDispatch: () => TypedRouter.toRepairDispatch(),
  toRepairFinish: () => TypedRouter.toRepairFinish(),
  toRepairList: () => TypedRouter.toRepairList(),
  toResourceStoreManage: () => TypedRouter.toResourceStoreManage(),
  toRoomFeeReport: () => TypedRouter.toRoomFeeReport(),
  toVisitList: () => TypedRouter.toVisitList(),
  toWorkCopy: () => TypedRouter.toWorkCopy(),
  toWorkDo: () => TypedRouter.toWorkDo(),
  toWorkStart: () => TypedRouter.toWorkStart(),
  toWriteOffCoupon: () => TypedRouter.toWriteOffCoupon(),
  toWriteOffReserve: () => TypedRouter.toWriteOffReserve(),
  toAddRepair: () => TypedRouter.toAddRepair(getCurrentCommunityId()),
})

/** 处理工作台菜单点击 */
function handleMenuClick(menu: WorkbenchMenu) {
  const navigate = workbenchMenuNavigators[menu.navigationKey]

  if (!navigate) {
    toast.warning('暂未配置对应入口')
    return
  }

  navigate()
}

/** 获取分类卡片的渐变底色 */
function getCategoryCardStyle(category: WorkbenchCategory) {
  return getSurfaceThemeVars(resolveSurfaceTheme(category.iconClass))
}
</script>

<template>
  <view class="workbench-page min-h-screen bg-gray-100">
    <view class="header relative overflow-hidden pb-20 pt-2 bg-gradient-blue">
      <view class="workbench-shell">
        <view class="hero-panel relative z-10 px-4 py-4">
          <view class="hero-main">
            <view class="avatar-wrapper mr-3">
              <image
                class="h-full w-full"
                :src="userInfo.avatar || '/static/images/default-avatar.png'"
                mode="aspectFill"
              />
            </view>
            <view class="flex flex-1 flex-col text-white">
              <text class="mb-1 text-lg font-bold">{{ userInfo.nickname || userInfo.username || '物业人员' }}</text>
              <view class="flex items-center opacity-90">
                <view class="i-carbon-building mr-1 text-sm" />
                <text class="text-xs">智慧社区</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="decor-circle-1" />
      <view class="decor-circle-2" />
    </view>

    <view class="relative z-10 px-3 -mt-12">
      <view class="workbench-shell">
        <view
          v-for="category in workbenchCategories"
          :key="category.title"
          class="category-card mb-3"
          :style="getCategoryCardStyle(category)"
        >
          <FormSectionTitle
            :title="category.title"
            :icon="category.icon"
            :icon-class="category.iconClass"
            :animated="true"
            background="transparent"
          />

          <view class="menu-grid">
            <view
              v-for="menu in category.menus"
              :key="menu.id"
              class="menu-item"
              @click="handleMenuClick(menu)"
            >
              <view class="icon-wrapper" :class="menu.bgClass">
                <view :class="[menu.icon, menu.iconClass]" class="text-2xl" />
                <view v-if="menu.badge" class="badge">
                  {{ menu.badge > 99 ? '99+' : menu.badge }}
                </view>
              </view>
              <text class="menu-name">{{ menu.name }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="h-4" />
  </view>
</template>

<style scoped lang="scss">
.workbench-page {
  background:
    radial-gradient(circle at top left, rgba(91, 153, 255, 0.14), transparent 30%),
    linear-gradient(180deg, #eff5ff 0%, #f7f9fc 45%, #fafbfc 100%);
  padding-bottom: env(safe-area-inset-bottom);
}

.workbench-shell {
  width: min(100%, 1360px);
  margin: 0 auto;
}

.hero-panel {
  overflow: hidden;
  margin: 0 8rpx;
  padding: 22rpx 24rpx 30rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.14);
  border-radius: 32rpx;
  background: linear-gradient(145deg, rgba(18, 78, 179, 0.14), rgba(255, 255, 255, 0.06));
  box-shadow: 0 24rpx 50rpx rgba(16, 54, 125, 0.14);
  backdrop-filter: blur(18rpx);
}

.hero-panel::after {
  content: '';
  position: absolute;
  top: -40rpx;
  right: -20rpx;
  width: 220rpx;
  height: 220rpx;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.18), transparent 68%);
  pointer-events: none;
}

.hero-main {
  position: relative;
  z-index: 1;
}

.hero-main {
  display: flex;
  align-items: center;
}

.avatar-wrapper {
  width: 112rpx;
  height: 112rpx;
  overflow: hidden;
  border: 4rpx solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
}

.decor-circle-1 {
  position: absolute;
  top: -40rpx;
  right: -40rpx;
  width: 160rpx;
  height: 160rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  filter: blur(20rpx);
}

.decor-circle-2 {
  position: absolute;
  bottom: -20rpx;
  left: 0;
  width: 100%;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50% 50% 0 0;
  filter: blur(10rpx);
}

.category-card {
  overflow: hidden;
  border-radius: 24rpx;
  background: linear-gradient(135deg, var(--surface-start) 0%, var(--surface-end) 100%);
  border: 2rpx solid var(--surface-border);
  box-shadow: 0 18rpx 40rpx var(--surface-shadow);
  backdrop-filter: blur(18rpx);
}

:deep(.form-section-title-cell) {
  border-radius: 24rpx 24rpx 0 0 !important;
  margin-bottom: 0 !important;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
  padding: 24rpx 16rpx;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 18rpx 10rpx;
  background: linear-gradient(180deg, var(--tile-start) 0%, var(--tile-end) 100%);
  border: 2rpx solid var(--tile-border);
  border-radius: 20rpx;
  box-shadow: 0 8rpx 18rpx rgba(15, 23, 42, 0.05);
  transition: opacity 0.2s;

  &:active {
    opacity: 0.7;
  }
}

.icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  margin-bottom: 16rpx;
  border-radius: 24rpx;
  transition: transform 0.2s;

  .menu-item:active & {
    transform: scale(0.95);
  }
}

.badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  font-size: 20rpx;
  color: #fff;
  background: #e54d42;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 8rpx rgba(229, 77, 66, 0.3);
}

.menu-name {
  font-size: 24rpx;
  font-weight: 500;
  color: #46556f;
  text-align: center;
  line-height: 1.4;
}
</style>
