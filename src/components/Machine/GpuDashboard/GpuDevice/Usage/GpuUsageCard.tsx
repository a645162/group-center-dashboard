import DisableSelectDiv from '@/components/Public/Layout/DisableSelectDiv';
import LinerDividerLayout from '@/components/Public/Layout/LinerDividerLayout';
import { getGpuUsageInfo } from '@/services/agent/GpuInfo';
import { getMachineSystemInfo } from '@/services/agent/MachineInfo';
import { convertFromMBToGB, getMemoryString } from '@/utils/Convert/MemorySize';
import { green, orange, red } from '@ant-design/colors';
import { Card, Progress, Skeleton, Space, Tooltip, theme } from 'antd';
import React, { useEffect, useState } from 'react';

import styles from './GpuUsageCard.less';

interface Props {
  apiUrl: string;
  gpuIndex: number;
  shouldShowByGpuName?: (gpuName: string | undefined) => boolean;
}

const useGpuMemoryDetail = (gpuMemoryTotalMB: number, memoryUsage: number) => {
  const [gpuMemoryTotalGiB, setGpuMemoryTotalGiB] = useState(() =>
    convertFromMBToGB(gpuMemoryTotalMB),
  );
  const [gpuMemoryUsageGiB, setGpuMemoryUsageGiB] = useState(
    () => gpuMemoryTotalGiB * (memoryUsage / 100),
  );
  const [gpuMemoryFreeGiB, setGpuMemoryFreeGiB] = useState(
    () => gpuMemoryTotalGiB - gpuMemoryUsageGiB,
  );

  useEffect(() => {
    setGpuMemoryTotalGiB(convertFromMBToGB(gpuMemoryTotalMB));
  }, [gpuMemoryTotalMB]);

  useEffect(() => {
    setGpuMemoryUsageGiB(gpuMemoryTotalGiB * (memoryUsage / 100));
    setGpuMemoryFreeGiB(gpuMemoryTotalGiB - gpuMemoryUsageGiB);
  }, [gpuMemoryTotalGiB, memoryUsage]);

  // 返回三个 useState 的结果
  return { gpuMemoryTotalGiB, gpuMemoryUsageGiB, gpuMemoryFreeGiB };
};

const useGpuUsageInfo = (apiUrl: string, gpuIndex: number) => {
  const [gpuUsageInfo, setGpuUsageInfo] = useState<API.DashboardGpuUsageInfo>();

  const updateGpuUsageInfo = () => {
    getGpuUsageInfo(apiUrl, gpuIndex)
      .then((data) => {
        setGpuUsageInfo(data);
      })
      .catch((error: any) => {
        console.log('error:', error);
      });
  };

  // 初始执行一次
  useEffect(() => {
    updateGpuUsageInfo();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateGpuUsageInfo();
    }, 2000); // 每隔2秒执行一次

    return () => clearInterval(intervalId); // 在组件卸载时清除定时器
  }, [apiUrl]); // 依赖项数组包含apiUrl，当apiUrl发生变化时重新设置定时器

  return gpuUsageInfo;
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

const ProgressComponent = (percent: number) => {
  // 转换为整数
  let finalPercentage = Math.floor(percent);
  if (finalPercentage > 100) {
    finalPercentage = 100;
  }
  if (finalPercentage < 0) {
    finalPercentage = 0;
  }

  const calculateColorIndex = (
    percent: number,
    max: number = 8,
    min: number = 3,
  ) => {
    const maxValue = max > min ? max : min;
    const minValue = max > min ? min : max;

    return Math.floor(((maxValue - minValue) * percent) / 100 + minValue);
  };
  const computeColor = (percent: number) => {
    const threshold1 = 40,
      threshold2 = 80;
    if (percent < threshold1) {
      return green[calculateColorIndex(percent / threshold1, 8, 3)];
    } else if (percent >= threshold1 && percent < threshold2) {
      return orange[
        calculateColorIndex(
          (percent - threshold1) / (threshold2 - threshold1),
          8,
          5,
        )
      ];
    } else {
      return red[
        calculateColorIndex((percent - threshold2) / (100 - threshold2), 8, 5)
      ];
    }
  };

  const getPercentageString = (percent: number | undefined) => {
    if (percent === undefined) {
      return '0%';
    }

    return `${percent}`.padStart(2, '0') + '%';
  };

  // format = {(percent) => `${percent} Days`}
  return (
    <div className={styles.gpuUsagePercent}>
      <Progress
        percent={finalPercentage}
        steps={10}
        size="small"
        strokeColor={computeColor(finalPercentage)}
        format={(finalPercentage) => getPercentageString(finalPercentage)}
        showInfo={false}
      />
      <div className={styles.gpuUsagePercentText}>
        <div>{getPercentageString(finalPercentage)}</div>
      </div>
    </div>
  );
};

const GpuUsageCard: React.FC<Props> = (props) => {
  const { apiUrl, gpuIndex, shouldShowByGpuName } = props;
  const { token } = theme.useToken();

  const gpuUsageInfo = useGpuUsageInfo(apiUrl, gpuIndex);
  const machineSystemInfo = useMachineSystemInfo(apiUrl);

  const { gpuMemoryTotalGiB, gpuMemoryUsageGiB } = useGpuMemoryDetail(
    gpuUsageInfo?.gpuMemoryTotalMB || 0,
    gpuUsageInfo?.memoryUsage || 0,
  );

  // 检查是否应该显示此GPU卡（基于卡名筛选）
  const shouldShowCard = shouldShowByGpuName
    ? shouldShowByGpuName(gpuUsageInfo?.gpuName)
    : true;

  if (!gpuUsageInfo) {
    return (
      <div>
        <Card style={{ minWidth: 300 }}>
          <div>
            <Skeleton />
          </div>
        </Card>
      </div>
    );
  }

  // 如果不应该显示此卡，返回null
  if (!shouldShowCard) {
    return null;
  }

  const leftContainer = (
    gpuIndex: number,
    gpuUsageInfo: API.DashboardGpuUsageInfo,
  ) => {
    const gpuMemoryUsageFormatted = getMemoryString(gpuMemoryUsageGiB);
    const gpuMemoryTotalFormatted = getMemoryString(gpuMemoryTotalGiB);

    // 计算内存使用率
    const getMemoryUsagePercentage = (used: number, total: number) => {
      if (total === 0) return 0;
      return Math.round((used / total) * 100);
    };

    // 构建GPU信息提示内容
    const gpuTooltipContent = gpuUsageInfo ? (
      <div style={{ minWidth: 200 }}>
        <div
          style={{
            marginBottom: 8,
            fontWeight: 'bold',
            color: token.colorText,
          }}
        >
          GPU状态
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div>
            <div style={{ fontWeight: 500, color: token.colorTextSecondary }}>
              功耗
            </div>
            <div style={{ color: token.colorText }}>
              {gpuUsageInfo.gpuPowerUsage || 0}W / {gpuUsageInfo.gpuTDP || 0}W
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 500, color: token.colorTextSecondary }}>
              温度
            </div>
            <div style={{ color: token.colorText }}>
              {gpuUsageInfo.gpuTemperature || 0}°C
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div style={{ color: token.colorText }}>正在加载GPU信息...</div>
    );

    return (
      <Space className={styles.space} direction="vertical" size="middle">
        {/* 左上 */}
        <div className={styles.innerLine}>
          <Tooltip
            title={gpuTooltipContent}
            placement="topLeft"
            overlayStyle={{ maxWidth: 300 }}
            color={token.colorBgElevated}
          >
            <span style={{ cursor: 'help' }}>
              [{gpuIndex}]{gpuUsageInfo?.gpuName || ''}
            </span>
          </Tooltip>
        </div>

        {/* 左下 */}
        <Tooltip
          title={
            <div>
              <div
                style={{
                  fontWeight: 'bold',
                  marginBottom: 8,
                  color: token.colorText,
                }}
              >
                显存详细信息
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div>
                  <div
                    style={{ fontWeight: 500, color: token.colorTextSecondary }}
                  >
                    已使用
                  </div>
                  <div style={{ color: token.colorText }}>
                    {Math.round(
                      ((gpuUsageInfo?.memoryUsage || 0) *
                        (gpuUsageInfo?.gpuMemoryTotalMB || 0)) /
                        100,
                    )}
                    MB
                  </div>
                </div>
                <div>
                  <div
                    style={{ fontWeight: 500, color: token.colorTextSecondary }}
                  >
                    总容量
                  </div>
                  <div style={{ color: token.colorText }}>
                    {gpuUsageInfo?.gpuMemoryTotalMB || 0}MB
                  </div>
                </div>
                <div>
                  <div
                    style={{ fontWeight: 500, color: token.colorTextSecondary }}
                  >
                    可用
                  </div>
                  <div style={{ color: token.colorText }}>
                    {(gpuUsageInfo?.gpuMemoryTotalMB || 0) -
                      Math.round(
                        ((gpuUsageInfo?.memoryUsage || 0) *
                          (gpuUsageInfo?.gpuMemoryTotalMB || 0)) /
                          100,
                      )}
                    MB
                  </div>
                </div>
                <div>
                  <div
                    style={{ fontWeight: 500, color: token.colorTextSecondary }}
                  >
                    使用率
                  </div>
                  <div style={{ color: token.colorText }}>
                    {getMemoryUsagePercentage(
                      gpuMemoryUsageGiB,
                      gpuMemoryTotalGiB,
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>
          }
          placement="topLeft"
          overlayStyle={{ maxWidth: 250 }}
          color={token.colorBgElevated}
        >
          <div className={styles.innerLine} style={{ cursor: 'help' }}>
            {gpuMemoryUsageFormatted}/{gpuMemoryTotalFormatted}GiB
          </div>
        </Tooltip>
      </Space>
    );
  };

  const rightContainer = (gpuUsageInfo: API.DashboardGpuUsageInfo) => {
    return (
      <DisableSelectDiv>
        <Space className={styles.space} direction="vertical" size="middle">
          {/* 右上 */}
          <div className={styles.innerLine}>
            <div className={styles.progressTitle}>显存</div>
            {ProgressComponent(gpuUsageInfo?.memoryUsage)}
          </div>

          {/* 右下 */}
          <div className={styles.innerLine}>
            <div className={styles.progressTitle}>核心</div>
            {ProgressComponent(gpuUsageInfo?.coreUsage)}
          </div>
        </Space>
      </DisableSelectDiv>
    );
  };

  const leftContent = leftContainer(gpuIndex, gpuUsageInfo);
  const rightContent = rightContainer(gpuUsageInfo);

  return (
    <div>
      <Card className={styles.gpuUsageCard}>
        <LinerDividerLayout leftChild={leftContent} rightChild={rightContent} />
      </Card>
    </div>
  );
};

export default GpuUsageCard;
