import { useGpuTaskFilterCardStore } from '@/data/store/modules/filter/GpuTaskFilterCard';
import { getGpuUsageInfo } from '@/services/agent/GpuInfo';
import React, { useEffect, useState } from 'react';
import GpuTaskListCard from './Task/GpuTaskListCard';
import GpuUsageCard from './Usage/GpuUsageCard';

import styles from './GpuDevice.less';

interface Props {
  apiUrl: string;
  gpuIndex: number;
}

const useGpuName = (apiUrl: string, gpuIndex: number) => {
  const [gpuName, setGpuName] = useState<string | undefined>();

  useEffect(() => {
    const updateGpuName = () => {
      getGpuUsageInfo(apiUrl, gpuIndex)
        .then((data) => {
          if (data?.gpuName) {
            setGpuName(data.gpuName);
          }
        })
        .catch((error: any) => {
          console.log('Error(getGpuUsageInfo):', error);
        });
    };

    // 初始执行一次
    updateGpuName();

    // 设置定时器定期更新
    const intervalId = setInterval(() => {
      updateGpuName();
    }, 2000); // 每隔2秒执行一次

    return () => clearInterval(intervalId);
  }, [apiUrl, gpuIndex]);

  return gpuName;
};

const GpuDevice: React.FC<Props> = (props) => {
  const { apiUrl, gpuIndex } = props;
  const gpuNameFilter = useGpuTaskFilterCardStore(
    (state) => state.gpuNameFilter,
  );
  const gpuName = useGpuName(apiUrl, gpuIndex);

  // 检查是否应该显示此GPU卡（基于卡名筛选）
  const shouldShowByGpuName = (gpuName: string | undefined): boolean => {
    // 如果卡名筛选未启用，显示所有卡
    if (!gpuNameFilter.enabled) {
      return true;
    }

    // 如果没有设置卡名筛选条件，显示所有卡
    if (!gpuNameFilter.gpuName) {
      return true;
    }

    // 如果没有GPU卡名称信息，显示此卡
    if (!gpuName) {
      return true;
    }

    // 进行卡名匹配
    if (gpuNameFilter.isFuzzyMatch) {
      // 模糊匹配：检查是否包含关键词
      return gpuName
        .toLowerCase()
        .includes(gpuNameFilter.gpuName.toLowerCase());
    } else {
      // 精确匹配：检查是否完全匹配
      return gpuName.toLowerCase() === gpuNameFilter.gpuName.toLowerCase();
    }
  };

  // 如果不应该显示此GPU设备，返回null
  if (!shouldShowByGpuName(gpuName)) {
    return null;
  }

  return (
    <div className={styles.gpuDevice}>
      <div className={styles.gpuUsageDiv}>
        <GpuUsageCard
          apiUrl={apiUrl}
          gpuIndex={gpuIndex}
          shouldShowByGpuName={shouldShowByGpuName}
        />
      </div>

      <div className={styles.gpuTaskDiv}>
        <GpuTaskListCard apiUrl={apiUrl} gpuIndex={gpuIndex} />
      </div>
    </div>
  );
};

export default GpuDevice;
