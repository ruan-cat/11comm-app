<!--
  处理维修工单
  功能：处理维修工单，支持派单/转单/退单/办结

  访问地址: http://localhost:9000/#/pages-sub/repair/handle
  建议携带参数: ?action=DISPATCH&repairId=REP_001&repairType=水电维修

  完整示例: http://localhost:9000/#/pages-sub/repair/handle?action=DISPATCH&repairId=REP_001&repairType=水电维修&repairObjType=001

  旧代码：gitee-example/pages/repairHandle/repairHandle.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import type { DispatchAction, MaintenanceType, PaymentType, RepairObjType, RepairResource } from '@/types/repair'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, reactive, ref } from 'vue'
import { dispatchRepair, finishRepair, getRepairPayTypes, getRepairStaffs } from '@/api/repair'
import { useGlobalLoading } from '@/hooks/useGlobalLoading'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { getCurrentCommunity, getUserInfo } from '@/utils/user'

const toast = useGlobalToast()
const loading = useGlobalLoading()

definePage({
  style: {
    navigationBarTitleText: '处理工单',
    enablePullDownRefresh: false,
  },
})

// ==================== 常量定义 ====================

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

// ==================== 依赖注入 ====================

/** 用户信息 */
const userInfo = getUserInfo()
const communityInfo = getCurrentCommunity()

// ==================== 页面参数 ====================

/** 页面参数类型 */
interface PageParams {
  action: DispatchAction
  repairId: string
  repairType: string
  repairObjType: RepairObjType
  repairChannel: string
  publicArea: string
  preStaffId: string
  preStaffName: string
}

// ==================== 表单状态 ====================

/** 表单引用 */
const formRef = ref()

/** 表单数据模型 */
const model = reactive<PageParams & {
  /** 维修师傅ID */
  staffId: string
  /** 维修师傅名称 */
  staffName: string
  /** 是否用料/维修类型ID */
  feeFlag: MaintenanceType | ''
  /** 支付方式ID */
  payType: PaymentType | ''
  /** 处理意见 */
  context: string
  /** 商品列表 */
  resourceList: RepairResource[]
  /** 总计金额 */
  totalAmount: number
  /** 维修前图片 */
  beforePhotos: string[]
  /** 维修后图片 */
  afterPhotos: string[]
}>({
  action: 'DISPATCH',
  repairId: '',
  repairType: '',
  repairObjType: '001',
  repairChannel: '',
  publicArea: '',
  preStaffId: '',
  preStaffName: '',
  staffId: '',
  staffName: '',
  feeFlag: '',
  payType: '',
  context: '',
  resourceList: [],
  totalAmount: 0,
  beforePhotos: [],
  afterPhotos: [],
})

// ==================== 计算属性 ====================

/** 页面标题 */
const pageTitle = computed(() => {
  switch (model.action) {
    case 'DISPATCH':
      return '派单'
    case 'TRANSFER':
      return '转单'
    case 'RETURN':
      return '退单'
    case 'FINISH':
      return '办结'
    default:
      return '处理工单'
  }
})

/** 是否显示维修师傅选择（派单/转单/退单时） */
const showStaffSelector = computed(() => model.action !== 'FINISH')

/** 是否显示商品选择按钮 */
const showResourceSelector = computed(() => model.feeFlag === '1001' || model.feeFlag === '1003')

/** 是否显示商品列表 */
const showResourceList = computed(() => (model.feeFlag === '1001' || model.feeFlag === '1003') && model.resourceList.length > 0)

/** 是否显示支付方式 */
const showPayType = computed(() => model.feeFlag === '1001')

/** 是否显示图片上传（仅办结时） */
const showImages = computed(() => model.action === 'FINISH')

/** 是否显示总计金额 */
const showTotalAmount = computed(() => model.feeFlag === '1001')

/** 维修师傅选择器选项 */
const staffOptions = ref<Array<{ staffId: string, staffName: string }>>([
  { staffId: '', staffName: '请选择员工' },
])

/** 选中的维修师傅索引 */
const selectedStaffIndex = ref(0)

/** 选中的维修师傅 */
const selectedStaff = computed(() => staffOptions.value[selectedStaffIndex.value])

/** 是否用料/维修类型选项 */
const feeOptions = computed(() => {
  if (model.repairObjType === '004') {
    // 公共区域：有偿服务/无偿服务
    return [
      { id: '' as const, name: '请选择' },
      { id: '1001' as const, name: '有偿服务' },
      { id: '1002' as const, name: '无偿服务' },
    ]
  }
  // 非公共区域：需要用料/无需用料
  return [
    { id: '' as const, name: '请选择' },
    { id: '1003' as const, name: '需要用料' },
    { id: '1004' as const, name: '无需用料' },
  ]
})

/** 支付方式选项 */
const payTypeOptions = ref<Array<{ statusCd: PaymentType | '', name: string }>>([
  { statusCd: '', name: '请选择' },
])

/** 选中的支付方式索引 */
const selectedPayTypeIndex = ref(0)

// ==================== 表单校验规则 ====================

/** 表单校验规则 */
const formRules: FormRules = {
  staffId: [
    {
      required: true,
      message: '请选择维修师傅',
      validator: (value) => {
        return value ? Promise.resolve() : Promise.reject(new Error('请选择维修师傅'))
      },
    },
  ],
  feeFlag: [
    {
      required: true,
      message: '请选择是否用料',
      validator: (value) => {
        return value ? Promise.resolve() : Promise.reject(new Error('请选择是否用料'))
      },
    },
  ],
  payType: [
    {
      required: true,
      message: '请选择支付方式',
      validator: (value) => {
        return value ? Promise.resolve() : Promise.reject(new Error('请选择支付方式'))
      },
    },
  ],
  context: [
    { required: true, message: '请填写处理意见' },
  ],
}

// ==================== 数据加载 ====================

/**
 * 加载维修师傅列表
 * 🔴 强制规范：必须设置 immediate: false
 */
const {
  send: loadStaffs,
  onSuccess: onLoadStaffsSuccess,
  onError: onLoadStaffsError,
} = useRequest(
  () =>
    getRepairStaffs({
      repairType: model.repairType,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)

/**
 * 加载维修师傅列表成功回调
 */
onLoadStaffsSuccess((result) => {
  staffOptions.value = [
    { staffId: '', staffName: '请选择员工' },
    ...result.data.staffs,
  ]
})

onLoadStaffsError((error) => {
  console.error('加载师傅列表失败:', error)
})

/**
 * 加载支付方式列表
 * 🔴 强制规范：必须设置 immediate: false
 */
const {
  send: loadPayTypes,
  onSuccess: onLoadPayTypesSuccess,
  onError: onLoadPayTypesError,
} = useRequest(() => getRepairPayTypes(), { immediate: false })

/**
 * 加载支付方式列表成功回调
 */
onLoadPayTypesSuccess((result) => {
  payTypeOptions.value = [
    { statusCd: '', name: '请选择' },
    ...result.data.map(item => ({
      statusCd: item.statusCd as PaymentType,
      name: item.name || '',
    })),
  ]
})

onLoadPayTypesError((error) => {
  console.error('加载支付方式失败:', error)
})

// ==================== 事件处理 ====================

/**
 * 维修师傅选择改变
 */
function handleStaffChange({ value }: { value: number }) {
  selectedStaffIndex.value = value
  if (value === 0) {
    model.staffId = ''
    model.staffName = ''
  }
  else {
    const staff = staffOptions.value[value]
    model.staffId = staff.staffId
    model.staffName = staff.staffName
  }
}

/**
 * 是否用料/维修类型选择改变
 */
function handleFeeChange({ value }: { value: number }) {
  model.feeFlag = feeOptions.value[value].id
}

/**
 * 支付方式选择改变
 */
function handlePayTypeChange({ value }: { value: number }) {
  selectedPayTypeIndex.value = value
  if (value === 0) {
    model.payType = ''
  }
  else {
    model.payType = payTypeOptions.value[value].statusCd
  }
}

/**
 * 打开选择商品页面
 */
function handleSelectResource() {
  TypedRouter.toSelectResource(model.feeFlag)
}

/**
 * 增加商品数量
 */
function handleIncreaseQuantity(index: number) {
  model.resourceList[index].useNumber = (model.resourceList[index].useNumber || 0) + 1
  updateTotalAmount()
}

/**
 * 减少商品数量
 */
function handleDecreaseQuantity(index: number) {
  if ((model.resourceList[index].useNumber || 0) <= 1) {
    toast.warning('不能再减少啦')
    return
  }
  model.resourceList[index].useNumber = (model.resourceList[index].useNumber || 1) - 1
  updateTotalAmount()
}

/**
 * 价格改变
 */
function handlePriceChange(index: number, price: string) {
  model.resourceList[index].price = Number(price)
  updateTotalAmount()
}

/**
 * 数量改变
 */
function handleQuantityChange(index: number, quantity: string) {
  model.resourceList[index].useNumber = Number(quantity)
  updateTotalAmount()
}

/**
 * 移除商品
 */
function handleRemoveResource(index: number) {
  model.resourceList.splice(index, 1)
  updateTotalAmount()
}

/**
 * 更新总价
 */
function updateTotalAmount() {
  model.totalAmount = model.resourceList.reduce((sum, item) => {
    const num = item.useNumber || 0
    const price = item.price || 0
    return sum + num * price
  }, 0)
}

/**
 * 维修前图片上传
 */
function handleBeforePhotosChange(fileIds: string[]) {
  model.beforePhotos = fileIds
}

/**
 * 维修后图片上传
 */
function handleAfterPhotosChange(fileIds: string[]) {
  model.afterPhotos = fileIds
}

// ==================== 提交处理 ====================

/**
 * 提交派单/转单/退单请求
 * 🔴 强制规范：必须设置 immediate: false
 */
const {
  send: submitDispatch,
  onSuccess: onDispatchSuccess,
  onError: onDispatchError,
} = useRequest(
  (params: {
    repairId: string
    staffId: string
    staffName: string
    action: DispatchAction
    context: string
    repairType: string
    communityId: string
    userId: string
    userName: string
  }) => dispatchRepair(params),
  { immediate: false },
)

onDispatchSuccess(() => {
  loading.close()
  toast.success('提交成功')

  setTimeout(() => {
    if (model.action === 'DISPATCH') {
      TypedRouter.toRepairList()
    }
    else {
      TypedRouter.toRepairDispatch()
    }
  }, 1500)
})

onDispatchError(() => {
  loading.close()
  toast.error('提交失败')
})

/**
 * 提交办结请求
 * 🔴 强制规范：必须设置 immediate: false
 */
const {
  send: submitFinish,
  onSuccess: onFinishSuccess,
  onError: onFinishError,
} = useRequest(
  (params: {
    repairId: string
    feeFlag: string
    context: string
    repairType: string
    communityId: string
    userId: string
    userName: string
    choosedGoodsList: RepairResource[]
    totalPrice: number
    payType: string
    beforeRepairPhotos: any[]
    afterRepairPhotos: any[]
    publicArea: string
    repairChannel: string
  }) => finishRepair(params),
  { immediate: false },
)

onFinishSuccess(() => {
  loading.close()
  toast.success('办结成功')

  setTimeout(() => {
    TypedRouter.toRepairDispatch()
  }, 1500)
})

onFinishError(() => {
  loading.close()
  toast.error('办结失败')
})

/**
 * 派单/转单/退单校验
 * @returns 返回错误信息，如果验证通过则返回空字符串
 */
function validateDispatch(): string {
  if (selectedStaffIndex.value === 0) {
    return '请选择维修师傅'
  }
  if (!model.context.trim()) {
    return '请填写处理意见'
  }
  return ''
}

/**
 * 办结校验
 * @returns 返回错误信息，如果验证通过则返回空字符串
 */
function validateFinish(): string {
  if (!model.feeFlag) {
    return model.repairObjType === '004' ? '请选择维修类型' : '请选择是否用料'
  }
  if ((model.feeFlag === '1001' || model.feeFlag === '1003') && model.resourceList.length === 0) {
    return '请选择商品'
  }
  if (model.feeFlag === '1001' && selectedPayTypeIndex.value === 0) {
    return '请选择支付方式'
  }
  if (!model.context.trim()) {
    return '请填写处理意见'
  }
  return ''
}

/**
 * 提交派单/转单/退单
 */
function handleSubmitDispatch() {
  // 校验
  const error = validateDispatch()
  if (error) {
    toast.warning(error)
    return
  }

  loading.loading('提交中...')

  submitDispatch({
    repairId: model.repairId,
    staffId: selectedStaff.value.staffId,
    staffName: selectedStaff.value.staffName || '',
    action: model.action,
    context: model.context,
    repairType: model.repairType,
    communityId: communityInfo.communityId,
    userId: userInfo.userId,
    userName: userInfo.userName,
  })
}

/**
 * 提交办结
 */
function handleSubmitFinish() {
  // 校验
  const error = validateFinish()
  if (error) {
    toast.warning(error)
    return
  }

  loading.loading('处理中...')

  submitFinish({
    repairId: model.repairId,
    feeFlag: model.feeFlag,
    context: model.context,
    repairType: model.repairType,
    communityId: communityInfo.communityId,
    userId: userInfo.userId,
    userName: userInfo.userName,
    choosedGoodsList: model.resourceList,
    totalPrice: model.totalAmount,
    payType: model.payType,
    beforeRepairPhotos: model.beforePhotos.map(photo => ({ photo })),
    afterRepairPhotos: model.afterPhotos.map(photo => ({ photo })),
    publicArea: model.publicArea,
    repairChannel: model.repairChannel,
  })
}

/**
 * 提交表单
 * @description 根据操作类型调用对应的提交方法
 */
function handleSubmit() {
  if (model.action === 'FINISH') {
    handleSubmitFinish()
  }
  else {
    handleSubmitDispatch()
  }
}

// ==================== 生命周期钩子 ====================

/**
 * 页面加载
 */
onLoad((options) => {
  model.action = (options?.action as DispatchAction) || 'DISPATCH'
  model.repairId = (options?.repairId as string) || ''
  model.repairType = (options?.repairType as string) || ''
  model.repairObjType = (options?.repairObjType as RepairObjType) || '001'
  model.repairChannel = (options?.repairChannel as string) || ''
  model.publicArea = (options?.publicArea as string) || ''
  model.preStaffId = (options?.preStaffId as string) || ''
  model.preStaffName = (options?.preStaffName as string) || ''

  // 加载维修师傅列表（派单/转单/退单时需要）
  if (showStaffSelector.value) {
    loadStaffs()
  }

  // 加载支付方式
  loadPayTypes()
})
</script>

<template>
  <view class="min-h-screen bg-gray-100">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 维修师傅选择 (派单/转单/退单) -->
      <view v-if="showStaffSelector" class="bg-white">
        <view class="section-title">
          维修师傅
        </view>
        <wd-cell-group border>
          <!-- 退单时显示只读信息 -->
          <template v-if="model.action === 'RETURN'">
            <wd-cell :title="model.preStaffName || '暂无'" />
          </template>
          <!-- 派单/转单时显示选择器 -->
          <template v-else>
            <wd-picker
              v-model="selectedStaffIndex"
              :columns="staffOptions"
              label-key="staffName"
              value-key="staffId"
              @confirm="handleStaffChange"
            >
              <wd-cell>
                <template #title>
                  <text class="text-gray-700 font-medium">维修师傅</text>
                </template>
                <template #value>
                  <text class="text-blue-500">{{ staffOptions[selectedStaffIndex]?.staffName || '请选择' }}</text>
                </template>
              </wd-cell>
            </wd-picker>
          </template>
        </wd-cell-group>
      </view>

      <!-- 是否用料/维修类型 (办结) -->
      <view v-else class="bg-white">
        <view class="section-title">
          {{ model.repairObjType === '004' ? '维修类型' : '是否用料' }}
        </view>
        <wd-cell-group border>
          <wd-picker
            v-model="model.feeFlag"
            :columns="feeOptions"
            label-key="name"
            value-key="id"
            @confirm="handleFeeChange"
          >
            <wd-cell :title="model.repairObjType === '004' ? '维修类型' : '是否用料'">
              <template #value>
                <text class="text-blue-500">{{ feeOptions.find(item => item.id === model.feeFlag)?.name || '请选择' }}</text>
              </template>
            </wd-cell>
          </wd-picker>
        </wd-cell-group>

        <!-- 选择商品按钮 -->
        <view v-if="showResourceSelector" class="p-3">
          <wd-button block type="primary" @click="handleSelectResource">
            <wd-icon name="" custom-class="i-carbon-add text-white mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            选择商品
          </wd-button>
        </view>

        <!-- 商品列表 -->
        <view v-if="showResourceList" class="p-3">
          <view class="section-title">
            商品清单
          </view>

          <view class="resource-table rounded bg-white">
            <!-- 表头 -->
            <view class="table-header flex items-center gap-2 bg-gray-50 p-3 text-sm font-bold">
              <view class="flex-1">
                商品
              </view>
              <view v-if="model.feeFlag === '1001'" class="w-20 text-center">
                价格
              </view>
              <view class="w-24 text-center">
                数量
              </view>
              <view class="w-16 text-center">
                操作
              </view>
            </view>

            <!-- 商品项 -->
            <view
              v-for="(item, index) in model.resourceList"
              :key="index"
              class="table-row border-t border-gray-100 py-2"
            >
              <view class="flex items-center gap-2 px-3">
                <!-- 商品名称 -->
                <view class="flex-1 text-sm">
                  <text v-if="!item.isCustom">{{ item.resName }}({{ item.specName || '-' }})</text>
                  <text v-else>{{ item.customGoodsName }}</text>
                </view>

                <!-- 价格 -->
                <view v-if="model.feeFlag === '1001'" class="w-20">
                  <input
                    v-model="item.price"
                    type="digit"
                    class="h-8 w-full border border-gray-200 rounded px-2 text-center text-sm"
                    :disabled="!item.isCustom && item.outHighPrice === item.outLowPrice"
                    @input="handlePriceChange(index, $event.detail.value)"
                  >
                </view>

                <!-- 数量 -->
                <view class="w-24 flex items-center justify-center gap-1">
                  <wd-icon
                    name=""
                    custom-class="i-carbon-subtract text-gray-600 w-36rpx h-36rpx flex items-center justify-center"
                    @click="handleDecreaseQuantity(index)"
                  />
                  <input
                    v-model="item.useNumber"
                    type="number"
                    class="h-8 w-12 border border-gray-200 rounded text-center text-sm"
                    @input="handleQuantityChange(index, $event.detail.value)"
                  >
                  <wd-icon
                    name=""
                    custom-class="i-carbon-add text-gray-600 w-36rpx h-36rpx flex items-center justify-center"
                    @click="handleIncreaseQuantity(index)"
                  />
                </view>

                <!-- 操作 -->
                <view class="w-16 text-center">
                  <wd-icon
                    name=""
                    custom-class="i-carbon-trash-can text-red-500 w-36rpx h-36rpx flex items-center justify-center"
                    @click="handleRemoveResource(index)"
                  />
                </view>
              </view>

              <!-- 价格范围提示 -->
              <view
                v-if="model.feeFlag === '1001' && !item.isCustom && item.outHighPrice !== item.outLowPrice"
                class="mt-1 px-3 pb-2 text-xs text-gray-500"
              >
                价格范围({{ item.outLowPrice }} - {{ item.outHighPrice }})
              </view>
            </view>
          </view>

          <!-- 总计 -->
          <view v-if="showTotalAmount" class="mt-3 rounded bg-white p-3">
            <view class="flex items-center justify-between">
              <text class="text-gray-700 font-medium">总计</text>
              <text class="text-lg text-colorui-green font-bold">¥{{ model.totalAmount.toFixed(2) }}</text>
            </view>
          </view>
        </view>

        <!-- 支付方式 -->
        <view v-if="showPayType" class="bg-white">
          <view class="section-title">
            支付方式
          </view>
          <wd-cell-group border>
            <wd-picker
              v-model="selectedPayTypeIndex"
              :columns="payTypeOptions"
              label-key="name"
              value-key="statusCd"
              @confirm="handlePayTypeChange"
            >
              <wd-cell>
                <template #title>
                  <text class="text-gray-700 font-medium">支付方式</text>
                </template>
                <template #value>
                  <text class="text-blue-500">{{ payTypeOptions[selectedPayTypeIndex]?.name || '请选择' }}</text>
                </template>
              </wd-cell>
            </wd-picker>
          </wd-cell-group>
        </view>
      </view>

      <!-- 处理意见 -->
      <view class="mt-3 bg-white">
        <view class="section-title">
          处理意见
        </view>
        <wd-cell-group border>
          <wd-textarea
            v-model="model.context"
            placeholder="请输入处理意见"
            :maxlength="500"
            show-word-limit
            :rows="4"
            :rules="formRules.context"
          />
        </wd-cell-group>
      </view>

      <!-- 图片上传 (办结时) -->
      <view v-if="showImages" class="mt-3 space-y-3">
        <!-- 维修前图片 -->
        <view class="section-title">
          维修前图片
        </view>
        <view class="rounded bg-white p-3">
          <view class="text-sm text-gray-500">
            <text>（图片上传功能待集成 vc-upload-async 组件）</text>
          </view>
        </view>

        <!-- 维修后图片 -->
        <view class="section-title">
          维修后图片
        </view>
        <view class="rounded bg-white p-3">
          <view class="text-sm text-gray-500">
            <text>（图片上传功能待集成 vc-upload-async 组件）</text>
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="p-3">
        <wd-button block type="success" size="large" @click="handleSubmit">
          {{ model.action === 'FINISH' ? '办结' : '提交' }}
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style lang="scss" scoped>
.min-h-screen {
  min-height: 100vh;
}

.bg-gray-100 {
  background-color: #f5f5f5;
}

/** 分区标题样式 */
.section-title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 20px 15px 10px;
}

/** 商品表格样式 */
.resource-table {
  border-radius: 16rpx;
  overflow: hidden;

  .table-header {
    border-bottom: 2rpx solid #e5e7eb;
  }

  .table-row {
    &:last-child {
      border-bottom: none;
    }
  }
}

/** 输入框统一样式 */
input[type='number'],
input[type='digit'] {
  font-size: 28rpx !important;
  line-height: 32rpx !important;
}

/** 强制设置 wd-cell 的文本大小 */
:deep(.wd-cell__title),
:deep(.wd-cell__value) {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
}

/** 确保 wd-cell 的 icon 区域垂直居中 */
:deep(.wd-cell__icon) {
  display: flex !important;
  align-items: center !important;
}
</style>
