import BasicFilter from '@/components/Machine/GpuDashboard/Filter/BasicFilter';
import { useGpuTaskFilterUserStore } from '@/data/store/modules/filter/GpuTaskFilterUser';
import { Flex } from 'antd';
import React from 'react';

const GpuTaskFilterPanel: React.FC = () => {
  function UserNameFilter() {
    const userNameEng = useGpuTaskFilterUserStore((state) => state.userNameEng);
    const isFuzzyMatch = useGpuTaskFilterUserStore(
      (state) => state.isFuzzyMatch,
    );
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

  return <div>{UserNameFilter()}</div>;
};

export default GpuTaskFilterPanel;
