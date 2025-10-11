import { getUserActivityTimeDistribution } from '@/services/group_center/dashboardStatistics';
import { Alert, Card, Col, Empty, Row, Spin, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';

interface UserActivityTimeChartProps {
  timePeriod: string;
}

interface UserActivityTimeData {
  userName: string;
  earliestStartTime: string;
  latestStartTime: string;
  activityTimeRange: string;
  totalTasks: number;
  totalRuntime: number;
}

interface UserActivityTimeResponse {
  users: UserActivityTimeData[];
  totalUsers: number;
  refreshTime: string;
}

const UserActivityTimeChart: React.FC<UserActivityTimeChartProps> = ({
  timePeriod,
}) => {
  const [activityData, setActivityData] =
    useState<UserActivityTimeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivityTimeData();
  }, [timePeriod]);

  const fetchActivityTimeData = async () => {
    try {
      console.log(
        'UserActivityTimeChart: Starting to fetch user activity time data, timePeriod:',
        timePeriod,
      );
      setLoading(true);
      setError(null);

      console.log(
        'UserActivityTimeChart: Calling getUserActivityTimeDistribution API with params:',
        { timePeriod },
      );
      const response = await getUserActivityTimeDistribution({ timePeriod });
      console.log('UserActivityTimeChart: API response received:', response);

      if (response.isSucceed && response.result) {
        console.log(
          'UserActivityTimeChart: API call successful, processing activity time data',
        );
        const result = response.result as UserActivityTimeResponse;
        console.log('UserActivityTimeChart: Raw activity time data:', result);

        setActivityData(result);
        console.log(
          'UserActivityTimeChart: Activity time data set successfully',
        );
      } else {
        console.error(
          'UserActivityTimeChart: API call failed - response not successful:',
          response,
        );
        setError('获取用户活动时间数据失败');
      }
    } catch (err) {
      console.error(
        'UserActivityTimeChart: Failed to fetch activity time data:',
        err,
      );
      setError('网络错误，请稍后重试');
    } finally {
      console.log('UserActivityTimeChart: Loading state set to false');
      setLoading(false);
    }
  };

  const formatRuntime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // 解析时间区间，处理跨天情况
  const parseTimeRange = (timeRange: string) => {
    console.log('Parsing time range:', timeRange);
    const [startTime, endTime] = timeRange.split('-');
    console.log('Parsed startTime:', startTime, 'endTime:', endTime);

    // 处理包含"次日"的情况
    const cleanEndTime = endTime.replace('次日', '').trim();
    console.log('Cleaned endTime:', cleanEndTime);

    return { startTime, endTime: cleanEndTime };
  };

  // 计算跨天时间段的显示逻辑
  const isCrossDay = (timeRange: string): boolean => {
    // 如果包含"次日"关键词，直接判断为跨天
    if (timeRange.includes('次日')) {
      console.log('Cross day detected by "次日" keyword');
      return true;
    }

    const { startTime, endTime } = parseTimeRange(timeRange);
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const result = startHour > endHour; // 如果开始时间的小时大于结束时间的小时，说明跨天
    console.log(
      'Cross day check result:',
      result,
      'startHour:',
      startHour,
      'endHour:',
      endHour,
    );
    return result;
  };

  // 准备时间区间图数据
  const getTimeRangeChartData = () => {
    if (!activityData) return [];

    return activityData.users.map((user, index) => {
      const { startTime, endTime } = parseTimeRange(user.activityTimeRange);
      const crossDay = isCrossDay(user.activityTimeRange);

      return {
        user: user.userName,
        startTime,
        endTime,
        crossDay,
        totalTasks: user.totalTasks,
        totalRuntime: user.totalRuntime,
        index,
      };
    });
  };

  // 计算统计信息
  const calculateStats = () => {
    if (!activityData) return null;

    const totalTasks = activityData.users.reduce(
      (sum, user) => sum + user.totalTasks,
      0,
    );
    const totalRuntime = activityData.users.reduce(
      (sum, user) => sum + user.totalRuntime,
      0,
    );
    const crossDayUsers = activityData.users.filter((user) =>
      isCrossDay(user.activityTimeRange),
    ).length;

    return {
      totalTasks,
      totalRuntime,
      crossDayUsers,
      averageTasksPerUser:
        activityData.totalUsers > 0 ? totalTasks / activityData.totalUsers : 0,
    };
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>加载用户活动时间数据...</div>
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
          <a onClick={fetchActivityTimeData} style={{ color: '#1890ff' }}>
            重试
          </a>
        }
      />
    );
  }

  if (!activityData || activityData.users.length === 0) {
    return (
      <Empty
        description="暂无用户活动时间数据"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const stats = calculateStats();
  const chartData = getTimeRangeChartData();

  return (
    <div>
      {/* 概览统计 */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="总用户数"
                value={activityData.totalUsers}
                valueStyle={{ color: '#1890ff' }}
                suffix="人"
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="总任务数"
                value={stats.totalTasks}
                valueStyle={{ color: '#52c41a' }}
                suffix="个"
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="跨天用户数"
                value={stats.crossDayUsers}
                valueStyle={{ color: '#faad14' }}
                suffix="人"
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="人均任务数"
                value={stats.averageTasksPerUser.toFixed(1)}
                valueStyle={{ color: '#722ed1' }}
                precision={1}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 合并的用户活动时间分布 - 进度条可视化 */}
      <Card
        title="用户活动时间分布"
        extra={
          <span style={{ color: '#666', fontSize: '12px' }}>
            时间范围: {timePeriod} | 数据刷新: {activityData.refreshTime}
          </span>
        }
      >
        <div
          style={{
            maxHeight: '600px',
            overflowY: 'auto',
            minHeight: '400px',
          }}
        >
          {chartData.map((item, index) => {
            const startHour = parseInt(item.startTime.split(':')[0]);
            const startMinute = parseInt(item.startTime.split(':')[1]);
            const endHour = parseInt(item.endTime.split(':')[0]);
            const endMinute = parseInt(item.endTime.split(':')[1]);

            // 计算开始和结束位置（百分比）
            const startPosition =
              ((startHour * 60 + startMinute) / (24 * 60)) * 100;
            const endPosition = ((endHour * 60 + endMinute) / (24 * 60)) * 100;

            return (
              <Card
                key={item.user}
                size="small"
                style={{
                  marginBottom: 20,
                  borderLeft: item.crossDay
                    ? '4px solid #ff4d4f'
                    : '4px solid #52c41a',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                bodyStyle={{ padding: '16px' }}
                hoverable
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.transform = '';
                }}
              >
                <Row gutter={16} align="middle">
                  <Col xs={24} sm={4}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '14px',
                        marginBottom: 8,
                      }}
                    >
                      {item.user}
                    </div>
                    {item.crossDay && (
                      <div style={{ fontSize: '12px', color: '#ff4d4f' }}>
                        ⚠️ 跨天活动
                      </div>
                    )}
                  </Col>

                  <Col xs={24} sm={14}>
                    {/* 时间轴进度条 */}
                    <div
                      style={{
                        position: 'relative',
                        height: 60,
                        marginBottom: 8,
                      }}
                    >
                      {/* 时间轴背景 */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: 0,
                          right: 0,
                          height: 10,
                          backgroundColor: '#f0f0f0',
                          borderRadius: 5,
                          transform: 'translateY(-50%)',
                        }}
                      />

                      {/* 活动时间进度条 */}
                      {item.crossDay ? (
                        // 跨天情况：两段染色
                        <>
                          {/* 第一段：从开始时间到24点 */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: `${startPosition}%`,
                              right: 0,
                              height: 10,
                              backgroundColor: '#ff4d4f',
                              borderRadius: '0 5px 5px 0',
                              transform: 'translateY(-50%)',
                              opacity: 0.8,
                            }}
                          />
                          {/* 第二段：从0点到结束时间 */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: 0,
                              right: `${100 - endPosition}%`,
                              height: 10,
                              backgroundColor: '#ff4d4f',
                              borderRadius: '5px 0 0 5px',
                              transform: 'translateY(-50%)',
                              opacity: 0.8,
                            }}
                          />
                        </>
                      ) : (
                        // 不跨天情况：一段染色
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: `${startPosition}%`,
                            right: `${100 - endPosition}%`,
                            height: 10,
                            backgroundColor: '#1890ff',
                            borderRadius: 5,
                            transform: 'translateY(-50%)',
                            opacity: 0.8,
                          }}
                        />
                      )}

                      {/* 时间刻度 */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          fontSize: '10px',
                          color: '#666',
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: 8,
                        }}
                      >
                        {[0, 6, 12, 18, 24].map((hour) => (
                          <span key={hour}>{hour}:00</span>
                        ))}
                      </div>

                      {/* 开始时间标记 */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: `${startPosition}%`,
                          width: 3,
                          height: 20,
                          backgroundColor: item.crossDay
                            ? '#ff4d4f'
                            : '#1890ff',
                          transform: 'translate(-50%, -50%)',
                          borderRadius: 1.5,
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          left: `${startPosition}%`,
                          transform: 'translateX(-50%)',
                          fontSize: '11px',
                          color: item.crossDay ? '#ff4d4f' : '#1890ff',
                          whiteSpace: 'nowrap',
                          fontWeight: 'bold',
                          backgroundColor: 'white',
                          padding: '2px 4px',
                          borderRadius: 2,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                      >
                        {item.startTime}
                      </div>

                      {/* 结束时间标记 */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: `${endPosition}%`,
                          width: 3,
                          height: 20,
                          backgroundColor: item.crossDay
                            ? '#ff4d4f'
                            : '#1890ff',
                          transform: 'translate(-50%, -50%)',
                          borderRadius: 1.5,
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          left: `${endPosition}%`,
                          transform: 'translateX(-50%)',
                          fontSize: '11px',
                          color: item.crossDay ? '#ff4d4f' : '#1890ff',
                          whiteSpace: 'nowrap',
                          fontWeight: 'bold',
                          backgroundColor: 'white',
                          padding: '2px 4px',
                          borderRadius: 2,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                      >
                        {item.endTime}
                      </div>
                    </div>

                    {/* 活动区间说明 */}
                    <div
                      style={{ fontSize: '12px', color: '#666', marginTop: 32 }}
                    >
                      {item.crossDay ? (
                        <span>
                          跨天活动: {item.startTime} → 次日 {item.endTime}
                        </span>
                      ) : (
                        <span>
                          活动区间: {item.startTime} - {item.endTime}
                        </span>
                      )}
                    </div>
                  </Col>

                  <Col xs={24} sm={6}>
                    <Row gutter={8}>
                      <Col span={12}>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#52c41a',
                            }}
                          >
                            {item.totalTasks}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            任务数
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#1890ff',
                            }}
                          >
                            {formatRuntime(item.totalRuntime)}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            运行时间
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default UserActivityTimeChart;
