# GPU看板右键菜单跳转任务查询功能

## 功能需求

在GPU看板的task右键菜单和下拉菜单中，添加菜单项，模仿设置过滤器的功能，能够直接跳转到任务查询界面，并支持快速填入用户名或工程名。

## 当前实现分析

### 1. 现有菜单结构

**右键菜单**（ContextMenu）：

- 详细信息
- 设置"用户名"为过滤用户
- 设置"项目名"为项目名过滤器

**下拉菜单**（Dropdown）：

- 详细信息
- 设置"用户名"为过滤用户
- 设置"项目名"为项目名过滤器

### 2. 任务查询界面

- 路由路径：`/task-query`
- 查询表单支持：用户名、项目名称、设备名称、任务类型、时间范围等
- 查询参数接口：`API.queryGpuTasksSimpleParams`

### 3. 路由配置

任务查询页面已配置在路由中，可以直接跳转。

## 技术实现方案

### 1. 新增菜单项

在右键菜单和下拉菜单中添加两个新选项：

- "跳转到任务查询（按用户）"
- "跳转到任务查询（按项目）"

### 2. 跳转逻辑

使用Umi的`history.push`或`navigate`进行页面跳转，并通过URL参数传递预填充的查询条件。

### 3. URL参数格式

任务查询页面支持通过URL参数预填充表单：

- `userName`: 用户名
- `projectName`: 项目名称
- `deviceName`: 设备名称
- `taskType`: 任务类型
- `isMultiGpu`: 是否多GPU任务
- `startTime`: 开始时间
- `endTime`: 结束时间

### 4. 实现步骤

1. 在`GpuTaskCardItem.tsx`中添加跳转函数
2. 在右键菜单和下拉菜单中添加新菜单项
3. 实现跳转逻辑，传递相应的查询参数
4. 确保任务查询页面能够正确解析URL参数

## 具体实现

### 1. 新增跳转函数

```typescript
const handleNavigateToTaskQueryByUser = () => {
  const params = new URLSearchParams({
    userName: taskInfo.name,
    page: '1',
    pageSize: '20',
    sortBy: 'TASK_START_TIME',
    sortOrder: 'DESC',
  });

  history.push(`/task-query?${params.toString()}`);
};

const handleNavigateToTaskQueryByProject = () => {
  const params = new URLSearchParams({
    projectName: taskInfo.projectName,
    page: '1',
    pageSize: '20',
    sortBy: 'TASK_START_TIME',
    sortOrder: 'DESC',
  });

  history.push(`/task-query?${params.toString()}`);
};
```

### 2. 修改菜单项

**右键菜单新增：**

```typescript
<ContextMenuItem onClick={handleNavigateToTaskQueryByUser}>
  跳转到任务查询（按用户）
</ContextMenuItem>
<ContextMenuItem onClick={handleNavigateToTaskQueryByProject}>
  跳转到任务查询（按项目）
</ContextMenuItem>
```

**下拉菜单新增：**

```typescript
{
  key: '4',
  label: `跳转到任务查询（按用户"${taskInfo.name}"）`,
  onClick: handleNavigateToTaskQueryByUser,
},
{
  key: '5',
  label: `跳转到任务查询（按项目"${taskInfo.projectName}"）`,
  onClick: handleNavigateToTaskQueryByProject,
}
```

## 注意事项

1. **导入依赖**：需要导入`history`或`useNavigate` hook
2. **参数验证**：确保传递的参数符合任务查询页面的要求
3. **用户体验**：跳转后应该自动执行查询，显示相关结果
4. **错误处理**：处理跳转失败的情况

## 测试要点

1. 右键菜单是否显示新选项
2. 下拉菜单是否显示新选项
3. 点击菜单项是否能正确跳转到任务查询页面
4. 跳转后查询表单是否预填充了正确的参数
5. 查询是否自动执行并显示结果

## 后续优化

1. 可以添加更多预填充选项，如设备名称、时间范围等
2. 可以支持组合查询条件
3. 可以添加跳转后的提示信息
