<!--
  领用审核
  功能：显示领用待审核列表，支持审核操作

  访问地址: http://localhost:9000/#/pages-sub/resource/item-out-audit

  旧代码：gitee-example/pages/resource/itemOutAuditOrders.vue
-->

<script setup lang="ts">
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { auditUndoItemRelease, listItemOutAuditHistoryOrders, listMyItemOutOrders } from '@/api/resource'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '领用审核',
    enablePullDownRefresh: false,
  },
})

const communityInfo = getCurrentCommunity()

const toast = useGlobalToast()

const list = ref<any[]>([])
const total = ref(0)
const currentPage = ref(0) // 0: 待办, 1: 已办

const { send: loadList } = useRequest(
  (params: { page: number, row: number }) =>
    listMyItemOutOrders({
      ...params,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
).onSuccess((event) => {
  const response = event.data
  total.value = response?.total || 0
  list.value = response?.list || []
})

const { send: loadHistory } = useRequest(
  (params: { page: number, row: number }) =>
    listItemOutAuditHistoryOrders({
      ...params,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
).onSuccess((event) => {
  const response = event.data
  total.value = response?.total || 0
  list.value = response?.list || []
})

const { send: auditApply } = useRequest(
  (data: { taskId: string, status: string, remark?: string }) => auditUndoItemRelease(data),
  { immediate: false },
).onSuccess(() => {
  toast.success('审核成功')
  changeListType(currentPage.value)
})

onMounted(() => {
  changeListType(0)
})

function changeListType(type: number) {
  currentPage.value = type
  if (type === 0) {
    loadList({ page: 1, row: 10 })
  }
  else {
    loadHistory({ page: 1, row: 10 })
  }
}

function goToDetail(item: any) {
  if (currentPage.value === 0) {
    // 待办 - 去出库页面
    uni.navigateTo({
      url: `/pages-sub/resource/item-out?applyOrderId=${item.businessId}&resOrderType=${item.businessType}&taskId=${item.taskId}`,
    })
  }
  else {
    // 已办 - 去详情页面
    uni.navigateTo({
      url: `/pages-sub/resource/item-out-detail?applyOrderId=${item.businessId}`,
    })
  }
}

function handleAuditPass(item: any) {
  uni.showModal({
    title: '审核确认',
    content: '确认通过该领用申请？',
    success: (res) => {
      if (res.confirm) {
        auditApply({
          taskId: item.taskId,
          status: '1200',
          remark: '审核通过',
        })
      }
    },
  })
}

function handleAuditReject(item: any) {
  uni.showModal({
    title: '审核确认',
    content: '确认拒绝该领用申请？',
    success: (res) => {
      if (res.confirm) {
        auditApply({
          taskId: item.taskId,
          status: '1400',
          remark: '审核拒绝',
        })
      }
    },
  })
}

function onPullDownRefresh() {
  changeListType(currentPage.value).finally(() => {
    uni.stopPullDownRefresh()
  })
}

function onReachBottom() {
  if (list.value.length < total.value) {
    const page = Math.floor(list.value.length / 10) + 1
    if (currentPage.value === 0) {
      loadList({ page, row: 10 })
    }
    else {
      loadHistory({ page, row: 10 })
    }
  }
}
</script>

<template>
  <view class="page-container">
    <!-- Tab 切换 -->
    <view class="tab-bar">
      <view class="tab-item" :class="{ active: currentPage === 0 }" @click="changeListType(0)">
        <text class="tab-icon" :class="[currentPage === 0 ? 'i-carbon-checkmark-filled' : 'i-carbon-checkmark']" />
        待办
      </view>
      <view class="tab-item" :class="{ active: currentPage === 1 }" @click="changeListType(1)">
        <text class="tab-icon" :class="[currentPage === 1 ? 'i-carbon-checkmark-filled' : 'i-carbon-checkmark']" />
        已办
      </view>
    </view>

    <!-- 列表 -->
    <view v-if="list.length > 0" class="list-container">
      <view v-for="(item, index) in list" :key="index" class="list-item">
        <view class="item-header" @click="goToDetail(item)">
          <view class="item-title">
            <wd-icon name="" custom-class="i-carbon-shopping-cart text-green-500 mr-2" />
            <text class="font-medium">{{ item.resourceNames }}</text>
          </view>
          <view class="item-status">
            <text class="status-text">({{ item.stateName }})</text>
          </view>
        </view>

        <view class="item-content" @click="goToDetail(item)">
          <view class="info-item">
            <text class="label">申请人:</text>
            <text>{{ item.createUserName }}</text>
          </view>
          <view class="info-item">
            <text class="label">时间:</text>
            <text>{{ item.createTime }}</text>
          </view>
        </view>

        <view v-if="currentPage === 0" class="item-actions">
          <wd-button type="success" size="small" @click="handleAuditPass(item)">
            通过
          </wd-button>
          <wd-button type="error" size="small" @click="handleAuditReject(item)">
            拒绝
          </wd-button>
          <wd-button type="info" size="small" plain @click="goToDetail(item)">
            详情
          </wd-button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-container">
      <wd-status-tip image="content" tip="暂无数据" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.tab-bar {
  display: flex;
  background-color: #fff;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.tab-item {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;

  &.active {
    color: #007aff;
    font-weight: 500;
  }
}

.tab-icon {
  font-size: 32rpx;
}

.list-container {
  padding: 20rpx;
}

.list-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.item-title {
  display: flex;
  align-items: center;
  flex: 1;
}

.font-medium {
  font-weight: 500;
}

.status-text {
  color: #666;
  font-size: 28rpx;
}

.item-content {
  margin-bottom: 20rpx;
}

.info-item {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;

  .label {
    margin-right: 8rpx;
  }
}

.item-actions {
  display: flex;
  gap: 16rpx;
  justify-content: flex-end;
}

.empty-container {
  padding: 100rpx 0;
}
</style>
