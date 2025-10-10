import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, Card, Space, Statistic, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';

import {
  getAllMachineStatus,
  getMachineStatusSummary,
} from '@/services/group_center/machineStatus';
import styles from './MachineStatusMonitor.less';

interface MachineStatusMonitorProps {
  refreshInterval?: number;
}

const MachineStatusMonitor: React.FC<MachineStatusMonitorProps> = ({
  refreshInterval = 30000,
}) => {
  const [machineStatus, setMachineStatus] = useState<
    API.MachineStatusResponse[]
  >([]);
  const [statusSummary, setStatusSummary] = useState<Record<
    string,
    any
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchMachineData = async () => {
    setLoading(true);
    try {
      const [statusResponse, summaryResponse] = await Promise.all([
        getAllMachineStatus(),
        getMachineStatusSummary(),
      ]);

      setMachineStatus(statusResponse || []);
      setStatusSummary(summaryResponse || {});

      setLastUpdate(new Date());
    } catch (error) {
      console.error('获取机器状态数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachineData();

    const interval = setInterval(fetchMachineData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getPingStatusTag = (machine: API.MachineStatusResponse) => {
    if (machine.pingStatus) {
      return (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          Ping正常
        </Tag>
      );
    }
    return (
      <Tag color="red" icon={<CloseCircleOutlined />}>
        Ping失败
      </Tag>
    );
  };

  const getAgentStatusTag = (machine: API.MachineStatusResponse) => {
    if (machine.agentStatus) {
      return (
        <Tag color="blue" icon={<CheckCircleOutlined />}>
          Agent在线
        </Tag>
      );
    }
    return (
      <Tag color="orange" icon={<CloseCircleOutlined />}>
        Agent离线
      </Tag>
    );
  };

  // const getGpuTag = (machine: API.MachineStatusResponse) => {
  //   if (machine.isGpu) {
  //     return (
  //       <Tag color="purple" icon={<DesktopOutlined />}>
  //         GPU服务器
  //       </Tag>
  //     );
  //   }
  //   return <Tag color="default">普通服务器</Tag>;
  // };

  const formatTime = (timestamp?: number) => {
    if (!timestamp || timestamp <= 0) {
      return '未知';
    }

    // Java时间戳是毫秒级的，直接使用
    try {
      return new Date(timestamp).toLocaleString('zh-CN');
    } catch (error) {
      console.error('时间戳格式化错误:', timestamp, error);
      return '格式错误';
    }
  };

  const getMachineStatusColor = (machine: API.MachineStatusResponse) => {
    if (machine.pingStatus && machine.agentStatus) {
      return 'success';
    } else if (machine.pingStatus && !machine.agentStatus) {
      return 'warning';
    } else {
      return 'error';
    }
  };

  return (
    <Card
      title="GPU服务器状态监视"
      loading={loading}
      extra={
        <Space>
          <Tooltip title="刷新数据">
            <Button
              icon={<ReloadOutlined />}
              size="small"
              onClick={fetchMachineData}
            >
              刷新
            </Button>
          </Tooltip>
          {lastUpdate && (
            <span style={{ fontSize: '12px', color: '#666' }}>
              最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}
            </span>
          )}
        </Space>
      }
      className={styles.machineMonitor}
    >
      {/* 状态摘要 */}
      {statusSummary && (
        <div className={styles.statusSummary}>
          <Space size="large" wrap>
            <Statistic
              title="总服务器数"
              value={machineStatus.length}
              valueStyle={{ color: '#1890ff' }}
            />
            <Statistic
              title="在线服务器"
              value={machineStatus.filter((m) => m.pingStatus).length}
              valueStyle={{ color: '#52c41a' }}
            />
            <Statistic
              title="Agent在线"
              value={machineStatus.filter((m) => m.agentStatus).length}
              valueStyle={{ color: '#722ed1' }}
            />
            <Statistic
              title="GPU服务器"
              value={machineStatus.filter((m) => m.isGpu).length}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Space>
        </div>
      )}

      {/* 服务器卡片容器 */}
      <div className={styles.machineCardsContainer}>
        {machineStatus.map((machine) => (
          <Card
            key={machine.name}
            size="small"
            className={`${styles.machineCard} ${styles[getMachineStatusColor(machine)]}`}
          >
            <div className={styles.cardHeader}>
              <span className={styles.machineName}>{machine.name}</span>
              <span className={styles.machinePosition}>{machine.position}</span>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.statusTags}>
                <Space size="small" wrap>
                  {getPingStatusTag(machine)}
                  {getAgentStatusTag(machine)}
                  {/* {getGpuTag(machine)} */}
                </Space>
              </div>

              <div className={styles.machineDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>最后Ping:</span>
                  <span className={styles.detailValue}>
                    {machine.lastPingTimeFormatted ||
                      formatTime(machine.lastPingTime)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>最后心跳:</span>
                  <span className={styles.detailValue}>
                    {machine.lastHeartbeatTimeFormatted ||
                      formatTime(machine.lastHeartbeatTime)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default MachineStatusMonitor;
