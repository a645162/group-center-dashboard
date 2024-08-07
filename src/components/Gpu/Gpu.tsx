import { GROUP_CENTER_URL } from '@/constants/group_center';
import { Layout, Row, Typography } from 'antd';
import React from 'react';
import styles from './Gpu.less';
import MachineSelector from './Machine';

interface Props {
  name: string;
}

// 脚手架示例组件
const Gpu: React.FC<Props> = (props) => {
  const { name } = props;
  return (
    <div>
      <Layout>
        <Row>
          <Typography.Title level={3} className={styles.title}>
            欢迎使用 <strong>{name}</strong> ！
          </Typography.Title>
        </Row>
      </Layout>

      <h1>GPU</h1>
      <h2>({GROUP_CENTER_URL})</h2>

      <MachineSelector />
    </div>
  );
};

export default Gpu;
