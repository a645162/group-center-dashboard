import VShow from '@/components/Vue/V-Show';
import { convertFromMBToGB, getMemoryString } from '@/utils/Convert/MemorySize';
import { getTimeStrFromTimestamp } from '@/utils/Time/DateTimeUtils';
import { Divider } from 'antd';
import styles from './TaskDetail.less';

interface Props {
  taskInfo: API.DashboardGpuTaskItemInfo;
}

const systemMainMemoryString = (item: API.DashboardGpuTaskItemInfo) => {
  const mainMemMB = item.taskMainMemoryMB;
  if (mainMemMB === undefined) {
    return '';
  }
  if (mainMemMB === 0) {
    return '';
  }
  if (mainMemMB < 1024) {
    return `${mainMemMB}MB`;
  }
  return `${convertFromMBToGB(mainMemMB)}GB`;
};

const TextDivider: React.FC = () => {
  return (
    <>
      <Divider className={styles.divider} dashed />
    </>
  );
};

const GpuTaskDetailModal: React.FC<Props> = (props) => {
  const { taskInfo } = props;

  let cudaVersionShort = taskInfo.cudaVersion;
  const cudaVersionShortSpilt = cudaVersionShort.split('.');
  if (cudaVersionShortSpilt.length > 2) {
    cudaVersionShort =
      cudaVersionShortSpilt[0] + '.' + cudaVersionShortSpilt[1];
  }

  return (
    <>
      <div>
        <VShow v-show={taskInfo.name}>
          <div>
            <b>用户: </b>
            {taskInfo.name}
          </div>
        </VShow>

        <VShow v-show={taskInfo.screenSessionName}>
          <div>
            <b>Screen会话名称: </b>
            {taskInfo.screenSessionName}
          </div>
        </VShow>

        <div>
          <b>启动时间: </b>
          {getTimeStrFromTimestamp(taskInfo.startTimestamp)}
        </div>

        <TextDivider />

        <VShow v-show={taskInfo.projectName}>
          <div>
            <b>项目名称: </b>
            {taskInfo.projectName}
          </div>
        </VShow>

        <VShow v-show={taskInfo.pyFileName}>
          <div>
            <b>Python文件名: </b>
            {taskInfo.pyFileName}
          </div>
        </VShow>

        <VShow v-show={taskInfo.projectDirectory}>
          <div>
            <b>项目目录路径: </b>
            {taskInfo.projectDirectory}
          </div>
        </VShow>

        <VShow v-show={taskInfo.pythonVersion}>
          <div>
            <b>Python版本: </b>
            {taskInfo.pythonVersion}
          </div>
        </VShow>

        <VShow v-show={taskInfo.condaEnv}>
          <div>
            <b>Conda虚拟环境名: </b>
            {taskInfo.condaEnv}
          </div>
        </VShow>

        <VShow v-show={systemMainMemoryString(taskInfo)}>
          <div>
            <b>系统主存(内存): </b>
            {systemMainMemoryString(taskInfo)}
          </div>
        </VShow>

        <TextDivider />

        <VShow v-show={taskInfo.gpuMemoryUsage}>
          <div>
            <b>当前显存使用: </b>
            {getMemoryString(convertFromMBToGB(taskInfo.gpuMemoryUsage))}GiB
          </div>
        </VShow>
        {taskInfo.gpuMemoryUsageMax && (
          <div>
            <b>最大显存占用: </b>
            {getMemoryString(convertFromMBToGB(taskInfo.gpuMemoryUsageMax))}GiB
          </div>
        )}

        {/* 多卡 */}
        <VShow v-show={taskInfo.worldSize > 1}>
          <div>
            <b>GPU使用数量: </b>
            {taskInfo.worldSize}
            <br />
            <b>多卡任务索引: </b>
            {taskInfo.localRank} ({taskInfo.localRank + 1} /{' '}
            {taskInfo.worldSize})
            <br />
            <VShow v-show={taskInfo.topPythonPid > 0}>
              <div>
                <b>主进程PID: </b>
                {taskInfo.topPythonPid}
              </div>{' '}
            </VShow>
          </div>
        </VShow>

        <VShow v-show={taskInfo.driverVersion}>
          <div>
            <b>Driver Version: </b>
            {taskInfo.driverVersion}
          </div>
        </VShow>
        <VShow v-show={taskInfo.cudaRoot}>
          <div>
            <b>CUDA Root: </b>
            {taskInfo.cudaRoot}
          </div>
        </VShow>
        <VShow v-show={taskInfo.cudaVersion}>
          <div>
            <b>CUDA Version: </b>
            {taskInfo.cudaVersion}
          </div>
        </VShow>
        <VShow v-show={taskInfo.cudaVisibleDevices}>
          <div>
            <b>CUDA Visible Devices: </b>
            {taskInfo.cudaVisibleDevices}
          </div>
        </VShow>

        <TextDivider />

        <VShow v-show={taskInfo.command}>
          <div>
            <b>命令行:</b>
            <br />
            {taskInfo.command}
          </div>
        </VShow>
      </div>
    </>
  );
};

export default GpuTaskDetailModal;
