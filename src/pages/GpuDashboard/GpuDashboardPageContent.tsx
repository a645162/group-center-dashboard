import React, { useEffect, useState } from 'react';

import { getPublicMachineList } from '@/services/group_center/frontEndPublicController';

import GpuDashboard from '@/components/Machine/GpuDashboard';
import MachineSelector from '@/components/Machine/MachineSelector';
import VShow from '@/components/Vue/V-Show';
import { getLatestRunGpu, setLatestRunGpu } from '@/data/cookies/Gpu';
import { Flex } from 'antd';
import styles from './GpuDashboardPageContent.less';
import GpuTaskFilterPanel from './GpuTaskFilterPanel';

interface Props {
  name?: string;
}

const useMachineListState = () => {
  const [machineList, setMachineList] = useState<API.FrontEndMachine[]>([]);

  useEffect(() => {
    getPublicMachineList()
      .then((data) => {
        // console.log('data:', data);
        setMachineList(data.filter((machine) => machine.isGpu));
      })
      .catch((error: any) => {
        console.log('error:', error);
      });
  }, []); // 依赖项数组为空数组，只在组件挂载时执行

  return machineList;
};

const GpuDashboardWithNoContent = (
  machineList: API.FrontEndMachine[] | null,
) => {
  if (machineList) {
    return (
      <VShow v-show={machineList !== undefined && machineList.length > 0}>
        <div className={styles.machineDiv}>
          {machineList.map((machine) => (
            <div key={machine.machineName} className={styles.machineItem}>
              <GpuDashboard
                name={machine.machineName}
                apiUrl={machine.machineUrl}
              />
            </div>
          ))}
        </div>
      </VShow>
    );
  } else {
    return <></>;
  }
};

const GpuDashboardPageContent: React.FC<Props> = (props) => {
  const {} = props;

  const machineList = useMachineListState();

  const [selectedMachineState, setSelectedMachineState] = useState<
    API.FrontEndMachine[] | null
  >(null);

  const [tryToSelectedMachineList, setTryToSelectedMachineList] = useState<
    API.FrontEndMachine[]
  >([]);

  useEffect(() => {
    getLatestRunGpu().then((latestMachineList: API.FrontEndMachine[]) => {
      // Check `latestMachineList` is in `machineList`
      // console.log('latestMachineList:', latestMachineList);
      const finalSelectedMachineList = machineList.filter((machine) => {
        for (let i = 0; i < latestMachineList.length; i++) {
          if (machine.machineName === latestMachineList[i].machineName) {
            return true;
          }
        }
        return false;
      });
      // console.log('finalSelectedMachineList:', finalSelectedMachineList);

      setTryToSelectedMachineList(finalSelectedMachineList);
      setSelectedMachineState(finalSelectedMachineList);
    });
  }, [machineList]);

  const onSelectedMachineChange = (machineList: API.FrontEndMachine[]) => {
    setLatestRunGpu(machineList)
      .then(() => {
        console.log('setLatestRunGpu success');
      })
      .catch((error: any) => {
        console.log('error:', error);
      });

    setSelectedMachineState(machineList);
  };

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

      <Flex gap="middle" vertical={false}>
        <MachineSelector
          machineList={machineList}
          onMachineChange={onSelectedMachineChange}
          multipleMachine={true}
          tryToSelectMachineList={tryToSelectedMachineList}
        />

        <GpuTaskFilterPanel />
      </Flex>

      {GpuDashboardWithNoContent(selectedMachineState)}
    </div>
  );
};

export default GpuDashboardPageContent;
