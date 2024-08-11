import React from 'react';

interface Props {
  enableSelect?: boolean;
  children: React.ReactNode;
}

const DisableSelectDiv: React.FC<Props> = (props) => {
  const { enableSelect, children } = props;

  const disableSelect = enableSelect === undefined || !enableSelect;

  return disableSelect ? (
    <div style={{ userSelect: 'none' }}>{children}</div>
  ) : (
    <div>{children}</div>
  );
};

export default DisableSelectDiv;
