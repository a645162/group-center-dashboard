import React from 'react';
import GpuTaskListCard from './Task/GpuTaskListCard';
import GpuUsageCard from './Usage/GpuUsageCard';

import './GpuDevice.less';

interface Props {
  apiUrl: string;
  gpuIndex: number;
}

const GpuDevice: React.FC<Props> = (props) => {
  const { apiUrl, gpuIndex } = props;

  return (
    <div className="gpu-device">
      <GpuUsageCard apiUrl={apiUrl} gpuIndex={gpuIndex} />
      <GpuTaskListCard apiUrl={apiUrl} gpuIndex={gpuIndex} />
    </div>
  );
};

export default GpuDevice;
