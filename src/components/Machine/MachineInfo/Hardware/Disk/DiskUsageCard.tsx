import VShow from '@/components/Vue/V-Show';
import { green, orange, red } from '@ant-design/colors';
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Card, Progress, Tag } from 'antd';
import React from 'react';

interface Props {
  diskUsage: API.MachineDiskUsage;
}

const calculateColorIndex = (
  percent: number,
  max: number = 8,
  min: number = 3,
) => {
  const maxValue = max > min ? max : min;
  const minValue = max > min ? min : max;

  return Math.floor(((maxValue - minValue) * percent) / 100 + minValue);
};
const computeColor = (percent: number) => {
  const threshold1 = 40,
    threshold2 = 80;
  if (percent < threshold1) {
    return green[calculateColorIndex(percent / threshold1, 8, 3)];
  } else if (percent >= threshold1 && percent < threshold2) {
    return orange[
      (calculateColorIndex((percent - threshold1) / (threshold2 - threshold1)),
      8,
      5)
    ];
  } else {
    return red[
      calculateColorIndex((percent - threshold2) / (100 - threshold2), 8, 5)
    ];
  }
};

const ProgressConponent = (percent: number) => {
  // format = {(percent) => `${percent} Days`}
  return (
    <Progress
      percent={percent}
      size="small"
      strokeColor={computeColor(percent)}
      format={(percent) => `${percent}`.padStart(2, '0') + '%'}
    />
  );
};

const DiskUsageCard: React.FC<Props> = (props) => {
  const { diskUsage } = props;

  const cardTitle = `${diskUsage.mountPoint}(${diskUsage.purpose})`;

  const divStyle = {
    margin: '4px',
    paddingLeft: '4px',
  };

  const cardStyle = {
    minWidth: 100,
  };

  return (
    <div className="disk-usage-card" style={divStyle}>
      <Card size="small" title={cardTitle} style={cardStyle}>
        {ProgressConponent(diskUsage.usedPercentage)}
        <div>已用: {diskUsage.usedStr}</div>
        <div>可用: {diskUsage.freeStr}</div>
        <div>总共: {diskUsage.totalStr}</div>
        <div style={{ paddingTop: '4px' }}>
          <VShow v-show={diskUsage.triggerHighPercentageUsed}>
            <Tag icon={<ExclamationCircleOutlined />} color="warning">
              已用高占比
            </Tag>
          </VShow>

          <VShow v-show={diskUsage.triggerLowFreeBytes}>
            <Tag icon={<ExclamationCircleOutlined />} color="warning">
              低可用空间
            </Tag>
          </VShow>

          <VShow v-show={diskUsage.triggerSizeWarning}>
            <Tag icon={<CloseCircleOutlined />} color="error">
              需要清理
            </Tag>
          </VShow>
        </div>
      </Card>
    </div>
  );
};

export default DiskUsageCard;
