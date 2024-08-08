import RunTimeComponent from '@/components/Time/RunTimeComponent';
import { Card, Divider, Space } from 'antd';
import React from 'react';

interface Props {
  index: number;
  taskInfo: API.DashboardGpuTaskItemInfo;
}

const GpuTaskCardItem: React.FC<Props> = (props) => {
  const { index, taskInfo } = props;

  const screenSessionString = taskInfo.screenSessionName
    ? `(${taskInfo.screenSessionName})`
    : '';

  return (
    <div>
      <Space direction="vertical" size={16}>
        <Card
          size="small"
          title={`[${index + 1}]${taskInfo.projectName}${screenSessionString}`}
          extra={<a href="#">详细信息</a>}
          style={{ width: 300 }}
        >
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
        </Card>
      </Space>
    </div>
  );
};

export default GpuTaskCardItem;
