import VShow from '@/components/Vue/V-Show';
import { getGpuTaskInfo } from '@/services/agent/GpuInfo';
import React, { useEffect, useState } from 'react';
import GpuTaskCardItem from './GpuTaskCardItem';

interface Props {
  apiUrl: string;
  gpuIndex: number;
}

const useGpuTaskListState = (apiUrl: string, gpuIndex: number) => {
  const [gpuTaskList, setGpuTaskList] =
    useState<API.DashboardGpuTaskItemInfo[]>();

  useEffect(() => {
    const intervalId = setInterval(() => {
      getGpuTaskInfo(apiUrl, gpuIndex)
        .then((data) => {
          setGpuTaskList(data.taskList);
        })
        .catch((error: any) => {
          console.log('error:', error);
        });
    }, 2000); // 每隔2秒执行一次

    return () => clearInterval(intervalId); // 在组件卸载时清除定时器
  }, [apiUrl]); // 依赖项数组包含apiUrl，当apiUrl发生变化时重新设置定时器

  return gpuTaskList;
};

const GpuTaskListCard: React.FC<Props> = (props) => {
  const { apiUrl, gpuIndex } = props;

  const gpuTaskList = useGpuTaskListState(apiUrl, gpuIndex);

  if (!gpuTaskList) {
    return (
      <>
        <div>暂无任务</div>
      </>
    );
  }

  // const gpuTaskFiltedList = gpuTaskList?.filter((gpuTask) => {
  // 	return UseFilter(gpuTask);
  // });

  return (
    <div>
      <VShow v-show={gpuTaskList.length > 0}>
        {Array.from({ length: gpuTaskList?.length || 0 }, (_, i) => (
          <div key={i}>
            <GpuTaskCardItem index={i} taskInfo={gpuTaskList?.[i]} />
          </div>
        ))}
      </VShow>
    </div>
  );
};

export default GpuTaskListCard;
