import { getDiskUsage } from '@/services/agent/MachineInfo';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import DiskUsageCard from './DiskUsageCard';

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

const MachineDisk: React.FC<Props> = (props) => {
  const { name, apiUrl } = props;

  const diskUsageState = useDiskUsageState(apiUrl);

  if (diskUsageState.length === 0) {
    return <div>暂无任何硬盘挂载点</div>;
  }

  const divStyle = {
    display: 'flex',
  };

  return (
    <div className="gpu-usage-card">
      <Card size="small" title={name} extra={<a href="#">More</a>}>
        <div style={divStyle}>
          {diskUsageState.map((diskUsageInfo, index) => (
            <DiskUsageCard key={index} diskUsage={diskUsageInfo} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MachineDisk;
