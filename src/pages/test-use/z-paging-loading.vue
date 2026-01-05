<!--
  z-paging-loading 组件测试页面
  功能：展示 z-paging-loading 组件的各种使用场景和配置

  访问地址: http://localhost:9000/#/pages/test-use/z-paging-loading
-->

<script setup lang="ts">
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'

definePage({
  style: {
    navigationBarTitleText: 'z-paging-loading 组件测试',
  },
})

/** 模拟数据列表 */
const dataList = ref<any[]>([])

/** z-paging 引用 */
const pagingRef = ref()

/**
 * 使用 useRequest 管理模拟数据请求
 * 🔴 强制规范：必须设置 immediate: false，由 z-paging 控制请求时机
 */
const {
  send: loadMockData,
  onSuccess,
  onError,
} = useRequest(
  (params: { pageNo: number, pageSize: number }) => {
    // 模拟 API 请求，返回 Promise
    return new Promise<{ list: any[] }>((resolve) => {
      setTimeout(() => {
        const mockData = Array.from({ length: 10 }, (_, index) => ({
          id: `${params.pageNo}-${index}`,
          title: `数据项 ${params.pageNo}-${index + 1}`,
          content: `这是第 ${params.pageNo} 页的第 ${index + 1} 条数据`,
        }))
        resolve({ list: mockData })
      }, 2000)
    })
  },
  { immediate: false },
)

/**
 * 成功回调 - 通知 z-paging 数据加载完成
 */
onSuccess((event) => {
  const result = event.data
  pagingRef.value?.complete(result?.list || [])
})

/**
 * 失败回调 - 通知 z-paging 加载失败
 */
onError((error) => {
  console.error('加载数据失败:', error)
  pagingRef.value?.complete(false)
})

/**
 * z-paging 的 @query 回调
 * @description 接收分页参数，触发请求（不使用 await/try-catch）
 */
function handleQuery(pageNo: number, pageSize: number) {
  loadMockData({ pageNo, pageSize })
}

/** 手动触发显示加载状态 */
function toggleLoading() {
  showLoading.value = !showLoading.value
}

/** 重新加载数据 */
function reloadData() {
  pagingRef.value?.reload()
}
</script>

<template>
  <view class="safe-area-inset-top safe-area-inset-bottom min-h-screen flex flex-col bg-gray-50">
    <!-- 顶部说明卡片 -->
    <view class="border-b border-gray-100 bg-white p-4 shadow-sm">
      <view class="mb-3">
        <text class="text-lg text-gray-800 font-semibold">z-paging-loading 组件测试</text>
      </view>
      <view class="text-sm text-gray-600 leading-relaxed">
        <text>本页面展示了 z-paging-loading 组件的各种使用场景。</text>
        <text class="mt-1 block">您可以通过切换不同的场景,查看不同配置下的加载效果。</text>
      </view>
    </view>

    <!-- 场景选择器 -->
    <view class="border-b border-gray-100 bg-white p-4">
      <view class="mb-3 flex items-center justify-between">
        <text class="text-base text-gray-700 font-medium">当前场景</text>
        <text class="text-sm text-gray-500">{{ currentSceneIndex + 1 }} / {{ loadingScenes.length }}</text>
      </view>

      <!-- 场景信息 -->
      <view class="mb-4 border border-blue-100 rounded-lg bg-blue-50 p-3">
        <text class="block text-sm text-blue-900 font-medium">{{ currentScene.title }}</text>
        <text class="mt-1 block text-xs text-blue-700">{{ currentScene.description }}</text>
      </view>

      <!-- 场景切换按钮 -->
      <view class="flex gap-2">
        <wd-button
          :disabled="currentSceneIndex === 0"
          type="default"
          size="small"
          class="flex-1"
          @click="prevScene"
        >
          上一个场景
        </wd-button>
        <wd-button
          :disabled="currentSceneIndex === loadingScenes.length - 1"
          type="primary"
          size="small"
          class="flex-1"
          @click="nextScene"
        >
          下一个场景
        </wd-button>
      </view>
    </view>

    <!-- 操作按钮组 -->
    <view class="border-b border-gray-100 bg-white p-4">
      <view class="mb-2">
        <text class="text-sm text-gray-600 font-medium">测试操作</text>
      </view>
      <view class="flex gap-2">
        <wd-button type="success" size="small" class="flex-1" @click="reloadData">
          重新加载数据
        </wd-button>
        <wd-button type="warning" size="small" class="flex-1" @click="toggleLoading">
          {{ showLoading ? '隐藏加载' : '显示加载' }}
        </wd-button>
      </view>
    </view>

    <!-- 动态文案演示 -->
    <view class="border-b border-gray-100 bg-white p-4">
      <view class="mb-2">
        <text class="text-sm text-gray-600 font-medium">动态文案演示</text>
      </view>
      <wd-search
        v-model="searchValue"
        placeholder="输入关键词,观察加载文案变化"
        class="mb-2"
      />
      <view class="border border-gray-200 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
        <text class="block">当前文案: {{ searchValue ? '正在搜索数据...' : '正在加载数据...' }}</text>
      </view>
    </view>

    <!-- z-paging 列表演示 -->
    <view class="flex-1">
      <!-- 手动控制的加载演示 -->
      <view v-if="showLoading" class="border-b border-gray-100 bg-white">
        <view class="border-b border-gray-100 px-4 py-2">
          <text class="text-sm text-gray-700 font-medium">手动控制的加载状态</text>
        </view>
        <ZPagingLoading v-bind="currentScene.props" />
      </view>

      <!-- z-paging 集成演示 -->
      <view class="flex flex-1 flex-col">
        <view class="border-b border-gray-100 bg-white px-4 py-2">
          <text class="text-sm text-gray-700 font-medium">z-paging 集成演示</text>
          <text class="mt-1 block text-xs text-gray-500">下拉刷新或滚动加载更多,观察加载效果</text>
        </view>

        <z-paging
          ref="pagingRef"
          v-model="dataList"
          :default-page-size="10"
          :refresher-enabled="true"
          :loading-more-enabled="true"
          :show-scrollbar="false"
          :fixed="false"
          :safe-area-config="{ bottom: 0 }"
          class="flex-1"
          @query="handleQuery"
        >
          <!-- 加载状态 - 使用当前场景配置 -->
          <template #loading>
            <ZPagingLoading
              v-bind="currentScene.props"
              :primary-text="searchValue ? '正在搜索数据...' : currentScene.props.primaryText"
            />
          </template>

          <!-- 列表内容 -->
          <view class="p-4">
            <wd-cell-group>
              <wd-cell
                v-for="item in dataList"
                :key="item.id"
                :title="item.title"
                :label="item.content"
              />
            </wd-cell-group>
          </view>

          <!-- 空状态 -->
          <template #empty>
            <view class="flex items-center justify-center p-8">
              <view class="text-center">
                <wd-icon name="inbox" custom-class="i-carbon-inbox text-6xl text-gray-300" />
                <text class="mt-3 block text-sm text-gray-500">暂无数据</text>
                <text class="mt-1 block text-xs text-gray-400">下拉刷新加载数据</text>
              </view>
            </view>
          </template>
        </z-paging>
      </view>
    </view>

    <!-- 底部配置信息 -->
    <view class="border-t border-gray-200 bg-white p-4">
      <view class="mb-2">
        <text class="text-sm text-gray-600 font-medium">当前场景配置</text>
      </view>
      <view class="border border-gray-200 rounded-lg bg-gray-50 p-3 text-xs text-gray-700 font-mono">
        <text class="block">icon: {{ currentScene.props.icon || 'loading' }}</text>
        <text class="mt-1 block">iconClass: {{ currentScene.props.iconClass || 'i-carbon-circle-dash...' }}</text>
        <text class="mt-1 block">iconSize: {{ currentScene.props.iconSize || '20px' }}</text>
        <text class="mt-1 block">loadingSize: {{ currentScene.props.loadingSize || '32px' }}</text>
        <text class="mt-1 block">loadingType: {{ currentScene.props.loadingType || 'ring' }}</text>
        <text class="mt-1 block">primaryText: {{ currentScene.props.primaryText || '正在加载数据...' }}</text>
        <text class="mt-1 block">secondaryText: {{ currentScene.props.secondaryText || '请稍候片刻' }}</text>
      </view>
    </view>
  </view>
</template>
