import { QrcodeOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Popover, QRCode } from 'antd';
import React from 'react';

import VShow from '@/components/Vue/V-Show';
import { openUrlInNewWindow } from '@/utils/WebBrowser/NewPage';
import styles from './HomeSiteItemWidget.less';

interface Props {
  siteObject: API.DataDashBoardSite;
}

const HomeSiteItemWidget: React.FC<Props> = (props) => {
  const { siteObject } = props;

  const onCardClick = () => {
    openUrlInNewWindow(siteObject.url);
  };

  const QrCodeContent = () => (
    <div>
      <QRCode
        errorLevel="H"
        value={siteObject.url}
        icon={siteObject.iconUrl}
        bordered={false}
      />
    </div>
  );

  return (
    <Card className={styles.card} onClick={onCardClick}>
      <div className={styles.containerDiv}>
        {/* Icon */}
        <Avatar className={styles.avatar} size={32} src={siteObject.iconUrl} />

        {/* Name */}
        <a className={styles.aText}>{siteObject.name}</a>

        {/* QRCode */}
        <VShow v-show={siteObject.supportQrCode}>
          <Popover className={styles.popover} content={<QrCodeContent />}>
            <Button shape="circle" icon={<QrcodeOutlined />} />
          </Popover>
        </VShow>
      </div>
    </Card>
  );
};

export default HomeSiteItemWidget;
