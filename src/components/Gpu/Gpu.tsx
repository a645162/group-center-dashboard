import { GROUP_CENTER_URL } from '@/constants/group_center';
import { getMachineList } from '@/services/group_center/frontEndMachineListController';
import { AxiosResponse } from '@umijs/max';
import { Layout, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './Gpu.less';
import MachineSelector from './Machine';

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

const Gpu: React.FC<Props> = (props) => {
  const { name } = props;

  const machineList = useMachineListState();

  const [selectedMachineState, setSelectedMachineState] =
    useState<API.FrontEndMachine | null>(null);

  return (
    <div>
      <Layout>
        <Row>
          <Typography.Title level={3} className={styles.title}>
            欢迎使用 <strong>{name}</strong> ！
          </Typography.Title>
        </Row>
      </Layout>

      <h1>GPU</h1>
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

      <p>
        Current Api Url:
        {selectedMachineState && selectedMachineState.machineUrl}
      </p>
    </div>
  );
};

export default Gpu;
