import Guide from '@/components/Guide';
import HomePageSiteWidget from '@/components/SiteList/HomePageSiteWidget/HomePageSiteWidget';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import Clock from 'react-live-clock';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <div className={styles.helloDiv}>
          <Guide name={trim(name)} />
        </div>

        <div className={styles.clockDiv}>
          <Clock
            format="YYYY年MM月DD日 HH:mm:ss"
            interval={1000}
            ticking={true}
          />
        </div>

        <div className={styles.containerSiteList}>
          <HomePageSiteWidget />
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
