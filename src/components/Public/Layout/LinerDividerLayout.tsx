import { Divider } from 'antd';
import React from 'react';

interface Props {
  leftChild: React.ReactNode;
  rightChild: React.ReactNode;
}

const LinerDividerLayout: React.FC<Props> = ({ leftChild, rightChild }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          width: '100%', // 确保填充满父级容器
          alignItems: 'center', // 确保所有子元素垂直居中
        }}
      >
        {/* 左侧容器 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center', // 水平居中
            alignItems: 'center', // 垂直居中
            flexDirection: 'column',
            flex: 1, // 平分剩余空间
          }}
        >
          {leftChild}
        </div>

        {/* 中间的垂直分割线 */}
        <Divider
          type="vertical"
          style={{
            margin: '0 0px', // 分割线两侧的间隔
          }}
        />

        {/* 右侧容器 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center', // 水平居中
            alignItems: 'center', // 垂直居中
            flexDirection: 'column',
            flex: 1, // 平分剩余空间
          }}
        >
          {rightChild}
        </div>
      </div>
    </>
  );
};

export default LinerDividerLayout;
