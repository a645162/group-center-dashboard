import ThemeSwitch from '@/components/UI/ThemeSwitch';
import { Layout, Space } from 'antd';

export default function DevSettings() {
  return (
    <Layout>
      <Space>
        <div>
          Theme Switch <ThemeSwitch />
        </div>
      </Space>
    </Layout>
  );
}
