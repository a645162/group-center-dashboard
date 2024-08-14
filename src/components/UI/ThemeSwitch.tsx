import { GetIsDarkMode } from '@/utils/AntD5/AntD5DarkMode';
import { useSystemThemeListener } from '@/utils/AntD5/SystemThemeListener';
import { Switch, theme } from 'antd';
import React from 'react';
import { useAntdConfigSetter } from 'umi';
const { darkAlgorithm, defaultAlgorithm } = theme;

const ThemeSwitch: React.FC = () => {
  const setAntdConfig = useAntdConfigSetter();

  useSystemThemeListener();

  return (
    <>
      <Switch
        checked={GetIsDarkMode()}
        onChange={(data) => {
          // 此配置会与原配置深合并
          setAntdConfig((config) => {
            return {
              ...config,
              theme: {
                algorithm: [data ? darkAlgorithm : defaultAlgorithm],
              },
            };
          });
        }}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      />
    </>
  );
};

export default ThemeSwitch;
