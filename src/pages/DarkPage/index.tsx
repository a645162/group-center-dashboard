import { SetDarkMode, ToggleDarkMode } from '@/utils/AntD5/AntD5DarkMode';
import { Button, Card, Col, Layout, Row, Space, Switch, version } from 'antd';

export default function DarkPage() {
  return (
    <Layout style={{ padding: '16px', minHeight: '100vh' }}>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Card title={`Dark Mode Test - antd@${version}`}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>Dark Mode Controls</h3>
              </div>

              <Card size="small" title="Switch Control">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>Dark Mode:</span>
                    <Switch
                      onChange={(isChecked: boolean) => {
                        SetDarkMode(isChecked);
                      }}
                    />
                  </div>
                </Space>
              </Card>

              <Card size="small" title="Button Controls">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    onClick={ToggleDarkMode}
                    block
                    size="large"
                  >
                    Toggle Dark Mode
                  </Button>

                  <Button onClick={() => SetDarkMode(true)} block>
                    Enable Dark Mode
                  </Button>

                  <Button onClick={() => SetDarkMode(false)} block>
                    Disable Dark Mode
                  </Button>
                </Space>
              </Card>

              <Card size="small" title="Theme Information">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>Current Theme:</span>
                    <span style={{ fontWeight: 'bold' }}>
                      {window.matchMedia('(prefers-color-scheme: dark)').matches
                        ? 'Dark'
                        : 'Light'}
                    </span>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>System Preference:</span>
                    <span>
                      {window.matchMedia('(prefers-color-scheme: dark)').matches
                        ? 'Dark'
                        : 'Light'}
                    </span>
                  </div>
                </Space>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}
