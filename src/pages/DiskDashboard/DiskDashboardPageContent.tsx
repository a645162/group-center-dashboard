import React, { useEffect, useState } from 'react';

import MachineDisk from '@/components/Machine/MachineInfo/Hardware/Disk/MachineDisk';
import { getPublicMachineList } from '@/services/group_center/frontEndMachineListController';

interface Props {
  name?: string;
}

const useMachineListState = () => {
  const [machineList, setMachineList] = useState<API.FrontEndMachine[]>([]);

  useEffect(() => {
    getPublicMachineList()
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

const DiskDashboardPageContent: React.FC<Props> = (props) => {
  const {} = props;

  const machineList = useMachineListState();

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

      {machineList.map((machine) => (
        <MachineDisk
          key={machine.machineName}
          name={machine.machineName}
          apiUrl={machine.machineUrl}
        />
      ))}
    </div>
  );
};

export default DiskDashboardPageContent;
