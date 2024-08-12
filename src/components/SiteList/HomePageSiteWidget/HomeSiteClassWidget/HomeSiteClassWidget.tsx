import React from 'react';
import HomeSiteItemWidget from './HomeSiteItemWidget/HomeSiteItemWidget';

interface Props {
  siteClassObject: API.DataDashBoardSiteClass;
}

const HomeSiteClassWidget: React.FC<Props> = (props) => {
  const { siteClassObject } = props;

  return (
    <div>
      <div>{siteClassObject.className}</div>
      {siteClassObject.sites.map((siteObject) => {
        return (
          <div key={siteObject.name}>
            <HomeSiteItemWidget siteObject={siteObject} />
          </div>
        );
      })}
    </div>
  );
};

export default HomeSiteClassWidget;
