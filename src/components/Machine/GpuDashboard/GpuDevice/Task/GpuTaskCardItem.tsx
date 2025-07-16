import RunTimeComponent from '@/components/Time/RunTimeComponent';
import VShow from '@/components/Vue/V-Show';
import { convertFromMBToGB, getMemoryString } from '@/utils/Convert/MemorySize';
import {
  BugOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DatabaseOutlined,
  DownOutlined,
  ForkOutlined,
  QuestionCircleOutlined,
  WarningOutlined,
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

import DisableSelectDiv from '@/components/Public/Layout/DisableSelectDiv';
import { GetIsDarkMode } from '@/utils/AntD5/AntD5DarkMode';
import { copyToClipboardPromise } from '@/utils/System/Clipboard';
import { getTimeStrFromTimestamp } from '@/utils/Time/DateTimeUtils';
import {
  ControlledMenu as ContextMenu,
  MenuDivider as ContextMenuDivider,
  MenuItem as ContextMenuItem,
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
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
    `[${index + 1}] ` +
    screenSessionString +
    `${taskInfo.projectName}-${taskInfo.pyFileName}`;

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

  const [isContextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuAnchorPoint, setContextMenuAnchorPoint] = useState({
    x: 0,
    y: 0,
  });

  const isDark = GetIsDarkMode();

  // 判断是否为僵尸进程
  const isZombieProcess =
    taskInfo.zeroAlreadyAlertedGpuUsage && taskInfo.zeroAlreadyAlertedCpuUsage;

  return (
    <div>
      {contextHolder}
      <ContextMenu
        anchorPoint={contextMenuAnchorPoint}
        state={isContextMenuOpen ? 'open' : 'closed'}
        menuStyle={{
          zIndex: 1000,
        }}
        theming={isDark ? 'dark' : undefined}
        direction="right"
        onClose={() => setContextMenuOpen(false)}
      >
        <ContextMenuItem disabled>{taskInfo.projectName}</ContextMenuItem>
        <ContextMenuDivider />
        <ContextMenuItem onClick={onClickShowDetail}>详细信息</ContextMenuItem>
      </ContextMenu>

      {/* Gpu Task Detail Modal */}
      <GpuTaskDetailModal taskInfo={taskInfo} ref={modalFunctionRef} />

      <Space direction="vertical" size={16}>
        <DisableSelectDiv>
          <Card
            className={styles.taskItemCard}
            size="small"
            title={cardTitle}
            extra={<MoreMenu />}
            styles={{
              header: {
                color: isZombieProcess ? '#ff4d4f' : undefined,
              },
              body: {
                color: isZombieProcess ? '#ff4d4f' : undefined,
              },
            }}
            onContextMenu={(e) => {
              if (
                typeof document.hasFocus === 'function' &&
                !document.hasFocus()
              )
                return;

              e.preventDefault();
              setContextMenuAnchorPoint({ x: e.clientX, y: e.clientY });
              setContextMenuOpen(true);
            }}
          >
            <div style={{ color: isZombieProcess ? '#ff4d4f' : undefined }}>
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
                  <Tag
                    icon={<DatabaseOutlined />}
                    color="default"
                    style={{ color: isZombieProcess ? '#ff4d4f' : undefined }}
                  >
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

                <VShow v-show={taskInfo.multiprocessingSpawn}>
                  <Popover
                    placement="bottom"
                    title="Multi-Process Spawn"
                    content="这是一个multiprocessing.spawn进程，不是标准的DDP多卡任务。"
                  >
                    <Tag
                      icon={<ForkOutlined />}
                      color="default"
                      style={{ color: isZombieProcess ? '#ff4d4f' : undefined }}
                    >
                      Spawn
                    </Tag>
                  </Popover>
                </VShow>

                <VShow
                  v-show={
                    taskInfo.zeroAlreadyAlertedGpuUsage &&
                    taskInfo.zeroAlreadyAlertedCpuUsage
                  }
                >
                  <Popover
                    placement="bottom"
                    title="[错误] 僵尸进程"
                    content="GPU和CPU使用率均连续为零，疑似僵尸进程，请及时杀死！"
                  >
                    <Tag icon={<CloseCircleOutlined />} color="error">
                      僵尸进程!
                    </Tag>
                  </Popover>
                </VShow>

                <VShow
                  v-show={
                    taskInfo.zeroAlreadyAlertedCpuUsage &&
                    !taskInfo.zeroAlreadyAlertedGpuUsage
                  }
                >
                  <Popover
                    placement="bottom"
                    title="[警告] CPU 空占用"
                    content="CPU使用率连续为零，已触发警告！"
                  >
                    <Tag icon={<WarningOutlined />} color="warning">
                      CPU 空占用
                    </Tag>
                  </Popover>
                </VShow>

                <VShow
                  v-show={
                    taskInfo.zeroAlreadyAlertedGpuUsage &&
                    !taskInfo.zeroAlreadyAlertedCpuUsage
                  }
                >
                  <Popover
                    placement="bottom"
                    title="[警告] GPU 空占用"
                    content="GPU使用率连续为零，已触发警告！"
                  >
                    <Tag icon={<WarningOutlined />} color="warning">
                      GPU 空占用
                    </Tag>
                  </Popover>
                </VShow>

                <MultiGpuTag taskInfo={taskInfo} />

                <VShow v-show={taskInfo.userEnvEpoch.length > 0}>
                  <Tag icon={<ClockCircleOutlined />} color="processing">
                    {taskInfo.userEnvEpoch}
                  </Tag>
                </VShow>
              </div>
            </div>
          </Card>
        </DisableSelectDiv>
      </Space>
    </div>
  );
};

export default GpuTaskCardItem;
