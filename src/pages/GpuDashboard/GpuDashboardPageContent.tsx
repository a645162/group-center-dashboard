import React, { useEffect, useState } from 'react';

import { getMachineList } from '@/services/group_center/frontEndMachineListController';

import GpuDashboard from '@/components/Machine/GpuDashboard';
import MachineSelector from '@/components/Machine/MachineSelector';

interface Props {
  name?: string;
}

const useMachineListState = () => {
  const [machineList, setMachineList] = useState<API.FrontEndMachine[]>([]);

  useEffect(() => {
    getMachineList()
      .then((data) => {
        // console.log('data:', data);
        setMachineList(data);
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
  const {} = props;

  const machineList = useMachineListState();

  const [selectedMachineState, setSelectedMachineState] =
    useState<API.FrontEndMachine | null>(null);

  if (!machineList) {
    return (
      <>
        <h1>Trying to connect to server...</h1>
      </>
    );
  }

  return (
    <div>
      {/* <ul>
        {machineList.map((machine) => (
          <li key={machine.machineName}>{machine.machineName}</li>
        ))}
      </ul> */}

      <MachineSelector
        machineList={machineList}
        onMachineChange={setSelectedMachineState}
      />

      {GpuDashboardWithNoContent(selectedMachineState)}
    </div>
  );
};

export default GpuDashboardPageContent;
