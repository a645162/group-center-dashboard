import { Cascader } from 'antd';
import React, { useEffect } from 'react';

type MachineSelectorProps = {
  machineList: API.FrontEndMachine[];
  onMachineChange?: (selectedMachine: API.FrontEndMachine[]) => void;
  multipleMachine?: boolean;
  tryToSelectMachineList?: API.FrontEndMachine[];
};

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const MachineSelector: React.FC<MachineSelectorProps> = ({
  machineList,
  onMachineChange,
  multipleMachine,
  tryToSelectMachineList,
}) => {
  const supportMultipleMachine = multipleMachine ?? false;

  // First level
  // machineList[i].position

  // Second level
  // machineList[i].machineName

  const positionOptions: Option[] = [];

  const TAG_ALL_MACHINE = 'allMachineOption';
  if (supportMultipleMachine) {
    positionOptions.push({
      value: TAG_ALL_MACHINE,
      label: '全部机器',
    });
  }

  // Get all positions and not duplicated
  let count = 0;
  for (let i = 0; i < machineList.length; i++) {
    const position = machineList[i].position;
    if (
      positionOptions.find((element) => element.label === position) ===
      undefined
    ) {
      positionOptions.push({
        value: (++count).toString(),
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
    // console.log('onMachineChange', value);

    // All Machine
    if (
      supportMultipleMachine &&
      value.length === 1 &&
      value[0] === TAG_ALL_MACHINE
    ) {
      if (onMachineChange) {
        onMachineChange([...machineList]);
      }
    }

    // Singla Machine
    const selectedMachine = machineList.find(
      (machine) => machine.machineUrl === value[1],
    );
    if (selectedMachine) {
      // console.log('onMachineChange', selectedMachine);
      if (onMachineChange) {
        onMachineChange([selectedMachine]);
      }
    }
  };

  const [defaultValue, setDefaultValue] = React.useState<string[]>([]);

  const selecteMachine = (machine: API.FrontEndMachine) => {
    // Find selectedMachine in positionOptions and children

    for (let i = 0; i < positionOptions.length; i++) {
      const position = positionOptions[i];
      if (position.label === machine.position) {
        if (position.children === undefined) {
          position.children = [];
        }

        for (let j = 0; j < position.children.length; j++) {
          const child = position.children[j];
          if (child.label === machine.machineName) {
            const value = [position.value, child.value];
            console.log('setDefaultValue', value);
            setDefaultValue(value);
          }
        }
      }
    }
  };

  useEffect(() => {
    //   console.log('useEffect', tryToSelectMachineList);
    if (tryToSelectMachineList && tryToSelectMachineList.length > 0) {
      const selectedMachine = machineList.find(
        (machine) =>
          machine &&
          machine.machineUrl === tryToSelectMachineList[0].machineUrl,
      );
      if (selectedMachine) {
        console.log('Selector', selectedMachine);

        selecteMachine(selectedMachine);

        // if (onMachineChange) {
        //   onMachineChange([selectedMachine]);
        // }
      }
    }
  }, [machineList, tryToSelectMachineList]);

  const style = {
    minWidth: '300px',
  };

  return (
    <>
      <Cascader
        options={positionOptions}
        onChange={onChange}
        defaultValue={defaultValue}
        placeholder="Please select"
        style={style}
      />
    </>
  );
};

export default MachineSelector;
