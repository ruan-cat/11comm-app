<!--
  欠费催缴列表页面
  功能：查询房屋欠费催缴记录列表

  访问地址: http://localhost:9000/#/pages-sub/fee/owe-callable
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:9000/#/pages-sub/fee/owe-callable?communityId=COMM_001

  旧代码：gitee-example/pages/fee/oweFeeCallable.vue
-->

<script setup lang="ts">
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { ref } from 'vue'
import { queryOweFeeCallable } from '@/api/fee'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '欠费催缴',
    enablePullDownRefresh: false,
  },
})

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

/** 搜索表单 */
const searchForm = ref({
  roomName: '',
  roomId: '',
})

/** 欠费催缴列表 */
const callables = ref<
  Array<{
    feeId: string
    feeName: string
    ownerName: string
    staffName: string
    amountdOwed: number
    callableWayName: string
    startTime: string
    endTime: string
    remark: string
    createTime: string
  }>
>([])

/**
 * 加载欠费催缴列表
 */
const { send: loadOweFeeCallable, loading: listLoading } = useRequest(
  (roomId: string) =>
    queryOweFeeCallable({
      page: 1,
      row: 50,
      communityId: communityInfo.communityId,
      payerObjId: roomId,
    }),
  { immediate: false },
).onSuccess((event) => {
  callables.value = (event.data as { data: typeof callables.value }).data || []
})

/**
 * 加载房屋信息并查询欠费催缴
 */
async function handleSearch() {
  if (!searchForm.value.roomName) {
    toast.showError('请输入房屋编号')
    return
  }

  // 解析房屋编号
  const roomNums = searchForm.value.roomName.split('-')
  if (roomNums.length !== 3) {
    toast.showError('输入房屋格式错误，如1-1-1')
    return
  }

  // 这里简化处理，实际应该调用房屋查询 API
  // 暂时直接使用输入的名称作为 roomId
  searchForm.value.roomId = searchForm.value.roomName

  await loadOweFeeCallable(searchForm.value.roomId)
}

/**
 * 登记催缴
 */
function handleWriteCallable() {
  if (!searchForm.value.roomId) {
    toast.showError('请先搜索房屋')
    return
  }

  TypedRouter.toFeeWriteOweCallable({
    roomId: searchForm.value.roomId,
    roomName: searchForm.value.roomName,
  })
}

/**
 * 格式化日期
 */
function formatDate(dateStr: string): string {
  if (!dateStr)
    return '-'
  const date = dayjs(dateStr)
  return `${date.year()}-${String(date.month() + 1).padStart(2, '0')}-${String(date.date()).padStart(2, '0')}`
}
</script>

<template>
  <view class="owe-callable-page">
    <!-- 搜索栏 -->
    <view class="search-bar bg-white p-3">
      <view class="flex items-center gap-2">
        <view class="flex-1">
          <input
            v-model="searchForm.roomName"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            type="text"
            placeholder="输入房屋编号 楼栋-单元-房屋"
            confirm-type="search"
            @confirm="handleSearch"
          >
        </view>
        <wd-button size="small" @click="handleSearch">
          搜索
        </wd-button>
        <wd-button v-if="searchForm.roomId" size="small" type="primary" @click="handleWriteCallable">
          登记
        </wd-button>
      </view>
    </view>

    <!-- 欠费催缴列表 -->
    <view v-if="callables.length > 0" class="p-3">
      <view
        v-for="(item, index) in callables"
        :key="index"
        class="callable-card mb-3 rounded-lg bg-white p-3"
      >
        <!-- 头部 -->
        <view class="flex items-center justify-between border-b border-gray-200 pb-2">
          <text class="text-base font-medium">{{ item.feeName }}</text>
          <text class="text-sm text-gray-500">{{ item.createTime }}</text>
        </view>

        <!-- 内容 -->
        <view class="grid grid-cols-2 mt-2 gap-2 text-sm">
          <view class="text-gray-500">
            <text>催缴方式:</text>
            <text class="ml-1 text-gray-700">{{ item.callableWayName }}</text>
          </view>
          <view class="text-gray-500">
            <text>业主:</text>
            <text class="ml-1 text-gray-700">{{ item.ownerName }}</text>
          </view>
          <view class="text-gray-500">
            <text>催缴金额:</text>
            <text class="ml-1 text-red-500">¥{{ item.amountdOwed }}</text>
          </view>
          <view class="text-gray-500">
            <text>催缴人:</text>
            <text class="ml-1 text-gray-700">{{ item.staffName }}</text>
          </view>
          <view class="col-span-2 text-gray-500">
            <text>欠费段:</text>
            <text class="ml-1 text-gray-700">{{ formatDate(item.startTime) }} ~ {{ formatDate(item.endTime) }}</text>
          </view>
          <view v-if="item.remark" class="col-span-2 text-gray-500">
            <text>催缴说明:</text>
            <text class="ml-1 text-gray-700">{{ item.remark }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="flex flex-col items-center justify-center py-20">
      <text class="text-gray-400">暂无欠费催缴记录</text>
    </view>

    <!-- 加载状态 -->
    <view v-if="listLoading" class="p-3 text-center text-gray-400">
      <text>加载中...</text>
    </view>
  </view>
</template>

<style scoped>
.callable-card {
  background-color: #fff;
}
</style>
