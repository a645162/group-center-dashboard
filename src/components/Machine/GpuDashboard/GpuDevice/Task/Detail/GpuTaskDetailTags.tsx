import VShow from '@/components/Vue/V-Show';
import {
  FundProjectionScreenOutlined,
  PythonOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import styles from './TaskDetail.less';

interface Props {
  taskInfo: API.DashboardGpuTaskItemInfo;
}

const GpuTaskDetailTags: React.FC<Props> = (props) => {
  const { taskInfo } = props;

  let cudaVersionShort = taskInfo.cudaVersion;
  const cudaVersionShortSpilt = cudaVersionShort.split('.');
  if (cudaVersionShortSpilt.length > 2) {
    cudaVersionShort =
      cudaVersionShortSpilt[0] + '.' + cudaVersionShortSpilt[1];
  }

  return (
    <>
      <div className={styles.divTags}>
        <VShow v-show={taskInfo.name}>
          <Tag icon={<UserOutlined />} color="default">
            {taskInfo.name}
          </Tag>
        </VShow>

        <VShow v-show={taskInfo.cudaVersion}>
          <Tag icon={<VideoCameraOutlined />} color="default">
            CUDA {cudaVersionShort}
          </Tag>
        </VShow>

        <VShow v-show={taskInfo.pythonVersion}>
          <Tag icon={<PythonOutlined />} color="default">
            Python {taskInfo.pythonVersion}
          </Tag>
        </VShow>

        <VShow v-show={taskInfo.screenSessionName}>
          <Tag icon={<FundProjectionScreenOutlined />} color="default">
            {taskInfo.screenSessionName}
          </Tag>
        </VShow>
      </div>
    </>
  );
};

export default GpuTaskDetailTags;
