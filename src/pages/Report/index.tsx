import { version as getGroupCenterVersion } from '@/services/group_center/programInfo';
import { Alert, Card, Col, Layout, Row, Spin, version } from 'antd';
import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';
import packageJson from '../../../package.json';

export default function ReportPage() {
  const uaString = navigator.userAgent;
  const [groupCenterVersion, setGroupCenterVersion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const uaParser = new UAParser(uaString);

  const uaBrowser = uaParser.getBrowser();
  const uaCpu = uaParser.getCPU();
  const uaEngine = uaParser.getEngine();
  const uaDevice = uaParser.getDevice();
  const uaOs = uaParser.getOS();
  const uaResult = uaParser.getResult();

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        setLoading(true);
        const version = await getGroupCenterVersion();
        setGroupCenterVersion(version);
        setError('');
      } catch (err) {
        console.error('Failed to fetch GroupCenter version:', err);
        setError('Failed to fetch GroupCenter version');
        setGroupCenterVersion('Unknown');
      } finally {
        setLoading(false);
      }
    };

    fetchVersion();
  }, []);

  return (
    <Layout style={{ padding: '16px' }}>
      <Card
        title={`User Agent Info - antd@${version}`}
        style={{ marginBottom: '16px' }}
      >
        {error && (
          <Alert
            message="GroupCenter Version Error"
            description={error}
            type="warning"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card size="small" title="Browser">
              <p>
                <strong>Name:</strong> {uaBrowser.name}
              </p>
              <p>
                <strong>Version:</strong> {uaBrowser.version}
              </p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card size="small" title="Device">
              <p>
                <strong>Vendor:</strong> {uaDevice.vendor || 'Unknown'}
              </p>
              <p>
                <strong>Model:</strong> {uaDevice.model || 'Unknown'}
              </p>
              <p>
                <strong>Type:</strong> {uaDevice.type || 'Unknown'}
              </p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card size="small" title="Operating System">
              <p>
                <strong>Name:</strong> {uaOs.name}
              </p>
              <p>
                <strong>Version:</strong> {uaOs.version}
              </p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card size="small" title="Engine">
              <p>
                <strong>Name:</strong> {uaEngine.name}
              </p>
              <p>
                <strong>Version:</strong> {uaEngine.version}
              </p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card size="small" title="CPU">
              <p>
                <strong>Architecture:</strong> {uaCpu.architecture || 'Unknown'}
              </p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card size="small" title="GroupCenter Version">
              {loading ? (
                <div style={{ textAlign: 'center' }}>
                  <Spin size="small" />
                </div>
              ) : (
                <p>
                  <strong>Version:</strong> {groupCenterVersion}
                </p>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card size="small" title="React App Version">
              <p>
                <strong>Version:</strong> {packageJson.version}
              </p>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={16} lg={12}>
            <Card size="small" title="User Agent String">
              <p
                style={{
                  wordBreak: 'break-all',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  backgroundColor: '#f5f5f5',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                {uaString}
              </p>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="Complete UA Result">
        <pre
          style={{
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '300px',
            backgroundColor: '#f5f5f5',
            padding: '12px',
            borderRadius: '4px',
          }}
        >
          {JSON.stringify(uaResult, null, 2)}
        </pre>
      </Card>
    </Layout>
  );
}
