import Guide from '@/components/Guide';
import HomePageSiteWidget from '@/components/SiteList/HomePageSiteWidget/HomePageSiteWidget';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <div>
          <Guide name={trim(name)} />
        </div>

        <div style={{ width: '100%' }}>
          <HomePageSiteWidget />
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
