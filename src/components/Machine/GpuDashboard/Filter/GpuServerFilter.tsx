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

  // 标记是否已经手动设置过选择状态（避免自动全选覆盖手动清空）
  const [hasManualSelection, setHasManualSelection] = useState(false);

  // 初始化选中状态 - 只有当没有外部选中状态且没有手动设置过时才默认全选
  useEffect(() => {
    if (
      machineList.length > 0 &&
      selectedMachines.length === 0 &&
      !hasManualSelection
    ) {
      const allMachineNames = new Set(
        machineList.map((machine) => machine.machineName),
      );
      setSelectedMachineNames(allMachineNames);
      onSelectionChange(machineList);
    }
  }, [machineList, selectedMachines.length, hasManualSelection]);

  // 同步外部选中状态
  useEffect(() => {
    const selectedNames = new Set(
      selectedMachines.map((machine) => machine.machineName),
    );
    setSelectedMachineNames(selectedNames);

    // 如果外部传入了空数组，标记为手动选择（避免自动全选）
    if (selectedMachines.length === 0) {
      setHasManualSelection(true);
    }
  }, [selectedMachines]);

  const handleMachineToggle = (machine: API.FrontEndMachine) => {
    const newSelectedNames = new Set(selectedMachineNames);

    if (newSelectedNames.has(machine.machineName)) {
      newSelectedNames.delete(machine.machineName);
    } else {
      newSelectedNames.add(machine.machineName);
    }

    setSelectedMachineNames(newSelectedNames);
    setHasManualSelection(true); // 标记为手动选择

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
    setHasManualSelection(true); // 标记为手动选择
    onSelectionChange(machineList);
  };

  const handleClearAll = () => {
    // 清空选择，不选择任何机器
    setSelectedMachineNames(new Set());
    setHasManualSelection(true); // 标记为手动清空
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
