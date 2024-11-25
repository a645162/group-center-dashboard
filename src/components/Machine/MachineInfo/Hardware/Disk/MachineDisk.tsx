import { getDiskUsage } from '@/services/agent/MachineInfo';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import DiskUsageCard from './DiskUsageCard';
import styles from './MachineDisk.less';

interface Props {
  name: string;
  apiUrl: string;
}

const useDiskUsageState = (apiUrl: string) => {
  const [diskUsage, setDiskUsage] = useState<API.MachineDiskUsage[]>([]);

  useEffect(() => {
    getDiskUsage(apiUrl)
      .then((data) => {
        setDiskUsage(data.diskUsage);
      })
      .catch((error: any) => {
        console.log('error:', error);
      });
  }, [apiUrl]);

  return diskUsage;
};

const cardContent = (mountPointList: API.MachineDiskUsage[]) => {
  return mountPointList.length === 0 ? (
    <div>暂无任何硬盘挂载点</div>
  ) : (
    <div className={styles.diskList}>
      {mountPointList.map((diskUsage, index) => (
        <div key={index} className={styles.diskItem}>
          <DiskUsageCard diskUsage={diskUsage} />
        </div>
      ))}
    </div>
  );
};

const MachineDisk: React.FC<Props> = (props) => {
  const { name, apiUrl } = props;

  const diskUsageState = useDiskUsageState(apiUrl);

  return (
    <div className="gpu-usage-card">
      <Card size="default" title={name}>
        {cardContent(diskUsageState)}
      </Card>
    </div>
  );
};

export default MachineDisk;
