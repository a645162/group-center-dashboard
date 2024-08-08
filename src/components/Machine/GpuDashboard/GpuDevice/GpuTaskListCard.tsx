import React from 'react';

interface Props {
  apiUrl: string;
  gpuIndex: number;
}

const GpuTaskListCard: React.FC<Props> = (props) => {
  const { apiUrl, gpuIndex } = props;

  return (
    <div>
      <h1>GpuTaskListCard</h1>
      <h2>
        ({apiUrl})-{gpuIndex}
      </h2>

      <div></div>
    </div>
  );
};

export default GpuTaskListCard;
