import { useGpuTaskFilterCardStore } from '@/data/store/modules/filter/GpuTaskFilterCard';
import { getGpuCount } from '@/services/agent/GpuInfo';
import { getMachineSystemInfo } from '@/services/agent/MachineInfo';
import { updateNviNotify } from '@/services/agent/Program';
import { convertFromMBToGB, getMemoryString } from '@/utils/Convert/MemorySize';
import { Card, Tooltip, message, notification, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import GpuDevice from './GpuDevice';

import { SyncOutlined } from '@ant-design/icons';
import {
  ControlledMenu as ContextMenu,
  MenuDivider as ContextMenuDivider,
  MenuItem as ContextMenuItem,
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';

import styles from './GpuDashboard.less';

interface Props {
  name: string;
  apiUrl: string;
}

const useGpuCountState = (apiUrl: string) => {
  const [gpuCountState, setGpuCountState] = useState<number>(0);

  useEffect(() => {
    getGpuCount(apiUrl)
      .then((data) => {
        const count = data?.result || 0;
        console.log('Gpu Count:', count);
        setGpuCountState(count);
      })
      .catch((error: any) => {
        console.log('error:', error);
      });
  }, [apiUrl]);

  return gpuCountState;
};

const useMachineSystemInfo = (apiUrl: string) => {
  const [machineSystemInfo, setMachineSystemInfo] =
    useState<API.MachineSystemInfo>();

  const updateMachineSystemInfo = () => {
    getMachineSystemInfo(apiUrl)
      .then((data) => {
        setMachineSystemInfo(data);
      })
      .catch((error: any) => {
        console.log('Error(getMachineSystemInfo):', error);
      });
  };

  // 初始执行一次
  useEffect(() => {
    updateMachineSystemInfo();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateMachineSystemInfo();
    }, 5000); // 每隔5秒执行一次

    return () => clearInterval(intervalId);
  }, [apiUrl]);

  return machineSystemInfo;
};

const GpuDashboard: React.FC<Props> = (props) => {
  const { name, apiUrl } = props;
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();

  // 右键菜单状态
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuAnchorPoint, setContextMenuAnchorPoint] = useState({
    x: 0,
    y: 0,
  });

  const gpuCountState = useGpuCountState(apiUrl);
  const machineSystemInfo = useMachineSystemInfo(apiUrl);
  const gpuIdFilter = useGpuTaskFilterCardStore((state) => state.gpuIdFilter);

  // 调试日志：显示筛选状态
  console.log('GpuDashboard - Filter state:', {
    enabled: gpuIdFilter.enabled,
    gpuIds: gpuIdFilter.gpuIds,
    range: gpuIdFilter.range,
    gpuCount: gpuCountState,
  });

  // 检查GPU卡是否应该显示（仅按卡号筛选）
  const shouldShowGpuCard = (gpuIndex: number): boolean => {
    // 如果按卡号筛选未启用，显示所有卡
    if (!gpuIdFilter.enabled) {
      return true;
    }

    // 检查范围筛选
    if (gpuIdFilter.range) {
      const { min, max } = gpuIdFilter.range;
      if (gpuIndex >= min && gpuIndex <= max) {
        return true;
      }
    }

    // 检查具体卡号筛选
    if (gpuIdFilter.gpuIds.length > 0) {
      if (gpuIdFilter.gpuIds.includes(gpuIndex)) {
        return true;
      }
    }

    // 如果既没有范围也没有具体卡号，显示所有卡
    if (!gpuIdFilter.range && gpuIdFilter.gpuIds.length === 0) {
      return true;
    }

    return false;
  };

  const gpuInfoContent = () => {
    if (gpuCountState === 0) {
      return (
        <div className={styles.noGpuDiv}>
          <p>未检测到GPU?!</p>
          <p>
            请报告<b>管理员</b>！
          </p>
        </div>
      );
    }

    // 过滤要显示的GPU卡
    const visibleGpuIndices = Array.from(
      { length: gpuCountState },
      (_, i) => i,
    ).filter(shouldShowGpuCard);

    // 调试日志：显示可见的GPU卡
    console.log('GpuDashboard - Visible GPU indices:', visibleGpuIndices);

    if (visibleGpuIndices.length === 0) {
      return (
        <div className={styles.noGpuDiv}>
          <p>没有匹配的GPU卡</p>
          <p>请调整按卡筛选设置</p>
        </div>
      );
    }

    return (
      <div className={styles.gpuInfoList}>
        {visibleGpuIndices.map((gpuIndex) => (
          <div key={gpuIndex} className={styles.gpuInfoItem}>
            <GpuDevice apiUrl={apiUrl} gpuIndex={gpuIndex} />
          </div>
        ))}
      </div>
    );
  };

  // 构建内存信息提示内容
  const memoryTooltipContent = machineSystemInfo ? (
    <div style={{ minWidth: 200, padding: '16px 12px' }}>
      <div
        style={{
          marginBottom: 16,
          fontWeight: 'bold',
          fontSize: '14px',
          textAlign: 'center',
          color: token.colorText,
        }}
      >
        系统内存信息
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* 物理内存进度条 */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontWeight: 500,
                fontSize: '13px',
                color: token.colorTextSecondary,
              }}
            >
              物理内存
            </span>
            <span
              style={{
                fontWeight: 'bold',
                fontSize: '13px',
                color: token.colorPrimary,
              }}
            >
              {Math.round(
                (machineSystemInfo.memoryPhysicUsedMb /
                  machineSystemInfo.memoryPhysicTotalMb) *
                  100,
              )}
              %
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: 8,
              backgroundColor: token.colorFillSecondary,
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: `${Math.round(
                  (machineSystemInfo.memoryPhysicUsedMb /
                    machineSystemInfo.memoryPhysicTotalMb) *
                    100,
                )}%`,
                height: '100%',
                backgroundColor:
                  Math.round(
                    (machineSystemInfo.memoryPhysicUsedMb /
                      machineSystemInfo.memoryPhysicTotalMb) *
                      100,
                  ) > 80
                    ? token.colorError
                    : Math.round(
                          (machineSystemInfo.memoryPhysicUsedMb /
                            machineSystemInfo.memoryPhysicTotalMb) *
                            100,
                        ) > 60
                      ? token.colorWarning
                      : token.colorPrimary,
                borderRadius: 4,
                transition: 'all 0.3s ease',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '11px', color: token.colorTextSecondary }}>
              {getMemoryString(
                convertFromMBToGB(machineSystemInfo.memoryPhysicUsedMb),
              )}{' '}
              /{' '}
              {getMemoryString(
                convertFromMBToGB(machineSystemInfo.memoryPhysicTotalMb),
              )}{' '}
              GB
            </span>
            <span style={{ fontSize: '11px', color: token.colorTextTertiary }}>
              可用:{' '}
              {getMemoryString(
                convertFromMBToGB(
                  machineSystemInfo.memoryPhysicTotalMb -
                    machineSystemInfo.memoryPhysicUsedMb,
                ),
              )}{' '}
              GB
            </span>
          </div>
        </div>

        {/* 虚拟内存进度条 */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontWeight: 500,
                fontSize: '13px',
                color: token.colorTextSecondary,
              }}
            >
              虚拟内存
            </span>
            <span
              style={{
                fontWeight: 'bold',
                fontSize: '13px',
                color: token.colorSuccess,
              }}
            >
              {Math.round(
                (machineSystemInfo.memorySwapUsedMb /
                  machineSystemInfo.memorySwapTotalMb) *
                  100,
              )}
              %
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: 8,
              backgroundColor: token.colorFillSecondary,
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: `${Math.round(
                  (machineSystemInfo.memorySwapUsedMb /
                    machineSystemInfo.memorySwapTotalMb) *
                    100,
                )}%`,
                height: '100%',
                backgroundColor:
                  Math.round(
                    (machineSystemInfo.memorySwapUsedMb /
                      machineSystemInfo.memorySwapTotalMb) *
                      100,
                  ) > 80
                    ? token.colorError
                    : Math.round(
                          (machineSystemInfo.memorySwapUsedMb /
                            machineSystemInfo.memorySwapTotalMb) *
                            100,
                        ) > 60
                      ? token.colorWarning
                      : token.colorSuccess,
                borderRadius: 4,
                transition: 'all 0.3s ease',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '11px', color: token.colorTextSecondary }}>
              {getMemoryString(
                convertFromMBToGB(machineSystemInfo.memorySwapUsedMb),
              )}{' '}
              /{' '}
              {getMemoryString(
                convertFromMBToGB(machineSystemInfo.memorySwapTotalMb),
              )}{' '}
              GB
            </span>
            <span style={{ fontSize: '11px', color: token.colorTextTertiary }}>
              可用:{' '}
              {getMemoryString(
                convertFromMBToGB(
                  machineSystemInfo.memorySwapTotalMb -
                    machineSystemInfo.memorySwapUsedMb,
                ),
              )}{' '}
              GB
            </span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      style={{
        minWidth: 160,
        padding: '12px',
        textAlign: 'center',
        color: token.colorText,
        fontSize: '12px',
      }}
    >
      正在加载内存信息...
    </div>
  );

  // 处理更新 nvi-notify
  const handleUpdateNviNotify = async () => {
    try {
      console.log(`Updating nvi-notify for machine: ${name}`);
      const response = await updateNviNotify(apiUrl);

      if (response.success) {
        notificationApi.success({
          message: 'nvi-notify 更新成功',
          description: `机器 ${name} 的 nvi-notify 已成功更新`,
          placement: 'topRight',
          duration: 0, // 0表示不会自动关闭，需要手动点击X
        });
        console.log('Update nvi-notify response:', response);
      } else {
        notificationApi.error({
          message: 'nvi-notify 更新失败',
          description: `机器 ${name} 的 nvi-notify 更新失败: ${response.message}`,
          placement: 'topRight',
          duration: 0,
        });
        console.error('Update nvi-notify failed:', response.message);
      }
    } catch (error) {
      console.error('Error updating nvi-notify:', error);
      notificationApi.error({
        message: 'nvi-notify 更新错误',
        description: `机器 ${name} 的 nvi-notify 更新过程中发生错误`,
        placement: 'topRight',
        duration: 0,
      });
    } finally {
      setContextMenuOpen(false);
    }
  };

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuAnchorPoint({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  };

  return (
    <div id={`device-${name}`}>
      {contextHolder}
      {notificationContextHolder}
      <ContextMenu
        anchorPoint={contextMenuAnchorPoint}
        state={isContextMenuOpen ? 'open' : 'closed'}
        menuStyle={{
          zIndex: 1000,
        }}
        theming={token.colorBgElevated === '#141414' ? 'dark' : undefined}
        direction="right"
        onClose={() => setContextMenuOpen(false)}
      >
        <ContextMenuItem disabled>{name}</ContextMenuItem>
        <ContextMenuDivider />
        <ContextMenuItem onClick={handleUpdateNviNotify}>
          <SyncOutlined style={{ marginRight: '8px' }} />
          Update nvi-notify
        </ContextMenuItem>
      </ContextMenu>

      <Card
        style={{
          marginBottom: 16,
          cursor: 'context-menu',
          backgroundColor: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
        styles={{ body: { padding: '12px 16px' } }}
        onContextMenu={handleContextMenu}
      >
        <Tooltip
          title={memoryTooltipContent}
          placement="top"
          color={token.colorBgElevated}
        >
          <h1 className={styles.title} style={{ cursor: 'help', margin: 0 }}>
            {name}
          </h1>
        </Tooltip>
      </Card>
      {gpuInfoContent()}
    </div>
  );
};

export default GpuDashboard;
