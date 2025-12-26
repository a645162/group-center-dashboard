# 过滤器URL参数和动画优化

## 需求分析

### 当前问题

1. **URL参数处理不完整**：当前过滤器设置无法从URL中删除参数
2. **状态持久化问题**：过滤器设置刷新后无法保留
3. **动画效果缺失**：过滤器显示/隐藏切换过于生硬

### 目标功能

1. 实现完整的URL参数管理（增删改查）
2. 确保过滤器状态在页面刷新后保持
3. 添加平滑的动画效果

## 技术方案

### 1. URL参数管理

- 使用Umi的`useLocation`和`useNavigate`进行URL参数操作
- 实现参数同步机制，确保URL与过滤器状态一致
- 支持参数删除功能

### 2. 状态持久化

- 为所有过滤器状态管理添加`persist`中间件
- 确保用户名和工程名过滤器状态持久化

### 3. 动画效果

- 使用CSS Transition实现平滑的显示/隐藏动画
- 添加淡入淡出和滑动效果
- 优化移动端动画性能

## 实现步骤

### 阶段一：URL参数管理

1. 创建URL参数工具函数
2. 修改过滤器组件支持URL参数同步
3. 实现参数删除功能

### 阶段二：状态持久化

1. 为用户名过滤器添加持久化
2. 为工程名过滤器添加持久化
3. 测试状态恢复功能

### 阶段三：动画优化

1. 修改FilterGroup组件添加动画
2. 优化CSS样式支持过渡效果
3. 测试动画性能

## 文件修改清单

### 需要修改的文件

1. `src/data/store/modules/filter/GpuTaskFilterUserName.ts` - 添加持久化
2. `src/data/store/modules/filter/GpuTaskFilterProjectName.ts` - 添加持久化
3. `src/components/Machine/GpuDashboard/Filter/FilterGroup.tsx` - 添加动画
4. `src/components/Machine/GpuDashboard/Filter/FilterGroup.less` - 动画样式
5. `src/pages/GpuDashboard/GpuTaskFilterPanel.tsx` - URL参数集成

### 需要创建的文件

1. `src/utils/urlParams.ts` - URL参数工具函数

## 技术细节

### URL参数格式

```
/gpu-dashboard?user=john&project=test&gpuIds=0,1,2&gpuRange=0-3
```

### 状态持久化配置

- 使用zustand的persist中间件
- 存储到localStorage
- 版本控制支持

### 动画效果

- 使用CSS transition属性
- 支持淡入淡出和高度变化
- 响应式设计

## 测试计划

1. URL参数增删改功能测试
2. 页面刷新状态恢复测试
3. 动画效果性能测试
4. 移动端兼容性测试

## 风险评估

- URL参数可能过长影响性能
- 动画效果可能影响低端设备性能
- 状态持久化可能产生版本冲突

## 解决方案

- 对URL参数进行压缩编码
- 提供动画开关选项
- 实现数据迁移机制
