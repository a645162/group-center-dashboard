import { PageContainer } from '@ant-design/pro-components';
import DiskDashboardPageContent from './DiskDashboardPageContent';
import styles from './index.less';

const DiskPage: React.FC = () => {
  // const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <DiskDashboardPageContent />
      </div>
    </PageContainer>
  );
};

export default DiskPage;
