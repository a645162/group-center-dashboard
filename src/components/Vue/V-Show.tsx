import React from 'react';

interface Props {
  'v-show': boolean | string | number;
  children: React.ReactNode;
}

const VShow: React.FC<Props> = (props) => {
  const { 'v-show': vIf, children } = props;

  const isUndefined = vIf === undefined;
  const boolCheck = typeof vIf === 'boolean' ? vIf : false;
  const intCheck = typeof vIf === 'number' ? vIf !== 0 : false;
  const strCheck = typeof vIf === 'string' ? vIf.length > 0 : false;

  const shouldRender = !isUndefined && (boolCheck || intCheck || strCheck);

  return shouldRender ? <>{children}</> : <></>;
};

export default VShow;
