import { getGpuCount } from '@/services/nvi_notify/GpuInfo';
import React, { useEffect, useState } from 'react';
import GpuDevice from './GpuDevice';

interface Props {
  name: string;
  apiUrl: string;
}

const useGpuCountState = (apiUrl: string) => {
  const [gpuCountState, setGpuCountState] = useState<number>(0);

  useEffect(() => {
    getGpuCount(apiUrl)
      .then((responseData) => {
        const data = responseData.data;
        const count = data?.result || 0;
        console.log('Gpu Count:', count);
        setGpuCountState(count);
      })
      .catch((error: any) => {
        console.log('error:', error);
      });
  }, [apiUrl]);

  return gpuCountState;
};

const GpuDashboard: React.FC<Props> = (props) => {
  const { name, apiUrl } = props;

  const gpuCountState = useGpuCountState(apiUrl);

  //   if (gpuCountState === 0) {
  //     return (<div>暂无GPU</div>);
  //   }

  const gpuInfoStyle = {
    display: 'flex',
  };

  return (
    <div>
      <h1>
        {name}({useGpuCountState(apiUrl)}卡)
      </h1>
      <div style={gpuInfoStyle}>
        {Array.from({ length: gpuCountState }, (_, i) => (
          <GpuDevice key={i} apiUrl={apiUrl} gpuIndex={i} />
        ))}
      </div>
    </div>
  );
};

export default GpuDashboard;
