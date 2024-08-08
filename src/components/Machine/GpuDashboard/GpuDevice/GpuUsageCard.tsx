import React from 'react';

interface Props {
  apiUrl: string;
  gpuIndex: number;
}

const GpuUsageCard: React.FC<Props> = (props) => {
  const { apiUrl, gpuIndex } = props;

  return (
    <div>
      <h1>GpuUsageCard</h1>
      <h2>
        ({apiUrl})-{gpuIndex}
      </h2>

      <div></div>
    </div>
  );
};

export default GpuUsageCard;
