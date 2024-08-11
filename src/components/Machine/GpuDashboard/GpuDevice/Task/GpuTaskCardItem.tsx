import RunTimeComponent from '@/components/Time/RunTimeComponent';
import VShow from '@/components/Vue/V-Show';
import { convertFromMBToGB, getMemoryString } from '@/utils/Convert/MemorySize';
import { BugOutlined, DatabaseOutlined, SyncOutlined } from '@ant-design/icons';
import { Card, Divider, Space, Tag } from 'antd';
import React, { useRef } from 'react';
import GpuTaskDetailModal, {
  GpuTaskDetailModalHandles,
} from './Detail/GpuTaskDetailModal';

import { FilterUseEffect, UseFilter } from './Filter';
import './GpuTaskItem.less';

interface Props {
  index: number;
  taskInfo: API.DashboardGpuTaskItemInfo;
}

const GpuTaskCardItem: React.FC<Props> = (props) => {
  const { index, taskInfo } = props;

  const modalFunctionRef = useRef<GpuTaskDetailModalHandles>(null);

  FilterUseEffect();

  const filterResult = UseFilter(taskInfo);

  if (!filterResult) {
    return <></>;
  }

  const onClickShowDetail = () => {
    modalFunctionRef.current?.tryToShowModal();
  };

  const screenSessionString = taskInfo.screenSessionName
    ? `(${taskInfo.screenSessionName})`
    : '';

  const isMultiGpu = taskInfo.worldSize > 1;
  const multiGpuString = `${taskInfo.localRank + 1}/${taskInfo.worldSize}`;

  return (
    <div>
      <GpuTaskDetailModal taskInfo={taskInfo} ref={modalFunctionRef} />
      <Space direction="vertical" size={16}>
        <Card
          size="small"
          title={`[${index + 1}]${taskInfo.projectName}-${taskInfo.pyFileName}${screenSessionString}`}
          extra={
            <a href="#" onClick={onClickShowDetail}>
              详细信息
            </a>
          }
          style={{ width: 300 }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                width: '100%', // 确保填充满父级容器
                alignItems: 'center', // 确保所有子元素垂直居中
              }}
            >
              {/* 左侧容器 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center', // 水平居中
                  alignItems: 'center', // 垂直居中
                  flexDirection: 'column',
                  flex: 1, // 平分剩余空间
                }}
              >
                <div>{taskInfo.name}</div>
              </div>

              {/* 中间的垂直分割线 */}
              <Divider
                type="vertical"
                style={{
                  margin: '0 0px', // 分割线两侧的间隔
                }}
              />

              {/* 右侧容器 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center', // 水平居中
                  alignItems: 'center', // 垂直居中
                  flexDirection: 'column',
                  flex: 1, // 平分剩余空间
                }}
              >
                <RunTimeComponent startTime={taskInfo.startTimestamp} />
              </div>
            </div>

            <div className="div-tags">
              <Tag icon={<DatabaseOutlined />} color="default">
                {getMemoryString(convertFromMBToGB(taskInfo.gpuMemoryUsage))}GB
              </Tag>

              <VShow v-show={taskInfo.debugMode}>
                <Tag icon={<BugOutlined />} color="processing">
                  调试
                </Tag>
              </VShow>

              <VShow v-show={isMultiGpu}>
                <Tag icon={<SyncOutlined spin />} color="default">
                  多卡{multiGpuString}
                </Tag>
              </VShow>
            </div>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default GpuTaskCardItem;
