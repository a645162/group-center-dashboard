import { useGpuTaskFilterUserNameStore } from '@/data/store/modules/filter/GpuTaskFilterUserName';
import { MatchStringFilter } from '@/data/store/modules/filter/utils';
import { useEffect } from 'react';

export const UserFilterUseEffect = () => {
  const userNameEng = useGpuTaskFilterUserNameStore(
    (state) => state.userNameEng,
  );
  const isFuzzyMatch = useGpuTaskFilterUserNameStore(
    (state) => state.isFuzzyMatch,
  );

  useEffect(() => {}, [userNameEng, isFuzzyMatch]);
};

export const CheckUserFilter = (
  taskInfo: API.DashboardGpuTaskItemInfo,
): boolean => {
  const userNameEng = useGpuTaskFilterUserNameStore(
    (state) => state.userNameEng,
  );
  const isFuzzyMatch = useGpuTaskFilterUserNameStore(
    (state) => state.isFuzzyMatch,
  );

  return MatchStringFilter(taskInfo.name, userNameEng, isFuzzyMatch);
};
