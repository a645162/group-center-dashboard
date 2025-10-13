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
  const [hasBeenInitialized, setHasBeenInitialized] = useState(false);

  // 初始化选中状态 - 只有当组件首次加载且没有选中任何机器时才默认全选
  useEffect(() => {
    // 只有在以下情况才自动全选：
    // 1. machineList 有数据
    // 2. selectedMachines 为空（没有外部选中的机器）
    // 3. selectedMachineNames 为空（组件内部状态也为空）
    // 4. 还没有初始化过（避免用户清空后再次自动全选）
    if (
      machineList.length > 0 &&
      selectedMachines.length === 0 &&
      selectedMachineNames.size === 0 &&
      !hasBeenInitialized
    ) {
      console.log('Auto-selecting all machines - initial load only');

      const allMachineNames = new Set(
        machineList.map((machine) => machine.machineName),
      );
      setSelectedMachineNames(allMachineNames);
      setHasBeenInitialized(true);
      // 使用 setTimeout 避免在渲染过程中调用 onSelectionChange
      setTimeout(() => {
        onSelectionChange(machineList);
      }, 0);
    }
  }, [
    machineList,
    selectedMachines.length,
    selectedMachineNames.size,
    hasBeenInitialized,
    onSelectionChange,
  ]);

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
    setHasBeenInitialized(true); // 标记为已初始化，用户手动操作后不再自动全选

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
    setHasBeenInitialized(true); // 标记为已初始化
    onSelectionChange(machineList);
  };

  const handleClearAll = () => {
    setSelectedMachineNames(new Set());
    setHasBeenInitialized(true); // 标记为已初始化，避免自动全选
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
