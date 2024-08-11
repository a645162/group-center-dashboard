import { useGpuTaskFilterUserStore } from '@/data/store/modules/filter/GpuTaskFilterUser';
import { MatchStringFilter } from '@/data/store/modules/filter/utils';
import { useEffect } from 'react';

export const UserFilterUseEffect = () => {
  const userNameEng = useGpuTaskFilterUserStore((state) => state.userNameEng);
  const isFuzzyMatch = useGpuTaskFilterUserStore((state) => state.isFuzzyMatch);

  useEffect(() => {}, [userNameEng, isFuzzyMatch]);
};

export const CheckUserFilter = (
  taskInfo: API.DashboardGpuTaskItemInfo,
): boolean => {
  const userNameEng = useGpuTaskFilterUserStore((state) => state.userNameEng);
  const isFuzzyMatch = useGpuTaskFilterUserStore((state) => state.isFuzzyMatch);

  return MatchStringFilter(taskInfo.name, userNameEng, isFuzzyMatch);
};
