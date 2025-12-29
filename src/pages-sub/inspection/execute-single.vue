<!--
  执行单项巡检页面
  功能：执行单个巡检项，填写巡检结果、上传照片等

  访问地址: http://localhost:9000/#/pages-sub/inspection/execute-single
  建议携带参数: ?taskDetailId=xxx&taskId=xxx&inspectionId=xxx&inspectionName=xxx&itemId=xxx

  示例: http://localhost:9000/#/pages-sub/inspection/execute-single?taskDetailId=DETAIL_002&taskId=TASK_001&inspectionId=INSP_002&inspectionName=消防通道检查&itemId=ITEM_002

  旧代码： gitee-example/pages/excuteOneInspection/excuteOneInspection.vue
-->

<script setup lang="ts">
import type { FormInstance } from 'wot-design-uni/components/wd-form/types'
import type { UploadFile } from 'wot-design-uni/components/wd-upload/types'
import type { InspectionItemTitle } from './types'
import { onLoad } from '@dcloudio/uni-app'
import { onMounted, reactive, ref } from 'vue'

/** 路由参数 */
const taskDetailId = ref('')
const taskId = ref('')
const inspectionId = ref('')
const inspectionName = ref('')
const itemId = ref('')
const fromPage = ref('') // 来源页面（用于判断是否从二维码扫描进入）

/** 获取路由参数 */
onLoad((options) => {
  taskDetailId.value = options?.taskDetailId as string || ''
  taskId.value = options?.taskId as string || ''
  inspectionId.value = options?.inspectionId as string || ''
  inspectionName.value = options?.inspectionName as string || ''
  itemId.value = options?.itemId as string || ''
  fromPage.value = options?.fromPage as string || ''
})

/** 表单实例 */
const formRef = ref<FormInstance>()

/** 表单数据 */
const formData = reactive({
  /** 巡检情况 (正常/异常) */
  patrolType: '',
  /** 巡检说明 */
  description: '',
  /** 上传的照片 */
  photos: [] as string[],
})

/** 巡检情况选项 */
const patrolTypeOptions = [
  { label: '正常', value: '10001' },
  { label: '异常', value: '10002' },
]

/** 巡检项标题列表（动态表单项） */
const titleList = ref<InspectionItemTitle[]>([])

/** 上传的照片文件列表 */
const uploadFiles = ref<UploadFile[]>([])

/** 当前位置信息 */
const locationInfo = ref({
  /** 纬度 */
  latitude: 0,
  /** 经度 */
  longitude: 0,
  /** 地址 */
  address: '正在获取...',
})

/** 是否正在提交 */
const submitting = ref(false)

/** 表单校验规则 */
const rules = {
  patrolType: [{ required: true, message: '请选择巡检情况' }],
  description: [{ required: true, message: '请填写巡检说明' }],
  photos: [
    {
      required: true,
      message: '请上传巡检照片',
      validator: (value: string[]) => value.length > 0,
    },
  ],
}

/**
 * 获取当前位置
 */
function getCurrentLocation() {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      locationInfo.value.latitude = res.latitude
      locationInfo.value.longitude = res.longitude

      // TODO: 调用地图API进行逆地理编码
      // 这里简化处理，直接显示坐标
      locationInfo.value.address = `${res.latitude.toFixed(6)}, ${res.longitude.toFixed(6)}`
    },
    fail: () => {
      uni.showToast({
        title: '获取位置失败',
        icon: 'none',
      })
    },
  })
}

/**
 * 加载巡检项标题
 */
async function loadInspectionItemTitles() {
  try {
    // TODO: 调用 Alova 接口获取数据
    // const result = await getInspectionItemTitleApi({
    //   communityId: getCurrentCommunity().communityId,
    //   itemId: itemId,
    //   page: 1,
    //   row: 100,
    // })
    // titleList.value = result.data || []

    // 临时 Mock 数据：模拟动态表单项
    titleList.value = [
      {
        titleId: 'TITLE_001',
        itemTitle: '设施状态',
        titleType: '1001', // 单选
        radio: '',
        inspectionItemTitleValueDtos: [
          { itemValue: '完好' },
          { itemValue: '损坏' },
          { itemValue: '需维修' },
        ],
      },
      {
        titleId: 'TITLE_002',
        itemTitle: '存在问题',
        titleType: '2002', // 多选
        radio: [],
        inspectionItemTitleValueDtos: [
          { itemValue: '设备异常' },
          { itemValue: '卫生问题' },
          { itemValue: '安全隐患' },
        ],
      },
      {
        titleId: 'TITLE_003',
        itemTitle: '详细说明',
        titleType: '3003', // 文本
        radio: '',
        inspectionItemTitleValueDtos: [],
      },
    ]

    // 初始化 radio 字段
    titleList.value.forEach((item) => {
      if (item.titleType === '2002') {
        // 多选：初始化为数组
        item.radio = item.inspectionItemTitleValueDtos.map(() => ({
          checked: false,
          itemValue: '',
          selected: '0',
        }))
      }
    })
  }
  catch (error) {
    console.error('加载巡检项标题失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
}

/**
 * 照片上传成功回调
 * @param files 上传成功的文件列表
 */
function handleUploadSuccess(files: UploadFile[]) {
  uploadFiles.value = files
  formData.photos = files.map(file => file.url || '')
}

/**
 * 照片删除回调
 * @param files 删除后的文件列表
 */
function handleUploadRemove(files: UploadFile[]) {
  uploadFiles.value = files
  formData.photos = files.map(file => file.url || '')
}

/**
 * 单选框变更
 * @param value 选中的值
 * @param item 标题项
 */
function handleRadioChange(value: string, item: InspectionItemTitle) {
  item.radio = value
}

/**
 * 多选框变更
 * @param values 选中的值数组
 * @param item 标题项
 */
function handleCheckboxChange(values: string[], item: InspectionItemTitle) {
  if (Array.isArray(item.radio)) {
    item.radio.forEach((radioItem, index) => {
      const itemValue = item.inspectionItemTitleValueDtos[index].itemValue
      if (values.includes(itemValue)) {
        radioItem.selected = '1'
        radioItem.checked = true
        radioItem.itemValue = itemValue
      }
      else {
        radioItem.selected = '0'
        radioItem.checked = false
        radioItem.itemValue = itemValue
      }
    })
  }
}

/**
 * 构建巡检说明文本
 */
function buildDescription(): string {
  let description = ''

  titleList.value.forEach((item) => {
    if (item.titleType === '2002') {
      // 多选
      let itemValue = ''
      if (Array.isArray(item.radio)) {
        item.radio.forEach((radioItem) => {
          if (radioItem.selected === '1') {
            itemValue += `${radioItem.itemValue},`
          }
        })
      }
      description += `${item.itemTitle}:${itemValue};`
    }
    else {
      // 单选或文本
      description += `${item.itemTitle}:${item.radio};`
    }
  })

  return description
}

/**
 * 提交巡检结果
 */
async function submitInspection() {
  // 表单校验
  const valid = await formRef.value?.validate()
  if (!valid)
    return

  // 构建巡检说明
  const description = buildDescription()

  // 校验必填项
  if (!formData.patrolType) {
    uni.showToast({
      title: '巡检情况不能为空',
      icon: 'none',
    })
    return
  }

  if (!description) {
    uni.showToast({
      title: '巡检说明不能为空',
      icon: 'none',
    })
    return
  }

  if (formData.photos.length === 0) {
    uni.showToast({
      title: '请上传巡检图片',
      icon: 'none',
    })
    return
  }

  submitting.value = true

  try {
    // TODO: 调用 Alova 接口提交数据
    // const result = await submitInspectionApi({
    //   taskId: taskId,
    //   taskDetailId: taskDetailId,
    //   inspectionId: inspectionId,
    //   inspectionName: inspectionName,
    //   communityId: getCurrentCommunity().communityId,
    //   patrolType: formData.patrolType,
    //   description: description,
    //   photos: formData.photos,
    //   userId: getUserInfo().userId,
    //   userName: getUserInfo().userName,
    //   latitude: locationInfo.value.latitude,
    //   longitude: locationInfo.value.longitude,
    // })

    // 临时模拟提交成功
    uni.showToast({
      title: '提交成功',
      icon: 'success',
    })

    // 返回上一页或跳转到巡检打卡页
    setTimeout(() => {
      if (fromPage.value === 'QrCode') {
        // 从二维码扫描进入，跳转到巡检打卡页
        router.replace({ name: 'inspection-task-list' })
      }
      else {
        // 正常流程，返回上一页
        router.back()
      }
    }, 1500)
  }
  catch (error) {
    console.error('提交巡检结果失败:', error)
    uni.showToast({
      title: '提交失败',
      icon: 'none',
    })
  }
  finally {
    submitting.value = false
  }
}

onMounted(() => {
  getCurrentLocation()
  loadInspectionItemTitles()
})
</script>

<template>
  <view class="inspection-execute-single">
    <!-- 标题 -->
    <view class="page-title">
      {{ inspectionName }}巡检
    </view>

    <!-- 表单 -->
    <wd-form ref="formRef" :model="formData" :rules="rules">
      <!-- 动态表单项 -->
      <view v-for="(item, index) in titleList" :key="index" class="form-section">
        <view class="section-title">
          {{ item.itemTitle }}
        </view>

        <!-- 单选 -->
        <wd-form-item v-if="item.titleType === '1001'" :prop="`title_${index}`">
          <wd-radio-group
            :model-value="item.radio as string"
            @update:model-value="(value) => handleRadioChange(value, item)"
          >
            <wd-radio
              v-for="(valueItem, valueIndex) in item.inspectionItemTitleValueDtos"
              :key="valueIndex"
              :value="valueItem.itemValue"
            >
              {{ valueItem.itemValue }}
            </wd-radio>
          </wd-radio-group>
        </wd-form-item>

        <!-- 多选 -->
        <wd-form-item v-else-if="item.titleType === '2002'" :prop="`title_${index}`">
          <wd-checkbox-group
            :model-value="
              Array.isArray(item.radio)
                ? item.radio.filter((r) => r.selected === '1').map((r) => r.itemValue)
                : []
            "
            @update:model-value="(values) => handleCheckboxChange(values, item)"
          >
            <wd-checkbox
              v-for="(valueItem, valueIndex) in item.inspectionItemTitleValueDtos"
              :key="valueIndex"
              :value="valueItem.itemValue"
            >
              {{ valueItem.itemValue }}
            </wd-checkbox>
          </wd-checkbox-group>
        </wd-form-item>

        <!-- 文本输入 -->
        <wd-form-item v-else :prop="`title_${index}`">
          <wd-textarea
            v-model="item.radio as string"
            placeholder="请回答"
            maxlength="512"
            show-word-limit
          />
        </wd-form-item>
      </view>

      <!-- 巡检情况 -->
      <wd-form-item label="巡检情况" prop="patrolType" required>
        <wd-radio-group v-model="formData.patrolType">
          <wd-radio
            v-for="option in patrolTypeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </wd-radio>
        </wd-radio-group>
      </wd-form-item>

      <!-- 巡检说明 -->
      <wd-form-item label="巡检说明" prop="description" required>
        <wd-textarea
          v-model="formData.description"
          placeholder="请输入巡检说明"
          maxlength="512"
          show-word-limit
        />
      </wd-form-item>

      <!-- 照片上传 -->
      <wd-form-item label="巡检照片" prop="photos" required>
        <wd-upload
          v-model="uploadFiles"
          :limit="4"
          action="https://ftf.jd.com/api/uploadImg"
          @success="handleUploadSuccess"
          @remove="handleUploadRemove"
        />
      </wd-form-item>

      <!-- 当前位置 -->
      <wd-form-item label="当前位置">
        <wd-input v-model="locationInfo.address" disabled />
      </wd-form-item>
    </wd-form>

    <!-- 提交按钮 -->
    <view class="submit-area">
      <wd-button
        type="success"
        size="large"
        block
        :loading="submitting"
        @click="submitInspection"
      >
        提交
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.inspection-execute-single {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;

  .page-title {
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(69, 90, 100, 0.6);
    padding: 40rpx 30rpx 20rpx;
  }

  .form-section {
    margin-bottom: 32rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: 400;
      color: rgba(69, 90, 100, 0.6);
      padding: 40rpx 30rpx 20rpx;
    }
  }

  .submit-area {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx;
    background: #ffffff;
    box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.08);
  }
}
</style>
