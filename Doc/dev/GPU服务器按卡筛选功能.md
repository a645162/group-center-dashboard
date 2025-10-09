# GPU服务器按卡筛选功能文档

## 任务描述

为GPU服务器筛选功能新增按卡筛选功能，允许用户根据GPU卡号或GPU卡名称进行筛选。

## 当前状态分析

### 现有筛选功能

- 服务器筛选：按机器名称筛选
- 任务筛选：按用户名、工程名、多卡任务状态筛选
- 缺少按GPU卡号或GPU卡名称的筛选功能

### 相关数据结构

从 `API.GpuTaskInfo` 类型定义中可以看到：

- `taskGpuId: number` - GPU卡号
- `taskGpuName: string` - GPU卡名称
- `serverNameEng: string` - 服务器英文名称

### 现有筛选器组件

- `GpuServerFilter` - 服务器筛选
- `BasicFilter` - 基础筛选器（用于用户名、工程名）
- `MultiGpuFilter` - 多卡任务筛选
- `GpuTaskFilterPanel` - 任务筛选面板

## 功能需求

### 按卡筛选功能

1. **按GPU卡号筛选**
   - 支持精确匹配特定卡号
   - 支持范围筛选（如卡号0-3）

2. **按GPU卡名称筛选**
   - 支持模糊匹配GPU卡名称
   - 支持精确匹配特定GPU型号

3. **筛选器交互**
   - 按钮式筛选器，与现有UI风格一致
   - 支持全选、清空操作
   - 显示当前筛选状态

## 技术实现方案

### 1. 创建新的筛选器组件

- `GpuCardFilter` - 按卡筛选组件
- 支持卡号和卡名称两种筛选模式
- 集成到现有的筛选器组中

### 2. 状态管理

- 创建新的Zustand store用于管理按卡筛选状态
- 支持卡号范围筛选和卡名称模糊匹配

### 3. 筛选逻辑

- 在任务显示时应用按卡筛选条件
- 与现有筛选器逻辑兼容

### 4. UI集成

- 将新筛选器添加到 `FilterGroup` 组件中
- 保持与现有筛选器一致的视觉风格

## 文件修改计划

### 新增文件

- `src/components/Machine/GpuDashboard/Filter/GpuCardFilter.tsx` - 按卡筛选组件
- `src/data/store/modules/filter/GpuTaskFilterCard.ts` - 按卡筛选状态管理

### 修改文件

- `src/components/Machine/GpuDashboard/Filter/FilterGroup.tsx` - 集成新筛选器
- `src/pages/GpuDashboard/GpuTaskFilterPanel.tsx` - 更新任务筛选面板

## 实现细节

### 筛选器状态

```typescript
interface GpuCardFilterState {
  // 按卡号筛选
  gpuIdFilter: {
    enabled: boolean;
    gpuIds: number[]; // 选中的卡号
    range?: { min: number; max: number }; // 卡号范围
  };

  // 按卡名称筛选
  gpuNameFilter: {
    enabled: boolean;
    gpuName: string;
    isFuzzyMatch: boolean;
  };
}
```

### 筛选逻辑

- 当按卡号筛选启用时，只显示指定卡号的任务
- 当按卡名称筛选启用时，根据匹配模式筛选GPU卡名称
- 两种筛选模式可以同时使用，采用AND逻辑

## 向后兼容性

- 不影响现有筛选功能
- 默认不启用按卡筛选
- 与现有筛选器逻辑完全兼容
