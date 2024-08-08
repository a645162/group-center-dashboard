import { getGpuUsageInfo } from '@/services/nvi_notify/GpuInfo';
import { Card, Divider } from 'antd';
import React, { useEffect, useState } from 'react';

interface Props {
  apiUrl: string;
  gpuIndex: number;
}

const useGpuUsageInfo = (apiUrl: string, gpuIndex: number) => {
  const [gpuUsageInfo, setGpuUsageInfo] = useState<API.GpuUsageInfo>();

  useEffect(() => {
    const intervalId = setInterval(() => {
      getGpuUsageInfo(apiUrl, gpuIndex)
        .then((responseData) => {
          const data = responseData.data;
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

const GpuUsageCard: React.FC<Props> = (props) => {
  const { apiUrl, gpuIndex } = props;

  const gpuUsageInfo = useGpuUsageInfo(apiUrl, gpuIndex);

  if (!gpuUsageInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="gpu-usage-card">
      <p>GPU Name: {gpuUsageInfo?.gpuName || ''}</p>
      <Card style={{ minWidth: 300 }}>
        <div>
          {/* 左 */}
          <div>
            {/* 左上 */}
            {gpuUsageInfo?.gpuName}
          </div>

          <div>{/* 左下 */}</div>
        </div>

        {/* 中间的垂直分割线 */}
        <Divider type="vertical" />

        <div>
          {/* 右 */}

          <div>{/* 右上 */}</div>

          <div>{/* 右下 */}</div>
        </div>
      </Card>
    </div>
  );
};

export default GpuUsageCard;
