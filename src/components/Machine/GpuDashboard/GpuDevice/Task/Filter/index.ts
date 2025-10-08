import { useProjectFilter } from './ProjectFilter';
import { useUserFilter } from './UserFilter';

// 移除无用的 FilterUseEffect，直接在组件中使用 hooks
export const useFilter = () => {
  const { checkUserFilter } = useUserFilter();
  const { checkProjectFilter } = useProjectFilter();

  const checkFilter = (taskInfo: API.DashboardGpuTaskItemInfo): boolean => {
    let finalResult = true;

    finalResult = finalResult && checkUserFilter(taskInfo);
    finalResult = finalResult && checkProjectFilter(taskInfo);

    return finalResult;
  };

  return { checkFilter };
};
