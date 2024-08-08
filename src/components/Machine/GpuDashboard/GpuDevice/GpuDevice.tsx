import React from 'react';
import GpuTaskListCard from './GpuTaskListCard';
import GpuUsageCard from './GpuUsageCard';

interface Props {
  apiUrl: string;
  gpuIndex: number;
}

const GpuDevice: React.FC<Props> = (props) => {
  const { apiUrl, gpuIndex } = props;

  return (
    <div>
      <GpuUsageCard apiUrl={apiUrl} gpuIndex={gpuIndex} />
      <GpuTaskListCard apiUrl={apiUrl} gpuIndex={gpuIndex} />
    </div>
  );
};

export default GpuDevice;
