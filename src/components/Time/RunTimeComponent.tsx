import { padTime } from '@/utils/Time/DateTimeUtils';
import React, { useEffect, useState } from 'react';

// 自定义钩子，用于计时
function useTimer(startTime: number) {
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const tick = () => {
      setCurrentTime(Date.now());
    };

    tick(); // 初始调用
    const intervalId = setInterval(tick, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [startTime]); // 依赖 startTime

  return currentTime;
}

// 格式化运行时间
function formatRuntime(runtimeInSeconds: number): string {
  const hours = Math.floor(runtimeInSeconds / 3600);
  const minutes = Math.floor((runtimeInSeconds % 3600) / 60);
  const seconds = Math.floor(runtimeInSeconds % 60);

  const days = Math.floor(hours / 24);
  const hoursInDay = hours % 24;

  if (days > 0) {
    return `${days}天${padTime(hoursInDay)}时${padTime(minutes)}分`;
  } else {
    if (hours === 0) {
      return `${padTime(minutes)}分${padTime(seconds)}秒`;
    }
    return `${padTime(hours)}时${padTime(minutes)}分${padTime(seconds)}秒`;
  }
}

interface RuntimeComponentProps {
  startTime: number;
}

const RunTimeComponent: React.FC<RuntimeComponentProps> = ({ startTime }) => {
  const currentTime = useTimer(startTime);
  const runtimeInSeconds = (currentTime - startTime) / 1000;
  const runtime = formatRuntime(runtimeInSeconds);

  return <div className="component-run-time">{runtime}</div>;
};

export default RunTimeComponent;
