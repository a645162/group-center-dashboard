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
      <h2>({apiUrl})</h2>

      <h1>GpuDevice</h1>
      <h2>Device {gpuIndex}</h2>
      <div>
        <GpuUsageCard apiUrl={apiUrl} gpuIndex={gpuIndex} />
        <GpuTaskListCard apiUrl={apiUrl} gpuIndex={gpuIndex} />
      </div>
    </div>
  );
};

export default GpuDevice;
