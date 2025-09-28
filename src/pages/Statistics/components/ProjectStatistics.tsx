import { getProjectStatistics } from '@/services/group_center/dashboardStatistics';
import { Alert, Card, Empty, List, Progress, Spin, Statistic, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

interface ProjectStatisticsProps {
  timePeriod: string;
}

interface ProjectStat {
  projectName: string;
  totalRuntime: number;
  totalTasks: number;
  activeUsers: string[];
  averageRuntime: number;
  activeUsersCount: number;
  formattedAverageRuntime: number;
}

interface ProjectStatisticsData {
  totalProjects: number;
  activeProjects: number;
  averageTasksPerProject: number;
  topProjects: ProjectStat[];
}

const ProjectStatistics: React.FC<ProjectStatisticsProps> = ({
  timePeriod,
}) => {
  const [projectData, setProjectData] = useState<ProjectStatisticsData | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectStatistics();
  }, [timePeriod]);

  const fetchProjectStatistics = async () => {
    try {
      console.log(
        'ProjectStatistics: Starting to fetch project statistics, timePeriod:',
        timePeriod,
      );
      setLoading(true);
      setError(null);

      console.log(
        'ProjectStatistics: Calling getProjectStatistics API with params:',
        { timePeriod },
      );
      const response = await getProjectStatistics({ timePeriod });
      console.log('ProjectStatistics: API response received:', response);

      if (response.isSucceed && response.result) {
        console.log(
          'ProjectStatistics: API call successful, processing project data',
        );
        const projectStats = response.result as ProjectStat[];
        console.log('ProjectStatistics: Raw project stats:', projectStats);

        const totalProjects = projectStats.length;
        const activeProjects = projectStats.filter(
          (project) => project.totalTasks > 0,
        ).length;
        const totalTasks = projectStats.reduce(
          (sum, project) => sum + project.totalTasks,
          0,
        );
        const averageTasksPerProject =
          totalProjects > 0 ? totalTasks / totalProjects : 0;

        console.log(
          'ProjectStatistics: Calculated metrics - totalProjects:',
          totalProjects,
          'activeProjects:',
          activeProjects,
          'totalTasks:',
          totalTasks,
          'averageTasksPerProject:',
          averageTasksPerProject,
        );

        setProjectData({
          totalProjects,
          activeProjects,
          averageTasksPerProject,
          topProjects: projectStats.slice(0, 10), // 只显示前10名
        });
        console.log('ProjectStatistics: Project data set successfully');
      } else {
        console.error(
          'ProjectStatistics: API call failed - response not successful:',
          response,
        );
        setError('获取项目统计数据失败');
      }
    } catch (err) {
      console.error(
        'ProjectStatistics: Failed to fetch project statistics:',
        err,
      );
      setError('网络错误，请稍后重试');
    } finally {
      console.log('ProjectStatistics: Loading state set to false');
      setLoading(false);
    }
  };

  const formatRuntime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const calculateUsagePercentage = (
    project: ProjectStat,
    allProjects: ProjectStat[],
  ): number => {
    const totalRuntime = allProjects.reduce(
      (sum, p) => sum + p.totalRuntime,
      0,
    );
    return totalRuntime > 0 ? (project.totalRuntime / totalRuntime) * 100 : 0;
  };

  // 准备项目任务分布饼图数据
  const getTaskDistributionData = () => {
    if (!projectData) return [];

    return projectData.topProjects.map((project) => ({
      type: project.projectName,
      value: project.totalTasks,
      runtime: project.totalRuntime,
      users: project.activeUsersCount,
    }));
  };

  // 准备项目运行时间柱状图数据
  const getRuntimeChartData = () => {
    if (!projectData) return [];

    return projectData.topProjects.map((project) => ({
      project: project.projectName,
      runtime: Math.floor(project.totalRuntime / 3600), // 转换为小时
      tasks: project.totalTasks,
      users: project.activeUsersCount,
    }));
  };

  // 饼图配置
  const pieConfig = {
    data: getTaskDistributionData(),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    tooltip: {
      fields: ['type', 'value', 'runtime', 'users'],
      formatter: (datum) => {
        const hours = Math.floor(datum.runtime / 3600);
        return {
          name: datum.type,
          value: `任务数: ${datum.value}\n运行时间: ${hours}h\n活跃用户: ${datum.users}人`,
        };
      },
    },
    legend: {
      position: 'bottom',
    },
  };

  // 柱状图配置
  const columnConfig = {
    data: getRuntimeChartData(),
    xField: 'project',
    yField: 'runtime',
    seriesField: 'project',
    isGroup: false,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'top',
      style: {
        fill: '#000',
      },
      formatter: (datum) => `${datum.runtime}h`,
    },
    tooltip: {
      fields: ['project', 'runtime', 'tasks', 'users'],
      formatter: (datum) => {
        return {
          name: datum.project,
          value: `运行时间: ${datum.runtime}h\n任务数: ${datum.tasks}\n活跃用户: ${datum.users}人`,
        };
      },
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}h`,
      },
    },
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>加载项目统计数据...</div>
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
          <a onClick={fetchProjectStatistics} style={{ color: '#1890ff' }}>
            重试
          </a>
        }
      />
    );
  }

  if (!projectData || projectData.topProjects.length === 0) {
    return (
      <Empty
        description="暂无项目统计数据"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

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
              value={projectData.totalProjects}
              valueStyle={{ color: '#1890ff' }}
            />
            <Statistic
              title="活跃项目"
              value={projectData.activeProjects}
              valueStyle={{ color: '#52c41a' }}
            />
            <Statistic
              title="项目活跃率"
              value={(
                (projectData.activeProjects / projectData.totalProjects) *
                100
              ).toFixed(1)}
              valueStyle={{ color: '#faad14' }}
              suffix="%"
            />
            <Statistic
              title="项目平均任务数"
              value={projectData.averageTasksPerProject.toFixed(1)}
              valueStyle={{ color: '#722ed1' }}
              precision={1}
            />
          </div>
        </Card>
      </div>

      {/* 项目排名列表 */}
      <Card
        title="项目使用排名"
        extra={
          <span style={{ color: '#666', fontSize: '12px' }}>
            时间范围: {timePeriod}
          </span>
        }
      >
        <List
          dataSource={projectData.topProjects}
          renderItem={(project, index) => {
            const usagePercentage = calculateUsagePercentage(
              project,
              projectData.topProjects,
            );
            return (
              <List.Item>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
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
                      <span style={{ fontWeight: 'bold' }}>
                        {project.projectName}
                      </span>
                      <span style={{ color: '#666', fontSize: '12px' }}>
                        活跃用户: {project.activeUsersCount}人
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
                      <span>任务数: {project.totalTasks}</span>
                      <span>
                        总运行时间: {formatRuntime(project.totalRuntime)}
                      </span>
                      <span>使用占比: {usagePercentage.toFixed(1)}%</span>
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
                      <span>
                        平均运行时间: {formatRuntime(project.averageRuntime)}
                      </span>
                      <span>活跃用户: {project.activeUsers.join(', ')}</span>
                    </div>

                    <Progress
                      percent={usagePercentage}
                      size="small"
                      strokeColor={
                        usagePercentage > 25
                          ? '#f50'
                          : usagePercentage > 15
                            ? '#2db7f5'
                            : '#87d068'
                      }
                      showInfo={false}
                    />
                  </div>
                </div>
              </List.Item>
            );
          }}
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
