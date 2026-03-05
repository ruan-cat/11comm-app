<!--
  采购列表
  功能：展示商品列表，供采购申请时选择商品

  访问地址: http://localhost:9000/#/pages-sub/purchase/list
  建议携带参数: ?communityId=COMM_001

  旧代码：gitee-example/pages/purchaseList/purchaseList.vue
-->

<script setup lang="ts">
import type { ResourceStore } from '@/api/purchase'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { listResourceStores } from '@/api/purchase'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '选择商品',
    enablePullDownRefresh: false,
  },
})

// ==================== 依赖注入 ====================

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

// ==================== 页面状态 ====================

/** 商品列表 */
const purchaseList = ref<ResourceStore[]>([])

// ==================== API 请求 ====================

/** 加载商品列表 */
const { send: loadPurchaseList, loading } = useRequest(
  (params: { page: number, row: number, communityId: string }) => listResourceStores(params),
  {
    immediate: false,
  },
).onSuccess((event) => {
  const data = event.data as { resourceStores?: typeof purchaseList.value }
  if (data?.resourceStores) {
    purchaseList.value = data.resourceStores
  }
}).onError((error) => {
  console.error('加载商品列表失败:', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

// ==================== 生命周期 ====================

onLoad((options) => {
  const communityId = options?.communityId || communityInfo.communityId
  loadPurchaseList({ page: 1, row: 50, communityId })
})

// ==================== 方法 ====================

/** 选择商品 */
function handleSelectItem(item: ResourceStore) {
  // 将选中的商品信息传递给上一个页面
  const pages = getCurrentPages()
  const prevPage = pages[pages.length - 2] as any

  if (prevPage) {
    // 设置商品信息
    const floorInfo = {
      resId: item.resId,
      resName: item.resName,
      resCode: item.resCode,
      price: item.price,
      stock: item.stock,
      description: item.description,
    }

    // 存储到全局或通过事件传递
    uni.$emit('purchaseSelect', floorInfo)

    // 由于无法直接调用上一页方法，使用路由参数方式
    const params = encodeURIComponent(JSON.stringify(floorInfo))

    uni.navigateBack({
      delta: 1,
    })
  }
}
</script>

<template>
  <view class="page-container">
    <view v-if="loading" class="loading-container">
      <wd-loading />
    </view>

    <view v-else-if="purchaseList.length === 0" class="empty-container">
      <text class="text-grey">暂无商品</text>
    </view>

    <view v-else class="goods-list">
      <wd-cell-group border>
        <wd-cell
          v-for="item in purchaseList"
          :key="item.resId"
          :title="item.resName"
          :value="`库存: ${item.stock}`"
          is-link
          @click="handleSelectItem(item)"
        >
          <template #label>
            <view class="goods-label">
              <text class="text-grey text-sm">{{ item.parentRstName }} - {{ item.rstName }}</text>
              <text class="text-grey text-sm">¥{{ item.price }}</text>
            </view>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
}

.text-grey {
  color: #999;
}

.text-sm {
  font-size: 24rpx;
}

.goods-list {
  padding: 20rpx;
}

.goods-label {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
}
</style>
