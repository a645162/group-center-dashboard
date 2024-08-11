import { CheckUserFilter, UserFilterUseEffect } from './UserFilter';

export const FilterUseEffect = () => {
  UserFilterUseEffect();
};

export const UseFilter = (taskInfo: API.DashboardGpuTaskItemInfo): boolean => {
  let finalResult = true;

  finalResult = finalResult && CheckUserFilter(taskInfo);

  return finalResult;
};
