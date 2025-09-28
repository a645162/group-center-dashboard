import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Select, Statistic, Tabs } from 'antd';
import React, { useState } from 'react';

import GpuUsageChart from './components/GpuUsageChart';
import ProjectStatistics from './components/ProjectStatistics';
import TimeTrendChart from './components/TimeTrendChart';
import UserStatistics from './components/UserStatistics';
import styles from './index.less';

const { Option } = Select;
const { TabPane } = Tabs;

const StatisticsPage: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<string>('ONE_WEEK');

  const timePeriodOptions = [
    { value: 'ONE_DAY', label: '24小时' },
    { value: 'THREE_DAYS', label: '3天' },
    { value: 'ONE_WEEK', label: '1周' },
    { value: 'TWO_WEEKS', label: '2周' },
    { value: 'ONE_MONTH', label: '1月' },
  ];

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
        {/* 概览统计 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="总任务数"
                value={1128}
                valueStyle={{ color: '#1890ff' }}
                suffix="个"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="活跃用户"
                value={45}
                valueStyle={{ color: '#52c41a' }}
                suffix="人"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="平均GPU使用率"
                value={68.5}
                valueStyle={{ color: '#faad14' }}
                suffix="%"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="项目数量"
                value={23}
                valueStyle={{ color: '#722ed1' }}
                suffix="个"
              />
            </Card>
          </Col>
        </Row>

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
          ]}
        />
      </div>
    </PageContainer>
  );
};

export default StatisticsPage;
