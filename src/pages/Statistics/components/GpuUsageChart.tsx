import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';

interface GpuUsageChartProps {
  timePeriod: string;
}

// 模拟数据 - 实际项目中会从接口获取
const mockGpuData = {
  averageUsage: 68.5,
  peakUsage: 92.3,
  totalTasks: 1128,
  activeGpus: 8,
  usageByDevice: [
    { name: 'GPU 0', usage: 75.2, memory: 12.4 },
    { name: 'GPU 1', usage: 82.1, memory: 15.8 },
    { name: 'GPU 2', usage: 45.3, memory: 8.2 },
    { name: 'GPU 3', usage: 91.7, memory: 22.1 },
    { name: 'GPU 4', usage: 68.9, memory: 11.5 },
    { name: 'GPU 5', usage: 53.2, memory: 9.8 },
    { name: 'GPU 6', usage: 79.4, memory: 14.3 },
    { name: 'GPU 7', usage: 62.8, memory: 10.7 },
  ],
};

const GpuUsageChart: React.FC<GpuUsageChartProps> = ({ timePeriod }) => {
  return (
    <div>
      {/* 概览统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="平均GPU使用率"
              value={mockGpuData.averageUsage}
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
              value={mockGpuData.peakUsage}
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
              value={mockGpuData.totalTasks}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="活跃GPU数量"
              value={mockGpuData.activeGpus}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* GPU设备使用情况 */}
      <Card title="各GPU设备使用情况" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          {mockGpuData.usageByDevice.map((gpu, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card size="small" style={{ marginBottom: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      marginBottom: 8,
                    }}
                  >
                    {gpu.name}
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color:
                        gpu.usage > 80
                          ? '#cf1322'
                          : gpu.usage > 60
                            ? '#faad14'
                            : '#52c41a',
                    }}
                  >
                    {gpu.usage}%
                  </div>
                  <div
                    style={{ fontSize: '12px', color: '#666', marginTop: 4 }}
                  >
                    显存: {gpu.memory} GB
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 使用率分布图表 */}
      <Card title="使用率分布">
        <div
          style={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            borderRadius: 6,
          }}
        >
          <div style={{ textAlign: 'center', color: '#666' }}>
            <div style={{ fontSize: '16px', marginBottom: 8 }}>图表区域</div>
            <div style={{ fontSize: '12px' }}>
              这里将显示GPU使用率的图表可视化
            </div>
            <div style={{ fontSize: '12px' }}>时间范围: {timePeriod}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GpuUsageChart;
