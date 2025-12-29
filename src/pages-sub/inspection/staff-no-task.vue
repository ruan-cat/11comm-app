<!--
  员工未巡检页面
  功能：显示特定员工的巡检情况详情

  访问地址: http://localhost:9000/#/pages-sub/inspection/staff-no-task
  建议携带参数: ?staffId=xxx&staffName=xxx&queryTime=xxx

  示例: http://localhost:9000/#/pages-sub/inspection/staff-no-task?staffId=STAFF_001&staffName=张三&queryTime=2025-12-29
-->

<script setup lang="ts">
import type { InspectionTaskDetail } from './types'
import { onLoad } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'

/** 路由参数 */
const staffId = ref('')
const staffName = ref('')
const queryTime = ref('')

/** 获取路由参数 */
onLoad((options) => {
  staffId.value = options?.staffId as string || ''
  staffName.value = options?.staffName as string || ''
  queryTime.value = options?.queryTime as string || ''
})

/** 巡检详情列表 */
const inspections = ref<InspectionTaskDetail[]>([])

/** 是否无数据 */
const noData = ref(false)

/** 是否加载中 */
const loading = ref(false)

/**
 * 加载员工巡检详情
 */
async function loadStaffInspectionDetail() {
  loading.value = true
  noData.value = false

  try {
    // TODO: 调用 Alova 接口获取数据
    // const result = await getInspectionTaskDetailApi({
    //   communityId: getCurrentCommunity().communityId,
    //   planUserId: staffId,
    //   queryTime: queryTime,
    //   page: 1,
    //   row: 100,
    // })
    // inspections.value = result.data || []

    // 临时 Mock 数据
    inspections.value = [
      {
        taskDetailId: 'DETAIL_S_001',
        taskId: 'TASK_S_001',
        inspectionId: 'INSP_S_001',
        inspectionName: '大门岗亭检查',
        itemId: 'ITEM_S_001',
        state: '20200407',
        stateName: '已完成',
        pointStartTime: '09:00',
        pointEndTime: '09:30',
      },
      {
        taskDetailId: 'DETAIL_S_002',
        taskId: 'TASK_S_002',
        inspectionId: 'INSP_S_002',
        inspectionName: '消防通道检查',
        itemId: 'ITEM_S_002',
        state: '20200405',
        stateName: '待巡检',
        pointStartTime: '10:00',
        pointEndTime: '10:30',
      },
      {
        taskDetailId: 'DETAIL_S_003',
        taskId: 'TASK_S_003',
        inspectionId: 'INSP_S_003',
        inspectionName: '电梯运行检查',
        itemId: 'ITEM_S_003',
        state: '20200405',
        stateName: '待巡检',
        pointStartTime: '14:00',
        pointEndTime: '14:30',
      },
    ]

    noData.value = inspections.value.length === 0
  }
  catch (error) {
    console.error('加载员工巡检详情失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStaffInspectionDetail()
})
</script>

<template>
  <view class="inspection-staff-no-task">
    <!-- 标题 -->
    <view class="page-title">
      {{ staffName }}巡检情况
    </view>

    <!-- 巡检详情列表 -->
    <view v-if="!noData && inspections.length > 0" class="inspection-list">
      <wd-cell-group>
        <wd-cell
          v-for="(item, index) in inspections"
          :key="index"
          :title="`${item.inspectionName} (${item.stateName})`"
        >
          <template #label>
            <view class="inspection-time">
              巡检时间: {{ item.pointStartTime || "-" }} - {{ item.pointEndTime || "-" }}
            </view>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 空状态 -->
    <wd-empty v-else-if="noData && !loading" description="暂无巡检记录" />

    <!-- 加载状态 -->
    <wd-loading v-if="loading" type="circular" />
  </view>
</template>

<style scoped lang="scss">
.inspection-staff-no-task {
  min-height: 100vh;
  background-color: #f5f5f5;

  .page-title {
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(69, 90, 100, 0.6);
    padding: 40rpx 30rpx 20rpx;
  }

  .inspection-list {
    margin-top: 20rpx;

    .inspection-time {
      font-size: 24rpx;
      color: #999999;
      margin-top: 8rpx;
    }
  }
}
</style>
