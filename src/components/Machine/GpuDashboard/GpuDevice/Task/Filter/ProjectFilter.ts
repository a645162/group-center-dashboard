import { useGpuTaskFilterProjectNameStore } from '@/data/store/modules/filter/GpuTaskFilterProjectName';
import { MatchStringFilter } from '@/data/store/modules/filter/utils';
import { useEffect } from 'react';

export const ProjectFilterUseEffect = () => {
  const projectName = useGpuTaskFilterProjectNameStore(
    (state) => state.projectName,
  );
  const isFuzzyMatch = useGpuTaskFilterProjectNameStore(
    (state) => state.isFuzzyMatch,
  );

  useEffect(() => {}, [projectName, isFuzzyMatch]);
};

export const CheckProjectFilter = (
  taskInfo: API.DashboardGpuTaskItemInfo,
): boolean => {
  const projectName = useGpuTaskFilterProjectNameStore(
    (state) => state.projectName,
  );
  const isFuzzyMatch = useGpuTaskFilterProjectNameStore(
    (state) => state.isFuzzyMatch,
  );

  return MatchStringFilter(taskInfo.projectName, projectName, isFuzzyMatch);
};
