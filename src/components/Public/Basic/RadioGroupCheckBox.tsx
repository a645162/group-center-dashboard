import { Radio } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import React from 'react';

interface Props {
  textTrue: string;
  textFalse: string;

  defaultValue: boolean;

  onChange?: (value: boolean) => void;
}

const RadioGroupCheckBox: React.FC<Props> = (props) => {
  const { textTrue, textFalse, defaultValue, onChange } = props;

  const defaultValueString = defaultValue ? 'a' : 'b';

  const onRadioChange = (e: CheckboxChangeEvent) => {
    const newValue = e.target.value === 'a';

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div>
      <Radio.Group
        defaultValue={defaultValueString}
        buttonStyle="solid"
        onChange={onRadioChange}
      >
        <Radio.Button value="a">{textTrue}</Radio.Button>
        <Radio.Button value="b">{textFalse}</Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default RadioGroupCheckBox;
