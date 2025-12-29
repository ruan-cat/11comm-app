<!--
  二维码巡检页面
  功能：通过扫描二维码快速定位到对应的巡检项

  访问地址: http://localhost:9000/#/pages-sub/inspection/execute-qrcode
  建议携带参数: ?inspectionId=xxx&inspectionName=xxx&itemId=xxx

  示例: http://localhost:9000/#/pages-sub/inspection/execute-qrcode?inspectionId=INSP_002&inspectionName=消防通道检查&itemId=ITEM_002
-->

<script setup lang="ts">
import type { InspectionTaskDetail } from './types'
import dayjs from 'dayjs'
import { useRouter } from 'uni-mini-router'
import { onMounted, ref } from 'vue'

/** 路由实例 */
const router = useRouter()

/** 获取路由参数 */
const { query } = router.currentRoute.value
const inspectionId = query.inspectionId as string
const inspectionName = query.inspectionName as string
const itemId = query.itemId as string

/** 任务详情列表 */
const taskDetails = ref<InspectionTaskDetail[]>([])

/** 是否加载中 */
const loading = ref(false)

/**
 * 查询巡检任务详情
 */
async function queryTaskDetails() {
  loading.value = true

  try {
    // 获取当前时间（模拟）
    const currentTime = dayjs().format('HH:mm')

    // TODO: 调用 Alova 接口获取数据
    // const result = await getInspectionTaskDetailApi({
    //   communityId: getCurrentCommunity().communityId,
    //   planUserId: getUserInfo().userId,
    //   inspectionId: inspectionId,
    //   state: "20200405",
    //   qrCodeTime: currentTime,
    //   page: 1,
    //   row: 100,
    // })
    // taskDetails.value = result.data || []

    // 临时 Mock 数据
    taskDetails.value = [
      {
        taskDetailId: 'DETAIL_QR_001',
        taskId: 'TASK_QR_001',
        inspectionId,
        inspectionName,
        itemId,
        state: '20200405',
        stateName: '待巡检',
      },
    ]

    // 如果找到任务，跳转到执行单项巡检页
    if (taskDetails.value.length > 0) {
      const item = taskDetails.value[0]

      router.replace({
        name: 'inspection-execute-single',
        query: {
          taskDetailId: item.taskDetailId,
          taskId: item.taskId,
          inspectionId,
          inspectionName,
          itemId,
          fromPage: 'QrCode',
        },
      })
    }
    else {
      // 没有找到任务
      loading.value = false
    }
  }
  catch (error) {
    console.error('查询巡检任务详情失败:', error)
    uni.showToast({
      title: '查询失败',
      icon: 'none',
    })
    loading.value = false
  }
}

onMounted(() => {
  queryTaskDetails()
})
</script>

<template>
  <view class="inspection-execute-qrcode">
    <view v-if="!loading && taskDetails.length === 0" class="no-task">
      <wd-icon name="warn" size="80px" color="#FF9800" />
      <view class="no-task-text">
        当前没有巡检任务或者没到巡检时间
      </view>
    </view>

    <wd-loading v-if="loading" type="circular" />
  </view>
</template>

<style scoped lang="scss">
.inspection-execute-qrcode {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;

  .no-task {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40rpx;
    padding: 100rpx 40rpx;

    .no-task-text {
      font-size: 28rpx;
      color: #999999;
      text-align: center;
    }
  }
}
</style>
