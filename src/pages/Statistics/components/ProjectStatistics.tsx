import { Card, List, Progress, Statistic, Tag } from 'antd';
import React from 'react';

interface ProjectStatisticsProps {
  timePeriod: string;
}

// 模拟数据
const mockProjectData = {
  totalProjects: 23,
  activeProjects: 18,
  averageTasksPerProject: 49.0,
  topProjects: [
    {
      name: 'project-alpha',
      tasks: 245,
      users: 12,
      usage: 34.8,
      lastActive: '2024-01-15',
    },
    {
      name: 'project-beta',
      tasks: 187,
      users: 8,
      usage: 26.5,
      lastActive: '2024-01-15',
    },
    {
      name: 'project-gamma',
      tasks: 156,
      users: 6,
      usage: 22.1,
      lastActive: '2024-01-14',
    },
    {
      name: 'project-delta',
      tasks: 98,
      users: 5,
      usage: 13.9,
      lastActive: '2024-01-14',
    },
    {
      name: 'project-epsilon',
      tasks: 76,
      users: 4,
      usage: 10.8,
      lastActive: '2024-01-13',
    },
    {
      name: 'project-zeta',
      tasks: 54,
      users: 3,
      usage: 7.7,
      lastActive: '2024-01-12',
    },
    {
      name: 'project-eta',
      tasks: 43,
      users: 2,
      usage: 6.1,
      lastActive: '2024-01-11',
    },
    {
      name: 'project-theta',
      tasks: 32,
      users: 2,
      usage: 4.5,
      lastActive: '2024-01-10',
    },
  ],
};

const ProjectStatistics: React.FC<ProjectStatisticsProps> = ({
  timePeriod,
}) => {
  return (
    <div>
      {/* 项目概览统计 */}
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
              title="总项目数"
              value={mockProjectData.totalProjects}
              valueStyle={{ color: '#1890ff' }}
            />
            <Statistic
              title="活跃项目"
              value={mockProjectData.activeProjects}
              valueStyle={{ color: '#52c41a' }}
            />
            <Statistic
              title="项目活跃率"
              value={(
                (mockProjectData.activeProjects /
                  mockProjectData.totalProjects) *
                100
              ).toFixed(1)}
              valueStyle={{ color: '#faad14' }}
              suffix="%"
            />
            <Statistic
              title="项目平均任务数"
              value={mockProjectData.averageTasksPerProject}
              valueStyle={{ color: '#722ed1' }}
              precision={1}
            />
          </div>
        </Card>
      </div>

      {/* 项目排名列表 */}
      <Card title="项目使用排名">
        <List
          dataSource={mockProjectData.topProjects}
          renderItem={(project, index) => (
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
                    <span style={{ fontWeight: 'bold' }}>{project.name}</span>
                    <span style={{ color: '#666', fontSize: '12px' }}>
                      最后活跃: {project.lastActive}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: '#666',
                      marginBottom: 4,
                    }}
                  >
                    <span>任务数: {project.tasks}</span>
                    <span>参与用户: {project.users}人</span>
                    <span>使用占比: {project.usage}%</span>
                  </div>

                  <Progress
                    percent={project.usage}
                    size="small"
                    strokeColor={
                      project.usage > 25
                        ? '#f50'
                        : project.usage > 15
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

      {/* 项目类型分布 */}
      <Card title="项目类型分布" style={{ marginTop: 24 }}>
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
              项目类型分布图
            </div>
            <div style={{ fontSize: '12px' }}>
              这里将显示不同类型项目的分布情况
            </div>
            <div style={{ fontSize: '12px' }}>时间范围: {timePeriod}</div>
          </div>
        </div>
      </Card>

      {/* 项目使用趋势 */}
      <Card title="项目使用趋势" style={{ marginTop: 24 }}>
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
              项目使用趋势图
            </div>
            <div style={{ fontSize: '12px' }}>
              这里将显示项目使用量的时间趋势
            </div>
            <div style={{ fontSize: '12px' }}>时间范围: {timePeriod}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProjectStatistics;
