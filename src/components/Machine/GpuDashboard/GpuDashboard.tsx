import { useGpuTaskFilterCardStore } from '@/data/store/modules/filter/GpuTaskFilterCard';
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

  return (
    <div id={`device-${name}`}>
      <h1 className={styles.title}>{name}</h1>
      {gpuInfoContent()}
    </div>
  );
};

export default GpuDashboard;
