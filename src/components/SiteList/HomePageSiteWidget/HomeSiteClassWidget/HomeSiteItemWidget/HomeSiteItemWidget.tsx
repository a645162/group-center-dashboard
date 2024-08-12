import React from 'react';

interface Props {
  siteObject: API.DataDashBoardSite;
}

const HomeSiteItemWidget: React.FC<Props> = (props) => {
  const { siteObject } = props;

  return (
    <div>
      <div>{siteObject.name}</div>
      <div>{siteObject.url}</div>
    </div>
  );
};

export default HomeSiteItemWidget;
