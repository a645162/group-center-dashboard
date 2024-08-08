import { PageContainer } from '@ant-design/pro-components';
import GpuDashboardPageContent from './GpuDashboardPageContent';
import styles from './index.less';

const GpuPage: React.FC = () => {
  // const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <GpuDashboardPageContent />
      </div>
    </PageContainer>
  );
};

export default GpuPage;
