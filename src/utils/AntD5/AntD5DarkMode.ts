import { MappingAlgorithm, theme } from 'antd';
import { useAntdConfig, useAntdConfigSetter } from 'umi';
const { darkAlgorithm, defaultAlgorithm } = theme;

export const GetSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const GetIsDarkMode = (): boolean => {
  const antdConfig = useAntdConfig();

  const algorithm = antdConfig.theme!.algorithm as MappingAlgorithm[];

  return algorithm.includes(darkAlgorithm);
};

export const SetDarkMode = (isDarkMode: boolean) => {
  const setAntdConfig = useAntdConfigSetter();

  setAntdConfig({
    theme: {
      algorithm: [isDarkMode ? darkAlgorithm : defaultAlgorithm],
    },
  });
};

export const ToggleDarkMode = () => {
  const setAntdConfig = useAntdConfigSetter();

  setAntdConfig((config) => {
    if (!config.theme!.algorithm) {
      config.theme!.algorithm = [defaultAlgorithm];
    }

    // Check `config.theme!.algorithm` Type is Array
    if (!Array.isArray(config.theme!.algorithm)) {
      config.theme!.algorithm = [config.theme!.algorithm as MappingAlgorithm];
    }

    const algorithm = config.theme!.algorithm as MappingAlgorithm[];
    if (algorithm.includes(darkAlgorithm)) {
      config.theme!.algorithm = [defaultAlgorithm];
    } else {
      config.theme!.algorithm = [darkAlgorithm];
    }

    return config;
  });
};
