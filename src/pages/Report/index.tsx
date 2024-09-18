import { Layout, Space, version } from 'antd';
import { UAParser } from 'ua-parser-js';

export default function ReportPage() {
  const uaString = navigator.userAgent;

  const uaParser = new UAParser(uaString);

  const uaBrowser = uaParser.getBrowser();
  console.log(uaBrowser);

  const uaCpu = uaParser.getCPU();
  console.log(uaCpu);

  const uaEngine = uaParser.getEngine();
  console.log(uaEngine);

  const uaDevice = uaParser.getDevice();
  console.log(uaDevice);

  const uaOs = uaParser.getOS();
  console.log(uaOs);

  const uaResult = uaParser.getResult();
  console.log(uaResult);

  return (
    <Layout>
      <h1>with antd@{version}</h1>
      <Space>
        <p>
          Browser: {uaBrowser.name}({uaBrowser.version})
        </p>
        <p>
          Device: {uaDevice.vendor} {uaDevice.model}
        </p>
        <p>
          OS: {uaOs.name} {uaOs.version}
        </p>
        <p>
          Engine: {uaEngine.name} {uaEngine.version}
        </p>
        <p>CPU: {uaCpu.architecture}</p>
        <p>Result: {JSON.stringify(uaResult)}</p>
        <p>UA: {uaString}</p>
      </Space>
    </Layout>
  );
}
