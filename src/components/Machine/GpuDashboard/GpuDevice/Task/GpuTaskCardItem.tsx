import RunTimeComponent from '@/components/Time/RunTimeComponent';
import VShow from '@/components/Vue/V-Show';
import { convertFromMBToGB, getMemoryString } from '@/utils/Convert/MemorySize';
import {
  BugOutlined,
  DatabaseOutlined,
  DownOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  Card,
  Divider,
  Dropdown,
  MenuProps,
  message,
  Popconfirm,
  Popover,
  Space,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';
import GpuTaskDetailModal, {
  GpuTaskDetailModalHandles,
} from './Detail/GpuTaskDetailModal';

import { copyToClipboardPromise } from '@/utils/System/Clipboard';
import { getTimeStrFromTimestamp } from '@/utils/Time/DateTimeUtils';
import MultiGpuTag from './Component/MultiGpuTag';
import { FilterUseEffect, UseFilter } from './Filter';
import styles from './GpuTaskCardItem.less';

interface Props {
  index: number;
  taskInfo: API.DashboardGpuTaskItemInfo;
}

const GpuTaskCardItem: React.FC<Props> = (props) => {
  const { index, taskInfo } = props;

  const [openStartTimePopConfirm, setOpenStartTimePopConfirm] = useState(false);
  const [openUserFilterPopConfirm, setOpenUserFilterPopConfirm] =
    useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const modalFunctionRef = useRef<GpuTaskDetailModalHandles>(null);

  FilterUseEffect();

  const filterResult = UseFilter(taskInfo);

  if (!filterResult) {
    return <></>;
  }

  const onClickShowDetail = () => {
    modalFunctionRef.current?.tryToShowModal();
  };

  const screenSessionString = taskInfo.screenSessionName
    ? `(${taskInfo.screenSessionName})`
    : '';
  const cardTitle =
    `[${index + 1}]` +
    `${taskInfo.projectName}-${taskInfo.pyFileName}` +
    screenSessionString;

  const currentGpuMemoryString = getMemoryString(
    convertFromMBToGB(taskInfo.gpuMemoryUsage),
  );
  const maxGpuMemoryString = getMemoryString(
    convertFromMBToGB(taskInfo.gpuMemoryUsageMax),
  );
  const popoverContentGpuMemory = (
    <div style={{ textAlign: 'center' }}>
      <p>{`当前显存占用: ${currentGpuMemoryString} GiB`}</p>
      <p>{`最大显存占用: ${maxGpuMemoryString} GiB`}</p>
    </div>
  );

  const startTimeString = getTimeStrFromTimestamp(taskInfo.startTimestamp);
  const handleCopyStartTimeString = () => {
    const text = startTimeString.trim();
    if (text.length === 0) {
      messageApi.open({
        type: 'error',
        content: '复制失败！',
      });
      return;
    }

    // 复制字符串到剪贴板
    copyToClipboardPromise(text)
      .then(() => {
        messageApi.open({
          type: 'success',
          content: '复制成功！',
        });
      })
      .catch(() => {
        messageApi.open({
          type: 'error',
          content: '复制失败！',
        });
      });

    // 关闭Tip
    setOpenStartTimePopConfirm(false);
  };

  const setUserFilterPopConfirmText = `您是否需要将用户名过滤器设置为:${taskInfo.name}`;
  const handleSetUserFilter = () => {
    // const setUserNameFilter = useGpuTaskFilterUserNameStore(
    //   (state) => state.setUserNameEng,
    // );
    // setUserNameFilter(taskInfo.name);

    setOpenUserFilterPopConfirm(false);

    messageApi.open({
      type: 'success',
      content: '设置完毕！',
    });
  };

  const moreMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: <a onClick={onClickShowDetail}>详细信息</a>,
    },
  ];
  const MoreMenu = () => (
    <>
      <Dropdown menu={{ items: moreMenuItems }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </>
  );

  return (
    <div>
      {contextHolder}
      <GpuTaskDetailModal taskInfo={taskInfo} ref={modalFunctionRef} />
      <Space direction="vertical" size={16}>
        <Card
          size="small"
          title={cardTitle}
          extra={<MoreMenu />}
          style={{ width: 300 }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                width: '100%', // 确保填充满父级容器
                alignItems: 'center', // 确保所有子元素垂直居中
              }}
            >
              {/* 左侧容器 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center', // 水平居中
                  alignItems: 'center', // 垂直居中
                  flexDirection: 'column',
                  flex: 1, // 平分剩余空间
                }}
              >
                <Popconfirm
                  placement="bottom"
                  title="用户名过滤器"
                  description={setUserFilterPopConfirmText}
                  okText="好的!"
                  cancelText="什么都不做"
                  icon={<QuestionCircleOutlined style={{ color: 'gray' }} />}
                  open={openUserFilterPopConfirm}
                  onConfirm={handleSetUserFilter}
                  onCancel={() => {
                    setOpenUserFilterPopConfirm(false);
                  }}
                >
                  <div
                    onClick={() => {
                      setOpenUserFilterPopConfirm(true);
                    }}
                  >
                    <div>{taskInfo.name}</div>
                  </div>
                </Popconfirm>
              </div>

              {/* 中间的垂直分割线 */}
              <Divider
                type="vertical"
                style={{
                  margin: '0 0px', // 分割线两侧的间隔
                }}
              />

              {/* 右侧容器 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center', // 水平居中
                  alignItems: 'center', // 垂直居中
                  flexDirection: 'column',
                  flex: 1, // 平分剩余空间
                }}
              >
                <Popconfirm
                  placement="bottom"
                  title="启动时间"
                  description={startTimeString}
                  okText="复制"
                  cancelText="我知道了"
                  icon={<QuestionCircleOutlined style={{ color: 'gray' }} />}
                  open={openStartTimePopConfirm}
                  onConfirm={handleCopyStartTimeString}
                  onCancel={() => {
                    setOpenStartTimePopConfirm(false);
                  }}
                >
                  <div
                    onClick={() => {
                      setOpenStartTimePopConfirm(true);
                    }}
                  >
                    <RunTimeComponent startTime={taskInfo.startTimestamp} />
                  </div>
                </Popconfirm>
              </div>
            </div>

            <div className={styles.divTags}>
              <Popover
                placement="bottom"
                title="显存使用情况"
                content={popoverContentGpuMemory}
              >
                <Tag icon={<DatabaseOutlined />} color="default">
                  {currentGpuMemoryString}GB
                </Tag>
              </Popover>

              <VShow v-show={taskInfo.debugMode}>
                <Popover
                  placement="bottom"
                  title="调试模式"
                  content="当前代码正在被调试器调试"
                >
                  <Tag icon={<BugOutlined />} color="processing">
                    调试
                  </Tag>
                </Popover>
              </VShow>
              <MultiGpuTag taskInfo={taskInfo} />
            </div>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default GpuTaskCardItem;
