import { Avatar, Card } from 'antd';
import React from 'react';
import HomeSiteItemWidget from './HomeSiteItemWidget/HomeSiteItemWidget';

import styles from './HomeSiteClassWidget.less';

interface Props {
  siteClassObject: API.DataDashBoardSiteClass;
}

const HomeSiteClassWidget: React.FC<Props> = (props) => {
  const { siteClassObject } = props;

  const ClassIcon = () => (
    <Avatar
      className={styles.avatar}
      size={32}
      src={siteClassObject.classIconUrl}
    />
  );

  return (
    <div>
      <Card
        title={siteClassObject.className}
        extra={<ClassIcon />}
        className={styles.siteCard}
      >
        <div className={styles.siteListDiv}>
          {siteClassObject.sites.map((siteObject, index) => {
            return (
              <div
                key={index + '_' + siteObject.name}
                className={styles.siteItemDiv}
              >
                <HomeSiteItemWidget siteObject={siteObject} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default HomeSiteClassWidget;
