<!--
  充电桩列表页面
  功能：显示充电桩列表，支持搜索

  访问地址: http://localhost:9000/#/pages-sub/fee/charge
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:9000/#/pages-sub/fee/charge?communityId=COMM_001

  旧代码：gitee-example/pages/charge/charge.vue
-->

<script setup lang="ts">
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getChargeMachineList } from '@/api/fee'
import { TypedRouter } from '@/router'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '充电桩',
    enablePullDownRefresh: false,
  },
})

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 搜索关键词 */
const searchKeyword = ref('')

/** 充电桩列表 */
const machines = ref<
  Array<{
    machineId: string
    machineName: string
    machineCode: string
    photoUrl: string
    communityId: string
    factoryName: string
    ruleName: string
    chargeTypeName: string
    stateName: string
    state: string
  }>
>([])

/** 加载充电桩列表 */
const { send: loadMachines, loading: machinesLoading } = useRequest(
  (keyword: string) =>
    getChargeMachineList({
      page: 1,
      row: 50,
      communityId: communityInfo.communityId,
      machineNameLike: keyword,
    }),
  { immediate: false },
).onSuccess((event) => {
  machines.value = (event.data as { data: typeof machines.value }).data || []
})

/** 搜索 */
function handleSearch() {
  loadMachines(searchKeyword.value)
}

/** 查看详情 */
function handleDetail(machine: (typeof machines.value)[0]) {
  TypedRouter.toFeeChargeDetail({
    communityId: machine.communityId,
    machineId: machine.machineId,
    machineName: machine.machineName,
  })
}

// 初始加载
loadMachines('')
</script>

<template>
  <view class="charge-page">
    <!-- 搜索栏 -->
    <view class="search-bar bg-white p-3">
      <view class="flex items-center gap-2">
        <view class="flex-1">
          <input
            v-model="searchKeyword"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            type="text"
            placeholder="输入充电桩名称"
            confirm-type="search"
            @confirm="handleSearch"
          >
        </view>
        <wd-button size="small" @click="handleSearch">
          搜索
        </wd-button>
      </view>
    </view>

    <!-- 充电桩列表 -->
    <view v-if="machines.length > 0" class="p-3">
      <view class="grid grid-cols-2 gap-3">
        <view
          v-for="(item, index) in machines"
          :key="index"
          class="machine-card rounded-lg bg-white p-3"
          @click="handleDetail(item)"
        >
          <!-- 图片 -->
          <view class="mb-2">
            <image
              v-if="item.photoUrl"
              :src="item.photoUrl"
              class="machine-image w-full rounded"
              mode="aspectFill"
            />
            <image v-else src="/static/image/noPhoto.jpg" class="machine-image w-full rounded" mode="aspectFill" />
          </view>

          <!-- 名称 -->
          <view class="text-center">
            <text class="text-sm font-medium">{{ item.machineName }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="flex flex-col items-center justify-center py-20">
      <text class="text-gray-400">暂无充电桩</text>
    </view>

    <!-- 加载状态 -->
    <view v-if="machinesLoading" class="p-3 text-center text-gray-400">
      <text>加载中...</text>
    </view>
  </view>
</template>

<style scoped>
.machine-card {
  background-color: #fff;
}
.machine-image {
  height: 200rpx;
}
</style>
