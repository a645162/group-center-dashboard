import { getUserStatistics } from '@/services/group_center/dashboardStatistics';
import { GetIsDarkMode } from '@/utils/AntD5/AntD5DarkMode';
import { Pie } from '@ant-design/charts';
import { Alert, Card, Empty, List, Progress, Spin, Statistic, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

interface UserStatisticsProps {
  timePeriod: string;
}

interface UserStat {
  userName: string;
  totalTasks: number;
  totalRuntime: number;
  averageRuntime: number;
  favoriteGpu: string;
  favoriteProject: string;
  formattedAverageRuntime: number;
}

interface UserStatisticsData {
  totalUsers: number;
  activeUsers: number;
  averageTasksPerUser: number;
  topUsers: UserStat[];
}

const UserStatistics: React.FC<UserStatisticsProps> = ({ timePeriod }) => {
  const [userData, setUserData] = useState<UserStatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStatistics();
  }, [timePeriod]);

  const fetchUserStatistics = async () => {
    try {
      console.log(
        'UserStatistics: Starting to fetch user statistics, timePeriod:',
        timePeriod,
      );
      setLoading(true);
      setError(null);

      console.log(
        'UserStatistics: Calling getUserStatistics API with params:',
        { timePeriod },
      );
      const response = await getUserStatistics({ timePeriod });
      console.log('UserStatistics: API response received:', response);

      if (response.isSucceed && response.result) {
        console.log(
          'UserStatistics: API call successful, processing user data',
        );
        const userStats = response.result as UserStat[];
        console.log('UserStatistics: Raw user stats:', userStats);

        const totalUsers = userStats.length;
        const activeUsers = userStats.filter(
          (user) => user.totalTasks > 0,
        ).length;
        const totalTasks = userStats.reduce(
          (sum, user) => sum + user.totalTasks,
          0,
        );
        const averageTasksPerUser =
          totalUsers > 0 ? totalTasks / totalUsers : 0;

        console.log(
          'UserStatistics: Calculated metrics - totalUsers:',
          totalUsers,
          'activeUsers:',
          activeUsers,
          'totalTasks:',
          totalTasks,
          'averageTasksPerUser:',
          averageTasksPerUser,
        );

        setUserData({
          totalUsers,
          activeUsers,
          averageTasksPerUser,
          topUsers: userStats.slice(0, 10), // 只显示前10名
        });
        console.log('UserStatistics: User data set successfully');
      } else {
        console.error(
          'UserStatistics: API call failed - response not successful:',
          response,
        );
        setError('获取用户统计数据失败');
      }
    } catch (err) {
      console.error('UserStatistics: Failed to fetch user statistics:', err);
      setError('网络错误，请稍后重试');
    } finally {
      console.log('UserStatistics: Loading state set to false');
      setLoading(false);
    }
  };

  const formatRuntime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const calculateUsagePercentage = (
    user: UserStat,
    allUsers: UserStat[],
  ): number => {
    const totalRuntime = allUsers.reduce((sum, u) => sum + u.totalRuntime, 0);
    return totalRuntime > 0 ? (user.totalRuntime / totalRuntime) * 100 : 0;
  };

  // 准备用户任务分布饼图数据
  const getTaskDistributionData = () => {
    if (!userData) return [];

    return userData.topUsers.map((user) => ({
      type: user.userName,
      value: user.totalTasks,
      runtime: user.totalRuntime,
    }));
  };

  // 准备用户运行时间柱状图数据
  const getRuntimeChartData = () => {
    if (!userData) return [];

    return userData.topUsers.map((user) => ({
      user: user.userName,
      runtime: Math.floor(user.totalRuntime / 3600), // 转换为小时
      tasks: user.totalTasks,
      favoriteGpu: user.favoriteGpu,
    }));
  };

  // 准备用户时间占比饼图数据
  const getUserTimeDistributionData = () => {
    if (!userData) return [];

    const totalRuntime = userData.topUsers.reduce(
      (sum, user) => sum + user.totalRuntime,
      0,
    );

    return userData.topUsers.map((user) => ({
      type: user.userName,
      value: user.totalRuntime,
      runtime: user.totalRuntime,
      tasks: user.totalTasks,
      favoriteGpu: user.favoriteGpu,
      percentage:
        totalRuntime > 0
          ? ((user.totalRuntime / totalRuntime) * 100).toFixed(1)
          : '0',
    }));
  };

  const isDark = GetIsDarkMode();

  // 饼图配置 - 使用Ant Design Charts最新API
  const pieConfig = {
    data: getTaskDistributionData(),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    theme: isDark ? 'dark' : 'light',
    label: {
      type: 'outer',
      content: '{name} {percentage}',
      formatter: (datum: any, mappingData: any) => {
        const percentage = ((datum.value / mappingData.total) * 100).toFixed(1);
        return `${datum.type}\n${percentage}%`;
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    tooltip: {
      title: 'type',
      items: [
        {
          name: '任务数',
          field: 'value',
          formatter: (datum: any) => `${datum.value}个`,
        },
        {
          name: '运行时间',
          field: 'runtime',
          formatter: (datum: any) => {
            const hours = Math.floor(datum.runtime / 3600);
            return `${hours}h`;
          },
        },
      ],
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
        animation: 'scale-in',
        duration: 1000,
      },
    },
  };

  // 柱状图配置 - 使用Ant Design Charts最新API
  const columnConfig = {
    data: getRuntimeChartData(),
    xField: 'user',
    yField: 'runtime',
    seriesField: 'user',
    isGroup: false,
    theme: isDark ? 'dark' : 'light',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'top',
      style: {
        fill: '#000',
        fontSize: 12,
      },
      formatter: (datum: any) => `${datum.runtime}h`,
    },
    tooltip: {
      title: 'user',
      items: [
        {
          name: '运行时间',
          field: 'runtime',
          formatter: (datum: any) => `${datum.runtime}h`,
        },
        {
          name: '任务数',
          field: 'tasks',
          formatter: (datum: any) => `${datum.tasks}个`,
        },
        {
          name: '常用GPU',
          field: 'favoriteGpu',
          formatter: (datum: any) => datum.favoriteGpu || 'N/A',
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
        formatter: (v: number) => `${Math.round(v)}h`,
      },
    },
    animation: {
      appear: {
        animation: 'scale-in-y',
        duration: 800,
      },
    },
  };

  // 用户时间占比饼图配置 - 使用Ant Design Charts最新API
  const userTimePieConfig = {
    data: getUserTimeDistributionData(),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    theme: isDark ? 'dark' : 'light',
    label: {
      text: 'type',
      position: 'outside',
      formatter: (text: string, item: any) => {
        const percent = item.percentage || '0';
        return `${text} ${percent}%`;
      },
    },
    tooltip: {
      title: 'type',
      items: [
        {
          name: '运行时间',
          field: 'runtime',
          formatter: (datum: any) => {
            const hours = Math.floor(datum.runtime / 3600);
            return `${hours}h`;
          },
        },
        {
          name: '占比',
          field: 'percentage',
          formatter: (datum: any) => `${datum.percentage}%`,
        },
        {
          name: '任务数',
          field: 'tasks',
          formatter: (datum: any) => `${datum.tasks}个`,
        },
        {
          name: '常用GPU',
          field: 'favoriteGpu',
          formatter: (datum: any) => datum.favoriteGpu || 'N/A',
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>加载用户统计数据...</div>
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
          <a onClick={fetchUserStatistics} style={{ color: '#1890ff' }}>
            重试
          </a>
        }
      />
    );
  }

  if (!userData || userData.topUsers.length === 0) {
    return (
      <Empty
        description="暂无用户统计数据"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

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
              value={userData.totalUsers}
              valueStyle={{ color: '#1890ff' }}
            />
            <Statistic
              title="活跃用户"
              value={userData.activeUsers}
              valueStyle={{ color: '#52c41a' }}
            />
            <Statistic
              title="用户活跃率"
              value={(
                (userData.activeUsers / userData.totalUsers) *
                100
              ).toFixed(1)}
              valueStyle={{ color: '#faad14' }}
              suffix="%"
            />
            <Statistic
              title="人均任务数"
              value={userData.averageTasksPerUser.toFixed(1)}
              valueStyle={{ color: '#722ed1' }}
              precision={1}
            />
          </div>
        </Card>
      </div>

      {/* 用户排名列表 */}
      <Card
        title="用户使用排名"
        extra={
          <span style={{ color: '#666', fontSize: '12px' }}>
            时间范围: {timePeriod}
          </span>
        }
      >
        <List
          dataSource={userData.topUsers}
          renderItem={(user, index) => {
            const usagePercentage = calculateUsagePercentage(
              user,
              userData.topUsers,
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
                        {user.userName}
                      </span>
                      <span style={{ color: '#666', fontSize: '12px' }}>
                        常用GPU: {user.favoriteGpu || 'N/A'}
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
                      <span>任务数: {user.totalTasks}</span>
                      <span>
                        总运行时间: {formatRuntime(user.totalRuntime)}
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
                      <span>常用项目: {user.favoriteProject || 'N/A'}</span>
                      <span>
                        平均运行时间: {formatRuntime(user.averageRuntime)}
                      </span>
                    </div>

                    <Progress
                      percent={usagePercentage}
                      size="small"
                      strokeColor={
                        usagePercentage > 15
                          ? '#f50'
                          : usagePercentage > 10
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

      {/* 用户时间占比分布 */}
      <Card title="用户时间占比分布" style={{ marginTop: 24 }}>
        <div style={{ height: 400 }}>
          <Pie {...userTimePieConfig} />
        </div>
      </Card>
    </div>
  );
};

export default UserStatistics;
