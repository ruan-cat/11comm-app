<!--
  维修待办单
  功能：显示待处理的维修工单列表

  访问地址: http://localhost:9000/#/pages-sub/repair/dispatch
  建议携带参数: ?page=1&row=10

  完整示例: http://localhost:9000/#/pages-sub/repair/dispatch?page=1&row=10

  旧代码：gitee-example/pages/repairDispatch/repairDispatch.vue
-->

<script setup lang="ts">
import type { RepairOrder } from '@/types/repair'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getRepairStaffList, getRepairStates, repairStart, repairStop } from '@/api/repair'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { useGlobalMessage } from '@/hooks/useGlobalMessage'
import { TypedRouter } from '@/router'
import { getCurrentCommunity, getUserInfo } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '维修待办单',
    enablePullDownRefresh: false,
  },
})

const message = useGlobalMessage()

/** 搜索条件 */
const searchName = ref('')
const selectedState = ref<string>('')
const stateOptions = ref<Array<{ label: string, value: string }>>([
  { label: '全部状态', value: '' },
])

/** 列表数据 */
const repairList = ref<RepairOrder[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)

/** z-paging 组件引用 */
const pagingRef = ref()

/** 暂停弹窗 */
const showStopModal = ref(false)
const stopReason = ref('')
const currentStopItem = ref<RepairOrder | null>(null)

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
  })
  .onError((error) => {
    console.error('加载状态字典失败:', error)
  })

/** 查询维修工单列表请求（z-paging 集成） */
const { send: loadRepairStaffList } = useRequest(
  (params: { page: number, row: number, statusCd?: string }) =>
    getRepairStaffList({
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
    pagingRef.value?.complete(response?.ownerRepairs || [], response?.total || 0)
  })
  .onError((error) => {
    console.error('加载列表失败:', error)
    pagingRef.value?.complete(false)
  })

/** z-paging 查询回调 */
function handleQuery(pageNo: number, pageSizeValue: number) {
  currentPage.value = pageNo
  pageSize.value = pageSizeValue

  loadRepairStaffList({
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

/** 启动维修 */
const { send: startRepair, onSuccess: onStartSuccess, onError: onStartError } = useRequest(
  (params: { repairId: string, communityId: string }) => repairStart(params),
  { immediate: false },
)

onStartSuccess(() => {
  uni.showToast({
    title: '启动成功',
    icon: 'success',
  })

  // 刷新列表
  setTimeout(() => {
    pagingRef.value?.reload()
  }, 1000)
})

onStartError((error) => {
  uni.showToast({
    title: error.error || '启动失败',
    icon: 'none',
  })
})

function handleStartRepair(item: RepairOrder) {
  message.confirm({
    title: '提示',
    msg: '确认启动报修？',
    success: (res) => {
      if (res.action === 'confirm') {
        startRepair({
          repairId: item.repairId!,
          communityId: item.communityId,
        }).catch((error) => {
          console.error('启动维修失败:', error)
        })
      }
    },
  })
}

/** 转单 */
function handleTransfer(item: RepairOrder) {
  TypedRouter.toRepairHandle({
    action: 'TRANSFER',
    repairId: item.repairId!,
    repairType: item.repairType || '',
    preStaffId: item.preStaffId,
    preStaffName: item.preStaffName,
    repairObjType: item.repairObjType,
    publicArea: item.publicArea,
    repairChannel: item.repairChannel,
  })
}

/** 暂停维修 */
function handleStopRepair(item: RepairOrder) {
  currentStopItem.value = item
  stopReason.value = ''
  showStopModal.value = true
}

/** 确认暂停 */
const { send: stopRepair, onSuccess: onStopSuccess, onError: onStopError } = useRequest(
  (params: { repairId: string, communityId: string, remark: string }) => repairStop(params),
  { immediate: false },
)

onStopSuccess(() => {
  showStopModal.value = false
  uni.showToast({
    title: '暂停成功',
    icon: 'success',
  })

  // 刷新列表
  setTimeout(() => {
    pagingRef.value?.reload()
  }, 1000)
})

onStopError((error) => {
  uni.showToast({
    title: error.error || '暂停失败',
    icon: 'none',
  })
})

async function handleConfirmStop() {
  if (!stopReason.value.trim()) {
    uni.showToast({
      title: '请填写暂停原因',
      icon: 'none',
    })
    return
  }

  if (!currentStopItem.value)
    return

  await stopRepair({
    repairId: currentStopItem.value.repairId!,
    communityId: currentStopItem.value.communityId,
    remark: stopReason.value,
  })
}

/** 退单 */
function handleReturn(item: RepairOrder) {
  TypedRouter.toRepairHandle({
    action: 'BACK',
    repairId: item.repairId!,
    repairType: item.repairType || '',
    preStaffId: item.preStaffId,
    preStaffName: item.preStaffName,
    repairObjType: item.repairObjType,
    publicArea: item.publicArea,
    repairChannel: item.repairChannel,
  })
}

/** 办结 */
function handleFinish(item: RepairOrder) {
  TypedRouter.toRepairHandle({
    action: 'FINISH',
    repairId: item.repairId!,
    repairType: item.repairType || '',
    preStaffId: item.preStaffId,
    preStaffName: item.preStaffName,
    repairObjType: item.repairObjType,
    publicArea: item.publicArea,
    repairChannel: item.repairChannel,
  })
}

/** 回访 */
function handleAppraise(item: RepairOrder) {
  TypedRouter.toAppraiseRepair({
    repairId: item.repairId!,
    repairType: item.repairType || '',
    repairChannel: item.repairChannel,
    publicArea: item.publicArea,
    communityId: item.communityId!,
  })
}

/** 检查权限 */
function checkAuth(privilegeId: string): boolean {
  // TODO: 实现权限检查逻辑
  return true
}

/** 格式化预约时间 */
function formatAppointmentTime(timeStr?: string): string {
  if (!timeStr)
    return ''
  try {
    const date = new Date(timeStr.replace(/-/g, '/'))
    return `${date.getMonth() + 1}-${date.getDate()}`
  }
  catch {
    return timeStr
  }
}

function displayLocation(item: RepairOrder): string {
  return item.repairObjName || item.address || '未填写位置'
}

function displayAppointment(item: RepairOrder): string {
  return formatAppointmentTime(item.appointmentTime || item.createTime) || '未填写时间'
}

function displayReporter(item: RepairOrder): string {
  const name = item.repairName || '未填写报修人'
  const phone = (item.tel || '').trim()
  return phone ? `${name} (${phone})` : name
}

type TagType = 'primary' | 'success' | 'warning' | 'danger'

/** 派单状态对应的标签颜色 */
const statusTagTypeMap: Record<string, TagType> = {
  10001: 'warning', // 待派单
  10002: 'primary', // 已派单
  10003: 'primary', // 处理中
  10004: 'success', // 已完成
  10005: 'danger', // 已关闭/已作废
}

function getStatusTagType(statusCd?: string): TagType {
  return statusTagTypeMap[statusCd || ''] || 'primary'
}
</script>

<template>
  <view class="repair-dispatch-page">
    <z-paging
      ref="pagingRef"
      v-model="repairList"
      :default-page-size="pageSize"
      :refresher-enabled="true"
      :loading-more-enabled="true"
      :show-scrollbar="false"
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
        <view
          v-for="item in repairList"
          :key="item.repairId"
          class="repair-card"
        >
          <view class="card-header">
            <view class="card-title">
              <text class="title-text">{{ item.title || item.repairId }}</text>
              <text class="id-text">工单号：{{ item.repairId }}</text>
            </view>
            <wd-tag :type="getStatusTagType(item.statusCd)" plain>
              {{ item.statusName || '待处理' }}
            </wd-tag>
          </view>

          <view class="card-body">
            <view class="row">
              <text class="label">报修类型</text>
              <text class="value value-strong">{{ item.repairTypeName || '其他维修' }}</text>
            </view>
            <view class="row">
              <text class="label">报修人</text>
              <text class="value value-strong">{{ displayReporter(item) }}</text>
            </view>
            <view class="row">
              <text class="label">位置</text>
              <text class="value value-strong">{{ displayLocation(item) }}</text>
            </view>
            <view class="row">
              <text class="label">预约时间</text>
              <text class="value value-strong">{{ displayAppointment(item) }}</text>
            </view>
            <view class="row">
              <text class="label">报修内容</text>
              <text class="value multiline value-strong">{{ item.context || '暂无报修内容' }}</text>
            </view>
          </view>

          <view class="card-actions">
            <!-- 详情按钮 -->
            <wd-button size="small" plain @click="handleViewDetail(item)">
              详情
            </wd-button>

            <!-- 启动按钮：已派单 -->
            <wd-button
              v-if="item.statusCd === '10002'"
              size="small"
              type="success"
              @click="handleStartRepair(item)"
            >
              启动
            </wd-button>

            <!-- 转单按钮：已派单/处理中 -->
            <wd-button
              v-if="item.statusCd === '10002' || item.statusCd === '10003'"
              size="small"
              type="warning"
              @click="handleTransfer(item)"
            >
              转单
            </wd-button>

            <!-- 暂停按钮：已派单/处理中 -->
            <wd-button
              v-if="item.statusCd === '10002' || item.statusCd === '10003'"
              size="small"
              type="warning"
              @click="handleStopRepair(item)"
            >
              暂停
            </wd-button>

            <!-- 退单按钮 -->
            <wd-button
              v-if="item.preStaffId !== '-1'"
              size="small"
              type="error"
              @click="handleReturn(item)"
            >
              退单
            </wd-button>

            <!-- 办结按钮：已派单/处理中 -->
            <wd-button
              v-if="item.statusCd === '10002' || item.statusCd === '10003'"
              size="small"
              type="success"
              @click="handleFinish(item)"
            >
              办结
            </wd-button>

            <!-- 回访按钮：已完成且需回访 -->
            <wd-button
              v-if="item.statusCd === '10004' && item.returnVisitFlag === '003' && checkAuth('502021040151320003')"
              size="small"
              type="success"
              @click="handleAppraise(item)"
            >
              回访
            </wd-button>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <template #empty>
        <view class="empty-wrap">
          <wd-status-tip image="search" tip="暂无待办工单" />
        </view>
      </template>

      <!-- 加载状态 -->
      <template #loading>
        <ZPagingLoading
          icon="document"
          icon-class="i-carbon-document text-orange-400 animate-pulse"
          primary-text="正在加载待办工单..."
          secondary-text="请稍候片刻"
        />
      </template>
    </z-paging>

    <!-- 暂停原因弹窗 -->
    <wd-popup v-model="showStopModal" position="center" closable>
      <view class="stop-modal p-6" style="width: 80vw;">
        <view class="mb-4 text-center text-lg font-bold">
          暂停原因
        </view>
        <wd-textarea
          v-model="stopReason"
          placeholder="请填写暂停原因"
          :maxlength="200"
          show-word-limit
          :rows="4"
        />
        <view class="mt-4 flex gap-3">
          <wd-button block @click="showStopModal = false">
            取消
          </wd-button>
          <wd-button block type="primary" @click="handleConfirmStop">
            确定
          </wd-button>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<style lang="scss" scoped>
.repair-dispatch-page {
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
  gap: 12px;
}

.repair-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f1f1;
  padding-bottom: 8px;
  margin-bottom: 10px;
}

.card-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title-text {
  font-size: 15px;
  font-weight: 600;
  color: #263238;
}

.id-text {
  font-size: 12px;
  color: #607d8b;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.label {
  font-size: 13px;
  color: #607d8b;
  flex-shrink: 0;
}

.value {
  font-size: 15px;
  color: #263238;
  text-align: right;
  flex: 1;
}

.value-strong {
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
}

.multiline {
  white-space: normal;
  text-align: right;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #f1f1f1;
  padding-top: 10px;
  margin-top: 8px;
}

.empty-wrap {
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
