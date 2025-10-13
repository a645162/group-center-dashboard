import { SubscriptionManagementPanel } from '@/components/ProjectSubscription';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row } from 'antd';
import React from 'react';
import styles from './index.less';

const AdvancedManagement: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              title="高级管理"
              style={{ minHeight: '400px' }}
              bodyStyle={{ padding: '24px' }}
            >
              <div className={styles.content}>
                <SubscriptionManagementPanel />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default AdvancedManagement;
