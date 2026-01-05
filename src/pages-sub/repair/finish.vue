<!--
  维修已办单
  功能：显示已完成的维修工单列表，支持搜索和筛选
  列表页

  访问地址: http://localhost:9000/#/pages-sub/repair/finish
  建议携带参数: ?page=1&row=10

  完整示例: http://localhost:9000/#/pages-sub/repair/finish?page=1&row=10

  旧代码：gitee-example/pages/repairDispatchFinish/repairDispatchFinish.vue
-->

<script setup lang="ts">
import type { RepairOrder } from '@/types/repair'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getRepairFinishList, getRepairStates } from '@/api/repair'
import RepairListItem from '@/components/common/repair-list-item/index.vue'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { REPAIR_STATUSES } from '@/constants/repair'
import { TypedRouter } from '@/router'
import { getCurrentCommunity, getUserInfo } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '维修已办单',
    enablePullDownRefresh: false,
  },
})

/** 搜索条件 */
const searchName = ref('')
const selectedState = ref<string>('')
const defaultStateOptions: Array<{ label: string, value: string }> = [
  { label: '全部状态', value: '' },
  ...REPAIR_STATUSES.map(item => ({
    label: item.label,
    value: item.value as string,
  })),
]
const stateOptions = ref<Array<{ label: string, value: string }>>([...defaultStateOptions])

/** 列表数据（由 z-paging 接管） */
const repairList = ref<RepairOrder[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
const pagingRef = ref()

/** 获取用户信息 */
const userInfo = getUserInfo()
const communityInfo = getCurrentCommunity()

/** 加载维修状态字典 */
const { send: loadStates } = useRequest(() => getRepairStates(), {
  immediate: false,
})
  .onSuccess((event) => {
    const result = event.data
    if (result && result.length > 0) {
      stateOptions.value = [
        { label: '全部状态', value: '' },
        ...result.map(item => ({
          label: item.name || '',
          value: item.statusCd || '',
        })),
      ]
    }
    else {
      stateOptions.value = [...defaultStateOptions]
    }
  })
  .onError((error) => {
    console.error('加载状态字典失败:', error)
    stateOptions.value = [...defaultStateOptions]
  })

/** 查询维修工单列表请求（z-paging 集成） */
const { send: loadRepairFinishList } = useRequest(
  (params: { page: number, row: number, statusCd?: string }) =>
    getRepairFinishList({
      ...params,
      userId: userInfo.userId || '',
      communityId: communityInfo.communityId || '',
      repairName: searchName.value,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const response = event.data
    total.value = response?.total || 0
    pagingRef.value?.complete(response?.ownerRepairs || [])
  })
  .onError((error) => {
    console.error('加载列表失败:', error)
    pagingRef.value?.complete(false)
  })

/** z-paging 查询回调 */
function handleQuery(pageNo: number, pageSizeValue: number) {
  currentPage.value = pageNo
  pageSize.value = pageSizeValue

  loadRepairFinishList({
    page: pageNo,
    row: pageSizeValue,
    statusCd: selectedState.value,
  })
}

// 进入页面自动触发首次加载
onMounted(() => {
  pagingRef.value?.reload()
})

/** 搜索 */
function handleSearch() {
  // 重置到第一页并刷新
  pagingRef.value?.reload()
}

/** 状态选择器改变 */
function handleStateChange({ value }: { value: string }) {
  selectedState.value = value
  pagingRef.value?.reload()
}

/** 查看详情 */
function handleViewDetail(item: RepairOrder) {
  TypedRouter.toRepairDetail(item.repairId!, userInfo.storeId)
}
</script>

<template>
  <view class="repair-finish-page">
    <z-paging
      ref="pagingRef"
      v-model="repairList"
      :default-page-size="pageSize"
      @query="handleQuery"
    >
      <!-- 顶部吸顶工具栏 -->
      <template #top>
        <view class="toolbar">
          <view class="toolbar-controls">
            <wd-search
              v-model="searchName"
              placeholder="输入报修人"
              :maxlength="20"
              hide-cancel
              clearable
              shape="round"
              light
              class="control-search"
              @search="handleSearch"
              @clear="handleSearch"
            >
              <template #prefix>
                <wd-picker
                  v-model="selectedState"
                  :columns="stateOptions"
                  label-key="label"
                  value-key="value"
                  @confirm="handleStateChange"
                >
                  <view class="prefix-filter">
                    <text class="prefix-text">{{ stateOptions.find(item => item.value === selectedState)?.label || '状态' }}</text>
                    <wd-icon name="" custom-class="i-carbon-chevron-down text-28rpx text-gray-500 ml-2rpx" />
                  </view>
                </wd-picker>
              </template>
            </wd-search>

            <view class="control-item">
              <wd-button type="success" size="small" class="control-btn" @click="handleSearch">
                搜索
              </wd-button>
            </view>
          </view>
          <view v-if="total > 0" class="toolbar-total">
            共 {{ total }} 条记录
          </view>
        </view>
      </template>

      <!-- 列表内容 -->
      <view class="repair-list">
        <repair-list-item
          v-for="item in repairList"
          :key="item.repairId"
          :item="item"
        >
          <template #action>
            <wd-button size="small" plain @click="handleViewDetail(item)">
              详情
            </wd-button>
          </template>
        </repair-list-item>
      </view>

      <!-- 空状态 -->
      <template #empty>
        <view class="empty-wrap">
          <wd-status-tip image="search" tip="暂无已办工单" />
        </view>
      </template>

      <!-- 加载状态 -->
      <template #loading>
        <ZPagingLoading
          icon="document"
          icon-class="i-carbon-document text-orange-400 animate-pulse"
          primary-text="正在加载已办工单..."
          secondary-text="请稍候片刻"
        />
      </template>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.repair-finish-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f5f5f5;
  padding: 12px 12px 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.toolbar-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-btn {
  width: 100%;
  height: 38px;
}

.control-item {
  flex: 0 0 90px;
}

.control-search {
  flex: 1;
}

.control-search :deep(.wd-search) {
  height: 38px;
}

.prefix-filter {
  display: flex;
  align-items: center;
  padding: 0 10rpx 0 6rpx;
  height: 36px;
  border-right: 1px solid #e0e0e0;
  gap: 4rpx;
}

.prefix-text {
  font-size: 12px;
  color: #303133;
}

.toolbar-total {
  margin-top: 6px;
  text-align: right;
  font-size: 12px;
  color: #607d8b;
}

.repair-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.empty-wrap {
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
