<!--
  巡检补检页面
  功能：显示需要补检的巡检任务列表，支持发起补检流程

  访问地址: http://localhost:9000/#/pages-sub/inspection/reexamine

  旧代码： gitee-example/pages/inspectionReexamine/inspectionReexamine.vue
-->

<script setup lang="ts">
import type { InspectionTask } from '@/types/inspection'
import { onShow } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'
import { TypedRouter } from '@/router'

/** 补检任务列表 */
const tasks = ref<InspectionTask[]>([])

/** 是否无数据 */
const noData = ref(false)

/** 是否加载中 */
const loading = ref(false)

/** 选择的补检日期 */
const selectedDate = ref('')

/**
 * 获取补检任务列表
 */
async function getReexamineTasks() {
  loading.value = true
  noData.value = false

  try {
    // TODO: 调用 Alova 接口获取数据
    // const result = await getInspectionTaskListApi({
    //   page: 1,
    //   row: 20,
    //   moreState: "20200405,20200406",
    //   canReexamine: "2000",
    //   planInsTime: selectedDate.value,
    // })
    // tasks.value = result.data || []

    // 临时 Mock 数据
    tasks.value = [
      {
        taskId: 'REEX_TASK_001',
        inspectionPlanId: 'PLAN_003',
        inspectionPlanName: '设备巡检（补检）',
        planUserName: '张三',
        planInsTime: '2025-12-28 10:00',
        signTypeName: '移动定位',
        stateName: '待补检',
        state: '20200405',
      },
      {
        taskId: 'REEX_TASK_002',
        inspectionPlanId: 'PLAN_004',
        inspectionPlanName: '环境巡检（补检）',
        planUserName: '李四',
        planInsTime: '2025-12-27 14:00',
        signTypeName: '二维码扫描',
        stateName: '待补检',
        state: '20200406',
      },
    ]

    noData.value = tasks.value.length === 0
  }
  catch (error) {
    console.error('获取补检任务失败:', error)
    uni.showToast({
      title: '获取任务失败',
      icon: 'none',
    })
  }
  finally {
    loading.value = false
  }
}

/**
 * 日期选择变更
 * @param value 选中的日期
 */
function handleDateChange(value: string) {
  selectedDate.value = value
  getReexamineTasks()
}

/**
 * 开始补检
 * @param item 任务信息
 */
function startReexamine(item: InspectionTask) {
  // 跳转到巡检过程页
  TypedRouter.toInspectionExecute(item.taskId, item.inspectionPlanName)
}

onMounted(() => {
  // 初始化日期为今天
  selectedDate.value = dayjs().format('YYYY-MM-DD')
  getReexamineTasks()
})

onShow(() => {
  // 页面显示时刷新任务列表
  getReexamineTasks()
})
</script>

<template>
  <view class="inspection-reexamine">
    <!-- 标题 -->
    <view class="page-title">
      巡检任务（补检）
    </view>

    <!-- 日期选择 -->
    <wd-cell-group>
      <wd-cell title="补检日期" is-link center>
        <wd-datetime-picker
          v-model="selectedDate"
          type="date"
          @confirm="handleDateChange"
        />
      </wd-cell>
    </wd-cell-group>

    <!-- 任务列表 -->
    <view v-if="!noData && tasks.length > 0" class="task-list">
      <wd-card
        v-for="(item, index) in tasks"
        :key="index"
        class="task-card"
      >
        <!-- 任务头部：任务ID和状态 -->
        <view class="task-header">
          <text class="task-id">{{ item.taskId }}</text>
          <text class="task-status">{{ item.stateName }}</text>
        </view>

        <!-- 任务信息 -->
        <wd-cell-group border>
          <wd-cell title="巡检计划" :value="item.inspectionPlanName" />
          <wd-cell title="计划编码" :value="item.inspectionPlanId" />
          <wd-cell title="巡检人" :value="item.planUserName" />
          <wd-cell title="巡检时间" :value="item.planInsTime" />
          <wd-cell title="巡检方式" :value="item.signTypeName" />
        </wd-cell-group>

        <!-- 操作按钮 -->
        <view class="task-actions">
          <wd-button
            type="success"
            size="small"
            block
            @click="startReexamine(item)"
          >
            补检
          </wd-button>
        </view>
      </wd-card>
    </view>

    <!-- 空状态 -->
    <wd-status-tip v-else-if="noData && !loading" image="search" tip="暂无补检任务" />

    <!-- 加载状态 -->
    <wd-loading v-if="loading" type="circular" />
  </view>
</template>

<style scoped lang="scss">
.inspection-reexamine {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;

  .page-title {
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(69, 90, 100, 0.6);
    padding: 40rpx 30rpx 20rpx;
  }

  .task-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    margin-top: 20rpx;

    .task-card {
      background: #ffffff;
      border-radius: 16rpx;
      padding: 24rpx;

      .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 24rpx;
        border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
        margin-bottom: 24rpx;

        .task-id {
          font-size: 28rpx;
          font-weight: 500;
          color: #333333;
        }

        .task-status {
          font-size: 24rpx;
          color: #ff9800;
        }
      }

      .task-actions {
        margin-top: 24rpx;
        padding-top: 24rpx;
        border-top: 2rpx solid rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
