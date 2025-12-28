<!--
  回复投诉评价页面
  功能：物业人员回复业主的投诉评价

  访问地址: http://localhost:9000/#/pages-sub/complaint/appraise-reply
  建议携带参数: ?appraiseId=APPR_COMP_001_1&communityId=COMM_001

  完整示例: http://localhost:9000/#/pages-sub/complaint/appraise-reply?appraiseId=APPR_COMP_001_1&communityId=COMM_001

  旧代码：gitee-example/pages/complaintOrderDetail/replyComplainAppraise.vue
-->

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { replyComplaintAppraise } from '@/api/complaint'
import { useGlobalToast } from '@/hooks/useGlobalToast'

/** 全局 Toast 提示 */
const toast = useGlobalToast()

definePage({
  style: {
    navigationBarTitleText: '回复评价',
    enablePullDownRefresh: false,
  },
})

/** 页面参数 */
const appraiseId = ref('')
const communityId = ref('')

/** 回复内容 */
const replyContext = ref('')

/** 提交回复 */
const { loading: submitting, send: submitReply } = useRequest(
  () =>
    replyComplaintAppraise({
      replyContext: replyContext.value,
      communityId: communityId.value,
      appraiseId: appraiseId.value,
    }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('回复评价成功')
    uni.navigateBack({
      delta: 1,
    })
  })
  .onError((error) => {
    console.error('❌ 回复评价失败:', error)
    toast.error(error.error || '回复评价失败，请稍后重试')
  })

/** 页面加载 */
onLoad((options) => {
  appraiseId.value = (options?.appraiseId as string) || ''
  communityId.value = (options?.communityId as string) || ''

  if (!appraiseId.value) {
    toast.error('缺少必要参数')
  }
})

/** 提交回复 */
function handleSubmit() {
  if (!replyContext.value.trim()) {
    toast.error('请输入回复内容')
    return
  }
  submitReply()
}
</script>

<template>
  <view class="appraise-reply-page">
    <view class="p-3">
      <!-- 回复内容输入 -->
      <view class="mb-3 bg-white">
        <wd-cell-group border>
          <wd-textarea
            v-model="replyContext"
            placeholder="请输入回复说明"
            :maxlength="200"
            show-word-limit
            :auto-height="true"
            :min-height="200"
            clearable
          />
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
.appraise-reply-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
