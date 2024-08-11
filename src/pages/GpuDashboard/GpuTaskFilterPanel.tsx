import BasicFilter from '@/components/Machine/GpuDashboard/Filter/BasicFilter';
import { useGpuTaskFilterProjectNameStore } from '@/data/store/modules/filter/GpuTaskFilterProjectName';
import { useGpuTaskFilterUserStore } from '@/data/store/modules/filter/GpuTaskFilterUser';
import { Flex } from 'antd';
import React from 'react';

function UserNameFilter() {
  const userNameEng = useGpuTaskFilterUserStore((state) => state.userNameEng);
  const isFuzzyMatch = useGpuTaskFilterUserStore((state) => state.isFuzzyMatch);
  const setUserNameEng = useGpuTaskFilterUserStore(
    (state) => state.setUserNameEng,
  );
  const setIsFuzzyMatch = useGpuTaskFilterUserStore(
    (state) => state.setIsFuzzyMatch,
  );

  const onValueChange = (value: string, isFuzzyMatch: boolean) => {
    setUserNameEng(value);
    setIsFuzzyMatch(isFuzzyMatch);
  };

  return (
    <div>
      <Flex gap="middle" vertical={false}>
        <BasicFilter
          name="用户名过滤"
          defaultValue={userNameEng}
          defaultIsFuzzyMatch={isFuzzyMatch}
          onValueChange={onValueChange}
        />
      </Flex>
    </div>
  );
}

function ProjectNameFilter() {
  const projectName = useGpuTaskFilterProjectNameStore(
    (state) => state.projectName,
  );
  const isFuzzyMatch = useGpuTaskFilterProjectNameStore(
    (state) => state.isFuzzyMatch,
  );
  const setUserNameEng = useGpuTaskFilterProjectNameStore(
    (state) => state.setProjectName,
  );
  const setIsFuzzyMatch = useGpuTaskFilterProjectNameStore(
    (state) => state.setIsFuzzyMatch,
  );

  const onValueChange = (value: string, isFuzzyMatch: boolean) => {
    setUserNameEng(value);
    setIsFuzzyMatch(isFuzzyMatch);
  };

  return (
    <div>
      <Flex gap="middle" vertical={false}>
        <BasicFilter
          name="工程名过滤"
          defaultValue={projectName}
          defaultIsFuzzyMatch={isFuzzyMatch}
          onValueChange={onValueChange}
        />
      </Flex>
    </div>
  );
}
const GpuTaskFilterPanel: React.FC = () => {
  return (
    <div>
      <Flex gap="small" vertical={false}>
        <div>{UserNameFilter()}</div>
        <div>{ProjectNameFilter()}</div>
      </Flex>
    </div>
  );
};

export default GpuTaskFilterPanel;
