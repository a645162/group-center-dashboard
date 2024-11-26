import { getGpuCount } from '@/services/agent/GpuInfo';
import React, { useEffect, useState } from 'react';
import GpuDevice from './GpuDevice';

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

const GpuDashboard: React.FC<Props> = (props) => {
  const { name, apiUrl } = props;

  const gpuCountState = useGpuCountState(apiUrl);

  const gpuInfoContent = () => {
    if (gpuCountState === 0) {
      return (
        <div className={styles.noGpuDiv}>
          <p>暂无GPU???</p>
          <p>请报告管理员！</p>
        </div>
      );
    }

    return (
      <div className={styles.gpuInfoList}>
        {Array.from({ length: gpuCountState }, (_, i) => (
          <div key={i} className={styles.gpuInfoItem}>
            <GpuDevice apiUrl={apiUrl} gpuIndex={i} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className={styles.title}>{name}</h1>

      {gpuInfoContent()}
    </div>
  );
};

export default GpuDashboard;
