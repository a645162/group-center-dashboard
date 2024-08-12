import { Layout, Row } from 'antd';
import React from 'react';
import Typed from 'typed.js';
import styles from './Guide.less';

interface Props {
  name: string;
}

const HelloTitle = () => {
  // Create reference to store the DOM element containing the animation
  const el = React.useRef(null);

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['欢迎使用 <i><strong>Group Center</strong></i> ^_^'],
      typeSpeed: 50,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    <div className={styles.typeHelloTitle}>
      <span ref={el} />
    </div>
  );
};

const Guide: React.FC<Props> = (props) => {
  const { name } = props;

  console.info(`欢迎使用 ${name}!`);

  return (
    <Layout>
      <Row>
        {/* <Typography.Title level={3} className={styles.title}>
          欢迎使用 <strong>{name}</strong> ！
        </Typography.Title> */}
        <HelloTitle />
      </Row>
    </Layout>
  );
};

export default Guide;
