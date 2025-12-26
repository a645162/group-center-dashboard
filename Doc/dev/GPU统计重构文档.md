# GPU使用统计重构文档

## 项目背景

当前GPU使用统计组件存在以下问题需要重构：

1. "平均GPU使用率"和"峰值使用率"统计指标不合理，需要移除
2. 需要添加"最受欢迎的GPU型号"统计
3. 饼图百分比应该基于总任务数计算，而不是使用率
4. 柱状图tooltip显示异常（任务数和服务器显示为null）
5. 需要使用Ant Design Charts最新API

## 当前数据结构分析

根据API测试结果，GPU统计数据结构如下：

```json
{
  "isSucceed": true,
  "result": [
    {
      "gpuName": "NVIDIA GeForce RTX 4090",
      "serverName": "8x4098B",
      "totalUsageCount": 8,
      "totalRuntime": 1602553,
      "averageUsagePercent": 1.87,
      "averageMemoryUsage": 0.1,
      "totalMemoryUsage": 51.78,
      "formattedAverageUsagePercent": 1.87,
      "formattedAverageMemoryUsage": 0.1,
      "formattedTotalMemoryUsage": 51.78
    }
  ]
}
```

## 重构需求

### 1. 统计指标重构

- **移除**: 平均GPU使用率、峰值使用率
- **新增**: 最受欢迎的GPU型号（按任务数最多）
- **保留**: 总任务数、活跃GPU数量

### 2. 饼图重构

- **当前问题**: 百分比计算基于使用率，不合理
- **解决方案**: 百分比应该基于总任务数计算
- **数据聚合**: 按GPU型号合并相同型号，计算任务数占比

### 3. 柱状图重构

- **当前问题**: tooltip显示任务数和服务器为null
- **解决方案**: 修复数据字段映射，确保tooltip正确显示
- **数据组织**: 保持GPU型号分组，服务器作为系列字段

### 4. 设备使用情况卡片重构

- **当前问题**: 显示使用率百分比不合理
- **解决方案**: 改为显示任务数占比，移除使用率显示

## 技术实现方案

### 1. 数据结构重新定义

```typescript
interface GpuStat {
  gpuName: string;
  serverName: string;
  totalUsageCount: number; // 任务数
  totalRuntime: number;
  averageMemoryUsage: number;
  totalMemoryUsage: number;
}

interface GpuStatisticsData {
  totalTasks: number;
  activeGpus: number;
  mostPopularGpu: string; // 最受欢迎的GPU型号
  mostPopularGpuTasks: number; // 最受欢迎GPU的任务数
  usageByDevice: GpuStat[];
}
```

### 2. 饼图数据聚合逻辑

```typescript
const getPieChartData = () => {
  // 按GPU型号聚合任务数
  const gpuModelMap = new Map<string, number>();

  gpuData.usageByDevice.forEach((gpu) => {
    const gpuModel = gpu.gpuName || '未知GPU';
    const currentCount = gpuModelMap.get(gpuModel) || 0;
    gpuModelMap.set(gpuModel, currentCount + (gpu.totalUsageCount || 0));
  });

  // 计算百分比
  const totalTasks = Array.from(gpuModelMap.values()).reduce(
    (sum, count) => sum + count,
    0,
  );

  return Array.from(gpuModelMap.entries()).map(([gpuModel, taskCount]) => ({
    type: gpuModel,
    value: taskCount,
    percent: totalTasks > 0 ? ((taskCount / totalTasks) * 100).toFixed(1) : '0',
  }));
};
```

### 3. 柱状图数据组织

```typescript
const getColumnChartData = () => {
  // 按GPU型号分组，然后按服务器显示任务数
  const gpuModelMap = new Map<string, Array<{ server: string; tasks: number }>>();

  gpuData.usageByDevice.forEach((gpu) => {
    const gpuModel = gpu.gpuName || '未知GPU';
    const server = gpu.serverName || '未知服务器';
    const tasks = gpu.totalUsageCount || 0;

    if (!gpuModelMap.has(gpuModel)) {
      gpuModelMap.set(gpuModel, []);
    }

    const serverList = gpuModelMap.get(gpuModel)!;
    const existingServer = serverList.find((item) => item.server === server);

    if (existingServer) {
      existingServer.tasks += tasks;
    } else {
      serverList.push({ server, tasks });
    }
  });

  // 转换为柱状图数据格式
  const result: Array<{ gpu: string;
```
