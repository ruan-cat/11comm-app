<!--
  活动列表页
  功能：展示社区活动列表，支持分页浏览

  访问地址: http://localhost:9000/#/pages/activity/index
  建议参数: ?currentCommunityId=COMM_001

  旧代码：gitee-example/pages/activityes/activityes.vue
-->

<script setup lang="ts">
import type { Activity, ActivityListParams, ActivityListResponse } from '@/types/activity'
import { onLoad, onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'
import { getActivityList, increaseActivityView } from '@/api/activity'
import { TypedRouter } from '@/router'
import { getImageUrl } from '@/utils'

/** 页面配置 */
definePage({
  name: 'Activities',
  style: {
    navigationBarTitleText: '社区活动',
    navigationBarBackgroundColor: '#368CFE',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'light',
    onReachBottomDistance: 50,
  },
})

/** 接口参数类型 */
interface PageOptions {
  currentCommunityId: string
}

/** 响应式数据状态 */
const currentCommunityId = ref<string>('')
const activities = ref<Activity[]>([])
const currentPage = ref<number>(1)
const pageSize = ref<number>(15)
const hasMore = ref<boolean>(true)
const isLoadingMore = ref<boolean>(false)
const error = ref<string>('')

/** API请求管理 - 优化请求参数 */
const {
  loading,
  data: activitiesResponse,
  send: fetchActivities,
} = useRequest(
  (params: ActivityListParams) => getActivityList(params),
  {
    immediate: false,
  },
)
  .onSuccess((event) => {
    const response = event.data as ActivityListResponse
    if (response?.activitiess) {
      processActivitiesData(response.activitiess, response)
    }
  })
  .onError((event) => {
    const err = event.error
    console.error('获取活动列表失败:', err)
    error.value = err?.message || '网络异常，请稍后重试'
    showErrorToast('加载失败，请稍后重试')
  })

/** 计算属性 */
const isEmpty = computed(() => !loading.value && activities.value.length === 0)
const showLoadMore = computed(() => hasMore.value && !loading.value)

/** 工具函数 */
/**
 * 格式化时间显示
 */
function formatTime(timeString: string): string {
  if (!timeString)
    return ''
  return dayjs(timeString).format('YYYY-MM-DD HH:mm')
}

/**
 * 格式化数字显示（如浏览量、点赞数）
 */
function formatNumber(num: number): string {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

/**
 * 显示错误提示
 */
function showErrorToast(message: string) {
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000,
  })
}

/**
 * 清理HTML标签并截断文本，用于活动内容预览
 */
function stripHtmlAndTruncate(html: string, maxLength: number = 80): string {
  if (!html)
    return ''

  /** 移除所有HTML标签 */
  let text = html.replace(/<[^>]*>/g, '')

  /** 清理多余的空白字符 */
  text = text.replace(/\s+/g, ' ').trim()

  /** 截断文本并添加省略号 */
  if (text.length > maxLength) {
    text = `${text.substring(0, maxLength).trim()}...`
  }

  return text
}

/**
 * 处理活动数据 - 完全匹配原Java110Context的数据处理逻辑
 */
function processActivitiesData(newActivities: Activity[], response: ActivityListResponse) {
  const processedActivities = newActivities.map((item: Activity) => ({
    ...item,
    /** 🔴 重要：图片URL处理逻辑匹配原Java110Context */
    src: item.src || getImageUrl(item.headerImg || '', currentCommunityId.value), /** 优先使用Mock接口提供的src */
    /** 🔴 数据格式兼容性处理 - 保持与原系统一致 */
    readCount: item.readCount || item.viewCount || 0, /** readCount优先，向后兼容viewCount */
    likeCount: item.likeCount || 0,
    collectCount: item.collectCount || 0, /** 收藏功能 */
    /** 时间格式化处理 */
    formattedStartTime: formatTime(item.startTime),
    formattedCreateTime: formatTime(item.createTime),
    formattedEndTime: item.endTime ? formatTime(item.endTime) : '',
  }))

  /** 🔴 分页数据处理逻辑 */
  if (currentPage.value === 1) {
    activities.value = processedActivities
  }
  else {
    activities.value.push(...processedActivities)
  }

  /** 🔴 分页状态更新 - 基于实际返回的数据量判断是否还有更多 */
  hasMore.value = processedActivities.length >= pageSize.value
  error.value = ''

  /** 输出处理结果用于调试 */
  console.log('🎯 Activities processed:', {
    total: response.total,
    currentPage: currentPage.value,
    newItems: processedActivities.length,
    totalItems: activities.value.length,
    hasMore: hasMore.value,
  })
}

/**
 * 加载活动列表（支持分页）
 */
async function loadActivities(page: number = 1, showLoading: boolean = true) {
  if (!currentCommunityId.value) {
    showErrorToast('社区ID不能为空')
    return
  }

  try {
    /** 设置加载状态 */
    if (page > 1) {
      isLoadingMore.value = true
    }

    const params: ActivityListParams = {
      page,
      row: pageSize.value,
      communityId: currentCommunityId.value,
      /** 只获取已发布的活动 */
      status: 'UPCOMING',
    }

    await fetchActivities(params)
    currentPage.value = page
  }
  catch (err: any) {
    console.error('加载活动失败:', err)
    /** 错误已在 onError 中处理 */
  }
  finally {
    if (page > 1) {
      isLoadingMore.value = false
    }
  }
}

/**
 * 刷新活动列表
 */
async function refreshActivities() {
  currentPage.value = 1
  hasMore.value = true
  await loadActivities(1)
}

/**
 * 加载更多活动
 */
async function loadMoreActivities() {
  if (hasMore.value && !loading.value && !isLoadingMore.value) {
    await loadActivities(currentPage.value + 1, false)
  }
}

/**
 * 跳转到活动详情并增加浏览量
 */
async function navigateToDetail(item: Activity) {
  try {
    /** 异步增加浏览量，不阻塞跳转 */
    increaseActivityView(item.activitiesId).catch((err) => {
      console.warn('增加浏览量失败:', err)
    })

    /** 立即跳转到详情页 */
    await TypedRouter.toActivityDetail(item.activitiesId, currentCommunityId.value)

    /** 乐观更新本地浏览量 */
    const index = activities.value.findIndex(activity => activity.activitiesId === item.activitiesId)
    if (index !== -1) {
      activities.value[index].readCount += 1
      activities.value[index].viewCount += 1
    }
  }
  catch (err) {
    console.error('跳转详情页失败:', err)
    showErrorToast('跳转失败，请重试')
  }
}

/** 监听社区ID变化，自动刷新数据 */
watch(
  () => currentCommunityId.value,
  (newCommunityId) => {
    if (newCommunityId) {
      refreshActivities()
    }
  },
  { immediate: false },
)

/** 生命周期钩子 */
onLoad((options: PageOptions) => {
  console.log('Activities页面加载，参数:', options)

  if (!options.currentCommunityId) {
    showErrorToast('社区参数缺失')
    return
  }

  currentCommunityId.value = options.currentCommunityId
  /** 首次加载数据 */
  loadActivities(1)
})

/** 页面显示时刷新数据（从详情页返回时） */
onShow(() => {
  /** 如果已有数据，则静默刷新 */
  if (activities.value.length > 0) {
    refreshActivities()
  }
})

/** 下拉刷新 */
onPullDownRefresh(async () => {
  try {
    await refreshActivities()
  }
  finally {
    uni.stopPullDownRefresh()
  }
})

/** 上拉加载更多 */
onReachBottom(() => {
  loadMoreActivities()
})
</script>

<template>
  <view class="min-h-screen bg-#f5f5f5 pb-20rpx">
    <!-- 顶部加载状态 -->
    <view v-if="loading && currentPage === 1" class="flex items-center justify-center py-60rpx">
      <wd-loading size="24px" color="#368CFE" />
      <text class="text-#666 ml-16rpx text-28rpx">加载中...</text>
    </view>

    <!-- 活动列表 -->
    <view v-if="activities.length > 0" class="w-full p-0">
      <view
        v-for="(item, index) in activities"
        :key="`${item.activitiesId}_${index}`"
        class="mx-32rpx my-24rpx"
        @click="navigateToDetail(item)"
      >
        <!-- 活动卡片 -->
        <view class="activity-card overflow-hidden bg-white rounded-24rpx">
          <!-- 活动图片区域 -->
          <view class="relative w-full overflow-hidden h-360rpx">
            <wd-img
              :src="item.src"
              mode="aspectFill"
              class="block h-full w-full"
            >
              <template #error>
                <view class="h-full w-full flex items-center justify-center bg-gray-100">
                  <text class="text-gray-400 text-24rpx">图片加载失败</text>
                </view>
              </template>
            </wd-img>

            <!-- 活动状态标签 -->
            <view class="absolute right-16rpx top-16rpx z-2">
              <wd-tag
                v-if="dayjs().isAfter(dayjs(item.endTime))"
                type="primary"
                size="large"
                plain
                class="status-tag bg-black/50 text-white text-30rpx!"
              >
                已结束
              </wd-tag>
              <wd-tag
                v-else-if="dayjs().isBefore(dayjs(item.startTime))"
                type="warning"
                size="large"
                plain
                class="status-tag bg-black/50 text-white text-30rpx!"
              >
                未开始
              </wd-tag>
              <wd-tag
                v-else
                type="success"
                size="large"
                plain
                class="status-tag bg-black/50 text-white text-30rpx!"
              >
                进行中
              </wd-tag>
            </view>

            <!-- 底部渐变遮罩和标题 -->
            <view class="title-overlay absolute bottom-0 left-0 right-0 z-1 px-32rpx py-24rpx">
              <text class="activity-title line-clamp-2 text-white font-medium text-32rpx">{{ item.title }}</text>
            </view>
          </view>

          <!-- 活动信息区域 -->
          <view class="px-32rpx py-24rpx">
            <view class="flex items-start">
              <!-- 发布者头像 - 使用 wd-img 实现圆形头像 -->
              <view class="shrink-0 mr-24rpx w-96rpx h-96rpx">
                <!-- 如果有头像图片，使用 wd-img -->
                <wd-img
                  v-if="item.avatar"
                  :src="item.avatar"
                  round
                  mode="aspectFill"
                  class="w-96rpx h-96rpx"
                >
                  <template #error>
                    <view class="user-avatar flex items-center justify-center rounded-full w-96rpx h-96rpx">
                      <text class="text-white font-medium text-28rpx">{{ item.userName?.charAt(0) || 'A' }}</text>
                    </view>
                  </template>
                </wd-img>
                <!-- 否则显示文字头像 -->
                <view v-else class="user-avatar flex items-center justify-center rounded-full w-96rpx h-96rpx">
                  <text class="text-white font-medium text-28rpx">{{ item.userName?.charAt(0) || 'A' }}</text>
                </view>
              </view>

              <view class="min-w-0 flex-1">
                <view class="flex items-center justify-between mb-8rpx">
                  <text class="text-gray-600 font-medium text-28rpx">{{ item.userName || '管理员' }}</text>
                  <text class="shrink-0 text-gray-400 ml-16rpx text-24rpx">{{ item.formattedCreateTime }}</text>
                </view>

                <!-- 活动内容预览 -->
                <view v-if="item.context" class="mt-16rpx mb-24rpx">
                  <text class="context-text line-clamp-2 text-gray-600 text-28rpx">{{ stripHtmlAndTruncate(item.context, 80) }}</text>
                </view>

                <!-- 活动时间信息 -->
                <view class="bg-gray-50 p-24rpx mb-24rpx rounded-16rpx">
                  <view class="flex items-center mb-8rpx">
                    <wd-icon name="" custom-class="i-carbon-time text-28rpx text-#368cfe mr-8rpx" />
                    <text class="text-gray-500 text-24rpx">活动时间</text>
                  </view>
                  <view class="time-value-container">
                    <text class="text-gray-700 font-medium text-28rpx">{{ item.formattedStartTime }}</text>
                    <text v-if="item.endTime" class="text-gray-400 text-24rpx"> ~ {{ formatTime(item.endTime) }}</text>
                  </view>
                </view>

                <!-- 统计信息栏 -->
                <view class="flex items-center justify-between border-t border-gray-100 pt-16rpx">
                  <!-- 统计数据 -->
                  <view class="flex items-center">
                    <!-- 浏览量 -->
                    <view class="flex items-center mr-32rpx">
                      <wd-icon name="" custom-class="i-carbon-view text-28rpx text-gray-400 mr-8rpx" />
                      <text class="text-gray-500 text-24rpx">{{ formatNumber(item.readCount) }}</text>
                    </view>

                    <!-- 点赞数 -->
                    <view class="flex items-center mr-32rpx">
                      <wd-icon name="" custom-class="i-carbon-thumbs-up text-28rpx text-gray-400 mr-8rpx" />
                      <text class="text-gray-500 text-24rpx">{{ formatNumber(item.likeCount) }}</text>
                    </view>

                    <!-- 收藏数 -->
                    <view class="flex items-center">
                      <wd-icon name="" custom-class="i-carbon-chat text-28rpx text-gray-400 mr-8rpx" />
                      <text class="text-gray-500 text-24rpx">{{ formatNumber(item.collectCount) }}</text>
                    </view>
                  </view>

                  <!-- 查看详情按钮 -->
                  <wd-button
                    type="primary"
                    size="small"
                    plain
                    round
                    class="px-24rpx text-24rpx!"
                  >
                    查看详情
                  </wd-button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载更多状态 -->
    <view v-if="showLoadMore" class="flex items-center justify-center py-32rpx">
      <wd-loading v-if="isLoadingMore" size="20px" color="#368CFE" />
      <text v-if="isLoadingMore" class="text-gray-400 ml-16rpx text-28rpx">加载更多...</text>
      <text v-else-if="!hasMore && activities.length > 0" class="text-gray-300 text-28rpx">没有更多了</text>
    </view>

    <!-- 空状态 -->
    <view v-if="isEmpty" class="flex flex-col items-center justify-center py-160rpx">
      <wd-status-tip
        image="content"
        tip="暂无活动"
        :image-size="{ height: 120, width: 120 }"
      />
      <view class="text-center mt-32rpx">
        <text class="block text-gray-400 mb-16rpx text-28rpx">暂时没有社区活动</text>
        <text class="block text-gray-300 text-24rpx">请稍后再来看看吧</text>
      </view>
    </view>

    <!-- 错误状态 -->
    <view v-if="error && isEmpty" class="flex flex-col items-center justify-center py-160rpx">
      <wd-status-tip
        image="network"
        tip="加载失败"
        :image-size="{ height: 120, width: 120 }"
      />
      <view class="text-center mt-32rpx">
        <text class="block text-red-400 mb-16rpx text-28rpx">{{ error }}</text>
        <wd-button
          type="primary"
          size="small"
          plain
          round
          @click="refreshActivities"
        >
          重新加载
        </wd-button>
      </view>
    </view>
  </view>
</template>

<style scoped>
/** 卡片样式 - 保留阴影和动画效果 */
.activity-card {
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.activity-card:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
}

/** 状态标签毛玻璃效果 */
.status-tag {
  backdrop-filter: blur(16rpx);
  -webkit-backdrop-filter: blur(16rpx);
}

/** 标题遮罩层渐变背景 */
.title-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
}

/** 活动标题样式 - 确保行高正常显示 */
.activity-title {
  line-height: 1.5;
  word-wrap: break-word;
  word-break: break-all;
  display: block;
}

/** 用户头像渐变背景 */
.user-avatar {
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
}

/** 内容文本样式 - 确保行高正常 */
.context-text {
  line-height: 1.6;
  word-wrap: break-word;
  word-break: break-all;
}

/** 时间值容器 - 确保文本不被截断 */
.time-value-container {
  width: 100%;
  word-wrap: break-word;
}

/** 文本截断工具类 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
