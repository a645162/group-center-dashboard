import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Anchor, Button } from 'antd';
import React, { useEffect, useState } from 'react';

import { getPublicMachineList } from '@/services/group_center/frontendPublic';

import GpuDashboard from '@/components/Machine/GpuDashboard';
import { FilterGroup } from '@/components/Machine/GpuDashboard/Filter';
import VShow from '@/components/Vue/V-Show';
import { getLatestRunGpu, setLatestRunGpu } from '@/data/cookies/Gpu';
import styles from './GpuDashboardPageContent.less';

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

interface GpuDashboardWithNoContentProps {
  machineList: API.FrontEndMachine[] | null;
}

const GpuDashboardWithNoContent: React.FC<GpuDashboardWithNoContentProps> = ({
  machineList,
}) => {
  // 将hooks移到组件内部，确保在React函数组件中调用
  const [showAnchor, setShowAnchor] = useState(() => {
    return window.innerWidth > window.innerHeight; // 横屏默认显示，竖屏默认隐藏
  });

  // 监听屏幕方向变化
  useEffect(() => {
    const handleResize = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setShowAnchor(isLandscape);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!machineList) {
    return <></>;
  }

  return (
    <VShow v-show={machineList !== undefined && machineList.length > 0}>
      {/* 切换按钮 */}
      {machineList.length > 1 && (
        <Button
          type="primary"
          shape="circle"
          icon={showAnchor ? <CloseOutlined /> : <MenuOutlined />}
          onClick={() => setShowAnchor(!showAnchor)}
          style={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            zIndex: 1001,
            width: 50,
            height: 50,
            backgroundColor: 'rgba(24, 144, 255, 0.8)',
            borderColor: 'rgba(24, 144, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        />
      )}

      {/* 浮动在右边的设备导航锚点 */}
      {machineList.length > 1 && showAnchor && (
        <Anchor
          affix={true}
          offsetTop={100}
          style={{
            position: 'fixed',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid rgba(217, 217, 217, 0.8)',
            backdropFilter: 'blur(8px)',
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
          items={machineList.map((machine) => ({
            key: machine.machineName,
            href: `#device-${machine.machineName}`,
            title: machine.machineName,
          }))}
        />
      )}

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

  if (!machineList || machineList.length === 0) {
    return (
      <>
        <h1>Trying to connect to server...</h1>
      </>
    );
  }

  return (
    <div className={styles.pageContentDiv}>
      {/* <ul>
        {machineList.map((machine) => (
          <li key={machine.machineName}>{machine.machineName}</li>
        ))}
      </ul> */}

      {/* 筛选器组 */}
      <FilterGroup
        machineList={machineList}
        selectedMachines={selectedMachineState || []}
        onSelectionChange={onSelectedMachineChange}
      />

      <GpuDashboardWithNoContent machineList={selectedMachineState} />
    </div>
  );
};

export default GpuDashboardPageContent;
