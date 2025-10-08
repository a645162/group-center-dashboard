# GPU服务器筛选器重构文档

## 任务描述

重构GPU服务器显示逻辑，从当前的单选模式改为默认显示所有服务器，并提供筛选器功能。

## 当前状态分析

需要查看以下关键文件来了解当前实现：

1. `src/pages/GpuDashboard/index.tsx` - 主页面
2. `src/pages/GpuDashboard/GpuDashboardPageContent.tsx` - 页面内容
3. `src/components/Machine/GpuDashboard/GpuDashboard.tsx` - GPU仪表板组件
4. `src/components/Machine/MachineSelector/MachineSelector.tsx` - 机器选择器
5. `src/components/Machine/GpuDashboard/Filter/BasicFilter.tsx` - 现有筛选器

## 重构目标

- 默认显示所有GPU服务器
- 添加筛选器组件，使用按钮形式
- 选中状态有边框，未选中状态为灰色
- 默认全选，用户可以手动取消选择

## 技术实现方案

1. 修改状态管理，从单选改为多选
2. 创建新的筛选器组件
3. 更新相关组件的props和状态传递
4. 确保向后兼容性

## 文件修改计划

- 修改MachineSelector组件逻辑
- 更新GpuDashboard组件状态管理
- 创建新的筛选器组件或修改现有筛选器
- 更新页面组件以使用新的筛选逻辑
