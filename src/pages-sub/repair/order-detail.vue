<!--
  维修工单详情
  详情页
  功能：显示维修工单详细信息，包括基本信息、图片和流转时间轴

  访问地址: http://localhost:9000/#/pages-sub/repair/order-detail
  建议携带参数: ?repairId=REP_001&storeId=STORE_001

  完整示例: http://localhost:9000/#/pages-sub/repair/order-detail?repairId=REP_001&storeId=STORE_001

  旧代码：gitee-example/pages/repairDetail/repairDetail.vue
-->

<!-- 基本完成检查审核 -->

<script setup lang="ts">
import type { RepairOrder, RepairPhoto, RepairStaffRecord } from '@/types/repair'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import { getRepairDetail, getRepairStaffRecords } from '@/api/repair'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { getCurrentCommunity } from '@/utils/user'

/** 全局 Toast 提示 */
const toast = useGlobalToast()

definePage({
  style: {
    navigationBarTitleText: '维修工单详情',
    enablePullDownRefresh: false,
  },
})

/** 页面参数 */
const repairId = ref('')
const storeId = ref('')

/** 工单详情 */
const repairDetail = ref<RepairOrder>()

/** 工单流转记录 */
const staffRecords = ref<RepairStaffRecord[]>([])

/** 获取小区信息 */
const communityInfo = getCurrentCommunity()

/** 是否有图片 */
const hasImages = computed(() => {
  if (!repairDetail.value)
    return false
  return (
    (repairDetail.value.repairPhotos?.length ?? 0) > 0
    || (repairDetail.value.beforePhotos?.length ?? 0) > 0
    || (repairDetail.value.afterPhotos?.length ?? 0) > 0
  )
})

/** 加载工单详情 */
const { loading: detailLoading, send: loadDetail } = useRequest(
  () =>
    getRepairDetail({
      repairId: repairId.value,
      storeId: storeId.value,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((result) => {
    const repair = result.data?.ownerRepair
    if (repair) {
      repairDetail.value = repair
    }
    else {
      toast.error('未找到工单信息')
    }
  })
  .onError((error) => {
    console.error('❌ 加载工单详情失败:', error)
    toast.error(error.error || '加载失败，请稍后重试')
  })

/** 加载工单流转记录 */
const { loading: recordsLoading, send: loadRecords } = useRequest(
  () =>
    getRepairStaffRecords({
      repairId: repairId.value,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((result) => {
    const records = result.data?.staffRecords ?? []
    staffRecords.value = records.map(record => ({
      ...record,
      staffName: record.staffName ?? '',
      startTime: record.startTime ?? '',
      endTime: record.endTime ?? '',
      statusCd: record.statusCd ?? '',
      statusName: record.statusName ?? '',
    }))
  })
  .onError((error) => {
    console.error('❌ 加载流转记录失败:', error)
    // 流转记录加载失败时不弹框提示，仅记录日志
    staffRecords.value = []
  })

/** 加载页面数据 */
function loadPageData() {
  if (!repairId.value) {
    toast.error('缺少必要参数')
    return
  }
  loadDetail()
  loadRecords()
}

/** 页面加载 */
onLoad((options) => {
  repairId.value = (options?.repairId as string) || ''
  storeId.value = (options?.storeId as string) || ''
  loadPageData()
})

/** 页面显示时刷新数据 */
onShow(() => {
  if (repairId.value) {
    loadPageData()
  }
})

/**
 * 获取图片 URL 列表
 * @param images - 图片数组
 * @example getImageUrls(repairDetail.repairPhotos)
 */
function getImageUrls(images: RepairPhoto[]) {
  return images
    .map(img => img.url || img.photo || '')
    .filter(Boolean)
}

/**
 * 回复评价
 * @param record - 工单流转记录
 * @example handleReplyAppraise(staffRecord)
 */
function handleReplyAppraise(record: RepairStaffRecord) {
  if (!record.ruId) {
    toast.error('缺少评价记录ID')
    return
  }
  TypedRouter.toReplyAppraise(record.ruId, repairId.value)
}

/**
 * 获取工单状态对应的颜色
 * @param statusCd - 状态代码
 * @example getStatusColor('10007')
 */
function getStatusColor(statusCd: string): string {
  const colorMap: Record<string, string> = {
    10004: 'bg-green-500', // 已结束
    10007: 'bg-blue-500', // 评价已完成
    10009: 'bg-orange-500', // 待支付
    12000: 'bg-purple-500', // 已完成
  }
  return colorMap[statusCd] || 'bg-gray-400'
}
</script>

<template>
  <view class="repair-detail-page">
    <!-- 加载状态 -->
    <view v-if="detailLoading" class="flex items-center justify-center p-8">
      <wd-loading />
    </view>

    <!-- 工单详情 -->
    <view v-else-if="repairDetail" class="p-3">
      <!-- 基本信息 -->
      <view class="mb-3 bg-white">
        <wd-cell-group border>
          <wd-cell title="报修ID" :value="repairDetail.repairId" title-class="text-36rpx" value-class="text-36rpx">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-edit text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>
          <wd-cell title="报修类型" :value="repairDetail.repairTypeName" title-class="text-36rpx" value-class="text-36rpx">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-ticket text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>
          <wd-cell title="报修人" :value="repairDetail.repairName" title-class="text-36rpx" value-class="text-36rpx">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-user-avatar text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>
          <wd-cell title="联系方式" :value="repairDetail.tel" title-class="text-36rpx" value-class="text-36rpx">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-phone text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>
          <wd-cell title="报修位置" :value="repairDetail.repairObjName" title-class="text-36rpx" value-class="text-36rpx">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-location text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>
          <wd-cell title="预约时间" :value="repairDetail.appointmentTime" title-class="text-36rpx" value-class="text-36rpx">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-time text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>
          <wd-cell title="状态" :value="repairDetail.statusName" title-class="text-36rpx" value-class="text-36rpx">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-checkmark-outline text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>
          <wd-cell title="报修内容" :value="repairDetail.context" title-class="text-36rpx" value-class="text-36rpx">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-document text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>

      <!-- 图片展示区域 -->
      <template v-if="hasImages">
        <!-- 业主报修图片 -->
        <view
          v-if="repairDetail.repairPhotos && repairDetail.repairPhotos.length > 0"
          class="mb-3 bg-white p-3"
        >
          <view class="image-section-title mb-2 flex items-center text-gray-700 font-bold">
            <wd-icon name="" custom-class="i-carbon-image text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            <text>业主报修图片</text>
          </view>
          <view class="grid grid-cols-3 gap-2">
            <wd-img
              v-for="(photo, index) in repairDetail.repairPhotos"
              :key="index"
              :src="photo.url || photo.photo"
              :image-urls="getImageUrls(repairDetail.repairPhotos)"
              :current-index="index"
              mode="aspectFill"
              class="aspect-square w-full rounded"
              :enable-preview="true"
            />
          </view>
        </view>

        <!-- 维修前图片 -->
        <view
          v-if="repairDetail.beforePhotos && repairDetail.beforePhotos.length > 0"
          class="mb-3 bg-white p-3"
        >
          <view class="image-section-title mb-2 flex items-center text-gray-700 font-bold">
            <wd-icon name="" custom-class="i-carbon-image text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            <text>维修前图片</text>
          </view>
          <view class="grid grid-cols-3 gap-2">
            <wd-img
              v-for="(photo, index) in repairDetail.beforePhotos"
              :key="index"
              :src="photo.url || photo.photo"
              :image-urls="getImageUrls(repairDetail.beforePhotos)"
              :current-index="index"
              mode="aspectFill"
              class="aspect-square w-full rounded"
              :enable-preview="true"
            />
          </view>
        </view>

        <!-- 维修后图片 -->
        <view
          v-if="repairDetail.afterPhotos && repairDetail.afterPhotos.length > 0"
          class="mb-3 bg-white p-3"
        >
          <view class="image-section-title mb-2 flex items-center text-gray-700 font-bold">
            <wd-icon name="" custom-class="i-carbon-image text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            <text>维修后图片</text>
          </view>
          <view class="grid grid-cols-3 gap-2">
            <wd-img
              v-for="(photo, index) in repairDetail.afterPhotos"
              :key="index"
              :src="photo.url || photo.photo"
              :image-urls="getImageUrls(repairDetail.afterPhotos)"
              :current-index="index"
              mode="aspectFill"
              class="aspect-square w-full rounded"
              :enable-preview="true"
            />
          </view>
        </view>
      </template>

      <!-- 工单流转时间轴 -->
      <view v-if="staffRecords.length > 0" class="bg-white p-3">
        <view class="timeline-title mb-3 text-gray-700 font-bold">
          工单流转记录
        </view>

        <view class="relative">
          <view
            v-for="(record, index) in staffRecords"
            :key="index"
            class="relative mb-4 flex gap-3"
            :class="{ 'last-timeline-item': index === staffRecords.length - 1 }"
          >
            <!-- 时间轴节点 -->
            <view class="timeline-node">
              <view class="node-dot" :class="getStatusColor(record.statusCd)" />
              <view v-if="index !== staffRecords.length - 1" class="node-line" />
            </view>

            <!-- 时间轴内容 -->
            <view class="flex-1 pb-2">
              <!-- 标题 -->
              <view class="timeline-record-title mb-1 font-medium">
                <text>{{ record.startTime }} 到达 {{ record.staffName }} 工位 - {{ record.statusName }}</text>
              </view>

              <!-- 处理意见 - 待支付或已结束时显示 -->
              <view
                v-if="record.endTime || record.statusCd === '10009' || record.statusCd === '10004'"
                class="timeline-record-content mb-1 text-gray-600"
              >
                <text>处理意见：{{ record.context || '暂无' }}</text>
                <text v-if="record.payTypeName" class="ml-1 text-blue-500">
                  ({{ record.payTypeName }})
                </text>
              </view>

              <!-- 评价已完成 - 显示回复按钮 -->
              <view v-if="record.statusCd === '10007'" class="mt-2">
                <wd-button size="small" type="success" @click="handleReplyAppraise(record)">
                  回复评价
                </wd-button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.repair-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/** 强制设置 wd-cell 的文本大小 */
:deep(.wd-cell__title) {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
}

:deep(.wd-cell__value) {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
}

/** 确保 wd-cell 的 icon 区域垂直居中 */
:deep(.wd-cell__icon) {
  display: flex !important;
  align-items: center !important;
}

/** 图片区域标题 */
.image-section-title {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
}

/** 时间轴标题 */
.timeline-title {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
}

/** 时间轴记录标题 */
.timeline-record-title {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
}

/** 时间轴记录内容 */
.timeline-record-content {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
}

/** 时间轴最后一项隐藏连接线 */
.last-timeline-item {
  .node-line {
    display: none;
  }
}

/** 时间轴节点 */
.timeline-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2px;

  .node-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgb(66, 153, 225); // 使用 rgb() 替代硬编码
    z-index: 1;
  }

  .node-line {
    flex: 1;
    width: 2px;
    background-color: rgb(226, 232, 240);
    margin-top: 4px;
    min-height: 40px;
  }
}
</style>
