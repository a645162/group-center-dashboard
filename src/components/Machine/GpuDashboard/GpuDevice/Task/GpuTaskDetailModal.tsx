import VShow from '@/components/Vue/V-Show';
import { convertFromMBToGB, getMemoryString } from '@/utils/Convert/MemorySize';
import { getTimeStrFromTimestamp } from '@/utils/Time/DateTimeUtils';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';

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

const GpuTaskDetailModal: React.FC<Props> = (props) => {
  const { taskInfo } = props;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Show Detail
      </Button>
      <Modal
        open={open}
        title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Submit
          </Button>,
          <Button
            key="link"
            href="https://google.com"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Search on Google
          </Button>,
        ]}
      >
        {/* <Divider dashed /> */}

        <div>用户名:{taskInfo.name}</div>

        {/* <Divider dashed /> */}

        <VShow v-show={taskInfo.screenSessionName.length > 0}>
          <div>Screen会话名称:{taskInfo.screenSessionName}</div>
        </VShow>

        {taskInfo.projectName && <div>项目名称:{taskInfo.projectName}</div>}

        {taskInfo.projectDirectory && (
          <div>项目目录:{taskInfo.projectDirectory}</div>
        )}

        {taskInfo.pyFileName && <div>Python文件名:{taskInfo.pyFileName}</div>}

        {taskInfo.condaEnv && <div>Conda环境:{taskInfo.condaEnv}</div>}
        {taskInfo.pythonVersion && (
          <div>Python Version:{taskInfo.pythonVersion}</div>
        )}

        <div>启动时间:{getTimeStrFromTimestamp(taskInfo.startTimestamp)}</div>

        {/* <Divider dashed /> */}

        {systemMainMemoryString(taskInfo) !== '' && (
          <div>系统主存:{systemMainMemoryString(taskInfo)}</div>
        )}

        {/* <Divider dashed /> */}

        {taskInfo.gpuMemoryUsage && (
          <div>
            当前显存使用:
            {getMemoryString(convertFromMBToGB(taskInfo.gpuMemoryUsage))}GiB
          </div>
        )}
        {taskInfo.gpuMemoryUsageMax && (
          <div>
            最大显存占用:
            {getMemoryString(convertFromMBToGB(taskInfo.gpuMemoryUsageMax))}GiB
          </div>
        )}

        {taskInfo.worldSize > 1 && (
          <div>
            GPU使用数量:{taskInfo.worldSize}
            <br />
            多卡任务索引:{taskInfo.localRank} ({taskInfo.localRank + 1} /{' '}
            {taskInfo.worldSize})
          </div>
        )}

        {taskInfo.driverVersion && (
          <div>Driver Version:{taskInfo.driverVersion}</div>
        )}
        {taskInfo.cudaRoot && <div>CUDA Root:{taskInfo.cudaRoot}</div>}
        {taskInfo.cudaVersion && <div>CUDA Version:{taskInfo.cudaVersion}</div>}
        {taskInfo.cudaVisibleDevices && (
          <div>CUDA Visible Devices:{taskInfo.cudaVisibleDevices}</div>
        )}

        {/* <Divider dashed /> */}

        {taskInfo.command && <div>命令行:{taskInfo.command}</div>}
      </Modal>
    </>
  );
};

export default GpuTaskDetailModal;
