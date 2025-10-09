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
  averageUsagePercent: number;
  averageMemoryUsage: number;
  totalMemoryUsage: number;
  formattedAverageUsagePercent: number;
  formattedAverageMemoryUsage: number;
  formattedTotalMemoryUsage: number;
}

interface GpuStatisticsData {
  averageUsage: number;
  peakUsage: number;
  totalTasks: number;
  activeGpus: number;
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

        const averageUsage =
          gpuStats.length > 0
            ? gpuStats.reduce((sum, gpu) => sum + gpu.averageUsagePercent, 0) /
              gpuStats.length
            : 0;
        const peakUsage =
          gpuStats.length > 0
            ? Math.max(...gpuStats.map((gpu) => gpu.averageUsagePercent))
            : 0;
        const totalTasks = gpuStats.reduce(
          (sum, gpu) => sum + gpu.totalUsageCount,
          0,
        );
        const activeGpus = gpuStats.filter(
          (gpu) => gpu.totalUsageCount > 0,
        ).length;

        console.log(
          'GpuUsageChart: Calculated metrics - averageUsage:',
          averageUsage,
          'peakUsage:',
          peakUsage,
          'totalTasks:',
          totalTasks,
          'activeGpus:',
          activeGpus,
        );

        setGpuData({
          averageUsage,
          peakUsage,
          totalTasks,
          activeGpus,
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

  // 准备饼图数据
  const getPieChartData = () => {
    if (!gpuData) return [];

    return gpuData.usageByDevice.map((gpu) => ({
      type: gpu.gpuName,
      value: gpu.averageUsagePercent,
      server: gpu.serverName,
    }));
  };

  // 准备柱状图数据
  const getColumnChartData = () => {
    if (!gpuData) return [];

    return gpuData.usageByDevice.map((gpu) => ({
      gpu: gpu.gpuName || '未知GPU', // 默认值处理
      usage: gpu.averageUsagePercent ?? 0, // 确保 usage 不为 null/undefined
      memory: gpu.averageMemoryUsage ?? 0, // 确保 memory 不为 null/undefined
      tasks: gpu.totalUsageCount ?? 0, // 确保 tasks 不为 null/undefined
      server: gpu.serverName || '未知服务器', // 默认值处理
    }));
  };

  // 饼图配置 - 使用Ant Design Charts最新API
  const pieConfig = {
    data: getPieChartData(),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      text: 'type',
      position: 'outer',
      formatter: (text: string, item: any) => {
        const total = getPieChartData().reduce((sum, d) => sum + d.value, 0);
        const percent =
          total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
        return `${text} ${percent}%`;
      },
    },
    tooltip: {
      title: 'type',
      items: [
        {
          name: '使用率',
          field: 'value',
          formatter: (datum: any) => `${(datum.value || 0).toFixed(1)}%`,
        },
        {
          name: '服务器',
          field: 'server',
        },
      ],
    },
    legend: {
      position: 'bottom',
      layout: 'horizontal',
    },
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 1000,
      },
    },
  };

  // 柱状图配置
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
      style: {
        fill: '#000',
      },
      formatter: (datum: any) => `${datum.tasks || 0}`,
    },
    tooltip: {
      title: 'gpu',
      items: [
        {
          name: '任务数',
          value: 'tasks',
          formatter: (datum: any) => `${datum.tasks || 0}个`,
        },
        {
          name: '服务器',
          value: 'server',
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
              title="平均GPU使用率"
              value={gpuData.averageUsage.toFixed(1)}
              precision={1}
              valueStyle={{ color: '#1890ff' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="峰值使用率"
              value={gpuData.peakUsage.toFixed(1)}
              precision={1}
              valueStyle={{ color: '#cf1322' }}
              suffix="%"
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

      {/* GPU设备使用情况 */}
      <Card
        title="各GPU设备使用情况"
        style={{ marginBottom: 24 }}
        extra={
          <span style={{ color: '#666', fontSize: '12px' }}>
            时间范围: {timePeriod}
          </span>
        }
      >
        <Row gutter={16}>
          {gpuData.usageByDevice.map((gpu, index) => (
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
                    {gpu.gpuName}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#666',
                      marginBottom: 8,
                    }}
                  >
                    {gpu.serverName}
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color:
                        gpu.averageUsagePercent > 80
                          ? '#cf1322'
                          : gpu.averageUsagePercent > 60
                            ? '#faad14'
                            : '#52c41a',
                    }}
                  >
                    {gpu.averageUsagePercent.toFixed(1)}%
                  </div>
                  <div
                    style={{ fontSize: '12px', color: '#666', marginTop: 4 }}
                  >
                    任务数: {gpu.totalUsageCount}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 使用率分布图表 */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="GPU使用率分布" style={{ marginBottom: 16 }}>
            {getPieChartData().length > 0 ? (
              <Pie {...pieConfig} />
            ) : (
              <Empty
                description="暂无GPU使用率数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="各GPU设备使用率对比" style={{ marginBottom: 16 }}>
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
