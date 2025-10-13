# GPU看板项目订阅功能

## 功能概述

在GPU看板的Task Card上添加右键菜单，支持用户订阅项目，并提供订阅管理面板。

## 功能需求

### 1. Task Card右键菜单

- 在GPU看板的Task Card上添加右键菜单
- 菜单项：订阅项目
- 点击后弹出订阅窗口

### 2. 订阅窗口

- 显示当前任务的项目信息
- 提供用户选择下拉框（从API获取用户列表）
- 订阅按钮
- 错误提示和成功反馈

### 3. 订阅管理面板

- 新的面板用于查询用户订阅
- 支持选择用户查看订阅项目
- 支持退订操作

## 技术实现

### 接口使用

- `getUserList()` - 获取用户列表
- `subscribeProject()` - 订阅项目
- `unsubscribeProject()` - 取消订阅
- `getUserSubscriptions()` - 获取用户订阅列表

### 组件设计

1. **TaskCard右键菜单组件**
   - 集成到现有的GpuTaskListCard组件
   - 使用Ant Design的Dropdown组件

2. **订阅弹窗组件**
   - 使用Ant Design的Modal组件
   - 包含用户选择下拉框和订阅按钮

3. **订阅管理面板组件**
   - 新的独立组件
   - 包含用户选择、订阅列表展示、退订功能

### 数据结构

```typescript
interface UserInfo {
  name: string;
  nameEng: string;
}

interface SubscriptionInfo {
  userName: string;
  subscriptions: string[];
  count: number;
}
```

## 实现步骤

1. 创建订阅相关的组件
2. 在GpuTaskListCard中添加右键菜单
3. 实现订阅弹窗逻辑
4. 创建订阅管理面板
5. 集成到现有页面中

## 注意事项

- 使用TypeScript确保类型安全
- 错误处理和用户反馈
- 遵循现有的代码风格和架构
- 使用最新的Ant Design组件
