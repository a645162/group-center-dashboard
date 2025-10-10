import { PageContainer } from '@ant-design/pro-components';
import { Alert, Card, Col, Row, Select, Spin, Statistic, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';

import { get24HourReport } from '@/services/group_center/dashboardStatistics';
import GpuUsageChart from './components/GpuUsageChart';
import ProjectStatistics from './components/ProjectStatistics';
import TimeTrendChart from './components/TimeTrendChart';
import UserActivityTimeChart from './components/UserActivityTimeChart';
import UserStatistics from './components/UserStatistics';
import styles from './index.less';

const { Option } = Select;

interface OverviewStats {
  totalTasks: number;
  activeUsers: number;
  averageGpuUsage: number;
  projectCount: number;
}

const StatisticsPage: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<string>('ONE_WEEK');
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const timePeriodOptions = [
    { value: 'ONE_DAY', label: '24小时' },
    { value: 'ONE_WEEK', label: '1周' },
    { value: 'ONE_MONTH', label: '1月' },
    { value: 'SIX_MONTH', label: '6个月' },
    { value: 'ONE_YEAR', label: '1年' },
  ];

  useEffect(() => {
    fetchOverviewStats();
  }, []);

  const fetchOverviewStats = async () => {
    try {
      console.log('StatisticsPage: Starting to fetch overview statistics');
      setLoading(true);
      setError(null);

      console.log('StatisticsPage: Calling get24HourReport API');
      const response = await get24HourReport();
      console.log('StatisticsPage: API response received:', response);

      if (response.isSucceed && response.result) {
        console.log('StatisticsPage: API call successful, processing data');
        const report = response.result;
        console.log('StatisticsPage: Report data:', report);
        setOverviewStats({
          totalTasks: report.totalTasks || 0,
          activeUsers: report.activeUsers || 0,
          averageGpuUsage: 0, // 需要从其他接口获取
          projectCount: report.topProjects?.length || 0,
        });
        console.log('StatisticsPage: Overview stats set successfully');
      } else {
        console.error(
          'StatisticsPage: API call failed - response not successful:',
          response,
        );
        setError('获取统计数据失败');
      }
    } catch (err) {
      console.error(
        'StatisticsPage: Failed to fetch overview statistics:',
        err,
      );
      setError('网络错误，请稍后重试');
    } finally {
      console.log('StatisticsPage: Loading state set to false');
      setLoading(false);
    }
  };

  const renderOverviewStats = () => {
    if (loading) {
      return (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          {[1, 2, 3, 4].map((item) => (
            <Col xs={24} sm={12} md={6} key={item}>
              <Card>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Spin />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      );
    }

    if (error) {
      return (
        <Alert
          message="数据加载失败"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <a onClick={fetchOverviewStats} style={{ color: '#1890ff' }}>
              重试
            </a>
          }
        />
      );
    }

    return (
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={overviewStats?.totalTasks || 0}
              valueStyle={{ color: '#1890ff' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={overviewStats?.activeUsers || 0}
              valueStyle={{ color: '#52c41a' }}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="平均GPU使用率"
              value={overviewStats?.averageGpuUsage || 0}
              valueStyle={{ color: '#faad14' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="项目数量"
              value={overviewStats?.projectCount || 0}
              valueStyle={{ color: '#722ed1' }}
              suffix="个"
            />
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <PageContainer
      title="统计信息"
      content="GPU使用情况统计和分析"
      extra={[
        <Select
          key="timePeriod"
          value={timePeriod}
          onChange={setTimePeriod}
          style={{ width: 120 }}
          disabled={loading}
        >
          {timePeriodOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>,
      ]}
      ghost
    >
      <div className={styles.statisticsPage}>
        {/* 详细统计 */}
        <Tabs
          defaultActiveKey="gpu"
          size="large"
          items={[
            {
              key: 'gpu',
              label: 'GPU使用统计',
              children: <GpuUsageChart timePeriod={timePeriod} />,
            },
            {
              key: 'user',
              label: '用户统计',
              children: <UserStatistics timePeriod={timePeriod} />,
            },
            {
              key: 'project',
              label: '项目统计',
              children: <ProjectStatistics timePeriod={timePeriod} />,
            },
            {
              key: 'trend',
              label: '时间趋势',
              children: <TimeTrendChart timePeriod={timePeriod} />,
            },
            {
              key: 'activity',
              label: '活动时间分布',
              children: <UserActivityTimeChart timePeriod={timePeriod} />,
            },
          ]}
        />
      </div>
    </PageContainer>
  );
};

export default StatisticsPage;
