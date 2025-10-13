import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CodeOutlined,
  ConsoleSqlOutlined,
  CopyOutlined,
  DownOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Progress,
  Space,
  Statistic,
  Tag,
  Tooltip,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';

import {
  getAllProxyServers,
  getProxyStatus,
  triggerHealthCheck,
} from '@/services/group_center/proxyManagement';
import { GetIsDarkMode } from '@/utils/AntD5/AntD5DarkMode';
import { copyToClipboardPromise } from '@/utils/System/Clipboard';
import {
  ControlledMenu as ContextMenu,
  MenuDivider as ContextMenuDivider,
  MenuItem as ContextMenuItem,
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
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
  const [messageApi, contextHolder] = message.useMessage();

  // 右键菜单状态
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuAnchorPoint, setContextMenuAnchorPoint] = useState({
    x: 0,
    y: 0,
  });
  const [selectedServer, setSelectedServer] =
    useState<API.ProxyServerInfo | null>(null);

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
    // 如果服务器被禁用，显示禁用标签
    if (!server.enable) {
      const disabledTag = (
        <Tag color="default" icon={<CloseCircleOutlined />}>
          禁用
        </Tag>
      );

      // 如果有最后检查时间，添加Tooltip显示
      if (server.lastCheckTime) {
        return (
          <Tooltip
            title={`最后检查: ${formatTime(server.lastCheckTime)}`}
            color="rgba(0, 0, 0, 0.75)"
          >
            {disabledTag}
          </Tooltip>
        );
      }

      return disabledTag;
    }

    // 服务器启用时的状态标签
    const statusTag = server.isAvailable ? (
      <Tag color="green" icon={<CheckCircleOutlined />}>
        在线
      </Tag>
    ) : (
      <Tag color="red" icon={<CloseCircleOutlined />}>
        离线
      </Tag>
    );

    // 如果有最后检查时间，添加Tooltip显示
    if (server.lastCheckTime) {
      return (
        <Tooltip
          title={`最后检查: ${formatTime(server.lastCheckTime)}`}
          color="rgba(0, 0, 0, 0.75)"
        >
          {statusTag}
        </Tooltip>
      );
    }

    return statusTag;
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

  // 生成Bash代理命令
  const generateBashProxyCommand = (server: API.ProxyServerInfo): string => {
    const proxyUrl = `http://${server.host}:${server.port}`;
    return `export http_proxy=${proxyUrl}\nexport https_proxy=${proxyUrl}\nexport HTTP_PROXY=${proxyUrl}\nexport HTTPS_PROXY=${proxyUrl}`;
  };

  // 生成PowerShell代理命令
  const generatePowerShellProxyCommand = (
    server: API.ProxyServerInfo,
  ): string => {
    const proxyUrl = `http://${server.host}:${server.port}`;
    return `$env:http_proxy="${proxyUrl}"\n$env:https_proxy="${proxyUrl}"\n$env:HTTP_PROXY="${proxyUrl}"\n$env:HTTPS_PROXY="${proxyUrl}"`;
  };

  // 复制Bash代理命令
  const handleCopyBashCommand = async () => {
    if (!selectedServer) return;

    const command = generateBashProxyCommand(selectedServer);
    try {
      await copyToClipboardPromise(command);
      messageApi.open({
        type: 'success',
        content: 'Bash代理命令已复制到剪贴板',
      });
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '复制失败',
      });
    }
    setContextMenuOpen(false);
  };

  // 复制PowerShell代理命令
  const handleCopyPowerShellCommand = async () => {
    if (!selectedServer) return;

    const command = generatePowerShellProxyCommand(selectedServer);
    try {
      await copyToClipboardPromise(command);
      messageApi.open({
        type: 'success',
        content: 'PowerShell代理命令已复制到剪贴板',
      });
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '复制失败',
      });
    }
    setContextMenuOpen(false);
  };

  // 获取卡片样式类名
  const getCardClassName = (server: API.ProxyServerInfo) => {
    const baseClass = styles.proxyCard;
    if (!server.enable) {
      return `${baseClass} ${styles.disabled}`;
    }
    if (server.isAvailable) {
      return `${baseClass} ${styles.available}`;
    }
    return `${baseClass} ${styles.unavailable}`;
  };

  // 上拉菜单项
  const getMoreMenuItems = (server: API.ProxyServerInfo) => [
    {
      key: '1',
      label: (
        <Space>
          <ConsoleSqlOutlined />
          复制为Bash代理服务器
        </Space>
      ),
      onClick: () => {
        const command = generateBashProxyCommand(server);
        copyToClipboardPromise(command)
          .then(() => {
            messageApi.open({
              type: 'success',
              content: 'Bash代理命令已复制到剪贴板',
            });
          })
          .catch(() => {
            messageApi.open({
              type: 'error',
              content: '复制失败',
            });
          });
      },
    },
    {
      key: '2',
      label: (
        <Space>
          <CodeOutlined />
          复制为PowerShell代理服务器
        </Space>
      ),
      onClick: () => {
        const command = generatePowerShellProxyCommand(server);
        copyToClipboardPromise(command)
          .then(() => {
            messageApi.open({
              type: 'success',
              content: 'PowerShell代理命令已复制到剪贴板',
            });
          })
          .catch(() => {
            messageApi.open({
              type: 'error',
              content: '复制失败',
            });
          });
      },
    },
  ];

  const MoreMenu = ({ server }: { server: API.ProxyServerInfo }) => (
    <Dropdown menu={{ items: getMoreMenuItems(server) }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );

  const isDark = GetIsDarkMode();

  return (
    <>
      {contextHolder}
      <ContextMenu
        anchorPoint={contextMenuAnchorPoint}
        state={isContextMenuOpen ? 'open' : 'closed'}
        menuStyle={{
          zIndex: 1000,
        }}
        theming={isDark ? 'dark' : undefined}
        direction="right"
        onClose={() => setContextMenuOpen(false)}
      >
        <ContextMenuItem disabled>
          <Space>
            <CopyOutlined />
            {selectedServer?.name}
          </Space>
        </ContextMenuItem>
        <ContextMenuDivider />
        <ContextMenuItem onClick={handleCopyBashCommand}>
          <Space>
            <ConsoleSqlOutlined />
            复制"{selectedServer?.name}"为Bash代理服务器
          </Space>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleCopyPowerShellCommand}>
          <Space>
            <CodeOutlined />
            复制"{selectedServer?.name}"为PowerShell代理服务器
          </Space>
        </ContextMenuItem>
      </ContextMenu>

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
                    color: getResponseTimeColor(
                      proxyStatus.averageResponseTime,
                    ),
                  }}
                />
              )}
            </Space>
          </div>
        )}

        {/* 代理服务器卡片列表 */}
        <div className={styles.proxyCardsContainer}>
          {proxyServers.map((server) => (
            <Card
              key={server.nameEng}
              className={getCardClassName(server)}
              size="small"
              title={
                <div className={styles.cardHeader}>
                  <span className={styles.serverName}>{server.name}</span>
                  {getStatusTag(server)}
                </div>
              }
              extra={<MoreMenu server={server} />}
              onContextMenu={(e) => {
                if (
                  typeof document.hasFocus === 'function' &&
                  !document.hasFocus()
                )
                  return;

                e.preventDefault();
                setSelectedServer(server);
                setContextMenuAnchorPoint({ x: e.clientX, y: e.clientY });
                setContextMenuOpen(true);
              }}
            >
              <div className={styles.cardContent}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>地址:</span>
                  <span className={styles.detailValue}>
                    {server.host}:{server.port}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>类型:</span>
                  <span className={styles.detailValue}>{server.type}</span>
                </div>
                {server.responseTime && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>响应时间:</span>
                    <span className={styles.detailValue}>
                      <Tag color={getResponseTimeColor(server.responseTime)}>
                        {server.responseTime}ms
                      </Tag>
                    </span>
                  </div>
                )}
                {server.lastError && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>错误信息:</span>
                    <span
                      className={styles.detailValue}
                      style={{ color: '#ff4d4f' }}
                    >
                      {server.lastError}
                    </span>
                  </div>
                )}

                {/* 成功率进度条 */}
                <div className={styles.successRate}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>成功率:</span>
                    <span className={styles.detailValue}>
                      {parseSuccessRate(server.successRate).toFixed(2)}%
                    </span>
                  </div>
                  <Progress
                    percent={parseSuccessRate(server.successRate)}
                    size="small"
                    strokeColor={
                      parseSuccessRate(server.successRate) > 90
                        ? '#52c41a'
                        : parseSuccessRate(server.successRate) > 70
                          ? '#faad14'
                          : '#ff4d4f'
                    }
                    showInfo={false}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </>
  );
};

export default ProxyMonitor;
