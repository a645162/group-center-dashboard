import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import GpuDashboardPageContent from './GpuDashboardPageContent';
import styles from './index.less';

const GpuPage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <GpuDashboardPageContent name={trim(name)} />
      </div>
    </PageContainer>
  );
};

export default GpuPage;
