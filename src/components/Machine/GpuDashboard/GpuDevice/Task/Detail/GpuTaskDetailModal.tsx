import { copyToClipboardPromise } from '@/utils/System/Clipboard';
import { Button, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import GpuTaskDetailContent from './GpuTaskDetailContent';

export interface GpuTaskDetailModalHandles {
  tryToShowModal: () => void;
}

interface Props {
  taskInfo: API.DashboardGpuTaskItemInfo;
}

const GpuTaskDetailModal = React.forwardRef<GpuTaskDetailModalHandles, Props>(
  (props, ref) => {
    const { taskInfo } = props;

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const contentDivRef = React.useRef<HTMLDivElement>(null);

    const showModal = () => {
      setOpen(true);
    };

    const onClickCopyAll = () => {
      setLoading(true);

      if (contentDivRef.current) {
        const text = contentDivRef.current.innerText;
        copyToClipboardPromise(text).finally(() => {
          setLoading(false);
          setOpen(false);
        });
      }
    };

    //   const handleOk = () => {
    //     setLoading(true);
    //     setTimeout(() => {
    //       setLoading(false);
    //       setOpen(false);
    //     }, 3000);
    //   };

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

    return (
      <>
        {/* <Button type="primary" onClick={showModal}>
          Show Detail
        </Button> */}
        <Modal
          open={open}
          title="Title"
          onOk={onClickCancel}
          onCancel={onClickCancel}
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
            //   <Button key="link" type="primary" loading={loading} onClick={copyAll}>
            //     复制全部
            //   </Button>,
          ]}
        >
          <div ref={contentDivRef}>
            <GpuTaskDetailContent taskInfo={taskInfo} />
          </div>
        </Modal>
      </>
    );
  },
);

export default GpuTaskDetailModal;
