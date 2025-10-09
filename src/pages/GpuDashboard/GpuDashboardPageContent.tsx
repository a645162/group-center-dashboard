import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Anchor, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useLocation } from 'umi';

import { getPublicMachineList } from '@/services/group_center/frontendPublic';

import GpuDashboard from '@/components/Machine/GpuDashboard';
import { FilterGroup } from '@/components/Machine/GpuDashboard/Filter';
import VShow from '@/components/Vue/V-Show';
import { getLatestRunGpu, setLatestRunGpu } from '@/data/cookies/Gpu';
import { useGpuTaskFilterCardStore } from '@/data/store/modules/filter/GpuTaskFilterCard';
import { useGpuTaskFilterMachineStore } from '@/data/store/modules/filter/GpuTaskFilterMachine';
import { useGpuTaskFilterMultiGpuStore } from '@/data/store/modules/filter/GpuTaskFilterMultiGpu';
import { useGpuTaskFilterProjectNameStore } from '@/data/store/modules/filter/GpuTaskFilterProjectName';
import { useGpuTaskFilterUserNameStore } from '@/data/store/modules/filter/GpuTaskFilterUserName';
import { parseGpuIds, parseGpuRange } from '@/utils/urlParams';
import styles from './GpuDashboardPageContent.less';

interface Props {
  name?: string;
}

const useMachineListState = () => {
  const [machineList, setMachineList] = useState<API.FrontEndMachine[]>([]);

  useEffect(() => {
    getPublicMachineList()
      .then((data) => {
        // console.log('data:', data);
        setMachineList(data.filter((machine) => machine.isGpu));
      })
      .catch((error: any) => {
        console.log('error:', error);
      });
  }, []); // 依赖项数组为空数组，只在组件挂载时执行

  return machineList;
};

interface GpuDashboardWithNoContentProps {
  machineList: API.FrontEndMachine[] | null;
}

const GpuDashboardWithNoContent: React.FC<GpuDashboardWithNoContentProps> = ({
  machineList,
}) => {
  // 将hooks移到组件内部，确保在React函数组件中调用
  const [showAnchor, setShowAnchor] = useState(() => {
    return window.innerWidth > window.innerHeight; // 横屏默认显示，竖屏默认隐藏
  });

  // 监听屏幕方向变化
  useEffect(() => {
    const handleResize = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setShowAnchor(isLandscape);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!machineList) {
    return <></>;
  }

  return (
    <VShow v-show={machineList !== undefined && machineList.length > 0}>
      {/* 切换按钮 */}
      {machineList.length > 1 && (
        <Button
          type="primary"
          shape="circle"
          icon={showAnchor ? <CloseOutlined /> : <MenuOutlined />}
          onClick={() => setShowAnchor(!showAnchor)}
          style={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            zIndex: 1001,
            width: 50,
            height: 50,
            backgroundColor: 'rgba(24, 144, 255, 0.8)',
            borderColor: 'rgba(24, 144, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        />
      )}

      {/* 浮动在右边的设备导航锚点 */}
      {machineList.length > 1 && showAnchor && (
        <Anchor
          affix={true}
          offsetTop={100}
          style={{
            position: 'fixed',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid rgba(217, 217, 217, 0.8)',
            backdropFilter: 'blur(8px)',
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
          items={machineList.map((machine) => ({
            key: machine.machineName,
            href: `#device-${machine.machineName}`,
            title: machine.machineName,
          }))}
        />
      )}

      <div className={styles.machineDiv}>
        {machineList.map((machine) => (
          <div key={machine.machineName} className={styles.machineItem}>
            <GpuDashboard
              name={machine.machineName}
              apiUrl={machine.machineUrl}
            />
          </div>
        ))}
      </div>
    </VShow>
  );
};

const GpuDashboardPageContent: React.FC<Props> = (props) => {
  const {} = props;
  const location = useLocation();

  const machineList = useMachineListState();

  const [selectedMachineState, setSelectedMachineState] = useState<
    API.FrontEndMachine[] | null
  >(null);

  const [tryToSelectedMachineList, setTryToSelectedMachineList] = useState<
    API.FrontEndMachine[]
  >([]);

  // 获取过滤器状态管理
  const setUserNameEng = useGpuTaskFilterUserNameStore(
    (state) => state.setUserNameEng,
  );
  const setIsFuzzyMatchUser = useGpuTaskFilterUserNameStore(
    (state) => state.setIsFuzzyMatch,
  );
  const setProjectName = useGpuTaskFilterProjectNameStore(
    (state) => state.setProjectName,
  );
  const setIsFuzzyMatchProject = useGpuTaskFilterProjectNameStore(
    (state) => state.setIsFuzzyMatch,
  );
  const setGpuIdFilter = useGpuTaskFilterCardStore(
    (state) => state.setGpuIdFilter,
  );
  const setGpuIdFilterEnabled = useGpuTaskFilterCardStore(
    (state) => state.setGpuIdFilterEnabled,
  );
  const setGpuNameFilter = useGpuTaskFilterCardStore(
    (state) => state.setGpuNameFilter,
  );
  const setGpuNameFilterEnabled = useGpuTaskFilterCardStore(
    (state) => state.setGpuNameFilterEnabled,
  );
  const setMultiGpuFilter = useGpuTaskFilterMultiGpuStore(
    (state) => state.setMultiGpuFilter,
  );
  const setSelectedMachineNames = useGpuTaskFilterMachineStore(
    (state) => state.setSelectedMachineNames,
  );
  const selectedMachineNames = useGpuTaskFilterMachineStore(
    (state) => state.selectedMachineNames,
  );

  // 解析URL参数
  const getUrlMachineName = () => {
    const searchParams = new URLSearchParams(location.search);
    // 获取URL路径中的参数，例如 /gpu-dashboard?4090a 或 /gpu-dashboard?2084
    const pathname = location.pathname;
    const search = location.search;

    console.log('URL pathname:', pathname);
    console.log('URL search:', search);
    console.log('URL searchParams:', Array.from(searchParams.entries()));

    // 如果search不为空，尝试从search中提取简化参数
    if (search && search.length > 1) {
      // 去掉开头的'?'字符
      const paramValue = search.substring(1);
      console.log('URL parameter value:', paramValue);

      // 检查是否是简化格式参数（没有键名，只有值）
      if (
        !searchParams.has('user') &&
        !searchParams.has('project') &&
        !searchParams.has('gpuIds') &&
        !searchParams.has('gpuRange') &&
        !searchParams.has('multiGpu') &&
        !searchParams.has('nameEng')
      ) {
        console.log('Detected simplified URL parameter:', paramValue);
        return paramValue;
      }
    }

    return null;
  };

  // 解析过滤器URL参数并设置过滤器状态
  const parseFilterParams = () => {
    const searchParams = new URLSearchParams(location.search);
    let hasFilterParams = false;

    // 解析用户名过滤器
    const userParam = searchParams.get('user');
    if (userParam) {
      console.log('Setting user filter from URL:', userParam);
      setUserNameEng(userParam);
      setIsFuzzyMatchUser(true); // 默认使用模糊匹配
      hasFilterParams = true;
    }

    // 解析工程名过滤器
    const projectParam = searchParams.get('project');
    if (projectParam) {
      console.log('Setting project filter from URL:', projectParam);
      setProjectName(projectParam);
      setIsFuzzyMatchProject(true); // 默认使用模糊匹配
      hasFilterParams = true;
    }

    // 解析GPU ID过滤器
    const gpuIdsParam = searchParams.get('gpuIds');
    if (gpuIdsParam) {
      const gpuIds = parseGpuIds(gpuIdsParam);
      console.log('Setting GPU IDs filter from URL:', gpuIds);
      if (gpuIds.length > 0) {
        setGpuIdFilter(gpuIds, undefined);
        setGpuIdFilterEnabled(true);
        hasFilterParams = true;
      }
    }

    // 解析GPU范围过滤器
    const gpuRangeParam = searchParams.get('gpuRange');
    if (gpuRangeParam) {
      const gpuRange = parseGpuRange(gpuRangeParam);
      console.log('Setting GPU range filter from URL:', gpuRange);
      if (gpuRange) {
        setGpuIdFilter([], gpuRange);
        setGpuIdFilterEnabled(true);
        hasFilterParams = true;
      }
    }

    // 解析多GPU过滤器
    const multiGpuParam = searchParams.get('multiGpu');
    if (multiGpuParam) {
      console.log('Setting multi-GPU filter from URL:', multiGpuParam);
      // 将字符串转换为对应的枚举值
      if (multiGpuParam === 'true') {
        setMultiGpuFilter('multi');
      } else if (multiGpuParam === 'false') {
        setMultiGpuFilter('single');
      } else {
        setMultiGpuFilter('none');
      }
      hasFilterParams = true;
    }

    return hasFilterParams;
  };

  // 解析机器nameEng参数并设置机器选择
  const parseMachineNameEngParam = () => {
    const searchParams = new URLSearchParams(location.search);
    const nameEngParam = searchParams.get('nameEng');

    if (nameEngParam && machineList.length > 0) {
      console.log('Setting machine filter from URL nameEng:', nameEngParam);

      // 根据nameEng参数匹配机器
      const matchedMachines = machineList.filter(
        (machine) =>
          machine.machineName
            .toLowerCase()
            .includes(nameEngParam.toLowerCase()) ||
          machine.machineName.toLowerCase() === nameEngParam.toLowerCase(),
      );

      if (matchedMachines.length > 0) {
        console.log(
          'Matched machines:',
          matchedMachines.map((m) => m.machineName),
        );
        setSelectedMachineState(matchedMachines);
        setTryToSelectedMachineList(matchedMachines);
        // 保存到持久化存储
        setSelectedMachineNames(matchedMachines.map((m) => m.machineName));
        return true;
      }
    }

    return false;
  };

  // 删除URL中的过滤器参数
  const removeFilterParamsFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    const filterKeys = [
      'user',
      'project',
      'gpuIds',
      'gpuRange',
      'multiGpu',
      'nameEng',
    ];

    let hasRemoved = false;
    filterKeys.forEach((key) => {
      if (searchParams.has(key)) {
        searchParams.delete(key);
        hasRemoved = true;
      }
    });

    if (hasRemoved) {
      const newSearch = searchParams.toString();
      const newUrl = newSearch
        ? `${location.pathname}?${newSearch}`
        : location.pathname;

      console.log('Removing filter params from URL, new URL:', newUrl);
      history.replace(newUrl);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered, machineList length:', machineList.length);
    const urlMachineName = getUrlMachineName();
    let hasProcessedFilters = false;

    // 解析过滤器参数
    const hasFilterParams = parseFilterParams();
    if (hasFilterParams) {
      hasProcessedFilters = true;
      // 延迟删除过滤器参数，确保状态已经设置
      setTimeout(() => {
        removeFilterParamsFromUrl();
      }, 100);
    }

    // 解析机器nameEng参数
    const hasMachineNameEng = parseMachineNameEngParam();
    if (hasMachineNameEng) {
      hasProcessedFilters = true;
      // 延迟删除nameEng参数
      setTimeout(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has('nameEng')) {
          searchParams.delete('nameEng');
          const newSearch = searchParams.toString();
          const newUrl = newSearch
            ? `${location.pathname}?${newSearch}`
            : location.pathname;
          console.log('Removing nameEng param from URL, new URL:', newUrl);
          history.replace(newUrl);
        }
      }, 100);
    }

    // 处理简化格式的URL参数（如 ?4090a 或 ?2084）
    if (urlMachineName && machineList.length > 0 && !hasMachineNameEng) {
      console.log('Processing simplified URL parameter:', urlMachineName);

      // 根据简化参数匹配机器 - 改进匹配逻辑
      const matchedMachines = machineList.filter((machine) => {
        const machineName = machine.machineName.toLowerCase();
        const urlParam = urlMachineName.toLowerCase();

        // 1. 精确匹配机器名称
        if (machineName === urlParam) {
          return true;
        }

        // 2. 检查机器名称是否包含URL参数
        if (machineName.includes(urlParam)) {
          return true;
        }

        // 3. 检查URL关键词是否包含URL参数
        if (machine.urlKeywords && Array.isArray(machine.urlKeywords)) {
          const hasMatchingKeyword = machine.urlKeywords.some((keyword) =>
            keyword.toLowerCase().includes(urlParam),
          );
          if (hasMatchingKeyword) {
            return true;
          }
        }

        // 4. 检查机器URL路径是否包含URL参数
        if (
          machine.machineUrl &&
          machine.machineUrl.toLowerCase().includes(urlParam)
        ) {
          return true;
        }

        return false;
      });

      console.log(
        'All available machines:',
        machineList.map((m) => ({
          name: m.machineName,
          url: m.machineUrl,
          keywords: m.urlKeywords,
        })),
      );
      console.log('Matched machines count:', matchedMachines.length);

      if (matchedMachines.length > 0) {
        console.log(
          'Matched machines from simplified URL:',
          matchedMachines.map((m) => ({
            name: m.machineName,
            url: m.machineUrl,
            keywords: m.urlKeywords,
          })),
        );
        setSelectedMachineState(matchedMachines);
        setTryToSelectedMachineList(matchedMachines);
        // 保存到持久化存储
        setSelectedMachineNames(matchedMachines.map((m) => m.machineName));

        // 如果只有简化格式参数，也删除它
        if (!hasProcessedFilters) {
          setTimeout(() => {
            history.replace(location.pathname);
          }, 100);
        }
        return;
      } else {
        console.log(
          'No machines matched simplified URL parameter:',
          urlMachineName,
        );
      }
    }

    // 如果没有URL参数或未匹配到机器，则使用持久化存储中的设置
    if (!hasMachineNameEng) {
      // 使用持久化存储中的机器名称列表
      if (selectedMachineNames.length > 0) {
        const finalSelectedMachineList = machineList.filter((machine) =>
          selectedMachineNames.includes(machine.machineName),
        );
        console.log(
          'Using persisted machine selection:',
          finalSelectedMachineList.map((m) => m.machineName),
        );
        setTryToSelectedMachineList(finalSelectedMachineList);
        setSelectedMachineState(finalSelectedMachineList);
      } else {
        // 如果没有持久化设置，则使用cookie作为后备
        getLatestRunGpu().then((latestMachineList: API.FrontEndMachine[]) => {
          const finalSelectedMachineList = machineList.filter((machine) => {
            for (let i = 0; i < latestMachineList.length; i++) {
              if (machine.machineName === latestMachineList[i].machineName) {
                return true;
              }
            }
            return false;
          });
          console.log(
            'Using cookie machine selection:',
            finalSelectedMachineList.map((m) => m.machineName),
          );
          setTryToSelectedMachineList(finalSelectedMachineList);
          setSelectedMachineState(finalSelectedMachineList);
        });
      }
    }
  }, [machineList, location.search]);

  const onSelectedMachineChange = (machineList: API.FrontEndMachine[]) => {
    // 保存到持久化存储
    setSelectedMachineNames(machineList.map((m) => m.machineName));

    // 同时保存到cookie作为后备
    setLatestRunGpu(machineList)
      .then(() => {
        console.log('setLatestRunGpu success');
      })
      .catch((error: any) => {
        console.log('error:', error);
      });

    setSelectedMachineState(machineList);
  };

  if (!machineList || machineList.length === 0) {
    return (
      <>
        <h1>Trying to connect to server...</h1>
      </>
    );
  }

  return (
    <div className={styles.pageContentDiv}>
      {/* <ul>
        {machineList.map((machine) => (
          <li key={machine.machineName}>{machine.machineName}</li>
        ))}
      </ul> */}

      {/* 筛选器组 */}
      <FilterGroup
        machineList={machineList}
        selectedMachines={selectedMachineState || []}
        onSelectionChange={onSelectedMachineChange}
      />

      <GpuDashboardWithNoContent machineList={selectedMachineState} />
    </div>
  );
};

export default GpuDashboardPageContent;
