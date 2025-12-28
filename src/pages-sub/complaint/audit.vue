<!--
  审核投诉单页面
  功能：审核投诉工单，选择处理结果并提交处理意见

  访问地址: http://localhost:9000/#/pages-sub/complaint/audit
  建议携带参数: ?complaintId=COMP_001&taskId=TASK_COMP_001

  完整示例: http://localhost:9000/#/pages-sub/complaint/audit?complaintId=COMP_001&taskId=TASK_COMP_001

  旧代码：gitee-example/pages/auditComplaintOrder/auditComplaintOrder.vue
-->

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { auditComplaint } from '@/api/complaint'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { ComplaintStateCode } from '@/types/complaint'
import { getCurrentCommunity } from '@/utils/user'

/** 全局 Toast 提示 */
const toast = useGlobalToast()

definePage({
  style: {
    navigationBarTitleText: '审核投诉单',
    enablePullDownRefresh: false,
  },
})

/** 页面参数 */
const complaintId = ref('')
const taskId = ref('')

/** 处理结果选项 */
const stateOptions = [
  {
    label: '已处理',
    value: ComplaintStateCode.HANDLED,
  },
  {
    label: '无法处理',
    value: ComplaintStateCode.CANNOT_HANDLE,
  },
]

/** 处理结果索引 */
const stateIndex = ref(-1)

/** 处理意见 */
const remark = ref('')

/** 获取小区信息 */
const communityInfo = getCurrentCommunity()

/** 提交审核 */
const { loading: submitting, send: submitAudit } = useRequest(
  () =>
    auditComplaint({
      state: stateOptions[stateIndex.value].value,
      remark: remark.value,
      taskId: taskId.value,
      complaintId: complaintId.value,
      communityId: communityInfo.communityId,
      storeId: 'STORE_001', // TODO: 从用户信息获取
      userId: 'USER_001', // TODO: 从用户信息获取
    }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('审核提交成功')
    uni.navigateBack({
      delta: 1,
    })
  })
  .onError((error) => {
    console.error('❌ 审核投诉失败:', error)
    toast.error(error.error || '审核提交失败，请稍后重试')
  })

/** 页面加载 */
onLoad((options) => {
  complaintId.value = (options?.complaintId as string) || ''
  taskId.value = (options?.taskId as string) || ''

  if (!complaintId.value) {
    toast.error('缺少必要参数')
  }
})

/**
 * 处理结果变更
 * @example handleStateChange({ detail: { value: 0 } })
 */
function handleStateChange(event: any) {
  stateIndex.value = event.detail.value
}

/** 提交审核 */
function handleSubmit() {
  // 表单验证
  if (stateIndex.value === -1) {
    toast.error('请选择处理结果')
    return
  }

  if (!remark.value.trim()) {
    toast.error('请填写处理意见')
    return
  }

  if (remark.value.length > 200) {
    toast.error('处理意见不能超过200个字')
    return
  }

  submitAudit()
}
</script>

<template>
  <view class="audit-page">
    <view class="p-3">
      <!-- 投诉信息提示 -->
      <view class="mb-3 rounded bg-white p-3">
        <view class="flex items-center gap-2 text-gray-600">
          <wd-icon name="info" custom-class="text-blue-500" />
          <text class="text-sm">投诉编号：{{ complaintId }}</text>
        </view>
      </view>

      <!-- 审核信息表单 -->
      <view class="mb-3 bg-white">
        <view class="px-3 pb-2 pt-3 text-gray-700 font-medium">
          审核信息
        </view>

        <wd-cell-group border>
          <!-- 处理结果 -->
          <wd-cell title="处理结果" is-link>
            <picker
              mode="selector"
              :range="stateOptions"
              :value="stateIndex"
              range-key="label"
              @change="handleStateChange"
            >
              <view class="text-sm" :class="stateIndex === -1 ? 'text-gray-400' : 'text-gray-700'">
                {{ stateIndex > -1 ? stateOptions[stateIndex].label : '请选择处理结果' }}
              </view>
            </picker>
          </wd-cell>

          <!-- 处理意见 -->
          <wd-cell title="处理意见">
            <template #value>
              <wd-textarea
                v-model="remark"
                placeholder="请输入处理意见"
                :maxlength="200"
                show-word-limit
                :auto-height="true"
                :min-height="100"
                clearable
              />
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>

      <!-- 提交按钮 -->
      <wd-button type="success" size="large" :loading="submitting" @click="handleSubmit">
        提交
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.audit-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
