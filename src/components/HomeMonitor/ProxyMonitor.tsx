import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  List,
  Progress,
  Space,
  Statistic,
  Tag,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';

import {
  getAllProxyServers,
  getProxyStatus,
  triggerHealthCheck,
} from '@/services/group_center/proxyManagement';
import styles from './ProxyMonitor.less';

interface ProxyMonitorProps {
  refreshInterval?: number;
}

const ProxyMonitor: React.FC<ProxyMonitorProps> = ({
  refreshInterval = 30000,
}) => {
  const [proxyServers, setProxyServers] = useState<API.ProxyServerInfo[]>([]);
  const [proxyStatus, setProxyStatus] = useState<API.ProxyStatusInfo | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchProxyData = async () => {
    setLoading(true);
    try {
      const [serversResponse, statusResponse] = await Promise.all([
        getAllProxyServers(),
        getProxyStatus(),
      ]);

      if (serversResponse.success) {
        setProxyServers(serversResponse.servers || []);
      }

      if (statusResponse.success) {
        setProxyStatus(statusResponse.status);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('获取代理服务器数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHealthCheck = async () => {
    try {
      await triggerHealthCheck();
      // 健康检查后重新获取数据
      setTimeout(fetchProxyData, 2000);
    } catch (error) {
      console.error('健康检查失败:', error);
    }
  };

  useEffect(() => {
    fetchProxyData();

    const interval = setInterval(fetchProxyData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getStatusTag = (server: API.ProxyServerInfo) => {
    if (server.isAvailable) {
      return (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          在线
        </Tag>
      );
    }
    return (
      <Tag color="red" icon={<CloseCircleOutlined />}>
        离线
      </Tag>
    );
  };

  const getResponseTimeColor = (time?: number) => {
    if (!time) return 'default';
    if (time < 100) return 'green';
    if (time < 500) return 'orange';
    return 'red';
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '未知';
    // Java时间戳是毫秒级的，直接使用
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const parseSuccessRate = (rate: string): number => {
    // 去掉百分号并转换为数字，保留两位小数
    const numericRate = parseFloat(rate.replace('%', ''));
    return isNaN(numericRate) ? 0 : parseFloat(numericRate.toFixed(2));
  };

  return (
    <Card
      title="代理服务器监视"
      loading={loading}
      extra={
        <Space>
          <Tooltip title="手动健康检查">
            <Button
              icon={<ReloadOutlined />}
              size="small"
              onClick={handleHealthCheck}
            >
              健康检查
            </Button>
          </Tooltip>
          {lastUpdate && (
            <span style={{ fontSize: '12px', color: '#666' }}>
              最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}
            </span>
          )}
        </Space>
      }
      className={styles.proxyMonitor}
    >
      {/* 状态摘要 */}
      {proxyStatus && (
        <div className={styles.statusSummary}>
          <Space size="large">
            <Statistic
              title="总代理数"
              value={proxyStatus.totalProxies}
              valueStyle={{ color: '#1890ff' }}
            />
            <Statistic
              title="可用代理"
              value={proxyStatus.availableProxies}
              valueStyle={{ color: '#52c41a' }}
            />
            <Statistic
              title="可用率"
              value={proxyStatus.availabilityRate}
              valueStyle={{ color: '#faad14' }}
            />
            {proxyStatus.averageResponseTime && (
              <Statistic
                title="平均响应时间"
                value={proxyStatus.averageResponseTime}
                suffix="ms"
                valueStyle={{
                  color: getResponseTimeColor(proxyStatus.averageResponseTime),
                }}
              />
            )}
          </Space>
        </div>
      )}

      {/* 代理服务器列表 */}
      <List
        dataSource={proxyServers}
        renderItem={(server) => (
          <List.Item>
            <div className={styles.serverItem}>
              <div className={styles.serverHeader}>
                <Space>
                  <span className={styles.serverName}>{server.name}</span>
                  {getStatusTag(server)}
                  <Tag color={server.enable ? 'blue' : 'default'}>
                    {server.enable ? '启用' : '禁用'}
                  </Tag>
                </Space>
                <Space>
                  {server.responseTime && (
                    <Tag color={getResponseTimeColor(server.responseTime)}>
                      {server.responseTime}ms
                    </Tag>
                  )}
                  <span className={styles.successRate}>
                    成功率: {parseSuccessRate(server.successRate).toFixed(2)}%
                  </span>
                </Space>
              </div>

              <div className={styles.serverDetails}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: '100%' }}
                >
                  <div>
                    <span className={styles.detailLabel}>地址:</span>
                    {server.host}:{server.port}
                  </div>
                  <div>
                    <span className={styles.detailLabel}>类型:</span>
                    {server.type}
                  </div>
                  <div>
                    <span className={styles.detailLabel}>优先级:</span>
                    {server.priority}
                  </div>
                  {server.lastCheckTime && (
                    <div>
                      <span className={styles.detailLabel}>最后检查:</span>
                      {formatTime(server.lastCheckTime)}
                    </div>
                  )}
                  {server.lastError && (
                    <div>
                      <span className={styles.detailLabel}>错误信息:</span>
                      <span style={{ color: '#ff4d4f' }}>
                        {server.lastError}
                      </span>
                    </div>
                  )}
                </Space>
              </div>

              {/* 成功率进度条 */}
              <Progress
                percent={parseSuccessRate(server.successRate)} // 转换为数字并保留两位小数
                size="small"
                strokeColor={
                  parseSuccessRate(server.successRate) > 90 // 比较数字
                    ? '#52c41a'
                    : parseSuccessRate(server.successRate) > 70
                      ? '#faad14'
                      : '#ff4d4f'
                }
                showInfo={false}
              />
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ProxyMonitor;
