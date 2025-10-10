import { getGpuStatistics } from '@/services/group_center/dashboardStatistics';
import { Column, Pie } from '@ant-design/charts';
import { Alert, Card, Col, Empty, Row, Spin, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';

interface GpuUsageChartProps {
  timePeriod: string;
}

interface GpuStat {
  gpuName: string;
  serverName: string;
  totalUsageCount: number;
  totalRuntime: number;
  averageMemoryUsage: number;
  totalMemoryUsage: number;
  formattedAverageMemoryUsage: number;
  formattedTotalMemoryUsage: number;
}

interface GpuStatisticsData {
  totalTasks: number;
  activeGpus: number;
  mostPopularGpu: string;
  mostPopularGpuTasks: number;
  usageByDevice: GpuStat[];
}

const GpuUsageChart: React.FC<GpuUsageChartProps> = ({ timePeriod }) => {
  const [gpuData, setGpuData] = useState<GpuStatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGpuStatistics();
  }, [timePeriod]);

  const fetchGpuStatistics = async () => {
    try {
      console.log(
        'GpuUsageChart: Starting to fetch GPU statistics, timePeriod:',
        timePeriod,
      );
      setLoading(true);
      setError(null);

      console.log('GpuUsageChart: Calling getGpuStatistics API with params:', {
        timePeriod,
      });
      const response = await getGpuStatistics({ timePeriod });
      console.log('GpuUsageChart: API response received:', response);

      if (response.isSucceed && Array.isArray(response.result)) {
        console.log('GpuUsageChart: API call successful, processing GPU data');
        const gpuStats = response.result as GpuStat[];
        console.log('GpuUsageChart: Raw GPU stats:', gpuStats);

        const totalTasks = gpuStats.reduce(
          (sum, gpu) => sum + gpu.totalUsageCount,
          0,
        );
        const activeGpus = gpuStats.filter(
          (gpu) => gpu.totalUsageCount > 0,
        ).length;

        // 找出最受欢迎的GPU型号（任务数最多）
        const gpuModelTaskCount = new Map<string, number>();
        gpuStats.forEach((gpu) => {
          const gpuModel = gpu.gpuName || '未知GPU';
          const currentCount = gpuModelTaskCount.get(gpuModel) || 0;
          gpuModelTaskCount.set(gpuModel, currentCount + gpu.totalUsageCount);
        });

        let mostPopularGpu = '暂无数据';
        let mostPopularGpuTasks = 0;
        gpuModelTaskCount.forEach((taskCount, gpuModel) => {
          if (taskCount > mostPopularGpuTasks) {
            mostPopularGpu = gpuModel;
            mostPopularGpuTasks = taskCount;
          }
        });

        console.log(
          'GpuUsageChart: Calculated metrics - totalTasks:',
          totalTasks,
          'activeGpus:',
          activeGpus,
          'mostPopularGpu:',
          mostPopularGpu,
          'mostPopularGpuTasks:',
          mostPopularGpuTasks,
        );

        setGpuData({
          totalTasks,
          activeGpus,
          mostPopularGpu,
          mostPopularGpuTasks,
          usageByDevice: gpuStats,
        });
        console.log('GpuUsageChart: GPU data set successfully');
      } else {
        console.error(
          'GpuUsageChart: API call failed - response not successful or result is not an array:',
          response,
        );
        setError('获取GPU统计数据失败');
      }
    } catch (err) {
      console.error('GpuUsageChart: Failed to fetch GPU statistics:', err);
      setError('网络错误，请稍后重试');
    } finally {
      console.log('GpuUsageChart: Loading state set to false');
      setLoading(false);
    }
  };

  const formatMemory = (gb: number): string => {
    return `${gb.toFixed(1)} GB`;
  };

  // 准备饼图数据 - 按GPU型号聚合任务数
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
    console.log(
      'GpuUsageChart: Total tasks for percentage calculation:',
      totalTasks,
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
    console.log('GpuUsageChart: Pie chart data length:', pieData.length);

    return pieData;
  };

  // 准备柱状图数据 - 按GPU型号和服务器分组显示任务数
  const getColumnChartData = () => {
    if (!gpuData) {
      console.log('GpuUsageChart: getColumnChartData - gpuData is null');
      return [];
    }

    console.log('GpuUsageChart: getColumnChartData - processing data');

    // 按GPU型号分组，然后按服务器显示任务数
    const gpuModelMap = new Map<
      string,
      Array<{ server: string; tasks: number }>
    >();

    gpuData.usageByDevice.forEach((gpu) => {
      const gpuModel = gpu.gpuName || '未知GPU';
      const server = gpu.serverName || '未知服务器';
      const tasks = gpu.totalUsageCount || 0;

      console.log(
        `GpuUsageChart: Column chart - GPU: ${gpuModel}, Server: ${server}, Tasks: ${tasks}`,
      );

      if (!gpuModelMap.has(gpuModel)) {
        gpuModelMap.set(gpuModel, []);
      }

      const serverList = gpuModelMap.get(gpuModel)!;
      const existingServer = serverList.find((item) => item.server === server);

      if (existingServer) {
        existingServer.tasks += tasks;
        console.log(
          `GpuUsageChart: Updated existing server ${server} for GPU ${gpuModel}, new tasks: ${existingServer.tasks}`,
        );
      } else {
        serverList.push({ server, tasks });
        console.log(
          `GpuUsageChart: Added new server ${server} for GPU ${gpuModel}, tasks: ${tasks}`,
        );
      }
    });

    // 转换为柱状图数据格式
    const result: Array<{ gpu: string; server: string; tasks: number }> = [];

    gpuModelMap.forEach((serverList, gpuModel) => {
      serverList.forEach((serverData) => {
        const dataItem = {
          gpu: gpuModel,
          server: serverData.server,
          tasks: serverData.tasks,
        };
        result.push(dataItem);
        console.log('GpuUsageChart: Column chart data item:', dataItem);
      });
    });

    console.log('GpuUsageChart: Final column chart data:', result);
    return result;
  };

  // 饼图配置 - 使用Ant Design Charts最新API，显示GPU型号任务数
  const pieConfig = {
    data: getPieChartData(),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      text: 'type',
      position: 'outside',
      formatter: (text: string, item: any) => {
        return `${text}\n${item?.value || 0}个 (${item?.percentage || '0'}%)`;
      },
    },
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
    legend: {
      position: 'bottom',
      layout: 'horizontal',
      itemName: {
        formatter: (text: string) => {
          return text.length > 15 ? text.substring(0, 15) + '...' : text;
        },
      },
    },
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 1000,
      },
    },
  };

  // 柱状图配置 - 显示每台服务器上同型号GPU的任务数
  const columnConfig = {
    data: getColumnChartData(),
    xField: 'gpu',
    yField: 'tasks',
    seriesField: 'server',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'top',
      offset: 10,
      style: {
        fill: '#000',
        fontSize: 12,
        fontWeight: 'bold',
      },
      formatter: (datum: any) => {
        if (!datum) {
          console.log('Column label formatter: datum is undefined');
          return '';
        }
        const tasks = datum.tasks || 0;
        console.log(
          `Column label formatter: GPU ${datum.gpu}, Server ${datum.server}, Tasks ${tasks}`,
        );
        return tasks > 0 ? `${tasks}` : '';
      },
    },
    tooltip: {
      title: 'gpu',
      items: [
        {
          name: '服务器-任务数',
          field: 'server',
          valueFormatter: (datum: any) =>
            `${datum?.server || '未知服务器'}-${datum?.tasks || 0}个`,
        },
      ],
    },
    xAxis: {
      label: {
        autoRotate: true,
        formatter: (text: string) => {
          return text.length > 10 ? text.substring(0, 10) + '...' : text;
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v: number) => `${Math.round(v)}`,
      },
      title: {
        text: '任务数',
      },
    },
    legend: {
      position: 'bottom',
      itemName: {
        formatter: (text: string) => {
          return text.length > 15 ? text.substring(0, 15) + '...' : text;
        },
      },
    },
    animation: {
      appear: {
        animation: 'scale-in-y',
        duration: 800,
      },
    },
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>加载GPU统计数据...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="数据加载失败"
        description={error}
        type="error"
        showIcon
        action={
          <a onClick={fetchGpuStatistics} style={{ color: '#1890ff' }}>
            重试
          </a>
        }
      />
    );
  }

  if (!gpuData || gpuData.usageByDevice.length === 0) {
    return (
      <Empty
        description="暂无GPU统计数据"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div>
      {/* 概览统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="最受欢迎的GPU"
              value={gpuData.mostPopularGpu}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="最受欢迎GPU任务数"
              value={gpuData.mostPopularGpuTasks}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={gpuData.totalTasks}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="活跃GPU数量"
              value={gpuData.activeGpus}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* GPU设备任务数分布 - 按GPU型号聚合显示，与饼图对应 */}
      <Card
        title="各GPU设备任务数分布"
        style={{ marginBottom: 24 }}
        extra={
          <span style={{ color: '#666', fontSize: '12px' }}>
            时间范围: {timePeriod}
          </span>
        }
      >
        <Row gutter={16}>
          {(() => {
            // 按GPU型号聚合数据，与饼图保持一致
            const gpuModelMap = new Map<
              string,
              { taskCount: number; serverCount: number }
            >();

            gpuData.usageByDevice.forEach((gpu) => {
              const gpuModel = gpu.gpuName || '未知GPU';
              const currentData = gpuModelMap.get(gpuModel) || {
                taskCount: 0,
                serverCount: 0,
              };
              currentData.taskCount += gpu.totalUsageCount || 0;
              currentData.serverCount += 1;
              gpuModelMap.set(gpuModel, currentData);
            });

            return Array.from(gpuModelMap.entries()).map(
              ([gpuModel, data], index) => {
                // 计算该GPU型号的任务数占比
                const taskPercent =
                  gpuData.totalTasks > 0
                    ? ((data.taskCount / gpuData.totalTasks) * 100).toFixed(1)
                    : '0';

                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={index}>
                    <Card size="small" style={{ marginBottom: 16 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: 4,
                          }}
                        >
                          {gpuModel}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#666',
                            marginBottom: 8,
                          }}
                        >
                          {data.serverCount}台服务器
                        </div>
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#1890ff',
                          }}
                        >
                          {data.taskCount}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#666',
                            marginTop: 4,
                          }}
                        >
                          占比: {taskPercent}%
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              },
            );
          })()}
        </Row>
      </Card>

      {/* 使用率分布图表 */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="GPU型号任务数分布" style={{ marginBottom: 16 }}>
            {(() => {
              const pieData = getPieChartData();
              console.log(
                'GpuUsageChart: Rendering pie chart with data:',
                pieData,
              );
              console.log('GpuUsageChart: Pie data length:', pieData.length);
              return pieData.length > 0 ? (
                <Pie {...pieConfig} />
              ) : (
                <Empty
                  description="暂无GPU任务数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              );
            })()}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="各GPU设备任务数对比" style={{ marginBottom: 16 }}>
            {getColumnChartData().length > 0 ? (
              <Column {...columnConfig} />
            ) : (
              <Empty
                description="暂无GPU设备数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GpuUsageChart;
