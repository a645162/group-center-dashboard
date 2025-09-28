import { Card, Col, Row, Select, Statistic } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

interface TimeTrendChartProps {
  timePeriod: string;
}

// 模拟数据
const mockTrendData = {
  hourly: [
    { time: '00:00', tasks: 12, usage: 45.2 },
    { time: '02:00', tasks: 8, usage: 32.1 },
    { time: '04:00', tasks: 5, usage: 18.7 },
    { time: '06:00', tasks: 7, usage: 25.4 },
    { time: '08:00', tasks: 35, usage: 68.9 },
    { time: '10:00', tasks: 42, usage: 75.3 },
    { time: '12:00', tasks: 38, usage: 72.1 },
    { time: '14:00', tasks: 45, usage: 78.6 },
    { time: '16:00', tasks: 48, usage: 82.4 },
    { time: '18:00', tasks: 52, usage: 85.7 },
    { time: '20:00', tasks: 41, usage: 73.2 },
    { time: '22:00', tasks: 28, usage: 61.5 },
  ],
  daily: [
    { date: '01-10', tasks: 245, usage: 68.5 },
    { date: '01-11', tasks: 287, usage: 72.3 },
    { date: '01-12', tasks: 312, usage: 75.8 },
    { date: '01-13', tasks: 298, usage: 74.1 },
    { date: '01-14', tasks: 324, usage: 78.2 },
    { date: '01-15', tasks: 356, usage: 82.7 },
  ],
  weekly: [
    { week: '第1周', tasks: 1567, usage: 65.8 },
    { week: '第2周', tasks: 1789, usage: 68.4 },
    { week: '第3周', tasks: 1923, usage: 72.1 },
    { week: '第4周', tasks: 2015, usage: 75.6 },
  ],
};

const TimeTrendChart: React.FC<TimeTrendChartProps> = ({ timePeriod }) => {
  const [trendType, setTrendType] = useState<'hourly' | 'daily' | 'weekly'>(
    'hourly',
  );

  const currentData = mockTrendData[trendType];
  const totalTasks = currentData.reduce((sum, item) => sum + item.tasks, 0);
  const avgUsage =
    currentData.reduce((sum, item) => sum + item.usage, 0) / currentData.length;

  return (
    <div>
      {/* 趋势类型选择器 */}
      <Card style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 'bold' }}>趋势类型:</span>
          <Select
            value={trendType}
            onChange={setTrendType}
            style={{ width: 120 }}
          >
            <Option value="hourly">小时趋势</Option>
            <Option value="daily">日趋势</Option>
            <Option value="weekly">周趋势</Option>
          </Select>
        </div>
      </Card>

      {/* 趋势概览统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8}>
          <Card>
            <Statistic
              title="总任务数"
              value={totalTasks}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card>
            <Statistic
              title="平均使用率"
              value={avgUsage}
              precision={1}
              valueStyle={{ color: '#52c41a' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="数据点数"
              value={currentData.length}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 趋势图表 */}
      <Card
        title={`${trendType === 'hourly' ? '小时' : trendType === 'daily' ? '日' : '周'}趋势图`}
      >
        <div
          style={{
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            borderRadius: 6,
          }}
        >
          <div style={{ textAlign: 'center', color: '#666' }}>
            <div style={{ fontSize: '18px', marginBottom: 12 }}>
              时间趋势图表
            </div>
            <div style={{ fontSize: '14px', marginBottom: 8 }}>
              趋势类型:{' '}
              {trendType === 'hourly'
                ? '小时趋势'
                : trendType === 'daily'
                  ? '日趋势'
                  : '周趋势'}
            </div>
            <div style={{ fontSize: '12px', marginBottom: 4 }}>
              时间范围: {timePeriod}
            </div>
            <div style={{ fontSize: '12px' }}>
              这里将显示详细的时间趋势可视化图表
            </div>
          </div>
        </div>
      </Card>

      {/* 数据表格 */}
      <Card title="详细数据" style={{ marginTop: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th
                  style={{
                    padding: '8px',
                    border: '1px solid #f0f0f0',
                    textAlign: 'left',
                  }}
                >
                  {trendType === 'hourly'
                    ? '时间'
                    : trendType === 'daily'
                      ? '日期'
                      : '周次'}
                </th>
                <th
                  style={{
                    padding: '8px',
                    border: '1px solid #f0f0f0',
                    textAlign: 'right',
                  }}
                >
                  任务数
                </th>
                <th
                  style={{
                    padding: '8px',
                    border: '1px solid #f0f0f0',
                    textAlign: 'right',
                  }}
                >
                  使用率(%)
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px', border: '1px solid #f0f0f0' }}>
                    {trendType === 'hourly'
                      ? item.time
                      : trendType === 'daily'
                        ? item.date
                        : item.week}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      border: '1px solid #f0f0f0',
                      textAlign: 'right',
                    }}
                  >
                    {item.tasks}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      border: '1px solid #f0f0f0',
                      textAlign: 'right',
                    }}
                  >
                    {item.usage.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TimeTrendChart;
