import { Card, Space } from 'antd';
import React from 'react';

interface Props {
  index: number;
  taskInfo: API.GpuTaskInfo;
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
          <p>Card content</p>
        </Card>
      </Space>
    </div>
  );
};

export default GpuTaskCardItem;
