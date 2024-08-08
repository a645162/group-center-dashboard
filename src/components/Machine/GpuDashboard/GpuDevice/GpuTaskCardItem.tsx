import RunTimeComponent from '@/components/Time/RunTimeComponent';
import { Card, Divider, Space } from 'antd';
import React from 'react';

interface Props {
  index: number;
  taskInfo: API.DashboardGpuTaskItemInfo;
}

const GpuTaskCardItem: React.FC<Props> = (props) => {
  const { index, taskInfo } = props;

  return (
    <div>
      <Space direction="vertical" size={16}>
        <Card
          size="small"
          title={`[${index + 1}]${taskInfo.projectName}`}
          extra={<a href="#">详细信息</a>}
          style={{ width: 300 }}
        >
          <div>
            {/* 左 */}
            <div>{/* 左上 */}</div>

            <div>{/* 左下 */}</div>
          </div>

          {/* 中间的垂直分割线 */}
          <Divider type="vertical" />

          <div>
            {/* 右 */}

            <div>{/* 右上 */}</div>

            <div>
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
