import { CheckProjectFilter, ProjectFilterUseEffect } from './ProjectFilter';
import { CheckUserFilter, UserFilterUseEffect } from './UserFilter';

export const FilterUseEffect = () => {
  UserFilterUseEffect();
  ProjectFilterUseEffect();
};

export const UseFilter = (taskInfo: API.DashboardGpuTaskItemInfo): boolean => {
  let finalResult = true;

  finalResult = finalResult && CheckUserFilter(taskInfo);
  finalResult = finalResult && CheckProjectFilter(taskInfo);

  return finalResult;
};
