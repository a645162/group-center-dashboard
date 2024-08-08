import React, { useEffect, useState } from 'react';

import { GROUP_CENTER_URL } from '@/constants/group_center';
import { getMachineList } from '@/services/group_center/frontEndMachineListController';
import { AxiosResponse } from '@umijs/max';

import GpuDashboard from '@/components/Machine/GpuDashboard';
import MachineSelector from '@/components/Machine/MachineSelector';

interface Props {
  name: string;
}

const useMachineListState = () => {
  const [machineList, setMachineList] = useState<API.FrontEndMachine[]>([]); // 提供一个初始状态值

  useEffect(() => {
    getMachineList()
      .then((data) => {
        const trueData = data as unknown as AxiosResponse<
          API.FrontEndMachine[]
        >;
        console.log('data:', trueData.data);
        setMachineList(trueData.data);
      })
      .catch((error: any) => {
        console.log('error:', error);
      });
  }, []); // 依赖项数组为空数组，只在组件挂载时执行

  return machineList;
};

const GpuDashboardWithNoContent = (
  selectedMachineState: API.FrontEndMachine | null,
) => {
  if (selectedMachineState) {
    return (
      <GpuDashboard
        name={selectedMachineState.machineName}
        apiUrl={selectedMachineState.machineUrl}
      />
    );
  } else {
    return <></>;
  }
};

const GpuDashboardPageContent: React.FC<Props> = (props) => {
  const { name } = props;

  const machineList = useMachineListState();

  const [selectedMachineState, setSelectedMachineState] =
    useState<API.FrontEndMachine | null>(null);

  return (
    <div>
      <h1>GPU</h1>
      <h2>{name}</h2>
      <h2>({GROUP_CENTER_URL})</h2>

      <ul>
        {machineList.map((machine) => (
          <li key={machine.machineName}>{machine.machineName}</li>
        ))}
      </ul>

      <MachineSelector
        machineList={machineList}
        onMachineChange={setSelectedMachineState}
      />

      {GpuDashboardWithNoContent(selectedMachineState)}
    </div>
  );
};

export default GpuDashboardPageContent;
