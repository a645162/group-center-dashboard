import VShow from '@/components/Vue/V-Show';
import { InvertHexColor } from '@/utils/Convert/Color';
import { SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';
import { getTopPythonPidColor } from './GpuTagColor';

interface Props {
  taskInfo: API.DashboardGpuTaskItemInfo;
}

const MultiGpuTag: React.FC<Props> = (props) => {
  const { taskInfo } = props;

  const isMultiGpu = taskInfo.worldSize > 1;
  const multiGpuString = `${taskInfo.localRank + 1}/${taskInfo.worldSize}`;

  const color = getTopPythonPidColor(taskInfo.topPythonPid);
  const fontColor = InvertHexColor(color);

  return (
    <>
      <VShow v-show={isMultiGpu}>
        <Tag
          icon={<SyncOutlined spin style={{ color: fontColor }} />}
          color={color}
        >
          <a style={{ color: fontColor }}>多卡{multiGpuString}</a>
        </Tag>
      </VShow>
    </>
  );
};

export default MultiGpuTag;
