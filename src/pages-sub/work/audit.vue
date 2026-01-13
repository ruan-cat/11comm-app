<!--
  工作单审核页
  功能：审核工作单，支持通过和驳回

  访问地址: http://localhost:9000/#/pages-sub/work/audit
  建议携带参数: ?orderId=xxx

  http://localhost:9000/#/pages-sub/work/audit?orderId=WO_001
-->

<script lang="ts" setup>
import type { WorkOrderDetail } from '@/types/work-order'
import { auditWorkOrder, getWorkOrderDetail } from '@/api/work-order'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: '工作单审核',
    navigationBarBackgroundColor: '#368bff',
    navigationBarTextStyle: 'white',
  },
})

/** 路由参数 */
const props = defineProps<{
  orderId?: string
}>()

/** 工作单详情 */
const orderDetail = ref<WorkOrderDetail | null>(null)

/** 审核意见 */
const opinion = ref('')

/** 加载详情请求 */
const { loading, send: loadDetail } = useRequest(
  () => getWorkOrderDetail({ orderId: props.orderId || '' }),
  { immediate: false },
)
  .onSuccess((event) => {
    orderDetail.value = event.data?.order || null
  })
  .onError((error) => {
    console.error('加载工作单详情失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  })

/** 审核请求 */
const { loading: auditLoading, send: doAudit } = useRequest(
  (result: 'pass' | 'reject') =>
    auditWorkOrder({
      orderId: props.orderId || '',
      result,
      opinion: opinion.value,
    }),
  { immediate: false },
)
  .onSuccess((_, args) => {
    const result = args[0]
    uni.showToast({
      title: result === 'pass' ? '审核通过' : '已驳回',
      icon: 'success',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  })
  .onError((error) => {
    console.error('审核失败:', error)
    uni.showToast({ title: '审核失败', icon: 'none' })
  })

/** 进入页面加载数据 */
onMounted(() => {
  if (props.orderId) {
    loadDetail()
  }
})

/** 获取状态标签样式 */
function getStatusType(status: string): 'primary' | 'success' | 'warning' | 'danger' | 'default' {
  const statusMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'default'> = {
    10001: 'warning',
    10002: 'primary',
    10003: 'success',
    10004: 'danger',
    10005: 'default',
  }
  return statusMap[status] || 'default'
}

/** 处理通过 */
function handlePass() {
  uni.showModal({
    title: '确认通过',
    content: '确定审核通过此工作单？',
    success: (res) => {
      if (res.confirm) {
        doAudit('pass')
      }
    },
  })
}

/** 处理驳回 */
function handleReject() {
  if (!opinion.value.trim()) {
    uni.showToast({ title: '请填写驳回原因', icon: 'none' })
    return
  }
  uni.showModal({
    title: '确认驳回',
    content: '确定驳回此工作单？',
    success: (res) => {
      if (res.confirm) {
        doAudit('reject')
      }
    },
  })
}
</script>

<template>
  <view class="min-h-screen bg-gray-50 pb-safe">
    <!-- 加载状态 -->
    <view v-if="loading" class="flex h-60 items-center justify-center">
      <wd-loading />
    </view>

    <!-- 审核内容 -->
    <view v-else-if="orderDetail" class="pb-24">
      <!-- 工作单信息 -->
      <FormSectionTitle title="工作单信息" icon="i-carbon-document" />
      <wd-cell-group border>
        <wd-cell title="工作单编号" :value="orderDetail.orderNo" />
        <wd-cell title="工作单标题" :value="orderDetail.title" />
        <wd-cell title="工作单类型" :value="orderDetail.typeName" />
        <wd-cell title="当前状态">
          <template #value>
            <wd-tag :type="getStatusType(orderDetail.status)" size="small">
              {{ orderDetail.statusName }}
            </wd-tag>
          </template>
        </wd-cell>
      </wd-cell-group>

      <!-- 工作内容 -->
      <FormSectionTitle title="工作内容" icon="i-carbon-text-align-left" />
      <wd-cell-group border>
        <view class="bg-white p-4">
          <text class="text-sm text-gray-700">{{ orderDetail.content }}</text>
        </view>
      </wd-cell-group>

      <!-- 完成情况 -->
      <template v-if="orderDetail.completeRemark || (orderDetail.completePhotos && orderDetail.completePhotos.length > 0)">
        <FormSectionTitle title="完成情况" icon="i-carbon-checkmark-filled" />
        <wd-cell-group border>
          <view v-if="orderDetail.completeRemark" class="bg-white p-4">
            <text class="text-sm text-gray-700">{{ orderDetail.completeRemark }}</text>
          </view>
          <view v-if="orderDetail.completePhotos && orderDetail.completePhotos.length > 0" class="bg-white p-4">
            <view class="flex flex-wrap gap-2">
              <image
                v-for="(photo, index) in orderDetail.completePhotos"
                :key="index"
                :src="photo"
                mode="aspectFill"
                class="h-20 w-20 rounded"
                @click="uni.previewImage({ urls: orderDetail.completePhotos || [], current: photo })"
              />
            </view>
          </view>
        </wd-cell-group>
      </template>

      <!-- 审核意见 -->
      <FormSectionTitle title="审核意见" icon="i-carbon-edit" />
      <wd-cell-group border>
        <wd-textarea
          v-model="opinion"
          placeholder="请输入审核意见（驳回时必填）"
          :maxlength="200"
          show-word-limit
          clearable
        />
      </wd-cell-group>
    </view>

    <!-- 空状态 -->
    <view v-else class="flex h-60 items-center justify-center">
      <wd-status-tip image="error" tip="工作单不存在" />
    </view>

    <!-- 底部操作按钮 -->
    <view v-if="orderDetail" class="fixed bottom-0 left-0 right-0 bg-white p-4 pb-safe shadow-top">
      <view class="flex gap-3">
        <wd-button
          type="danger"
          block
          plain
          :loading="auditLoading"
          @click="handleReject"
        >
          驳回
        </wd-button>
        <wd-button
          type="success"
          block
          :loading="auditLoading"
          @click="handlePass"
        >
          通过
        </wd-button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.shadow-top {
  box-shadow: 0 -2px 10px rgb(0 0 0 / 5%);
}
</style>
