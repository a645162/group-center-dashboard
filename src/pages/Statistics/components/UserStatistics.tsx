import { Card, List, Progress, Statistic, Tag } from 'antd';
import React from 'react';

interface UserStatisticsProps {
  timePeriod: string;
}

// 模拟数据
const mockUserData = {
  totalUsers: 45,
  activeUsers: 32,
  averageTasksPerUser: 25.1,
  topUsers: [
    { name: 'user001', tasks: 128, usage: 18.2, lastActive: '2024-01-15' },
    { name: 'user002', tasks: 95, usage: 13.5, lastActive: '2024-01-15' },
    { name: 'user003', tasks: 87, usage: 12.3, lastActive: '2024-01-14' },
    { name: 'user004', tasks: 76, usage: 10.8, lastActive: '2024-01-14' },
    { name: 'user005', tasks: 65, usage: 9.2, lastActive: '2024-01-13' },
    { name: 'user006', tasks: 54, usage: 7.7, lastActive: '2024-01-13' },
    { name: 'user007', tasks: 43, usage: 6.1, lastActive: '2024-01-12' },
    { name: 'user008', tasks: 32, usage: 4.5, lastActive: '2024-01-11' },
  ],
};

const UserStatistics: React.FC<UserStatisticsProps> = ({ timePeriod }) => {
  return (
    <div>
      {/* 用户概览统计 */}
      <div style={{ marginBottom: 24 }}>
        <Card>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
            }}
          >
            <Statistic
              title="总用户数"
              value={mockUserData.totalUsers}
              valueStyle={{ color: '#1890ff' }}
            />
            <Statistic
              title="活跃用户"
              value={mockUserData.activeUsers}
              valueStyle={{ color: '#52c41a' }}
            />
            <Statistic
              title="用户活跃率"
              value={(
                (mockUserData.activeUsers / mockUserData.totalUsers) *
                100
              ).toFixed(1)}
              valueStyle={{ color: '#faad14' }}
              suffix="%"
            />
            <Statistic
              title="人均任务数"
              value={mockUserData.averageTasksPerUser}
              valueStyle={{ color: '#722ed1' }}
              precision={1}
            />
          </div>
        </Card>
      </div>

      {/* 用户排名列表 */}
      <Card title="用户使用排名">
        <List
          dataSource={mockUserData.topUsers}
          renderItem={(user, index) => (
            <List.Item>
              <div
                style={{ width: '100%', display: 'flex', alignItems: 'center' }}
              >
                <div style={{ width: 40, textAlign: 'center' }}>
                  <Tag
                    color={
                      index < 3 ? '#f50' : index < 5 ? '#2db7f5' : '#87d068'
                    }
                  >
                    #{index + 1}
                  </Tag>
                </div>

                <div style={{ flex: 1, margin: '0 16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>{user.name}</span>
                    <span style={{ color: '#666', fontSize: '12px' }}>
                      最后活跃: {user.lastActive}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: '#666',
                    }}
                  >
                    <span>任务数: {user.tasks}</span>
                    <span>使用占比: {user.usage}%</span>
                  </div>

                  <Progress
                    percent={user.usage}
                    size="small"
                    strokeColor={
                      user.usage > 15
                        ? '#f50'
                        : user.usage > 10
                          ? '#2db7f5'
                          : '#87d068'
                    }
                    showInfo={false}
                  />
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* 用户活动时间分布 */}
      <Card title="用户活动时间分布" style={{ marginTop: 24 }}>
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
            <div style={{ fontSize: '16px', marginBottom: 8 }}>
              用户活动时间分布图
            </div>
            <div style={{ fontSize: '12px' }}>
              这里将显示用户在不同时间段的活跃度分布
            </div>
            <div style={{ fontSize: '12px' }}>时间范围: {timePeriod}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserStatistics;
