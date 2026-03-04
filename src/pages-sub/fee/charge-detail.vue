<!--
  充电桩详情页面
  功能：显示充电桩详细信息、订单记录和插座状态

  访问地址: http://localhost:9000/#/pages-sub/fee/charge-detail
  建议携带参数: ?machineId=xxx&machineName=xxx&communityId=COMM_001

  完整示例: http://localhost:9000/#/pages-sub/fee/charge-detail?machineId=MACHINE_001&machineName=充电桩1&communityId=COMM_001

  旧代码：gitee-example/pages/charge/chargeDetail.vue
-->

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { getChargeMachineList, getChargeMachineOrderList, getChargeMachinePortList } from '@/api/fee'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '充电桩详情',
    enablePullDownRefresh: false,
  },
})

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

/** 页面参数 */
const pageParams = reactive({
  machineId: '',
  machineName: '',
  communityId: '',
})

/** 充电桩信息 */
const machine = ref<{
  machineId: string
  machineName: string
  machineCode: string
  factoryName: string
  ruleName: string
  chargeTypeName: string
  stateName: string
  monitorId?: string
}>({
  machineId: '',
  machineName: '',
  machineCode: '',
  factoryName: '',
  ruleName: '',
  chargeTypeName: '',
  stateName: '',
})

/** 订单列表 */
const orders = ref<
  Array<{
    orderId: string
    personName: string
    personTel: string
    machineName: string
    machineCode: string
    portCode: string
    chargeHours: number
    durationPrice: number
    energy: number
    amount: number
    startTime: string
    endTime: string
    stateName: string
    remark: string
  }>
>([])

/** 插座列表 */
const ports = ref<
  Array<{
    portId: string
    portName: string
    portCode: string
    stateName: string
  }>
>([])

/** 当前 Tab */
const activeTab = ref(0)

/** 加载充电桩信息 */
const { send: loadMachine, loading: machineLoading } = useRequest(
  (machineId: string, communityId: string) =>
    getChargeMachineList({
      page: 1,
      row: 1,
      communityId,
      machineId,
    }),
  { immediate: false },
).onSuccess((event) => {
  const data = event.data as { data: typeof machine.value[] }
  if (data.data && data.data.length > 0) {
    machine.value = data.data[0]
  }
})

/** 加载订单列表 */
const { send: loadOrders, loading: ordersLoading } = useRequest(
  (machineId: string, communityId: string) =>
    getChargeMachineOrderList({
      page: 1,
      row: 100,
      communityId,
      machineId,
    }),
  { immediate: false },
).onSuccess((event) => {
  orders.value = (event.data as { data: typeof orders.value }).data || []
})

/** 加载插座列表 */
const { send: loadPorts, loading: portsLoading } = useRequest(
  (machineId: string, communityId: string) =>
    getChargeMachinePortList({
      page: 1,
      row: 100,
      communityId,
      machineId,
    }),
  { immediate: false },
).onSuccess((event) => {
  ports.value = (event.data as { data: typeof ports.value }).data || []
})

/** Tab 切换 */
function handleTabChange(index: number) {
  activeTab.value = index
  if (index === 0) {
    loadOrders(pageParams.machineId, pageParams.communityId)
  }
  else if (index === 1) {
    loadPorts(pageParams.machineId, pageParams.communityId)
  }
}

/** 页面加载 */
onLoad((options) => {
  pageParams.machineId = options?.machineId || ''
  pageParams.machineName = options?.machineName || ''
  pageParams.communityId = options?.communityId || communityInfo.communityId

  // 加载充电桩信息
  loadMachine(pageParams.machineId, pageParams.communityId)
  // 默认加载订单列表
  loadOrders(pageParams.machineId, pageParams.communityId)
})
</script>

<template>
  <view class="charge-detail-page">
    <!-- 充电桩信息 -->
    <FormSectionTitle title="充电桩" />

    <wd-cell-group>
      <wd-cell title="名称">
        <text>{{ machine.machineName }}</text>
      </wd-cell>
      <wd-cell title="设备编号">
        <text>{{ machine.machineCode }}</text>
      </wd-cell>
      <wd-cell title="厂家">
        <text>{{ machine.factoryName }}</text>
      </wd-cell>
      <wd-cell title="充电规则">
        <text>{{ machine.ruleName }}</text>
      </wd-cell>
      <wd-cell title="充电类型">
        <text>{{ machine.chargeTypeName }}</text>
      </wd-cell>
      <wd-cell title="状态">
        <text>{{ machine.stateName }}</text>
      </wd-cell>
    </wd-cell-group>

    <!-- Tab 栏 -->
    <view class="tab-bar mt-3 bg-white">
      <view class="flex">
        <view
          class="flex-1 py-3 text-center"
          :class="activeTab === 0 ? 'border-b-2 border-green-500 text-green-500 font-medium' : 'text-gray-500'"
          @click="handleTabChange(0)"
        >
          订单
        </view>
        <view
          class="flex-1 py-3 text-center"
          :class="activeTab === 1 ? 'border-b-2 border-green-500 text-green-500 font-medium' : 'text-gray-500'"
          @click="handleTabChange(1)"
        >
          插座
        </view>
      </view>
    </view>

    <!-- Tab 内容 -->
    <view class="p-3">
      <!-- 订单列表 -->
      <view v-show="activeTab === 0">
        <view
          v-for="(item, index) in orders"
          :key="index"
          class="order-card mb-3 rounded-lg bg-white p-3"
        >
          <view class="flex items-center justify-between border-b border-gray-200 pb-2">
            <text class="font-medium">{{ item.personName }}/{{ item.personTel }}</text>
            <text class="text-sm text-gray-500">{{ item.orderId }}</text>
          </view>

          <view class="grid grid-cols-2 mt-2 gap-2 text-sm">
            <view class="text-gray-500">
              <text>充电桩:</text>
              <text class="ml-1 text-gray-700">{{ item.machineName }}>{{ item.machineCode }}</text>
            </view>
            <view class="text-gray-500">
              <text>插座:</text>
              <text class="ml-1 text-gray-700">{{ item.portCode }}</text>
            </view>
            <view class="text-gray-500">
              <text>充电小时:</text>
              <text class="ml-1 text-gray-700">{{ item.chargeHours }}</text>
            </view>
            <view class="text-gray-500">
              <text>小时电价:</text>
              <text class="ml-1 text-gray-700">¥{{ item.durationPrice }}</text>
            </view>
            <view class="text-gray-500">
              <text>充电量:</text>
              <text class="ml-1 text-gray-700">{{ item.energy }}</text>
            </view>
            <view class="text-gray-500">
              <text>扣款金额:</text>
              <text class="ml-1 text-red-500">¥{{ item.amount }}</text>
            </view>
            <view class="col-span-2 text-gray-500">
              <text>时间:</text>
              <text class="ml-1 text-gray-700">{{ item.startTime }} ~ {{ item.endTime }}</text>
            </view>
            <view class="text-gray-500">
              <text>状态:</text>
              <text class="ml-1 text-gray-700">{{ item.stateName }}</text>
            </view>
            <view v-if="item.remark" class="col-span-2 text-gray-500">
              <text>备注:</text>
              <text class="ml-1 text-gray-700">{{ item.remark }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 插座列表 -->
      <view v-show="activeTab === 1">
        <view
          v-for="(item, index) in ports"
          :key="index"
          class="port-card mb-3 rounded-lg bg-white p-3"
        >
          <view class="flex items-center justify-between border-b border-gray-200 pb-2">
            <text class="font-medium">{{ item.portName }}</text>
            <text class="text-sm text-gray-500">{{ item.portId }}</text>
          </view>

          <view class="grid grid-cols-2 mt-2 gap-2 text-sm">
            <view class="text-gray-500">
              <text>编号:</text>
              <text class="ml-1 text-gray-700">{{ item.portCode }}</text>
            </view>
            <view class="text-gray-500">
              <text>状态:</text>
              <text class="ml-1 text-gray-700">{{ item.stateName }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="machineLoading || ordersLoading || portsLoading" class="p-3 text-center text-gray-400">
      <text>加载中...</text>
    </view>
  </view>
</template>

<style scoped>
.tab-bar {
  background-color: #fff;
}
.order-card,
.port-card {
  background-color: #fff;
}
</style>
