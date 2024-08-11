import BasicFilter from '@/components/Machine/GpuDashboard/Filter/BasicFilter';
import { useGpuTaskFilterProjectNameStore } from '@/data/store/modules/filter/GpuTaskFilterProjectName';
import { useGpuTaskFilterUserNameStore } from '@/data/store/modules/filter/GpuTaskFilterUserName';
import { Flex } from 'antd';
import React from 'react';

function UserNameFilter() {
  const userNameEng = useGpuTaskFilterUserNameStore(
    (state) => state.userNameEng,
  );
  const isFuzzyMatch = useGpuTaskFilterUserNameStore(
    (state) => state.isFuzzyMatch,
  );
  const setUserNameEng = useGpuTaskFilterUserNameStore(
    (state) => state.setUserNameEng,
  );
  const setIsFuzzyMatch = useGpuTaskFilterUserNameStore(
    (state) => state.setIsFuzzyMatch,
  );

  const onSave = (value: string, isFuzzyMatch: boolean) => {
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
          onSave={onSave}
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
  const setProjectName = useGpuTaskFilterProjectNameStore(
    (state) => state.setProjectName,
  );
  const setIsFuzzyMatch = useGpuTaskFilterProjectNameStore(
    (state) => state.setIsFuzzyMatch,
  );

  const onSave = (value: string, isFuzzyMatch: boolean) => {
    setProjectName(value);
    setIsFuzzyMatch(isFuzzyMatch);
  };

  return (
    <div>
      <Flex gap="middle" vertical={false}>
        <BasicFilter
          name="工程名过滤"
          defaultValue={projectName}
          defaultIsFuzzyMatch={isFuzzyMatch}
          onSave={onSave}
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
