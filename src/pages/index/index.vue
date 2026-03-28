<!--
  首页
  功能：作为物业业务首页，聚合主任务卡片与常用业务入口

  访问地址: http://localhost:3000/#/pages/index/index

  旧代码：gitee-example/pages/index/index.vue
-->

<script setup lang="ts">
import type { HomeMenuEntry } from './home-menu-config'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { createWorkbenchMenuNavigators } from '@/pages/work-dashboard/navigation'
import { TypedRouter } from '@/router'
import { getCurrentCommunity, getUserInfo } from '@/utils/user'
import { homeFeaturedEntries, homeHeaderSubtitle, homeHeaderTitle, homeSections } from './home-menu-config'

definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
    backgroundColor: '#F5F7FB',
  },
})

const toast = useGlobalToast()
const currentCommunity = getCurrentCommunity()
const currentUser = getUserInfo()

/** 构建首页 iconify 图标类名 */
function getEntryIconClass(entry: HomeMenuEntry, size: 'feature' | 'grid') {
  const sizeClass = size === 'feature'
    ? 'w-44rpx h-44rpx text-44rpx'
    : 'w-36rpx h-36rpx text-36rpx'

  return `${entry.icon} ${entry.iconClass} ${sizeClass} flex items-center justify-center flex-shrink-0`
}

/** 获取当前小区 ID */
function getCurrentCommunityId() {
  return currentCommunity.communityId
}

/** 首页入口导航映射 */
const homeMenuNavigators = createWorkbenchMenuNavigators({
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

/** 处理首页入口点击 */
function handleEntryClick(entry: HomeMenuEntry) {
  const navigate = homeMenuNavigators[entry.navigationKey]

  if (!navigate) {
    toast.warning('暂未配置对应入口')
    return
  }

  navigate()
}
</script>

<template>
  <view class="home-page">
    <view class="home-header">
      <view class="header-bar">
        <view class="brand-block">
          <view class="brand-icon-shell">
            <view class="i-carbon-building text-white text-36rpx" />
          </view>

          <view class="brand-copy">
            <text class="brand-title">{{ homeHeaderTitle }}</text>
            <text class="brand-subtitle">{{ currentCommunity.communityName || homeHeaderSubtitle }}</text>
          </view>
        </view>

        <view class="user-chip">
          <view class="i-carbon-user-avatar text-white text-24rpx" />
          <text class="user-chip-text">{{ currentUser.userName }}</text>
        </view>
      </view>
    </view>

    <view class="home-content">
      <view class="featured-grid">
        <view
          v-for="entry in homeFeaturedEntries"
          :key="entry.id"
          class="featured-card"
          @click="handleEntryClick(entry)"
        >
          <view class="featured-card-top">
            <view class="featured-icon-shell" :class="entry.bgClass">
              <wd-icon
                name=""
                :custom-class="getEntryIconClass(entry, 'feature')"
              />
            </view>

            <view class="featured-arrow">
              <view class="i-carbon-arrow-up-right text-blue-500 text-20rpx" />
            </view>
          </view>

          <view class="featured-copy">
            <text class="featured-title">{{ entry.name }}</text>
            <text v-if="entry.meta" class="featured-meta">{{ entry.meta }}</text>
          </view>
        </view>
      </view>

      <view
        v-for="section in homeSections"
        :key="section.id"
        class="section-card"
      >
        <view class="section-head">
          <view class="section-title-wrap">
            <view class="section-mark" />
            <text class="section-title">{{ section.title }}</text>
          </view>
        </view>

        <view class="entry-grid" :class="`entry-grid-${section.columns}`">
          <view
            v-for="entry in section.entries"
            :key="entry.id"
            class="entry-item"
            @click="handleEntryClick(entry)"
          >
            <view class="entry-icon-shell" :class="entry.bgClass">
              <wd-icon
                name=""
                :custom-class="getEntryIconClass(entry, 'grid')"
              />
            </view>
            <text class="entry-name">{{ entry.name }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  padding-bottom: calc(28rpx + env(safe-area-inset-bottom));
  background: #f5f7fb;
}

.home-header {
  padding: calc(18rpx + env(safe-area-inset-top)) 24rpx 78rpx;
  background: linear-gradient(180deg, #2f7cff 0%, #5f9fff 100%);
}

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 18rpx;
  min-width: 0;
}

.brand-icon-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 22rpx;
  flex-shrink: 0;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  min-width: 0;
}

.brand-title {
  color: #fff;
  font-size: 34rpx;
  font-weight: 800;
  line-height: 1.2;
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.82);
  font-size: 22rpx;
  line-height: 1.2;
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 18rpx;
  color: #fff;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 9999rpx;
  flex-shrink: 0;
}

.user-chip-text {
  max-width: 160rpx;
  font-size: 22rpx;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-content {
  margin-top: -42rpx;
  padding: 0 24rpx 24rpx;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
  margin-bottom: 20rpx;
}

.featured-card,
.section-card {
  background: #fff;
  border-radius: 28rpx;
  box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.08);
}

.featured-card,
.entry-item {
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}

.featured-card:active,
.entry-item:active {
  opacity: 0.86;
  transform: scale(0.985);
}

.featured-card {
  padding: 22rpx 22rpx 18rpx;
}

.featured-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10rpx;
}

.featured-icon-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 84rpx;
  height: 84rpx;
  border-radius: 24rpx;
}

.featured-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44rpx;
  height: 44rpx;
  background: #f5f8ff;
  border-radius: 14rpx;
}

.featured-copy {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  margin-top: 8rpx;
}

.featured-title {
  color: #16233b;
  font-size: 32rpx;
  font-weight: 800;
  line-height: 1.28;
}

.featured-meta {
  color: #72819a;
  font-size: 22rpx;
  line-height: 1.3;
}

.section-card {
  padding: 20rpx 18rpx;
  background: linear-gradient(180deg, #f4f8ff 0%, #edf3ff 100%);
  box-shadow:
    0 12rpx 30rpx rgba(15, 23, 42, 0.06),
    inset 0 0 0 2rpx rgba(255, 255, 255, 0.88);
}

.section-card + .section-card {
  margin-top: 18rpx;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14rpx;
}

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.section-mark {
  width: 8rpx;
  height: 28rpx;
  background: #2f7cff;
  border-radius: 9999rpx;
}

.section-title {
  color: #18263f;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.2;
}

.entry-grid {
  display: grid;
  gap: 10rpx;
}

.entry-grid-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.entry-grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  padding: 18rpx 10rpx 16rpx;
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  box-shadow:
    0 6rpx 18rpx rgba(47, 124, 255, 0.06),
    inset 0 0 0 2rpx rgba(47, 124, 255, 0.06);
  border-radius: 22rpx;
}

.entry-icon-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 74rpx;
  height: 74rpx;
  border-radius: 22rpx;
}

.entry-name {
  color: #42506a;
  font-size: 22rpx;
  font-weight: 500;
  line-height: 1.35;
  text-align: center;
}
</style>
