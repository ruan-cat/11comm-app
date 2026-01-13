<!--
  工作台页面
  功能：展示按分类组织的功能入口网格，快速进入各个业务功能模块

  访问地址: http://localhost:9000/#/pages/work/index
-->

<script lang="ts" setup>
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router/helpers'

defineOptions({
  name: 'Workbench',
})

definePage({
  style: {
    navigationBarTitleText: '工作台',
    navigationBarBackgroundColor: '#368bff',
    navigationBarTextStyle: 'white',
  },
})

const toast = useGlobalToast()

/** 功能菜单项 */
interface WorkbenchMenu {
  id: string
  name: string
  icon: string
  iconClass: string
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
      { id: 'complaint', name: '投诉待办', icon: 'i-carbon-warning-alt', iconClass: 'text-colorui-red', route: '/pages-sub/complaint/list' },
      { id: 'repair', name: '报修待办', icon: 'i-carbon-tools', iconClass: 'text-colorui-blue', route: '/pages-sub/repair/dispatch' },
      { id: 'inspection', name: '巡检打卡', icon: 'i-carbon-location', iconClass: 'text-colorui-green', route: '/pages-sub/inspection/task-list' },
      { id: 'maintenance', name: '设备保养', icon: 'i-carbon-settings', iconClass: 'text-colorui-orange', disabled: true },
    ],
  },
  {
    title: '维修报修',
    menus: [
      { id: 'repair-order', name: '维修工单池', icon: 'i-carbon-document', iconClass: 'text-colorui-orange', route: '/pages-sub/repair/order-list' },
      { id: 'repair-dispatch', name: '维修待办单', icon: 'i-carbon-tools', iconClass: 'text-colorui-blue', route: '/pages-sub/repair/dispatch' },
      { id: 'repair-finish', name: '维修已办', icon: 'i-carbon-task-complete', iconClass: 'text-colorui-green', route: '/pages-sub/repair/finish' },
    ],
  },
  {
    title: '工单业务',
    menus: [
      { id: 'work-start', name: '发工作单', icon: 'i-carbon-document-add', iconClass: 'text-colorui-blue', disabled: true },
      { id: 'work-do', name: '办工作单', icon: 'i-carbon-task', iconClass: 'text-colorui-green', disabled: true },
      { id: 'work-copy', name: '抄送工作单', icon: 'i-carbon-send-alt', iconClass: 'text-colorui-cyan', disabled: true },
      { id: 'oa-workflow', name: 'OA流程', icon: 'i-carbon-flow', iconClass: 'text-colorui-purple', disabled: true },
    ],
  },
  {
    title: '资源管理',
    menus: [
      { id: 'purchase-audit', name: '采购待办', icon: 'i-carbon-shopping-cart', iconClass: 'text-colorui-blue', disabled: true },
      { id: 'item-out-audit', name: '领用待办', icon: 'i-carbon-delivery', iconClass: 'text-colorui-green', disabled: true },
      { id: 'allocation-audit', name: '调拨待办', icon: 'i-carbon-arrows-horizontal', iconClass: 'text-colorui-orange', disabled: true },
      { id: 'my-items', name: '我的物品', icon: 'i-carbon-box', iconClass: 'text-colorui-cyan', disabled: true },
    ],
  },
  {
    title: '物业服务',
    menus: [
      { id: 'renovation', name: '装修管理', icon: 'i-carbon-paint-brush', iconClass: 'text-colorui-orange', disabled: true },
      { id: 'fee', name: '费用管理', icon: 'i-carbon-currency', iconClass: 'text-colorui-green', disabled: true },
      { id: 'meter', name: '抄表管理', icon: 'i-carbon-meter', iconClass: 'text-colorui-blue', disabled: true },
      { id: 'owner', name: '业主管理', icon: 'i-carbon-user-multiple', iconClass: 'text-colorui-purple', disabled: true },
    ],
  },
  {
    title: '停车业务',
    menus: [
      { id: 'owner-car', name: '业主车辆', icon: 'i-carbon-car', iconClass: 'text-colorui-blue', disabled: true },
      { id: 'barrier-gate', name: '道闸管理', icon: 'i-carbon-gate', iconClass: 'text-colorui-orange', disabled: true },
    ],
  },
  {
    title: '核销业务',
    menus: [
      { id: 'coupon', name: '核销优惠券', icon: 'i-carbon-ticket', iconClass: 'text-colorui-red', disabled: true },
      { id: 'appointment', name: '预约核销', icon: 'i-carbon-calendar', iconClass: 'text-colorui-green', disabled: true },
    ],
  },
  {
    title: '访客放行',
    menus: [
      { id: 'visit', name: '访客待办', icon: 'i-carbon-user-avatar', iconClass: 'text-colorui-blue', disabled: true },
      { id: 'release', name: '物品放行', icon: 'i-carbon-package', iconClass: 'text-colorui-orange', disabled: true },
    ],
  },
  {
    title: '报表统计',
    menus: [
      { id: 'data-report', name: '数据统计', icon: 'i-carbon-chart-bar', iconClass: 'text-colorui-blue', disabled: true },
      { id: 'pay-fee-detail', name: '缴费明细', icon: 'i-carbon-receipt', iconClass: 'text-colorui-green', disabled: true },
      { id: 'fee-summary', name: '费用汇总', icon: 'i-carbon-report', iconClass: 'text-colorui-orange', disabled: true },
    ],
  },
]

/** 处理菜单点击 */
function handleMenuClick(menu: WorkbenchMenu) {
  if (menu.disabled) {
    toast.info('功能开发中')
    return
  }

  // 根据路由跳转
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
  <view class="workbench-page bg-colorui-bg min-h-screen">
    <!-- 功能分类列表 -->
    <view v-for="category in categories" :key="category.title" class="category-section mb-3 bg-white">
      <!-- 分类标题 -->
      <view class="category-title border-colorui-line border-b px-4 py-3 text-base font-medium">
        {{ category.title }}
      </view>

      <!-- 功能网格 -->
      <view class="menu-grid grid grid-cols-4 gap-0">
        <view
          v-for="menu in category.menus"
          :key="menu.id"
          class="menu-item active:bg-colorui-bg flex flex-col items-center justify-center py-4"
          :class="{ 'opacity-50': menu.disabled }"
          @click="handleMenuClick(menu)"
        >
          <!-- 图标 -->
          <view class="menu-icon relative mb-2">
            <wd-icon name="" :custom-class="`text-32px ${menu.icon} ${menu.iconClass}`" />
            <!-- 角标 -->
            <view
              v-if="menu.badge"
              class="badge absolute h-18px min-w-18px flex items-center justify-center rounded-full bg-colorui-red px-1 text-10px text-white -right-2 -top-1"
            >
              {{ menu.badge > 99 ? '99+' : menu.badge }}
            </view>
          </view>
          <!-- 名称 -->
          <text class="menu-name text-colorui-grey text-12px">{{ menu.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.workbench-page {
  padding-bottom: env(safe-area-inset-bottom);
}

.category-section {
  &:first-child {
    margin-top: 0;
  }
}

.menu-item {
  border-right: 1rpx solid var(--colorui-line, #e5e5e5);
  border-bottom: 1rpx solid var(--colorui-line, #e5e5e5);

  &:nth-child(4n) {
    border-right: none;
  }
}

.menu-grid {
  .menu-item:nth-last-child(-n + 4):nth-child(4n + 1),
  .menu-item:nth-last-child(-n + 4):nth-child(4n + 1) ~ .menu-item {
    border-bottom: none;
  }
}
</style>
