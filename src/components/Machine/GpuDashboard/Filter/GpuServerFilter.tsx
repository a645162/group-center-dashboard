import { Button, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './GpuServerFilter.less';

interface GpuServerFilterProps {
  machineList: API.FrontEndMachine[];
  selectedMachines: API.FrontEndMachine[];
  onSelectionChange: (selectedMachines: API.FrontEndMachine[]) => void;
}

const GpuServerFilter: React.FC<GpuServerFilterProps> = ({
  machineList,
  selectedMachines,
  onSelectionChange,
}) => {
  const [selectedMachineNames, setSelectedMachineNames] = useState<Set<string>>(
    new Set(),
  );

  // 初始化选中状态 - 默认全选
  useEffect(() => {
    if (machineList.length > 0) {
      const allMachineNames = new Set(
        machineList.map((machine) => machine.machineName),
      );
      setSelectedMachineNames(allMachineNames);
      onSelectionChange(machineList);
    }
  }, [machineList]);

  // 同步外部选中状态
  useEffect(() => {
    const selectedNames = new Set(
      selectedMachines.map((machine) => machine.machineName),
    );
    setSelectedMachineNames(selectedNames);
  }, [selectedMachines]);

  const handleMachineToggle = (machine: API.FrontEndMachine) => {
    const newSelectedNames = new Set(selectedMachineNames);

    if (newSelectedNames.has(machine.machineName)) {
      newSelectedNames.delete(machine.machineName);
    } else {
      newSelectedNames.add(machine.machineName);
    }

    setSelectedMachineNames(newSelectedNames);

    // 更新选中的机器列表
    const newSelectedMachines = machineList.filter((machine) =>
      newSelectedNames.has(machine.machineName),
    );
    onSelectionChange(newSelectedMachines);
  };

  const handleSelectAll = () => {
    const allMachineNames = new Set(
      machineList.map((machine) => machine.machineName),
    );
    setSelectedMachineNames(allMachineNames);
    onSelectionChange(machineList);
  };

  const handleClearAll = () => {
    setSelectedMachineNames(new Set());
    onSelectionChange([]);
  };

  const isSelected = (machineName: string) => {
    return selectedMachineNames.has(machineName);
  };

  return (
    <div className={styles.gpuServerFilter}>
      <div className={styles.filterHeader}>
        <span className={styles.filterTitle}>GPU服务器筛选</span>
        <Space size="small">
          <Button
            size="small"
            type="link"
            onClick={handleSelectAll}
            className={styles.actionButton}
          >
            全选
          </Button>
          <Button
            size="small"
            type="link"
            onClick={handleClearAll}
            className={styles.actionButton}
          >
            清空
          </Button>
        </Space>
      </div>

      <div className={styles.machineButtons}>
        {machineList.map((machine) => (
          <Button
            key={machine.machineName}
            type={isSelected(machine.machineName) ? 'primary' : 'default'}
            className={`${styles.machineButton} ${
              isSelected(machine.machineName)
                ? styles.selected
                : styles.unselected
            }`}
            onClick={() => handleMachineToggle(machine)}
          >
            {machine.machineName}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GpuServerFilter;
