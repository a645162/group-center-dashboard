import RunTimeComponent from '@/components/Time/RunTimeComponent';
import VShow from '@/components/Vue/V-Show';
import { ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Card, Divider, Space, Tag } from 'antd';
import React, { useRef } from 'react';
import GpuTaskDetailModal, {
  GpuTaskDetailModalHandles,
} from './Detail/GpuTaskDetailModal';

interface Props {
  index: number;
  taskInfo: API.DashboardGpuTaskItemInfo;
}

const GpuTaskCardItem: React.FC<Props> = (props) => {
  const { index, taskInfo } = props;

  const modalFunctionRef = useRef<GpuTaskDetailModalHandles>(null);

  const onClickShowDetail = () => {
    modalFunctionRef.current?.tryToShowModal();
  };

  const screenSessionString = taskInfo.screenSessionName
    ? `(${taskInfo.screenSessionName})`
    : '';

  const isMultiGpu = taskInfo.worldSize > 1;
  const multiGpuString = `${taskInfo.localRank}/${taskInfo.worldSize}`;

  return (
    <div>
      <GpuTaskDetailModal taskInfo={taskInfo} ref={modalFunctionRef} />
      <Space direction="vertical" size={16}>
        <Card
          size="small"
          title={`[${index + 1}]${taskInfo.projectName}${screenSessionString}`}
          extra={
            <a href="#" onClick={onClickShowDetail}>
              详细信息
            </a>
          }
          style={{ width: 300 }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* 左侧容器 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginRight: '16px',
                }}
              >
                {/* 左上 */}
                <div>{taskInfo.name}</div>

                {/* 左下 */}
                <div>{/* {taskInfo.} */}</div>
              </div>

              {/* 中间的垂直分割线 */}
              <Divider type="vertical" />

              {/* 右侧容器 */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* 右上 */}

                {/* 右下 */}
                <RunTimeComponent startTime={taskInfo.startTimestamp} />
              </div>
            </div>

            <div className="tags">
              <VShow v-show={taskInfo.debugMode}>
                <Tag icon={<SyncOutlined spin />} color="processing">
                  调试
                </Tag>
              </VShow>

              <VShow v-show={isMultiGpu}>
                <Tag icon={<ClockCircleOutlined />} color="default">
                  {multiGpuString}
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
