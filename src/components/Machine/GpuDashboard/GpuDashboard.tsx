import React from 'react';

interface Props {
  name: string;
  apiUrl: string;
}

const GpuDashboard: React.FC<Props> = (props) => {
  const { name, apiUrl } = props;

  return (
    <div>
      <h1>{name}</h1>
      <h2>({apiUrl})</h2>

      <div></div>
    </div>
  );
};

export default GpuDashboard;
