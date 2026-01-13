<!--
  工作台页面
  功能：展示按分类组织的功能入口网格，快速进入各个业务功能模块

  访问地址: http://localhost:9000/#/pages/work-dashboard/index

  旧代码：gitee-example/pages/index/work.vue
-->

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router/helpers'
import { useUserStore } from '@/store'

definePage({
  style: {
    navigationBarTitleText: '工作台',
    navigationBarBackgroundColor: '#0081FF',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F3F4F6',
  },
})

const toast = useGlobalToast()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

/** 功能菜单项 */
interface WorkbenchMenu {
  id: string
  name: string
  icon: string
  iconClass: string
  bgClass: string
  route?: string
  badge?: number
  disabled?: boolean
}

/** 功能分类 */
interface WorkbenchCategory {
  title: string
  menus: WorkbenchMenu[]
}

/** 功能分类配置 */
const categories: WorkbenchCategory[] = [
  {
    title: '常用功能',
    menus: [
      { id: 'complaint', name: '投诉待办', icon: 'i-carbon-warning-alt', iconClass: 'text-colorui-red', bgClass: 'bg-colorui-red/10', route: '/pages-sub/complaint/list' },
      { id: 'repair', name: '报修待办', icon: 'i-carbon-tools', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', route: '/pages-sub/repair/dispatch' },
      { id: 'inspection', name: '巡检打卡', icon: 'i-carbon-location', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', route: '/pages-sub/inspection/task-list' },
      { id: 'maintenance', name: '设备保养', icon: 'i-carbon-settings', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', disabled: true },
    ],
  },
  {
    title: '维修报修',
    menus: [
      { id: 'repair-order', name: '维修工单池', icon: 'i-carbon-document', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', route: '/pages-sub/repair/order-list' },
      { id: 'repair-dispatch', name: '维修待办单', icon: 'i-carbon-tools', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', route: '/pages-sub/repair/dispatch' },
      { id: 'repair-finish', name: '维修已办', icon: 'i-carbon-task-complete', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', route: '/pages-sub/repair/finish' },
    ],
  },
  {
    title: '工单业务',
    menus: [
      { id: 'work-start', name: '发工作单', icon: 'i-carbon-document-add', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', disabled: true },
      { id: 'work-do', name: '办工作单', icon: 'i-carbon-task', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', disabled: true },
      { id: 'work-copy', name: '抄送工作单', icon: 'i-carbon-send-alt', iconClass: 'text-colorui-cyan', bgClass: 'bg-colorui-cyan/10', disabled: true },
      { id: 'oa-workflow', name: 'OA流程', icon: 'i-carbon-flow', iconClass: 'text-colorui-purple', bgClass: 'bg-colorui-purple/10', disabled: true },
    ],
  },
  {
    title: '资源管理',
    menus: [
      { id: 'purchase-audit', name: '采购待办', icon: 'i-carbon-shopping-cart', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', disabled: true },
      { id: 'item-out-audit', name: '领用待办', icon: 'i-carbon-delivery', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', disabled: true },
      { id: 'allocation-audit', name: '调拨待办', icon: 'i-carbon-arrows-horizontal', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', disabled: true },
      { id: 'my-items', name: '我的物品', icon: 'i-carbon-box', iconClass: 'text-colorui-cyan', bgClass: 'bg-colorui-cyan/10', disabled: true },
    ],
  },
  {
    title: '物业服务',
    menus: [
      { id: 'renovation', name: '装修管理', icon: 'i-carbon-paint-brush', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', disabled: true },
      { id: 'fee', name: '费用管理', icon: 'i-carbon-currency', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', disabled: true },
      { id: 'meter', name: '抄表管理', icon: 'i-carbon-meter', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', disabled: true },
      { id: 'owner', name: '业主管理', icon: 'i-carbon-user-multiple', iconClass: 'text-colorui-purple', bgClass: 'bg-colorui-purple/10', disabled: true },
    ],
  },
  {
    title: '停车业务',
    menus: [
      { id: 'owner-car', name: '业主车辆', icon: 'i-carbon-car', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', disabled: true },
      { id: 'barrier-gate', name: '道闸管理', icon: 'i-carbon-gate', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', disabled: true },
    ],
  },
  {
    title: '核销业务',
    menus: [
      { id: 'coupon', name: '核销优惠券', icon: 'i-carbon-ticket', iconClass: 'text-colorui-red', bgClass: 'bg-colorui-red/10', disabled: true },
      { id: 'appointment', name: '预约核销', icon: 'i-carbon-calendar', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', disabled: true },
    ],
  },
  {
    title: '访客放行',
    menus: [
      { id: 'visit', name: '访客待办', icon: 'i-carbon-user-avatar', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', disabled: true },
      { id: 'release', name: '物品放行', icon: 'i-carbon-package', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', disabled: true },
    ],
  },
  {
    title: '报表统计',
    menus: [
      { id: 'data-report', name: '数据统计', icon: 'i-carbon-chart-bar', iconClass: 'text-colorui-blue', bgClass: 'bg-colorui-blue/10', disabled: true },
      { id: 'pay-fee-detail', name: '缴费明细', icon: 'i-carbon-receipt', iconClass: 'text-colorui-green', bgClass: 'bg-colorui-green/10', disabled: true },
      { id: 'fee-summary', name: '费用汇总', icon: 'i-carbon-report', iconClass: 'text-colorui-orange', bgClass: 'bg-colorui-orange/10', disabled: true },
    ],
  },
]

/** 处理菜单点击 */
function handleMenuClick(menu: WorkbenchMenu) {
  if (menu.disabled) {
    toast.info('功能开发中')
    return
  }

  switch (menu.id) {
    case 'complaint':
      TypedRouter.toComplaintList()
      break
    case 'repair':
    case 'repair-dispatch':
      TypedRouter.toRepairDispatch()
      break
    case 'repair-order':
      TypedRouter.toRepairList()
      break
    case 'repair-finish':
      TypedRouter.toRepairFinish()
      break
    case 'inspection':
      TypedRouter.toInspectionTaskList()
      break
    default:
      toast.info('功能开发中')
  }
}
</script>

<template>
  <view class="workbench-page min-h-screen bg-gray-100">
    <!-- 顶部用户信息区域 -->
    <view class="header relative overflow-hidden pb-16 pt-2 bg-gradient-blue">
      <view class="relative z-10 flex items-center px-4 py-4">
        <!-- 头像 -->
        <view class="avatar-wrapper mr-3">
          <image
            class="h-full w-full"
            :src="userInfo.avatar || '/static/images/default-avatar.png'"
            mode="aspectFill"
          />
        </view>
        <!-- 信息 -->
        <view class="flex flex-1 flex-col text-white">
          <text class="mb-1 text-lg font-bold">{{ userInfo.nickname || userInfo.username || '物业人员' }}</text>
          <view class="flex items-center opacity-90">
            <view class="i-carbon-building mr-1 text-sm" />
            <text class="text-xs">智慧社区</text>
          </view>
        </view>
      </view>
      <!-- 装饰背景 -->
      <view class="decor-circle-1" />
      <view class="decor-circle-2" />
    </view>

    <!-- 内容区域 - 向上重叠 -->
    <view class="relative z-10 px-3 -mt-10">
      <!-- 功能分类列表 -->
      <view
        v-for="category in categories"
        :key="category.title"
        class="category-card mb-3"
      >
        <!-- 分类标题 -->
        <view class="category-header">
          <view class="title-indicator" />
          <text class="text-sm text-gray-800 font-bold">{{ category.title }}</text>
        </view>

        <!-- 功能网格 -->
        <view class="menu-grid">
          <view
            v-for="menu in category.menus"
            :key="menu.id"
            class="menu-item"
            :class="{ 'is-disabled': menu.disabled }"
            @click="handleMenuClick(menu)"
          >
            <!-- 图标容器 -->
            <view class="icon-wrapper" :class="menu.bgClass">
              <view :class="[menu.icon, menu.iconClass]" class="text-2xl" />
              <!-- 角标 -->
              <view v-if="menu.badge" class="badge">
                {{ menu.badge > 99 ? '99+' : menu.badge }}
              </view>
            </view>
            <!-- 名称 -->
            <text class="menu-name">{{ menu.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="h-4" />
  </view>
</template>

<style scoped lang="scss">
.workbench-page {
  padding-bottom: env(safe-area-inset-bottom);
}

/* 头像样式 */
.avatar-wrapper {
  width: 112rpx;
  height: 112rpx;
  overflow: hidden;
  border: 4rpx solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
}

/* 装饰圆形 */
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

/* 分类卡片 */
.category-card {
  overflow: hidden;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

/* 分类标题 */
.category-header {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.title-indicator {
  width: 8rpx;
  height: 28rpx;
  margin-right: 16rpx;
  background: #0081ff;
  border-radius: 4rpx;
}

/* 功能网格 */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 24rpx 16rpx;
}

/* 菜单项 */
.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16rpx 8rpx;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.7;
  }

  &.is-disabled {
    opacity: 0.5;
    filter: grayscale(0.3);
  }
}

/* 图标容器 */
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

/* 角标 */
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

/* 菜单名称 */
.menu-name {
  font-size: 24rpx;
  font-weight: 500;
  color: #666;
}
</style>
