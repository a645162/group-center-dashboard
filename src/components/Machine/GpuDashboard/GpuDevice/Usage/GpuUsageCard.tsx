import DisableSelectDiv from '@/components/Public/Layout/DisableSelectDiv';
import LinerDividerLayout from '@/components/Public/Layout/LinerDividerLayout';
import { getGpuUsageInfo } from '@/services/agent/GpuInfo';
import { convertFromMBToGB, getMemoryString } from '@/utils/Convert/MemorySize';
import { green, orange, red } from '@ant-design/colors';
import { Card, Progress, Skeleton, Space } from 'antd';
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

  const gpuUsageInfo = useGpuUsageInfo(apiUrl, gpuIndex);

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

    return (
      <Space className={styles.space} direction="vertical" size="middle">
        {/* 左上 */}
        <div className={styles.innerLine}>
          [{gpuIndex}]{gpuUsageInfo?.gpuName || ''}
        </div>

        {/* 左下 */}
        <div className={styles.innerLine}>
          {gpuMemoryUsageFormatted}/{gpuMemoryTotalFormatted}GiB
        </div>
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
