import { useGpuTaskFilterUserStore } from '@/data/store/modules/filter/GpuTaskFilterUser';
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

  if (userNameEng === '') {
    return true;
  }

  if (isFuzzyMatch) {
    if (taskInfo.name.includes(userNameEng)) {
      return true;
    }
  } else {
    if (taskInfo.name === userNameEng) {
      return true;
    }
  }

  return false;
};
