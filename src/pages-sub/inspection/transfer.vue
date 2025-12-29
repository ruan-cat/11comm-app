<!--
  任务流转页面
  功能：将巡检任务流转给其他员工，填写流转原因和选择接收人

  访问地址: http://localhost:9000/#/pages-sub/inspection/transfer
  建议携带参数: ?task=xxx (JSON字符串)

  示例: http://localhost:9000/#/pages-sub/inspection/transfer?task={"taskId":"TASK_001",...}
-->

<script setup lang="ts">
import type { FormInstance } from 'wot-design-uni/components/wd-form/types'
import type { InspectionTask } from './types'
import { onLoad } from '@dcloudio/uni-app'
import { onMounted, reactive, ref } from 'vue'

/** 路由参数 */
const taskInfoStr = ref('')

/** 任务信息 */
const taskInfo = ref<InspectionTask>({} as InspectionTask)

/** 获取路由参数 */
onLoad((options) => {
  taskInfoStr.value = options?.task as string || ''
  if (taskInfoStr.value) {
    try {
      taskInfo.value = JSON.parse(taskInfoStr.value)
    }
    catch (error) {
      console.error('解析任务信息失败:', error)
    }
  }
})

/** 表单实例 */
const formRef = ref<FormInstance>()

/** 表单数据 */
const formData = reactive({
  /** 接收人ID */
  staffId: '',
  /** 接收人姓名 */
  staffName: '',
  /** 流转说明 */
  transferDesc: '',
})

/** 是否正在提交 */
const submitting = ref(false)

/** 是否显示员工选择器 */
const showStaffPicker = ref(false)

/** 员工列表 */
const staffList = ref<Array<{ userId: string, userName: string }>>([])

/** 表单校验规则 */
const rules = {
  staffId: [{ required: true, message: '请选择接收员工' }],
  transferDesc: [{ required: true, message: '请输入流转说明' }],
}

/**
 * 获取员工列表
 */
async function getStaffList() {
  try {
    // TODO: 调用 Alova 接口获取数据
    // const result = await getStaffListApi({
    //   communityId: getCurrentCommunity().communityId,
    // })
    // staffList.value = result.data || []

    // 临时 Mock 数据
    staffList.value = [
      { userId: 'USER_001', userName: '张三' },
      { userId: 'USER_002', userName: '李四' },
      { userId: 'USER_003', userName: '王五' },
      { userId: 'USER_004', userName: '赵六' },
    ]
  }
  catch (error) {
    console.error('获取员工列表失败:', error)
    uni.showToast({
      title: '获取员工失败',
      icon: 'none',
    })
  }
}

/**
 * 打开员工选择器
 */
function openStaffPicker() {
  showStaffPicker.value = true
}

/**
 * 员工选择确认
 * @param value 选中的值
 */
function handleStaffConfirm(value: { value: string, label: string }) {
  formData.staffId = value.value
  formData.staffName = value.label
  showStaffPicker.value = false
}

/**
 * 提交流转
 */
async function submitTransfer() {
  // 表单校验
  const valid = await formRef.value?.validate()
  if (!valid)
    return

  // 获取当前用户信息（模拟）
  const currentUserId = 'CURRENT_USER_ID' // TODO: 从用户信息中获取

  // 验证不能流转给自己
  if (formData.staffId === currentUserId) {
    uni.showToast({
      title: '不能流转给自己',
      icon: 'none',
    })
    return
  }

  submitting.value = true

  try {
    // TODO: 调用 Alova 接口提交数据
    // const result = await transferInspectionTaskApi({
    //   transferDesc: formData.transferDesc,
    //   staffId: formData.staffId,
    //   staffName: formData.staffName,
    //   communityId: taskInfo.value.communityId,
    //   taskId: taskInfo.value.taskId,
    //   taskType: 2000,
    //   ...taskInfo.value,
    // })

    // 临时模拟提交成功
    uni.showToast({
      title: '流转成功',
      icon: 'success',
    })

    // 跳转回巡检打卡页
    setTimeout(() => {
      router.replace({ name: 'inspection-task-list' })
    }, 1500)
  }
  catch (error) {
    console.error('提交流转失败:', error)
    uni.showToast({
      title: '流转失败',
      icon: 'none',
    })
  }
  finally {
    submitting.value = false
  }
}

onMounted(() => {
  // 解析任务信息
  if (taskInfoStr.value) {
    try {
      taskInfo.value = JSON.parse(taskInfoStr)
    }
    catch (error) {
      console.error('解析任务信息失败:', error)
      uni.showToast({
        title: '数据错误',
        icon: 'none',
      })
    }
  }

  // 获取员工列表
  getStaffList()
})
</script>

<template>
  <view class="inspection-transfer">
    <!-- 任务信息 -->
    <view class="task-info">
      <wd-cell-group title="任务信息">
        <wd-cell title="任务ID" :value="taskInfo.taskId" />
        <wd-cell title="巡检计划" :value="taskInfo.inspectionPlanName" />
        <wd-cell title="当前执行人" :value="taskInfo.planUserName" />
        <wd-cell title="巡检时间" :value="taskInfo.planInsTime" />
      </wd-cell-group>
    </view>

    <!-- 流转表单 -->
    <view class="transfer-form">
      <wd-form ref="formRef" :model="formData" :rules="rules">
        <!-- 接收员工 -->
        <wd-form-item label="接收员工" prop="staffId" required>
          <wd-input
            v-model="formData.staffName"
            placeholder="请选择接收员工"
            readonly
            @click="openStaffPicker"
          >
            <template #suffix>
              <wd-icon name="arrow-right" />
            </template>
          </wd-input>
        </wd-form-item>

        <!-- 流转说明 -->
        <wd-form-item label="流转说明" prop="transferDesc" required>
          <wd-textarea
            v-model="formData.transferDesc"
            placeholder="请输入流转说明"
            maxlength="512"
            show-word-limit
          />
        </wd-form-item>
      </wd-form>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-area">
      <wd-button
        type="success"
        size="large"
        block
        :loading="submitting"
        @click="submitTransfer"
      >
        提交
      </wd-button>
    </view>

    <!-- 员工选择器 -->
    <wd-picker
      v-model="showStaffPicker"
      :columns="staffList.map((staff) => ({ value: staff.userId, label: staff.userName }))"
      @confirm="handleStaffConfirm"
      @cancel="showStaffPicker = false"
    />
  </view>
</template>

<style scoped lang="scss">
.inspection-transfer {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;

  .task-info {
    margin-bottom: 20rpx;
  }

  .transfer-form {
    background: #ffffff;
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
