# GPU型号任务数分布饼图Tooltip问题分析

## 问题描述

"GPU型号任务数分布"饼图鼠标悬停时，Tooltip显示任务个数为0，占比0%，但饼图本身能正常绘制，箭头指向也正确。

## 修复状态

✅ **已完成修复** - 2025-10-10

## 修复内容

1. 在数据准备阶段预先计算百分比
2. 更新Tooltip配置使用预计算的百分比字段
3. 更新标签格式化器使用预计算的百分比
4. 构建验证通过，无编译错误

## 分析过程

### 1. API数据检查

通过API测试获取到的GPU统计数据：

```json
[
  {
    "gpuName": "NVIDIA GeForce RTX 4090",
    "serverName": "8x4098B",
    "totalUsageCount": 11,
    "totalRuntime": 1813529
  },
  {
    "gpuName": "NVIDIA GeForce RTX 3090",
    "serverName": "3090",
    "totalUsageCount": 1,
    "totalRuntime": 583934
  }
  // ... 更多数据
]
```

数据正常，`totalUsageCount` 字段包含正确的任务数。

### 2. 饼图数据处理逻辑

在 [`GpuUsageChart.tsx`](src/pages/Statistics/components/GpuUsageChart.tsx:123) 的 [`getPieChartData()`](src/pages/Statistics/components/GpuUsageChart.tsx:123) 函数中：

```typescript
const pieData = Array.from(gpuModelMap.entries()).map(
  ([gpuModel, taskCount]) => {
    const dataItem = {
      type: gpuModel,
      value: taskCount,
    };
    return dataItem;
  },
);
```

数据格式为：`{ type: gpuModel, value: taskCount }`，这是正确的。

### 3. Tooltip配置对比

#### 有问题的GPU饼图配置：

```typescript
tooltip: {
  title: 'type',
  items: [
    {
      name: '任务数',
      field: 'value',
      valueFormatter: (datum: any) => {
        console.log('Pie tooltip valueFormatter:', datum);
        return `${datum?.value || 0}个`;
      },
    },
    {
      name: '占比',
      field: 'value',
      valueFormatter: (datum: any, index: number, data: any[]) => {
        console.log('Pie tooltip percent formatter:', datum, index, data);
        if (!data || !Array.isArray(data)) {
          return '0%';
        }
        const total = data.reduce((sum, d) => sum + (d?.value || 0), 0);
        const percent = total > 0 ? (((datum?.value || 0) / total) * 100).toFixed(1) : '0';
        return `${percent}%`;
      },
    },
  ],
}
```

#### 正常工作的用户时间占比饼图配置：

```typescript
// 数据预处理阶段计算百分比
const getUserTimeDistributionData = () => {
  // ...
  return userData.topUsers.map((user) => ({
    type: user.userName,
    value: user.totalRuntime,
    runtime: user.totalRuntime,
    tasks: user.totalTasks,
    favoriteGpu: user.favoriteGpu,
    percentage: totalRuntime > 0 ? ((user.totalRuntime / totalRuntime) * 100).toFixed(1) : '0',
  }));
};

// Tooltip直接使用预计算的百分比
tooltip: {
  items: [
    {
      name: '运行时间',
      field: 'runtime',
      formatter: (datum: any) => {
        const hours = Math.floor(datum.runtime / 3600);
        return `${hours}h`;
      },
    },
    {
      name: '占比',
      field: 'percentage',
      formatter: (datum: any) => `${datum.percentage}%`,
    },
  ],
}
```

### 4. 问题根因

GPU饼图的Tooltip配置存在以下问题：

1. **动态计算问题**：在 [`valueFormatter`](src/pages/Statistics/components/GpuUsageChart.tsx:255) 中动态计算百分比，但可能由于Ant Design Charts的内部机制，传入的 `

### 4. 问题根因

GPU饼图的Tooltip配置存在以下问题：

1. **动态计算问题**：在 [`valueFormatter`](src/pages/Statistics/components/GpuUsageChart.tsx:255) 中动态计算百分比，但可能由于Ant Design Charts的内部机制，传入的 `data` 参数可能不完整或格式不正确。

2. **字段映射问题**：使用 `field: 'value'` 但尝试访问 `datum.value`，可能存在字段访问问题。

3. **数据上下文问题**：动态计算时依赖的 `data` 数组可能不包含所有数据项。

### 5. 解决方案

参考用户时间占比饼图的成功经验，应该：

1. 在数据准备阶段预先计算百分比
2. 在Tooltip中直接使用预计算的百分比字段

## 修复方案

### 修改1：更新数据准备函数

在 [`getPieChartData()`](src/pages/Statistics/components/GpuUsageChart.tsx:123) 中预先计算百分比：

```typescript
const getPieChartData = () => {
  if (!gpuData) {
    console.log('GpuUsageChart: getPieChartData - gpuData is null');
    return [];
  }

  console.log('GpuUsageChart: getPieChartData - raw gpuData:', gpuData);
  console.log(
    'GpuUsageChart: getPieChartData - usageByDevice:',
    gpuData.usageByDevice,
  );

  // 按GPU型号聚合任务数
  const gpuModelMap = new Map<string, number>();

  gpuData.usageByDevice.forEach((gpu) => {
    const gpuModel = gpu.gpuName || '未知GPU';
    const currentCount = gpuModelMap.get(gpuModel) || 0;
    const taskCount = gpu.totalUsageCount || 0;
    gpuModelMap.set(gpuModel, currentCount + taskCount);
    console.log(
      `GpuUsageChart: Processing GPU ${gpuModel} on server ${gpu.serverName}, taskCount: ${taskCount}`,
    );
  });

  // 计算总任务数
  const totalTasks = Array.from(gpuModelMap.values()).reduce(
    (sum, count) => sum + count,
    0,
  );

  // 转换为饼图数据格式 - 预先计算百分比
  const pieData = Array.from(gpuModelMap.entries()).map(
    ([gpuModel, taskCount]) => {
      const percentage =
        totalTasks > 0 ? ((taskCount / totalTasks) * 100).toFixed(1) : '0';
      const dataItem = {
        type: gpuModel,
        value: taskCount,
        percentage: percentage,
      };
      console.log('GpuUsageChart: Pie chart data item:', dataItem);
      return dataItem;
    },
  );

  console.log('GpuUsageChart: Final pie chart data:', pieData);
  console.log('GpuUsageChart: Pie data length:', pieData.length);

  return pieData;
};
```

### 修改2：更新Tooltip配置

更新 [`pieConfig`](src/pages/Statistics/components/GpuUsageChart.tsx:230) 的tooltip配置：

```typescript
tooltip: {
  title: 'type',
  items: [
    {
      name: '任务数',
      field: 'value',
      formatter: (datum: any) => {
        console.log('Pie tooltip task count formatter:', datum);
        return `${datum?.value || 0}个`;
      },
    },
    {
      name: '占比',
      field: 'percentage',
      formatter: (datum: any) => {
        console.log('Pie tooltip percentage formatter:', datum);
        return `${datum?.percentage || '0'}%`;
      },
    },
  ],
},
```

### 修改3：更新标签格式化器

同时更新标签的格式化器以使用预计算的百分比：

```typescript
label: {
  text: 'type',
  position: 'outside',
  formatter: (text: string, item: any) => {
    return `${text}\n${item?.value || 0}个 (${item?.percentage || '0'}%)`;
  },
},
```

## 预期效果

修复后，Tooltip应该正确显示：

- 任务数：显示实际的数值（如11个、1个等）
- 占比：显示正确的百分比（如68.8%、6.3%等）

## 测试验证

1. 检查控制台日志输出，确认数据正确处理
2. 鼠标悬停在饼图上，验证Tooltip显示正确
3. 对比饼图视觉分布与Tooltip数据的一致性
