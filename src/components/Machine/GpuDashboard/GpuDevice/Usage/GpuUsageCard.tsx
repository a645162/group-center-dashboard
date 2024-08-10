import { getGpuUsageInfo } from '@/services/agent/GpuInfo';
import { green, orange, red } from '@ant-design/colors';
import { Card, Divider, Progress } from 'antd';
import React, { useEffect, useState } from 'react';

import { convertFromMBToGB, getMemoryString } from '@/utils/Convert/MemorySize';

interface Props {
  apiUrl: string;
  gpuIndex: number;
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      getGpuUsageInfo(apiUrl, gpuIndex)
        .then((data) => {
          setGpuUsageInfo(data);
        })
        .catch((error: any) => {
          console.log('error:', error);
        });
    }, 2000); // 每隔2秒执行一次

    return () => clearInterval(intervalId); // 在组件卸载时清除定时器
  }, [apiUrl]); // 依赖项数组包含apiUrl，当apiUrl发生变化时重新设置定时器

  return gpuUsageInfo;
};

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
      (calculateColorIndex((percent - threshold1) / (threshold2 - threshold1)),
      8,
      5)
    ];
  } else {
    return red[
      calculateColorIndex((percent - threshold2) / (100 - threshold2), 8, 5)
    ];
  }
};

const ProgressConponent = (percent: number) => {
  // format = {(percent) => `${percent} Days`}
  return (
    <Progress
      percent={percent}
      steps={10}
      size="small"
      strokeColor={computeColor(percent)}
      format={(percent) => `${percent}`.padStart(2, '0') + '%'}
    />
  );
};

const GpuUsageCard: React.FC<Props> = (props) => {
  const { apiUrl, gpuIndex } = props;

  const gpuUsageInfo = useGpuUsageInfo(apiUrl, gpuIndex);

  const { gpuMemoryTotalGiB, gpuMemoryUsageGiB } = useGpuMemoryDetail(
    gpuUsageInfo?.gpuMemoryTotalMB || 0,
    gpuUsageInfo?.memoryUsage || 0,
  );

  const gpuMemoryUsageFormatted = getMemoryString(gpuMemoryUsageGiB);
  const gpuMemoryTotalFormatted = getMemoryString(gpuMemoryTotalGiB);

  if (!gpuUsageInfo) {
    return <div>Loading......</div>;
  }

  return (
    <div className="gpu-usage-card">
      <Card style={{ minWidth: 300 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* 左侧容器 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginRight: '16px',
            }}
          >
            {/* 左上 */}
            <div>
              [{gpuIndex}]{gpuUsageInfo?.gpuName || ''}
            </div>

            {/* 左下 */}
            <div>
              {gpuMemoryUsageFormatted}/{gpuMemoryTotalFormatted}GiB
            </div>
          </div>

          {/* 中间的垂直分割线 */}
          <Divider type="vertical" />

          {/* 右侧容器 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* 右上 */}
            {ProgressConponent(gpuUsageInfo?.memoryUsage)}

            {/* 右下 */}
            {ProgressConponent(gpuUsageInfo?.coreUsage)}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GpuUsageCard;
