<!-- TODO: 待阅读 -->

# 2025-01-10 回访按钮与维修工单评价页业务关系分析报告

## 1. 分析背景

本报告针对用户提出的以下疑问进行深度分析：

1. `dispatch.vue`（维修待办单页面）是给谁看的？维修师傅需要使用回访按钮吗？
2. `appraise.vue`（维修工单评价页）是给业主还是维修师傅用的？
3. "回访"按钮这个名字设计得好吗？
4. 旧项目中回访按钮和评价页的关系是怎样的？

## 2. 核心发现

### 2.1. 页面使用者分析

|             页面              |          使用者          |                      说明                      |
| :---------------------------: | :----------------------: | :--------------------------------------------: |
|   `dispatch.vue` 维修待办单   | **维修师傅（物业员工）** |   显示分配给当前登录维修师傅的待处理工单列表   |
| `appraise.vue` 维修工单评价页 | **维修师傅（物业员工）** | 维修师傅代替业主填写回访评价，而非业主自己操作 |

### 2.2. 关键业务逻辑

**回访按钮的显示条件**（新项目 `dispatch.vue:285-288`）：

```typescript
/** 是否显示回访按钮（已完成且需回访） */
function canAppraise(item: RepairOrder): boolean {
	return item.statusCd === "10004" && item.returnVisitFlag === "003" && checkAuth("502021040151320003");
}
```

**旧项目对应代码**（`repairDispatch.vue:59`）：

```html
<button
	v-if="item.state == '1800' && item.returnVisitFlag == '003' && checkAuth('502021040151320003')"
	@click="dealAppraise(item)"
>
	回访
</button>
```

## 3. 问题逐一解答

### 3.1. 问题一：`dispatch.vue` 是给谁看的？

**答案：维修师傅（物业员工）**

**证据分析**：

1. **页面标题**：`维修待办单`，"待办"意味着是分配给某人需要处理的工单
2. **API 调用**：使用 `getRepairStaffList` 接口，参数包含 `userId`（当前登录用户 ID）
3. **按钮功能**：
   - 启动（开始维修）
   - 转单（转给其他师傅）
   - 暂停（暂停维修）
   - 退单（退回工单）
   - 办结（完成维修）
   - 回访（回访业主）

这些操作都是**维修师傅**在处理工单过程中需要执行的操作，业主不需要也不应该有这些权限。

**旧项目佐证**（`repairDispatch.vue:95-96`）：

```javascript
let _userInfo = this.java110Context.getUserInfo();
let storeId = _userInfo.storeId; // 获取员工所属门店ID
```

### 3.2. 问题二：`appraise.vue` 是给谁用的？

**答案：维修师傅（物业员工），但代表业主填写评价**

**业务场景解读**：

这是一个**电话回访**场景，而非业主自助评价场景：

1. 维修工单完成后，系统标记该工单需要回访（`returnVisitFlag === '003'`）
2. 维修师傅在待办单列表看到"回访"按钮
3. 维修师傅**主动联系业主**（通常是电话回访）
4. 维修师傅**代替业主**在系统中填写评分和回访建议
5. 提交后完成回访流程

**证据分析**：

1. **页面入口**：只能从 `dispatch.vue`（维修待办单）进入，而维修待办单是维修师傅使用的页面
2. **表单字段**：
   - `服务评分`：维修师傅询问业主对服务的满意度后填写
   - `回访建议`：维修师傅记录业主的反馈意见
3. **旧项目代码注释**（`repair.js:240`）：

```javascript
/**
 * 办结  // 注意：这里注释写的是"办结"，说明回访是办结流程的一部分
 * @param {Object} _that 上下文对象
 * @param {Object} _data 数据处理
 */
export function appraiseRepair(_that) {
```

### 3.3. 问题三："回访"按钮这个名字设计得好吗？

**答案：从业务角度来说，命名是准确的，但可能造成理解困惑**

**命名分析**：

|       角度       |                           评价                            |
| :--------------: | :-------------------------------------------------------: |
|    业务准确性    | ✅ 准确。这确实是"回访"操作，维修师傅主动联系业主收集反馈 |
|     用户理解     | ⚠️ 可能困惑。"回访"容易让人误以为是"再次访问"或"返回访问" |
| 与页面名称一致性 |    ❌ 不一致。按钮叫"回访"，但跳转到的页面叫"评价维修"    |

**对比分析**：

|     元素     | 当前命名 |   可能的替代命名    |
| :----------: | :------: | :-----------------: |
|   按钮文本   |   回访   | 回访评价 / 电话回访 |
|   页面标题   | 评价维修 | 回访记录 / 回访评价 |
| 表单字段标题 | 回访建议 | 业主反馈 / 回访内容 |

**建议**：

1. **保持"回访"按钮名称**：因为这确实是回访操作
2. **统一页面标题**：将"评价维修"改为"回访评价"或"回访记录"
3. **添加页面说明**：在页面顶部添加提示文字，说明这是电话回访后记录业主评价的页面

### 3.4. 问题四：旧项目的业务逻辑是怎样的？

**旧项目业务流程**：

```plain
维修工单创建
    ↓
派单给维修师傅
    ↓
维修师傅启动维修（state: 2001 → 1100）
    ↓
维修师傅处理中（state: 1100/1200/1300）
    ↓
维修师傅办结（state → 1800）
    ↓
系统标记需要回访（returnVisitFlag: 003）
    ↓
维修师傅在待办单看到"回访"按钮
    ↓
点击"回访" → 跳转到评价页
    ↓
维修师傅电话联系业主，记录评价
    ↓
提交评价，完成回访
```

**状态码对照表**：

| 旧项目 state | 新项目 statusCd | 状态名称 |
| :----------: | :-------------: | :------: |
|     2001     |      10002      |  已派单  |
|     1100     |      10003      |  处理中  |
|     1200     |      10003      |  处理中  |
|     1300     |      10006      |   暂停   |
|     1800     |      10004      |  已完成  |
|     1700     |      10005      |  已取消  |

**returnVisitFlag 含义**：

| 值  |      含义      |
| :-: | :------------: |
| 001 | 定时任务处理中 |
| 002 | 定时任务处理中 |
| 003 |  需要人工回访  |

## 4. 业务流程图

```plain
┌─────────────────────────────────────────────────────────────────┐
│                        维修工单生命周期                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  业主报修 → 物业录单 → 派单 → 维修师傅接单                        │
│                              ↓                                  │
│                         维修待办单页面                           │
│                        (dispatch.vue)                           │
│                              ↓                                  │
│              ┌──────────────┼──────────────┐                    │
│              ↓              ↓              ↓                    │
│           [启动]         [转单]         [退单]                   │
│              ↓                                                  │
│           处理中                                                 │
│              ↓                                                  │
│           [办结]                                                 │
│              ↓                                                  │
│         工单完成 (statusCd: 10004)                               │
│              ↓                                                  │
│    系统标记需要回访 (returnVisitFlag: 003)                       │
│              ↓                                                  │
│         [回访按钮] 显示                                          │
│              ↓                                                  │
│    维修师傅电话联系业主                                          │
│              ↓                                                  │
│         评价页面 (appraise.vue)                                  │
│    维修师傅代替业主填写评分和建议                                 │
│              ↓                                                  │
│         提交评价                                                 │
│              ↓                                                  │
│         回访完成                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 5. 代码对比分析

### 5.1. 回访按钮触发逻辑

**旧项目**（`repairDispatch.vue:59`）：

```html
<button
	class="cu-btn sm bg-green margin-left"
	v-if="item.state == '1800' && item.returnVisitFlag == '003' && checkAuth('502021040151320003')"
	@click="dealAppraise(item)"
>
	回访
</button>
```

**新项目**（`dispatch.vue:275-282`）：

```vue
<template>
	<!-- 回访按钮：已完成且需回访 -->
	<wd-button v-if="canAppraise(item)" size="small" type="success" @click="handleAppraise(item)"> 回访 </wd-button>
</template>
```

### 5.2. 跳转逻辑

**旧项目**（`repairDispatch.vue:246-256`）：

```javascript
dealAppraise: function(item) {
  this.context.navigateTo({
    url: '/pages/appraiseRepair/appraiseRepair?' +
      "repairId=" + item.repairId +
      "&repairType=" + item.repairType +
      "&repairChannel=" + item.repairChannel +
      "&publicArea=" + item.publicArea +
      "&communityId=" + item.communityId
  })
}
```

**新项目**（`dispatch.vue:251-259`）：

```typescript
function handleAppraise(item: RepairOrder) {
	TypedRouter.toAppraiseRepair({
		repairId: item.repairId!,
		repairType: item.repairType || "",
		repairChannel: item.repairChannel,
		publicArea: item.publicArea,
		communityId: item.communityId!,
	});
}
```

### 5.3. 评价提交逻辑

**旧项目**（`repair.js:244-290`）：

```javascript
export function appraiseRepair(_that) {
	return new Promise(function (reslove, reject) {
		let _data = {
			repairId: _that.repairId,
			repairType: _that.repairType,
			repairChannel: _that.repairChannel,
			publicArea: _that.publicArea,
			communityId: _that.communityId,
			context: _that.remark, // 回访建议内容
		};
		_that.context.post({
			url: url.appraiseRepairNew,
			data: _data,
			// ...
		});
	});
}
```

**新项目**（`appraise.vue:47-56`）：

```typescript
await submitAppraise({
	repairId: repairId.value,
	repairType: repairType.value,
	repairChannel: repairChannel.value,
	publicArea: publicArea.value,
	communityId: communityId.value,
	context: content.value, // 回访建议内容
});
```

## 6. 总结

### 6.1. 核心结论

1. **`dispatch.vue` 是维修师傅使用的页面**，显示分配给当前登录维修师傅的待处理工单
2. **`appraise.vue` 也是维修师傅使用的页面**，用于记录电话回访业主后收集的评价
3. **"回访"按钮命名准确**，但与页面标题"评价维修"存在不一致
4. **业务逻辑是电话回访场景**，而非业主自助评价场景

### 6.2. 业务设计理解

这套设计体现了物业管理的实际业务流程：

1. 维修完成后，物业需要主动回访业主了解满意度
2. 回访通常通过电话进行，而非让业主自己在 APP 上评价
3. 维修师傅在电话中询问业主满意度后，代替业主在系统中记录评价
4. 这种设计确保了回访的主动性和完成率

### 6.3. 改进建议

|    改进项    |                               建议                               |
| :----------: | :--------------------------------------------------------------: |
| 页面标题统一 |              将"评价维修"改为"回访评价"或"回访记录"              |
| 添加页面说明 | 在评价页顶部添加提示："请在电话回访业主后，记录业主的评价和建议" |
| 显示工单信息 |   在评价页顶部显示工单基本信息（报修人、报修内容等），方便确认   |
| 按钮文本优化 |             可考虑改为"回访评价"，更明确表达操作含义             |

## 7. 附录

### 7.1. 相关文件清单

|       文件       |                          路径                           |
| :--------------: | :-----------------------------------------------------: |
| 维修待办单（新） |           `src/pages-sub/repair/dispatch.vue`           |
| 维修待办单（旧） | `gitee-example/pages/repairDispatch/repairDispatch.vue` |
|   评价页（新）   |           `src/pages-sub/repair/appraise.vue`           |
|   评价页（旧）   | `gitee-example/pages/appraiseRepair/appraiseRepair.vue` |
|  API 定义（旧）  |          `gitee-example/api/repair/repair.js`           |

### 7.2. 权限码说明

|       权限码       |   说明   |
| :----------------: | :------: |
| 502021040151320003 | 回访权限 |
