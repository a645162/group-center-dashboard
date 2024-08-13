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
          <div>用户:{taskInfo.name}</div>
        </VShow>

        <VShow v-show={taskInfo.screenSessionName}>
          <div>Screen会话名称:{taskInfo.screenSessionName}</div>
        </VShow>

        <div>启动时间:{getTimeStrFromTimestamp(taskInfo.startTimestamp)}</div>

        <TextDivider />

        <VShow v-show={taskInfo.projectName}>
          <div>项目名称:{taskInfo.projectName}</div>
        </VShow>

        <VShow v-show={taskInfo.pyFileName}>
          <div>Python文件名:{taskInfo.pyFileName}</div>
        </VShow>

        <VShow v-show={taskInfo.projectDirectory}>
          <div>项目目录路径:{taskInfo.projectDirectory}</div>
        </VShow>

        <VShow v-show={taskInfo.pythonVersion}>
          <div>Python版本:{taskInfo.pythonVersion}</div>
        </VShow>

        <VShow v-show={taskInfo.condaEnv}>
          <div>Conda虚拟环境名:{taskInfo.condaEnv}</div>
        </VShow>

        <VShow v-show={systemMainMemoryString(taskInfo)}>
          <div>系统主存(内存):{systemMainMemoryString(taskInfo)}</div>
        </VShow>

        <TextDivider />

        <VShow v-show={taskInfo.gpuMemoryUsage}>
          <div>
            当前显存使用:
            {getMemoryString(convertFromMBToGB(taskInfo.gpuMemoryUsage))}GiB
          </div>
        </VShow>
        {taskInfo.gpuMemoryUsageMax && (
          <div>
            最大显存占用:
            {getMemoryString(convertFromMBToGB(taskInfo.gpuMemoryUsageMax))}GiB
          </div>
        )}

        {/* 多卡 */}
        <VShow v-show={taskInfo.worldSize > 1}>
          <div>
            GPU使用数量:{taskInfo.worldSize}
            <br />
            多卡任务索引:{taskInfo.localRank} ({taskInfo.localRank + 1} /{' '}
            {taskInfo.worldSize})
            <br />
            <VShow v-show={taskInfo.topPythonPid > 0}>
              <div>主进程PID:{taskInfo.topPythonPid}</div>{' '}
            </VShow>
          </div>
        </VShow>

        <VShow v-show={taskInfo.driverVersion}>
          <div>Driver Version:{taskInfo.driverVersion}</div>
        </VShow>
        <VShow v-show={taskInfo.cudaRoot}>
          <div>CUDA Root:{taskInfo.cudaRoot}</div>
        </VShow>
        <VShow v-show={taskInfo.cudaVersion}>
          <div>CUDA Version:{taskInfo.cudaVersion}</div>
        </VShow>
        <VShow v-show={taskInfo.cudaVisibleDevices}>
          <div>CUDA Visible Devices:{taskInfo.cudaVisibleDevices}</div>
        </VShow>

        <TextDivider />

        <VShow v-show={taskInfo.command}>
          <div>命令行:{taskInfo.command}</div>
        </VShow>
      </div>
    </>
  );
};

export default GpuTaskDetailModal;
