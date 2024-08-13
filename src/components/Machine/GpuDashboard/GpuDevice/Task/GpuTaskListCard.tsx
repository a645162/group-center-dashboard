import VShow from '@/components/Vue/V-Show';
import { getGpuTaskInfo } from '@/services/agent/GpuInfo';
import { CheckIsDevMode } from '@/utils/node';
import { Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import GpuTaskCardItem from './GpuTaskCardItem';
import styles from './GpuTaskListCard.less';

interface Props {
  apiUrl: string;
  gpuIndex: number;
}

const useGpuTaskListState = (apiUrl: string, gpuIndex: number) => {
  const [gpuTaskList, setGpuTaskList] =
    useState<API.DashboardGpuTaskItemInfo[]>();

  // 判断是否为开发模式
  const isDevMode = CheckIsDevMode();

  // 开发环境刷新间隔为60秒
  const refreshIntervalDev = 60 * 1000;

  // 生产环境刷新间隔为2秒
  const refreshIntervalProd = 2 * 1000;

  // 计算最终刷新间隔
  const refreshInterval = isDevMode ? refreshIntervalDev : refreshIntervalProd;

  // 刷新数据
  const refreshData = () => {
    getGpuTaskInfo(apiUrl, gpuIndex)
      .then((data) => {
        setGpuTaskList(data.taskList);
      })
      .catch((error: any) => {
        console.log('Error(getGpuTaskInfo):', error);
      });
  };

  // 第一次手动刷新
  useEffect(() => {
    refreshData();
  }, []);

  // 后续时间间隔到后自动刷新
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => clearInterval(intervalId); // 在组件卸载时清除定时器
  }, [apiUrl]); // 依赖项数组包含apiUrl，当apiUrl发生变化时重新设置定时器

  return gpuTaskList;
};

const GpuTaskListCard: React.FC<Props> = (props) => {
  const { apiUrl, gpuIndex } = props;

  const gpuTaskList = useGpuTaskListState(apiUrl, gpuIndex);

  if (!gpuTaskList) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  // const gpuTaskFiltedList = gpuTaskList?.filter((gpuTask) => {
  // 	return UseFilter(gpuTask);
  // });

  return (
    <div>
      <VShow v-show={gpuTaskList.length > 0}>
        {Array.from({ length: gpuTaskList?.length || 0 }, (_, i) => (
          <div className={styles.gpuTaskItemDiv} key={i}>
            <GpuTaskCardItem index={i} taskInfo={gpuTaskList?.[i]} />
          </div>
        ))}
      </VShow>
    </div>
  );
};

export default GpuTaskListCard;
