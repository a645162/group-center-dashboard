import { getTimeTrendStatistics } from '@/services/group_center/dashboardStatistics';
import { GetIsDarkMode } from '@/utils/AntD5/AntD5DarkMode';
import { Line } from '@ant-design/charts';
import {
  Alert,
  Card,
  Col,
  Collapse,
  Empty,
  Pagination,
  Row,
  Select,
  Spin,
  Statistic,
} from 'antd';
import React, { useEffect, useState } from 'react';

const { Option } = Select;
const { Panel } = Collapse;

interface TimeTrendChartProps {
  timePeriod: string;
}

interface DailyStat {
  date: string;
  totalTasks: number;
  totalRuntime: number;
  activeUsers: string[];
  peakGpuUsage: number;
  activeUsersCount: number;
  formattedPeakGpuUsage: number;
}

interface TimeTrendData {
  period: string;
  dailyStats: DailyStat[];
  totalTasks: number;
  totalRuntime: number;
  totalUsers: number;
  averageDailyTasks: number;
  averageDailyRuntime: number;
}

const TimeTrendChart: React.FC<TimeTrendChartProps> = ({ timePeriod }) => {
  const [trendData, setTrendData] = useState<TimeTrendData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    fetchTimeTrendStatistics();
  }, [timePeriod]);

  const fetchTimeTrendStatistics = async () => {
    try {
      console.log(
        'TimeTrendChart: Starting to fetch time trend statistics, timePeriod:',
        timePeriod,
      );
      setLoading(true);
      setError(null);

      console.log(
        'TimeTrendChart: Calling getTimeTrendStatistics API with params:',
        { timePeriod },
      );
      const response = await getTimeTrendStatistics({ timePeriod });
      console.log('TimeTrendChart: API response received:', response);

      if (response.isSucceed && response.result) {
        console.log(
          'TimeTrendChart: API call successful, processing trend data',
        );
        const trendData = response.result as TimeTrendData;
        console.log('TimeTrendChart: Raw trend data:', trendData);

        setTrendData(trendData);
        console.log('TimeTrendChart: Trend data set successfully');
      } else {
        console.error(
          'TimeTrendChart: API call failed - response not successful:',
          response,
        );
        setError('获取时间趋势统计数据失败');
      }
    } catch (err) {
      console.error(
        'TimeTrendChart: Failed to fetch time trend statistics:',
        err,
      );
      setError('网络错误，请稍后重试');
    } finally {
      console.log('TimeTrendChart: Loading state set to false');
      setLoading(false);
    }
  };

  const formatRuntime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // 准备任务数趋势数据
  const getTaskTrendData = () => {
    if (!trendData || !trendData.dailyStats) return [];

    return trendData.dailyStats.map((day) => ({
      date: day.date.split(' ')[0], // 只保留日期部分，移除时间
      tasks: day.totalTasks,
      runtime: Math.floor(day.totalRuntime / 3600), // 转换为小时
      users: day.activeUsersCount,
    }));
  };

  // 准备双轴图数据
  const getDualAxesData = () => {
    if (!trendData || !trendData.dailyStats) return [[], []];

    const taskData = trendData.dailyStats.map((day) => ({
      date: day.date.split(' ')[0], // 只保留日期部分，移除时间
      value: day.totalTasks,
      type: '任务数',
    }));

    const usageData = trendData.dailyStats.map((day) => ({
      date: day.date.split(' ')[0], // 只保留日期部分，移除时间
      value: day.peakGpuUsage,
      type: 'GPU使用率',
    }));

    return [taskData, usageData];
  };

  const isDark = GetIsDarkMode();

  // 任务数趋势图配置 - 使用Ant Design Charts最新API
  const lineConfig = {
    data: getTaskTrendData(),
    xField: 'date',
    yField: 'tasks',
    autoFit: true,
    theme: isDark ? 'dark' : 'light',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
        fontSize: 12,
      },
    },
    tooltip: {
      title: 'date',
      items: [
        {
          name: '任务数',
          field: 'tasks',
          formatter: (datum: any) => `${datum.tasks}个`,
        },
        {
          name: '运行时间',
          field: 'runtime',
          formatter: (datum: any) => `${datum.runtime}h`,
        },
        {
          name: '活跃用户',
          field: 'users',
          formatter: (datum: any) => `${datum.users}人`,
        },
      ],
    },
    xAxis: {
      type: 'cat', // 使用分类轴而不是线性轴
      label: {
        autoRotate: true,
      },
    },
    yAxis: {
      label: {
        formatter: (v: number) => `${Math.round(v)}个`,
      },
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  // 双轴图配置 - 使用Ant Design Charts最新API
  const dualAxesConfig = {
    data: getDualAxesData(),
    xField: 'date',
    yField: ['value', 'value'],
    autoFit: true,
    theme: isDark ? 'dark' : 'light',
    xAxis: {
      type: 'cat', // 使用分类轴而不是线性轴
      label: {
        autoRotate: true,
      },
    },
    geometryOptions: [
      {
        geometry: 'line',
        seriesField: 'type',
        lineStyle: {
          lineWidth: 3,
        },
        point: {
          size: 4,
        },
        color: '#1890ff',
      },
      {
        geometry: 'line',
        seriesField: 'type',
        lineStyle: {
          lineWidth: 3,
        },
        point: {
          size: 4,
        },
        color: '#52c41a',
      },
    ],
    tooltip: {
      title: 'date',
      items: [
        {
          name: '类型',
          field: 'type',
        },
        {
          name: '数值',
          field: 'value',
          formatter: (datum: any) => {
            return `${datum.value}${datum.type === '任务数' ? '个' : '%'}`;
          },
        },
      ],
    },
    legend: {
      position: 'top',
    },
    yAxis: {
      value: {
        nice: true,
        label: {
          formatter: (val: number) => `${Math.round(val)}个`,
        },
      },
      value1: {
        nice: true,
        label: {
          formatter: (val: number) => `${Math.round(val)}%`,
        },
      },
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  // 获取当前页面的数据
  const getCurrentPageData = () => {
    if (!trendData || !trendData.dailyStats) return [];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return trendData.dailyStats.slice(startIndex, endIndex);
  };

  // 处理分页变化
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>加载时间趋势统计数据...</div>
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
          <a onClick={fetchTimeTrendStatistics} style={{ color: '#1890ff' }}>
            重试
          </a>
        }
      />
    );
  }

  if (
    !trendData ||
    !trendData.dailyStats ||
    trendData.dailyStats.length === 0
  ) {
    return (
      <Empty
        description="暂无时间趋势统计数据"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div>
      {/* 趋势概览统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8}>
          <Card>
            <Statistic
              title="总任务数"
              value={trendData.totalTasks}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card>
            <Statistic
              title="总运行时间"
              value={formatRuntime(trendData.totalRuntime)}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="活跃用户数"
              value={trendData.totalUsers}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 趋势图表 */}
      <Card
        title="任务数趋势"
        extra={
          <span style={{ color: '#666', fontSize: '12px' }}>
            时间范围: {timePeriod}
          </span>
        }
      >
        <div style={{ height: 400 }}>
          <Line {...lineConfig} />
        </div>
      </Card>

      {/* 数据表格 - 使用Collapse组件默认折叠 */}
      <Collapse style={{ marginTop: 24 }}>
        <Panel header="详细数据" key="1">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  style={{
                    background: isDark
                      ? 'rgba(255, 255, 255, 0.04)'
                      : '#fafafa',
                  }}
                >
                  <th
                    style={{
                      padding: '8px',
                      border: isDark
                        ? '1px solid rgba(255, 255, 255, 0.12)'
                        : '1px solid #f0f0f0',
                      textAlign: 'left',
                    }}
                  >
                    日期
                  </th>
                  <th
                    style={{
                      padding: '8px',
                      border: isDark
                        ? '1px solid rgba(255, 255, 255, 0.12)'
                        : '1px solid #f0f0f0',
                      textAlign: 'right',
                    }}
                  >
                    任务数
                  </th>
                  <th
                    style={{
                      padding: '8px',
                      border: isDark
                        ? '1px solid rgba(255, 255, 255, 0.12)'
                        : '1px solid #f0f0f0',
                      textAlign: 'right',
                    }}
                  >
                    总运行时间
                  </th>
                  <th
                    style={{
                      padding: '8px',
                      border: isDark
                        ? '1px solid rgba(255, 255, 255, 0.12)'
                        : '1px solid #f0f0f0',
                      textAlign: 'right',
                    }}
                  >
                    峰值GPU使用率
                  </th>
                  <th
                    style={{
                      padding: '8px',
                      border: isDark
                        ? '1px solid rgba(255, 255, 255, 0.12)'
                        : '1px solid #f0f0f0',
                      textAlign: 'right',
                    }}
                  >
                    活跃用户数
                  </th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageData().map((day, index) => {
                  const globalIndex = (currentPage - 1) * pageSize + index;
                  return (
                    <tr key={globalIndex}>
                      <td
                        style={{
                          padding: '8px',
                          border: isDark
                            ? '1px solid rgba(255, 255, 255, 0.12)'
                            : '1px solid #f0f0f0',
                        }}
                      >
                        {day.date.split(' ')[0]}
                      </td>
                      <td
                        style={{
                          padding: '8px',
                          border: isDark
                            ? '1px solid rgba(255, 255, 255, 0.12)'
                            : '1px solid #f0f0f0',
                          textAlign: 'right',
                        }}
                      >
                        {day.totalTasks}
                      </td>
                      <td
                        style={{
                          padding: '8px',
                          border: isDark
                            ? '1px solid rgba(255, 255, 255, 0.12)'
                            : '1px solid #f0f0f0',
                          textAlign: 'right',
                        }}
                      >
                        {formatRuntime(day.totalRuntime)}
                      </td>
                      <td
                        style={{
                          padding: '8px',
                          border: isDark
                            ? '1px solid rgba(255, 255, 255, 0.12)'
                            : '1px solid #f0f0f0',
                          textAlign: 'right',
                        }}
                      >
                        {day.peakGpuUsage.toFixed(1)}%
                      </td>
                      <td
                        style={{
                          padding: '8px',
                          border: isDark
                            ? '1px solid rgba(255, 255, 255, 0.12)'
                            : '1px solid #f0f0f0',
                          textAlign: 'right',
                        }}
                      >
                        {day.activeUsersCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 分页组件 */}
          {trendData &&
            trendData.dailyStats &&
            trendData.dailyStats.length > 0 && (
              <div
                style={{
                  marginTop: 16,
                  textAlign: 'right',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={trendData.dailyStats.length}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) =>
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                  }
                  onChange={handlePageChange}
                  onShowSizeChange={handlePageChange}
                  pageSizeOptions={['10', '20', '50', '100']}
                />
              </div>
            )}
        </Panel>
      </Collapse>
    </div>
  );
};

export default TimeTrendChart;
