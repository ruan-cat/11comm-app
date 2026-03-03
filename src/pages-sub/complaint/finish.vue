<!--
  投诉已办单列表页面
  功能：显示已完成处理的投诉工单列表

  访问地址: http://localhost:9000/#/pages-sub/complaint/finish

  完整示例: http://localhost:9000/#/pages-sub/complaint/finish

  旧代码：gitee-example/pages/complaintFinish/complaintFinish.vue
-->

<script setup lang="ts">
import type { Complaint } from '@/types/complaint'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { ref } from 'vue'
import { getFinishComplaintList } from '@/api/complaint'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { getCurrentCommunity } from '@/utils/user'

/** 全局 Toast 提示 */
const toast = useGlobalToast()

definePage({
  style: {
    navigationBarTitleText: '投诉已办单',
    enablePullDownRefresh: false,
  },
})

/** 投诉列表 */
const complaintList = ref<Complaint[]>([])

/** 是否无数据 */
const noData = ref(false)

/** 获取小区信息 */
const communityInfo = getCurrentCommunity()

/** 加载已办投诉列表 */
const { loading, send: loadList } = useRequest(
  () =>
    getFinishComplaintList({
      page: 1,
      row: 15,
      userId: 'USER_001', // TODO: 从用户信息获取
      storeId: 'STORE_001', // TODO: 从用户信息获取
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((result) => {
    const list = result.data?.data || []
    if (list.length < 1) {
      noData.value = true
      complaintList.value = []
      return
    }

    // 格式化日期为 MM-DD
    complaintList.value = list.map((item) => {
      const date = dayjs(item.createTime)
      return {
        ...item,
        createTime: `${date.month() + 1}-${date.date()}`,
      }
    })
    noData.value = false
  })
  .onError((error) => {
    console.error('❌ 加载已办投诉列表失败:', error)
    toast.error(error.error || '加载失败，请稍后重试')
    noData.value = true
  })

/** 页面加载 */
onLoad(() => {
  loadList()
})

/** 页面显示时刷新数据 */
onShow(() => {
  loadList()
})

/**
 * 查看投诉详情
 * @example handleDetail(complaint)
 */
function handleDetail(complaint: Complaint) {
  TypedRouter.toComplaintDetail(complaint.complaintId)
}
</script>

<template>
  <view class="complaint-finish-page">
    <!-- 加载状态 -->
    <view v-if="loading" class="flex items-center justify-center p-8">
      <wd-loading />
    </view>

    <!-- 投诉列表 -->
    <view v-else-if="!noData && complaintList.length > 0" class="p-3">
      <view
        v-for="(item, index) in complaintList"
        :key="index"
        class="complaint-card mb-3 rounded bg-white p-3"
      >
        <!-- 头部：投诉ID 和 电话 -->
        <view class="flex items-center justify-between border-b border-gray-200 pb-2">
          <text class="font-medium">{{ item.complaintId }}</text>
          <text class="text-sm text-gray-500">{{ item.tel }}</text>
        </view>

        <!-- 投诉信息 -->
        <view class="mt-2">
          <view class="info-row flex items-center justify-between text-sm">
            <text class="text-gray-500">投诉类型</text>
            <text class="text-gray-700">{{ item.typeName }}</text>
          </view>

          <view class="info-row flex items-center justify-between text-sm">
            <text class="text-gray-500">投诉人</text>
            <text class="text-gray-700">{{ item.complaintName }}</text>
          </view>

          <view class="info-row flex items-center justify-between text-sm">
            <text class="text-gray-500">房间</text>
            <text class="text-gray-700">{{ item.roomName }}</text>
          </view>

          <view class="info-row flex items-center justify-between text-sm">
            <text class="text-gray-500">投诉时间</text>
            <text class="text-gray-700">{{ item.createTime }}</text>
          </view>

          <view class="info-row flex items-center justify-between text-sm">
            <text class="text-gray-500">投诉内容</text>
            <text class="line-clamp-2 text-gray-700">{{ item.context }}</text>
          </view>
        </view>

        <!-- 底部操作按钮 -->
        <view class="mt-3 flex items-center justify-end gap-2 border-t border-gray-200 pt-3">
          <wd-button size="small" plain @click="handleDetail(item)">
            详情
          </wd-button>
        </view>
      </view>
    </view>

    <!-- 空数据状态 -->
    <view v-else class="flex flex-col items-center justify-center" style="min-height: 60vh;">
      <wd-icon name="inbox" custom-class="text-gray-300" size="80px" />
      <text class="mt-4 text-gray-400">暂无已办投诉数据</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.complaint-finish-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.complaint-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 信息行间距 - 兼容微信小程序 */
.info-row + .info-row {
  margin-top: 0.5rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
