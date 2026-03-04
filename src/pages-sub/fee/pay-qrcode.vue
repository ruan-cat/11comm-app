<!--
  二维码缴费页面
  功能：生成二维码，用户扫码支付欠费

  访问地址: http://localhost:9000/#/pages-sub/fee/pay-qrcode
  建议携带参数: ?roomId=xxx&communityId=xxx&feeIds=xxx

  完整示例: http://localhost:9000/#/pages-sub/fee/pay-qrcode?roomId=ROOM_001&communityId=COMM_001&feeIds=FEE_001,FEE_002

  旧代码：gitee-example/pages/fee/payFeeByQrCode.vue
-->

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { toPayOweFee } from '@/api/fee'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '二维码缴费',
    enablePullDownRefresh: false,
  },
})

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

/** 页面参数 */
const pageParams = reactive({
  roomId: '',
  communityId: '',
  feeIds: [] as string[],
})

/** 二维码 URL */
const qrcodeUrl = ref('')

/** 加载状态 */
const loading = ref(true)

/** 生成二维码支付 */
const { send: generateQrcode, loading: qrcodeLoading } = useRequest(
  (data: { roomId: string, communityId: string, feeIds: string[] }) =>
    toPayOweFee({
      roomId: data.roomId,
      communityId: data.communityId,
      business: 'oweFee',
      feeIds: data.feeIds,
    }),
  { immediate: false },
).onSuccess((event) => {
  const data = event.data as { code: number, msg: string, data: { codeUrl: string } }
  if (data.code !== 0) {
    toast.showError(data.msg)
    return
  }
  qrcodeUrl.value = data.data.codeUrl
  loading.value = false
}).onError(() => {
  loading.value = false
})

/** 页面加载 */
onLoad((options) => {
  pageParams.roomId = options?.roomId || ''
  pageParams.communityId = options?.communityId || communityInfo.communityId
  pageParams.feeIds = (options?.feeIds || '').split(',')

  // 生成二维码
  generateQrcode({
    roomId: pageParams.roomId,
    communityId: pageParams.communityId,
    feeIds: pageParams.feeIds,
  })
})

/** 已支付（返回上一页） */
function handlePaid() {
  uni.navigateBack()
}
</script>

<template>
  <view class="pay-qrcode-page flex flex-col items-center justify-center p-5">
    <!-- 二维码 -->
    <view class="qrcode-container mb-5 rounded-lg bg-white p-5">
      <view v-if="loading || qrcodeLoading" class="flex items-center justify-center">
        <text class="text-gray-400">加载中...</text>
      </view>
      <view v-else-if="qrcodeUrl" class="flex flex-col items-center">
        <!-- 这里使用 canvas 绘制二维码，实际项目中可使用 u-qrcode 等组件 -->
        <image :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrcodeUrl)}`" class="qrcode-image" />
        <text class="mt-3 text-sm text-gray-500">请使用微信扫码支付</text>
      </view>
      <view v-else class="flex items-center justify-center">
        <text class="text-red-500">二维码生成失败</text>
      </view>
    </view>

    <!-- 支付按钮 -->
    <view class="w-full">
      <wd-button type="primary" size="large" block @click="handlePaid">
        已支付
      </wd-button>
    </view>
  </view>
</template>

<style scoped>
.qrcode-container {
  width: 500rpx;
  min-height: 500rpx;
}
.qrcode-image {
  width: 400rpx;
  height: 400rpx;
}
</style>
