import React from 'react';
import GpuTaskListCard from './Task/GpuTaskListCard';
import GpuUsageCard from './Usage/GpuUsageCard';

import styles from './GpuDevice.less';

interface Props {
  apiUrl: string;
  gpuIndex: number;
}

const GpuDevice: React.FC<Props> = (props) => {
  const { apiUrl, gpuIndex } = props;

  return (
    <div className={styles.gpuDevice}>
      <div className={styles.gpuUsageDiv}>
        <GpuUsageCard apiUrl={apiUrl} gpuIndex={gpuIndex} />
      </div>

      <div className={styles.gpuTaskDiv}>
        <GpuTaskListCard apiUrl={apiUrl} gpuIndex={gpuIndex} />
      </div>
    </div>
  );
};

export default GpuDevice;
