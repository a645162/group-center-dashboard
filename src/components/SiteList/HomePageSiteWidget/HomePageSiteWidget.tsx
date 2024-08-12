import { getPublicSiteClassList } from '@/services/group_center';
import React, { useEffect, useState } from 'react';
import styles from './HomePageSiteWidget.less';
import HomeSiteClassWidget from './HomeSiteClassWidget/HomeSiteClassWidget';

const useSiteClassListState = () => {
  const [siteClassList, setSiteClassList] = useState<
    API.DataDashBoardSiteClass[]
  >([]);

  useEffect(() => {
    getPublicSiteClassList()
      .then((data) => {
        // console.log('data:', data);
        setSiteClassList(data);
      })
      .catch((error: any) => {
        console.log('error:', error);
      });
  }, []); // 依赖项数组为空数组，只在组件挂载时执行

  return siteClassList;
};

const HomePageSiteWidget: React.FC = () => {
  const siteClassList = useSiteClassListState();

  return (
    <div className={styles.mainDiv}>
      <div>
        {siteClassList.map((item) => (
          <div key={item.className}>
            <HomeSiteClassWidget siteClassObject={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePageSiteWidget;
