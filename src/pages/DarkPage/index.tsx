import { SetDarkMode, ToggleDarkMode } from '@/utils/AntD5/AntD5DarkMode';
import { Button, Layout, Space, Switch, version } from 'antd';

export default function DarkPage() {
  return (
    <Layout>
      <h1>with antd@{version}</h1>
      <Space>
        isDarkTheme
        <Switch
          //   checked={getIsDarkMode()}
          onChange={(isChecked: boolean) => {
            SetDarkMode(isChecked);
          }}
        />
        <Button onClick={ToggleDarkMode}>Toggle Dark Mode</Button>
      </Space>
    </Layout>
  );
}
