<!--
  维修列表搜索栏组件
  用于维修列表页面的搜索和筛选工具栏

  功能：
  - 提供搜索输入框
  - 支持状态筛选（可配置是否启用）
  - 内部封装状态字典加载逻辑
  - 显示总记录数
-->

<script setup lang="ts">
import type { RepairListSearchBarProps, StateOption } from './types'
import { useRequest } from 'alova/client'
import { computed, ref, watch } from 'vue'
import { getRepairStates } from '@/api/repair'
import { REPAIR_STATUSES } from '@/constants/repair'

const props = withDefaults(defineProps<RepairListSearchBarProps>(), {
  modelValue: '',
  selectedState: '',
  isUseStateOptions: true,
  placeholder: '输入报修人',
  maxlength: 20,
  total: 0,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:selectedState', value: string): void
  (e: 'search'): void
  (e: 'clear'): void
  (e: 'state-change', value: string): void
}>()

/** 默认状态选项（从常量生成） */
const defaultStateOptions: StateOption[] = [
  { label: '全部状态', value: '' },
  ...REPAIR_STATUSES.map(item => ({
    label: item.label,
    value: item.value as string,
  })),
]

/** 状态选项列表 */
const stateOptions = ref<StateOption[]>([...defaultStateOptions])

/** 内部搜索关键词 */
const internalSearchName = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

/** 内部选中状态 */
const internalSelectedState = computed({
  get: () => props.selectedState,
  set: (value) => {
    emit('update:selectedState', value)
  },
})

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

/** 监听 isUseStateOptions 变化，决定是否加载状态字典 */
watch(
  () => props.isUseStateOptions,
  (newValue) => {
    if (newValue) {
      loadStates()
    }
  },
  { immediate: true },
)

/** 搜索处理 */
function handleSearch() {
  emit('search')
}

/** 清空处理 */
function handleClear() {
  emit('clear')
}

/** 状态选择器改变 */
function handleStateChange({ value }: { value: string }) {
  internalSelectedState.value = value
  emit('state-change', value)
}

/** 当前选中状态的显示标签 */
const currentStateLabel = computed(() => {
  const found = stateOptions.value.find(item => item.value === props.selectedState)
  return found?.label || '状态'
})
</script>

<template>
  <view class="toolbar">
    <view class="toolbar-controls">
      <wd-search
        v-model="internalSearchName"
        :placeholder="placeholder"
        :maxlength="maxlength"
        hide-cancel
        clearable
        shape="round"
        light
        class="control-search"
        @search="handleSearch"
        @clear="handleClear"
      >
        <template v-if="isUseStateOptions" #prefix>
          <wd-picker
            v-model="internalSelectedState"
            :columns="stateOptions"
            label-key="label"
            value-key="value"
            @confirm="handleStateChange"
          >
            <view class="prefix-filter">
              <text class="prefix-text">{{ currentStateLabel }}</text>
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

<style lang="scss" scoped>
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
</style>
