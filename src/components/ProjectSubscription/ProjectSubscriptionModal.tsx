import {
  getUserList,
  subscribeProject,
} from '@/services/group_center/publicApi';
import { Button, message, Modal, Select, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { Text } = Typography;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  projectId: number;
  projectName: string;
}

interface UserInfo {
  name: string;
  nameEng: string;
}

const ProjectSubscriptionModal: React.FC<Props> = (props) => {
  const { visible, onCancel, onSuccess, projectId, projectName } = props;

  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // 获取用户列表
  useEffect(() => {
    if (visible) {
      getUserList()
        .then((response) => {
          if (response.isSucceed && Array.isArray(response.result)) {
            setUserList(response.result);
          } else {
            console.error('Failed to get user list:', response);
            messageApi.error('获取用户列表失败');
          }
        })
        .catch((error) => {
          console.error('Error fetching user list:', error);
          messageApi.error('获取用户列表时发生错误');
        });
    }
  }, [visible, messageApi]);

  // 处理订阅
  const handleSubscribe = async () => {
    if (!selectedUser) {
      messageApi.warning('请选择用户');
      return;
    }

    setLoading(true);
    try {
      const response = await subscribeProject({
        projectId,
        userName: selectedUser,
      });

      if (response.isSucceed) {
        messageApi.success('订阅成功');
        setSelectedUser('');
        onSuccess();
        onCancel();
      } else {
        const errorMessage = response.result?.message || '订阅失败';
        messageApi.error(errorMessage);
      }
    } catch (error) {
      console.error('Error subscribing project:', error);
      messageApi.error('订阅时发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    setSelectedUser('');
    onCancel();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="订阅项目"
        open={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="subscribe"
            type="primary"
            loading={loading}
            onClick={handleSubscribe}
            disabled={!selectedUser}
          >
            订阅
          </Button>,
        ]}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong>项目信息:</Text>
            <br />
            <Text>项目ID: {projectId}</Text>
            <br />
            <Text>项目名称: {projectName}</Text>
          </div>

          <div>
            <Text strong>选择用户:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="请选择用户"
              value={selectedUser || undefined}
              onChange={setSelectedUser}
              options={userList.map((user) => ({
                label: `${user.name} (${user.nameEng})`,
                value: user.name,
              }))}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </div>

          <div>
            <Text type="secondary">订阅后，当项目完成时您将收到通知</Text>
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default ProjectSubscriptionModal;
