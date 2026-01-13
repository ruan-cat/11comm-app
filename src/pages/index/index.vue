<!--
  首页
  功能：工作入口，展示常用待办入口

  访问地址: http://localhost:9000/#/pages/index/index

  旧代码：gitee-example/pages/index/index.vue
-->

<script lang="ts" setup>
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router/helpers'

/** 导入顶部入口图标 */
import iComplaint from '@/static/image/index/i_complaint.png'
import iInspection from '@/static/image/index/i_inspection.png'
import iMachine from '@/static/image/index/i_machine.png'
import iRepair from '@/static/image/index/i_repair.png'

import indexAllocation from '@/static/image/index_allocation.png'
/** 导入工作待办图标 */
import indexApplyAudit from '@/static/image/index_apply_audit.png'
import indexComplaint from '@/static/image/index_complaint.png'
import indexItemoutAudit from '@/static/image/index_itemout_audit.png'
import indexRepair from '@/static/image/index_repair.png'

defineOptions({
  name: 'Home',
})

definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})

const toast = useGlobalToast()

/** 顶部入口配置 */
interface HeaderEntry {
  id: string
  name: string
  icon: string
  route?: string
  disabled?: boolean
}

/** 待办入口配置 */
interface TodoEntry {
  id: string
  name: string
  icon?: string
  route?: string
  disabled?: boolean
}

/** 工作单入口配置 */
interface WorkOrderEntry {
  id: string
  name: string
  label: string
  route?: string
  disabled?: boolean
}

/** 顶部入口列表 */
const headerEntries: HeaderEntry[] = [
  { id: 'complaint', name: '投诉待办', icon: iComplaint, route: '/pages-sub/complaint/list' },
  { id: 'repair', name: '报修待办', icon: iRepair, route: '/pages-sub/repair/dispatch' },
  { id: 'inspection', name: '巡检打卡', icon: iInspection, route: '/pages-sub/inspection/task-list' },
  { id: 'maintenance', name: '设备保养', icon: iMachine, disabled: true },
]

/** 工作待办入口列表 */
const todoEntries: TodoEntry[] = [
  { id: 'purchase-audit', name: '采购待办', icon: indexApplyAudit, disabled: true },
  { id: 'item-out-audit', name: '领用待办', icon: indexItemoutAudit, disabled: true },
  { id: 'allocation-audit', name: '调拨待办', icon: indexAllocation, disabled: true },
  { id: 'release', name: '物品放行', icon: indexComplaint, disabled: true },
  { id: 'visit', name: '访客待办', icon: indexRepair, disabled: true },
]

/** 工作单入口列表 */
const workOrderEntries: WorkOrderEntry[] = [
  { id: 'work-start', name: '工作单', label: '发', disabled: true },
  { id: 'work-do', name: '工作单', label: '办', disabled: true },
  { id: 'work-copy', name: '抄送', label: '抄', disabled: true },
]

/** 维修报修入口配置 */
interface RepairEntry {
  id: string
  name: string
  icon?: string
  route?: string
  disabled?: boolean
}

/** 维修报修入口列表 */
const repairEntries: RepairEntry[] = [
  { id: 'repair-order', name: '维修工单池', icon: indexRepair, route: '/pages-sub/repair/order-list' },
  { id: 'repair-dispatch', name: '维修待办单', icon: iRepair, route: '/pages-sub/repair/dispatch' },
  { id: 'repair-finish', name: '维修已办', icon: indexComplaint, route: '/pages-sub/repair/finish' },
]

/** 处理顶部入口点击 */
function handleHeaderClick(entry: HeaderEntry) {
  if (entry.disabled) {
    toast.info('功能开发中')
    return
  }

  switch (entry.id) {
    case 'complaint':
      TypedRouter.toComplaintList()
      break
    case 'repair':
      TypedRouter.toRepairDispatch()
      break
    case 'inspection':
      TypedRouter.toInspectionTaskList()
      break
    default:
      toast.info('功能开发中')
  }
}

/** 处理工作待办入口点击 */
function handleTodoClick(entry: TodoEntry) {
  if (entry.disabled) {
    toast.info('功能开发中')
    return
  }

  // 根据 id 跳转到对应页面
  toast.info('功能开发中')
}

/** 处理工作单入口点击 */
function handleWorkOrderClick(entry: WorkOrderEntry) {
  if (entry.disabled) {
    toast.info('功能开发中')
    return
  }

  // 根据 id 跳转到对应页面
  toast.info('功能开发中')
}

/** 处理维修报修入口点击 */
function handleRepairClick(entry: RepairEntry) {
  if (entry.disabled) {
    toast.info('功能开发中')
    return
  }

  switch (entry.id) {
    case 'repair-order':
      TypedRouter.toRepairList()
      break
    case 'repair-dispatch':
      TypedRouter.toRepairDispatch()
      break
    case 'repair-finish':
      TypedRouter.toRepairFinish()
      break
    default:
      toast.info('功能开发中')
  }
}
</script>

<template>
  <view class="home-contant">
    <!-- 顶部入口区域 -->
    <view class="title-head">
      <view
        v-for="entry in headerEntries"
        :key="entry.id"
        class="header-entry"
        :class="{ 'opacity-60': entry.disabled }"
        @click="handleHeaderClick(entry)"
      >
        <image class="title-ico" :src="entry.icon" mode="aspectFit" />
        <view>{{ entry.name }}</view>
      </view>
    </view>

    <!-- 工作待办 -->
    <view class="work-todo">
      <view class="work-todo-title">
        工作待办
      </view>

      <view class="work-item">
        <view
          v-for="entry in todoEntries"
          :key="entry.id"
          class="work-item-content"
          :class="{ 'opacity-60': entry.disabled }"
          @click="handleTodoClick(entry)"
        >
          <image class="work-ico" :src="entry.icon" mode="aspectFit" />
          <view>{{ entry.name }}</view>
        </view>
      </view>
    </view>

    <!-- 工作单 -->
    <view class="work-todo">
      <view class="work-todo-title">
        工作单
      </view>

      <view class="work-item">
        <view
          v-for="entry in workOrderEntries"
          :key="entry.id"
          class="work-item-content"
          :class="{ 'opacity-60': entry.disabled }"
          @click="handleWorkOrderClick(entry)"
        >
          <view class="work-font">
            {{ entry.label }}
          </view>
          <view>{{ entry.name }}</view>
        </view>
      </view>
    </view>

    <!-- 维修报修 -->
    <view class="work-todo">
      <view class="work-todo-title">
        维修报修
      </view>

      <view class="work-item">
        <view
          v-for="entry in repairEntries"
          :key="entry.id"
          class="work-item-content"
          :class="{ 'opacity-60': entry.disabled }"
          @click="handleRepairClick(entry)"
        >
          <image class="work-ico" :src="entry.icon" mode="aspectFit" />
          <view>{{ entry.name }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.home-contant {
  height: 100vh;
  width: 100vw;
  background-color: #f1f1f1;
}

.title-head {
  background-color: #368bff;
  padding-top: 40px;
  padding-bottom: 40px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  gap: 50px;
  color: #fff;
  font-size: 12px;
}

.header-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
}

.title-ico {
  height: 45px;
  width: 45px;
}

.work-todo {
  height: auto;
  margin-top: 20px;
  background-color: #fff;
  flex-direction: column;
  display: flex;
}

.work-todo-title {
  font-weight: 500;
  padding: 10px;
  border-bottom: 1px solid #f1f1f1;
}

.work-item {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
}

.work-ico {
  width: 45px;
  height: 45px;
}

.work-item-content {
  padding: 20px;
  border: 1px solid #f1f1f1;
  cursor: pointer;

  &:active {
    background-color: #f5f5f5;
  }
}

.work-font {
  font-size: 30px;
  color: #378cfe;
}
</style>
