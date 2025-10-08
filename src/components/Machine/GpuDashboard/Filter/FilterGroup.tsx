import { FilterOutlined } from '@ant-design/icons';
import { Button, Card, Space } from 'antd';
import React, { useState } from 'react';

import GpuTaskFilterPanel from '@/pages/GpuDashboard/GpuTaskFilterPanel';
import styles from './FilterGroup.less';
import GpuServerFilter from './GpuServerFilter';

interface FilterGroupProps {
  machineList: API.FrontEndMachine[];
  selectedMachines: API.FrontEndMachine[];
  onSelectionChange: (machines: API.FrontEndMachine[]) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  machineList,
  selectedMachines,
  onSelectionChange,
}) => {
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className={styles.filterGroupContainer}>
      {/* 筛选器显示/隐藏按钮 */}
      <div className={styles.filterToggle}>
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={() => setShowFilters(!showFilters)}
          size="small"
        >
          {showFilters ? '隐藏筛选器' : '显示筛选器'}
        </Button>
      </div>

      {/* 筛选器组 */}
      {showFilters && (
        <Card size="small" className={styles.filterCard} title="筛选器">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* GPU服务器筛选 */}
            <div className={styles.filterSection}>
              <div className={styles.filterLabel}>GPU服务器筛选</div>
              <GpuServerFilter
                machineList={machineList}
                selectedMachines={selectedMachines}
                onSelectionChange={onSelectionChange}
              />
            </div>

            {/* 任务筛选器（用户名和工程名过滤） */}
            <div className={styles.filterSection}>
              <div className={styles.filterLabel}>任务筛选</div>
              <GpuTaskFilterPanel />
            </div>
          </Space>
        </Card>
      )}
    </div>
  );
};

export default FilterGroup;
