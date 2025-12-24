# 2025-12-24 处理维修工单页面代码优化报告

## 优化概述

本次对 `src\pages-sub\repair\handle.vue` 文件进行了全面的代码质量优化，使其更符合 Vue3 Composition API 最佳实践和项目编码规范。

## 优化内容详情

### 1. 页面间通信优化

#### 问题

- Vue2 代码使用 `uni.$on` 监听商品选择返回，但 Vue3 代码中缺失此逻辑
- 缺少 `onUnload` 生命周期清理事件监听

#### 解决方案

```typescript
// 添加商品选择监听
uni.$on("getResourceInfo", (data: string) => {
	try {
		const resourceData = JSON.parse(data);
		model.resourceList.push(resourceData);
		updateTotalAmount();
	} catch (error) {
		console.error("解析商品数据失败:", error);
	}
});

// 添加页面卸载清理
onUnload(() => {
	uni.$off("getResourceInfo");
});
```

### 2. 输入验证优化

#### 问题

- 价格和数量输入缺少边界检查
- 没有处理非法数值输入

#### 解决方案

```typescript
/** 价格改变 */
function handlePriceChange(index: number, price: string) {
	const numericPrice = Number(price);
	if (!Number.isNaN(numericPrice) && numericPrice >= 0) {
		model.resourceList[index].price = numericPrice;
		updateTotalAmount();
	}
}

/** 数量改变 */
function handleQuantityChange(index: number, quantity: string) {
	const numericQuantity = Number(quantity);
	if (!Number.isNaN(numericQuantity) && numericQuantity > 0) {
		model.resourceList[index].useNumber = numericQuantity;
		updateTotalAmount();
	}
}
```

### 3. 计算属性优化

#### 问题

- 提交按钮的 `loading` 和 `disabled` 状态重复计算
- 选中师傅的计算属性缺少空值保护

#### 解决方案

```typescript
/** 当前操作是否正在提交 */
const isSubmitting = computed(() => {
	return model.action === "FINISH" ? isFinishSubmitting.value : isDispatchSubmitting.value;
});

/** 选中的维修师傅 */
const selectedStaff = computed(() => {
	const staff = staffOptions.value[selectedStaffIndex.value];
	return staff || { staffId: "", staffName: "请选择员工" };
});
```

### 4. 表单校验逻辑优化

#### 问题

- 派单/转单/退单校验逻辑不够清晰
- 办结校验缺少详细注释

#### 解决方案

```typescript
/** 派单/转单/退单校验 */
function validateDispatch(): string {
	// 退单操作不需要选择维修师傅
	if (model.action !== "RETURN" && selectedStaffIndex.value === 0) {
		return "请选择维修师傅";
	}

	if (!model.context.trim()) {
		return "请填写处理意见";
	}

	return "";
}

/** 办结校验 */
function validateFinish(): string {
	// 1. 检查是否用料/维修类型
	if (!model.feeFlag) {
		return model.repairObjType === "004" ? "请选择维修类型" : "请选择是否用料";
	}

	// 2. 如果选择有偿服务或需要用料，必须选择商品
	if ((model.feeFlag === "1001" || model.feeFlag === "1003") && model.resourceList.length === 0) {
		return "请选择商品";
	}

	// 3. 如果选择有偿服务，必须选择支付方式
	if (model.feeFlag === "1001" && selectedPayTypeIndex.value === 0) {
		return "请选择支付方式";
	}

	// 4. 处理意见必填
	if (!model.context.trim()) {
		return "请填写处理意见";
	}

	return "";
}
```

### 5. 成功/失败回调优化

#### 问题

- 操作类型文本映射重复代码
- 缺少统一的操作文本管理

#### 解决方案

```typescript
/** 派单/转单/退单成功回调 */
onDispatchSuccess(() => {
	const actionTextMap: Record<DispatchAction, string> = {
		DISPATCH: "派单",
		TRANSFER: "转单",
		RETURN: "退单",
		FINISH: "办结",
	};
	const actionText = actionTextMap[model.action] || "操作";
	toast.success(`${actionText}成功`);

	// 延迟跳转，让用户看到成功提示
	setTimeout(() => {
		if (model.action === "DISPATCH") {
			TypedRouter.toRepairList();
		} else {
			TypedRouter.toRepairDispatch();
		}
	}, 1500);
});
```

### 6. 工具函数抽取

#### 问题

- 商品显示名称逻辑在模板中直接处理
- 缺少可复用的格式化函数

#### 解决方案

```typescript
/**
 * 获取商品显示名称
 * @param item 商品项
 * @returns 格式化后的商品名称
 */
function getResourceDisplayName(item: RepairResource): string {
	if (item.isCustom) {
		return item.customGoodsName || "自定义商品";
	}
	const specName = item.specName || "-";
	return `${item.resName}(${specName})`;
}
```

模板使用:

```vue
<!-- 优化前 -->
<text v-if="!item.isCustom">{{ item.resName }}({{ item.specName || '-' }})</text>
<text v-else>{{ item.customGoodsName }}</text>

<!-- 优化后 -->
<text>{{ getResourceDisplayName(item) }}</text>
```

### 7. 提交逻辑优化

#### 问题

- 提交流程缺少清晰的步骤注释
- 代码可读性有待提高

#### 解决方案

```typescript
/** 提交派单/转单/退单 */
function handleSubmitDispatch() {
	// 1. 表单校验
	const error = validateDispatch();
	if (error) {
		toast.warning(error);
		return;
	}

	// 2. 防止重复提交
	if (isDispatchSubmitting.value) {
		return;
	}

	// 3. 提交请求
	submitDispatch({
		repairId: model.repairId,
		staffId: selectedStaff.value.staffId,
		staffName: selectedStaff.value.staffName || "",
		action: model.action,
		context: model.context,
		repairType: model.repairType,
		communityId: communityInfo.communityId,
		userId: userInfo.userId,
		userName: userInfo.userName,
	});
}
```

### 8. 模板优化

#### 问题

- 退单显示文案不够明确
- 师傅选择器直接使用数组索引

#### 解决方案

```vue
<!-- 优化前 -->
<wd-cell :title="model.preStaffName || '暂无'" />
<text class="text-blue-500">{{ staffOptions[selectedStaffIndex]?.staffName || '请选择' }}</text>

<!-- 优化后 -->
<wd-cell title="退回至" :value="model.preStaffName || '暂无'" />
<text class="text-blue-500">{{ selectedStaff.staffName }}</text>
```

### 9. 导入优化

#### 问题

- 缺少 `onUnload` 生命周期钩子导入

#### 解决方案

```typescript
// 优化前
import { onLoad } from "@dcloudio/uni-app";

// 优化后
import { onLoad, onUnload } from "@dcloudio/uni-app";
```

### 10. 代码注释优化

#### 问题

- 页面加载逻辑缺少步骤注释
- 关键函数缺少 JSDoc 注释

#### 解决方案

```typescript
/**
 * 页面加载
 */
onLoad((options) => {
	// 1. 解析页面参数
	model.action = (options?.action as DispatchAction) || "DISPATCH";
	// ...其他参数

	// 2. 参数验证
	if (!model.repairId) {
		toast.error("缺少必要参数：工单ID");
		return;
	}

	// 3. 加载维修师傅列表（派单/转单/退单时需要）
	if (showStaffSelector.value) {
		loadStaffs();
	}

	// 4. 加载支付方式列表
	loadPayTypes();
});
```

## 优化效果

### 代码质量提升

- ✅ 更符合 Vue3 Composition API 最佳实践
- ✅ 更好的类型安全性
- ✅ 更清晰的代码组织结构
- ✅ 更完善的边界条件处理

### 可维护性提升

- ✅ 统一的操作文本管理
- ✅ 可复用的工具函数
- ✅ 清晰的步骤注释
- ✅ 完善的错误处理

### 用户体验提升

- ✅ 更好的输入验证
- ✅ 更明确的提示信息
- ✅ 更流畅的交互体验

## 对比 Vue2 旧代码的改进

| 功能点     | Vue2 实现                | Vue3 优化后                               |
| :--------- | :----------------------- | :---------------------------------------- |
| 页面间通信 | `uni.$on` 直接使用       | 添加类型安全 + 错误处理 + `onUnload` 清理 |
| 输入验证   | 简单的 `Number()` 转换   | 增加 `NaN` 检查 + 边界条件验证            |
| 操作文本   | 内联三元表达式           | 统一的 `actionTextMap` 映射               |
| 商品显示   | 模板内多个 `v-if/v-else` | 抽取为 `getResourceDisplayName` 工具函数  |
| 提交状态   | 重复的条件判断           | 统一的 `isSubmitting` 计算属性            |
| 师傅选择   | 直接数组索引访问         | 带空值保护的计算属性                      |
| 提交逻辑   | 代码缺少步骤注释         | 清晰的 1-2-3 步骤注释                     |
| 退单显示   | 仅显示师傅名称           | 明确标注"退回至"                          |

## 注意事项

1. **页面间通信**: 使用 `uni.$on` 监听商品选择返回，需要在 `onUnload` 中清理监听器
2. **数值输入**: 所有数值输入都需要进行 `NaN` 检查和边界条件验证
3. **操作文本**: 使用统一的 `actionTextMap` 管理所有操作类型的显示文案
4. **计算属性**: 善用计算属性避免重复计算和提升代码可读性

## 总结

本次优化主要聚焦于:

1. **完善缺失功能**: 补充了商品选择监听和页面卸载清理逻辑
2. **增强代码质量**: 添加输入验证、空值保护、错误处理
3. **提升可维护性**: 抽取工具函数、统一文本管理、优化注释
4. **改进用户体验**: 更好的输入验证和提示信息

优化后的代码更加健壮、可维护，并且完全符合 Vue3 Composition API 的最佳实践。
