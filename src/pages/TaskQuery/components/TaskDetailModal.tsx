import { copyToClipboardPromise } from '@/utils/System/Clipboard';
import { Button, message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import TaskDetailContent from './TaskDetailContent';

export interface TaskDetailModalHandles {
  tryToShowModal: () => void;
}

interface Props {
  taskInfo: API.GpuTaskInfo;
}

const TaskDetailModal = React.forwardRef<TaskDetailModalHandles, Props>(
  (props, ref) => {
    const { taskInfo } = props;

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const contentDivRef = React.useRef<HTMLDivElement>(null);

    const [messageApi, contextHolder] = message.useMessage();

    const showModal = () => {
      setOpen(true);
    };

    const onClickCopyAll = () => {
      setLoading(true);

      if (contentDivRef.current) {
        const text = contentDivRef.current.innerText;
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
          })
          .finally(() => {
            setLoading(false);
            setOpen(false);
          });
      }
    };

    const onClickCancel = () => {
      setOpen(false);
    };

    const tryToShowModal = useCallback(() => {
      showModal();
    }, []);

    // 当组件挂载后，将这个组件的实例传递给父组件
    React.useImperativeHandle(ref, () => ({
      tryToShowModal,
    }));

    const title = `[${taskInfo.taskUser}]${taskInfo.projectName}-${taskInfo.pyFileName}`;

    return (
      <>
        {contextHolder}

        <Modal
          open={open}
          title={title}
          onOk={onClickCancel}
          onCancel={onClickCancel}
          width={800}
          footer={[
            <Button key="back" onClick={onClickCancel}>
              关闭
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={onClickCopyAll}
            >
              复制全部
            </Button>,
          ]}
        >
          <div>
            <div ref={contentDivRef}>
              <TaskDetailContent taskInfo={taskInfo} />
            </div>
          </div>
        </Modal>
      </>
    );
  },
);

export default TaskDetailModal;
