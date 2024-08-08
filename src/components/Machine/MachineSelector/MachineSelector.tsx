import { Cascader } from 'antd';
import React from 'react';

type MachineSelectorProps = {
  machineList: API.FrontEndMachine[];
  onMachineChange?: (selectedMachine: API.FrontEndMachine) => void;
};

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const MachineSelector: React.FC<MachineSelectorProps> = ({
  machineList,
  onMachineChange,
}) => {
  // First level
  // machineList[i].position

  // Second level
  // machineList[i].machineName

  // Get all positions and not duplicated
  const positionOptions: Option[] = [];
  for (let i = 0; i < machineList.length; i++) {
    const position = machineList[i].position;
    if (
      positionOptions.find((element) => element.label === position) ===
      undefined
    ) {
      positionOptions.push({
        value: position,
        label: position,
      });
    }
  }

  for (let i = 0; i < machineList.length; i++) {
    for (let j = 0; j < positionOptions.length; j++) {
      const position = machineList[i].position;
      const currentPosition = positionOptions[j].label;
      if (position === currentPosition) {
        if (positionOptions[j].children === undefined) {
          positionOptions[j].children = [];
        }

        // @ts-ignore
        positionOptions[j].children.push({
          value: machineList[i].machineUrl,
          label: machineList[i].machineName,
        });
      }
    }
  }

  const onChange = (value: string[]) => {
    const selectedMachine = machineList.find(
      (machine) => machine.machineUrl === value[1],
    );
    if (selectedMachine) {
      // console.log('onMachineChange', selectedMachine);

      if (onMachineChange) {
        onMachineChange(selectedMachine);
      }
    }
  };

  const style = {
    minWidth: '200px',
  };

  return (
    <>
      <Cascader
        options={positionOptions}
        onChange={onChange}
        placeholder="Please select"
        style={style}
      />
    </>
  );
};

export default MachineSelector;
