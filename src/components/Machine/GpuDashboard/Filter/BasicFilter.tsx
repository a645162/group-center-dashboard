import RadioGroupCheckBox from '@/components/Public/Basic/RadioGroupCheckBox';
import { Button, Input, message, Modal } from 'antd';
import React, { useState } from 'react';

interface Props {
  name: string;

  defaultValue: string;
  defaultIsFuzzyMatch: boolean;

  onValueChange: (value: string, isFuzzyMatch: boolean) => void;
}

const BasicFilter: React.FC<Props> = (props) => {
  const { name, defaultValue, defaultIsFuzzyMatch, onValueChange } = props;

  const [open, setOpen] = useState(false);

  const [value, setValue] = useState(defaultValue);
  const [isFuzzyMatch, setIsFuzzyMatch] = useState(defaultIsFuzzyMatch);

  const isValid = defaultValue !== '';
  const buttonType = isValid ? 'primary' : 'default';
  const content = isValid ? `${name}:${defaultValue}` : `${name}未设定`;

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setValue(newValue);
  };

  const [messageApi, contextHolder] = message.useMessage();

  const onClickCancel = () => {
    setOpen(false);

    messageApi.info(`取消修改(${name})`);
  };
  const onClickSave = () => {
    onValueChange(value, isFuzzyMatch);

    setOpen(false);

    messageApi.open({
      type: 'success',
      content: `修改成功(${name})`,
    });
  };
  const onClickUnset = () => {
    onValueChange('', isFuzzyMatch);

    setOpen(false);

    messageApi.open({
      type: 'success',
      content: `取消成功(${name})`,
    });
  };

  return (
    <div>
      {contextHolder}

      <Button type={buttonType} onClick={() => setOpen(true)}>
        {content}
      </Button>

      <Modal
        open={open}
        title={name}
        onOk={onClickCancel}
        onCancel={onClickCancel}
        footer={[
          <Button key="back" onClick={onClickCancel}>
            不保存
          </Button>,
          <Button key="link" type="default" onClick={onClickUnset}>
            关闭过滤器
          </Button>,
          <Button key="submit" type="primary" onClick={onClickSave}>
            修改
          </Button>,
        ]}
      >
        <p>过滤器值：</p>
        <Input
          placeholder={`${name}值`}
          defaultValue={defaultValue}
          onChange={onTextChange}
        />
        <p>匹配模式：</p>
        <RadioGroupCheckBox
          textTrue="模糊匹配"
          textFalse="精确(完全)匹配"
          defaultValue={defaultIsFuzzyMatch}
          onChange={setIsFuzzyMatch}
        />
      </Modal>
    </div>
  );
};

export default BasicFilter;
