import {
  getUserList,
  getUserSubscriptions,
  unsubscribeProject,
} from '@/services/group_center/publicApi';
import { DeleteOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Empty,
  List,
  Popconfirm,
  Select,
  Space,
  Typography,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';

const { Text, Title } = Typography;

interface UserInfo {
  name: string;
  nameEng: string;
}

interface SubscriptionInfo {
  userName: string;
  subscriptions: string[];
  count: number;
}

const SubscriptionManagementPanel: React.FC = () => {
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [subscriptions, setSubscriptions] = useState<SubscriptionInfo | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // 获取用户列表
  useEffect(() => {
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
  }, [messageApi]);

  // 获取用户订阅列表
  const fetchUserSubscriptions = async (userName: string) => {
    if (!userName) return;

    setLoading(true);
    try {
      const response = await getUserSubscriptions({ userName });

      if (response.isSucceed) {
        setSubscriptions(response.result);
      } else {
        const errorMessage = response.result || '获取订阅列表失败';
        messageApi.error(errorMessage);
        setSubscriptions(null);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      messageApi.error('获取订阅列表时发生错误');
      setSubscriptions(null);
    } finally {
      setLoading(false);
    }
  };

  // 处理用户选择变化
  const handleUserChange = (value: string) => {
    setSelectedUser(value);
    fetchUserSubscriptions(value);
  };

  // 处理取消订阅
  const handleUnsubscribe = async (projectId: string) => {
    if (!selectedUser) return;

    try {
      const response = await unsubscribeProject({
        projectId: parseInt(projectId),
        userName: selectedUser,
      });

      if (response.isSucceed) {
        messageApi.success('取消订阅成功');
        // 重新获取订阅列表
        fetchUserSubscriptions(selectedUser);
      } else {
        const errorMessage = response.result?.message || '取消订阅失败';
        messageApi.error(errorMessage);
      }
    } catch (error) {
      console.error('Error unsubscribing project:', error);
      messageApi.error('取消订阅时发生错误');
    }
  };

  return (
    <>
      {contextHolder}
      <Card
        title="订阅管理"
        style={{
          marginBottom: 16,
          width: '100%',
          maxWidth: '100%',
        }}
        bodyStyle={{ padding: '24px' }}
        extra={<Text type="secondary">查看和管理用户的项目订阅</Text>}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ fontSize: '16px' }}>
              选择用户:
            </Text>
            <Select
              style={{
                width: '100%',
                marginTop: 12,
                maxWidth: '400px',
              }}
              size="large"
              placeholder="请选择用户"
              value={selectedUser || undefined}
              onChange={handleUserChange}
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

          {selectedUser && subscriptions && (
            <div style={{ width: '100%' }}>
              <Title level={4} style={{ marginBottom: 16 }}>
                用户 {selectedUser} 的订阅项目 ({subscriptions.count} 个)
              </Title>

              {subscriptions.count > 0 ? (
                <List
                  loading={loading}
                  dataSource={subscriptions.subscriptions}
                  style={{ width: '100%' }}
                  renderItem={(projectId) => (
                    <List.Item
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                      actions={[
                        <Popconfirm
                          key="unsubscribe"
                          title="确认取消订阅"
                          description={`确定要取消订阅项目 ${projectId} 吗？`}
                          onConfirm={() => handleUnsubscribe(projectId)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            size="middle"
                          >
                            取消订阅
                          </Button>
                        </Popconfirm>,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <Text strong style={{ fontSize: '16px' }}>
                            项目 ID: {projectId}
                          </Text>
                        }
                        description={`用户: ${subscriptions.userName}`}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty
                  description="该用户暂无订阅项目"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ margin: '40px 0' }}
                />
              )}
            </div>
          )}

          {selectedUser && !subscriptions && !loading && (
            <Empty
              description="暂无订阅数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Space>
      </Card>
    </>
  );
};

export default SubscriptionManagementPanel;
