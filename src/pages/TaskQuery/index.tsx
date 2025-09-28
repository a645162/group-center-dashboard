import { PageContainer } from '@ant-design/pro-components';
import React, { useState } from 'react';

import { queryGpuTasksSimple } from '@/services/group_center/gpuTaskQuery';
import TaskQueryForm from './components/TaskQueryForm';
import TaskResultTable from './components/TaskResultTable';
import styles from './index.less';

const TaskQueryPage: React.FC = () => {
  const [queryParams, setQueryParams] = useState<API.queryGpuTasksSimpleParams>(
    {},
  );
  const [queryResults, setQueryResults] = useState<API.GpuTaskInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleQuery = async (params: API.queryGpuTasksSimpleParams) => {
    setLoading(true);
    setQueryParams(params);

    try {
      console.log('开始查询，参数:', params);
      const result = await queryGpuTasksSimple(params);
      console.log('查询结果:', result);

      if (result.isSucceed && result.result) {
        // 根据API响应结构调整 - 后端返回的数据结构包含pagination
        const data = result.result.data || result.result.list || [];
        const pagination = result.result.pagination;

        // 使用pagination中的totalItems作为总数
        const total =
          pagination?.totalItems ||
          result.result.total ||
          result.result.totalCount ||
          0;

        setQueryResults(Array.isArray(data) ? data : []);
        setTotalCount(total);
      } else {
        console.error('查询失败:', result);
        setQueryResults([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('查询异常:', error);
      setQueryResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleParamsChange = (newParams: API.queryGpuTasksSimpleParams) => {
    // 当分页参数改变时，重新执行查询
    setQueryParams(newParams);
    handleQuery(newParams);
  };

  const handleReset = () => {
    setQueryParams({});
    setQueryResults([]);
    setTotalCount(0);
  };

  return (
    <PageContainer
      title="GPU任务查询"
      content="查询和分析GPU任务执行情况"
      ghost
    >
      <div className={styles.taskQueryPage}>
        {/* 查询表单 */}
        <div className={styles.queryFormSection}>
          <TaskQueryForm
            onQuery={handleQuery}
            onReset={handleReset}
            loading={loading}
          />
        </div>

        {/* 查询结果 */}
        <div className={styles.resultSection}>
          <TaskResultTable
            data={queryResults}
            loading={loading}
            total={totalCount}
            queryParams={queryParams}
            onParamsChange={handleParamsChange}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default TaskQueryPage;
