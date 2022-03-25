/* eslint-disable react/require-default-props */
import { Modal, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { Title, Text } = Typography;

interface IProps {
  isModalVisible?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange?: (val: string) => void; // 返回值没有类型，即返回值为空
}
const DetailModal = (props: IProps) => {
  const { isModalVisible = false, onChange } = props;
  useEffect(() => {
  }, []);
  return (
    <Modal
      title="规则详情"
      visible={isModalVisible}
      footer={null}
      bodyStyle={{ minHeight: 350, maxHeight: 400, overflow: 'scroll' }}
      destroyOnClose
    >
      <Space className="keyBox" direction="vertical">
        <Title level={3}>关键词</Title>
        <div>
          <Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text>
          <Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text>
        </div>
      </Space>
      <Space className="keyBox" style={{ marginTop: 10 }} direction="vertical">
        <Title level={3}>回复内容</Title>
        <Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text>
        <Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text>
        <Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text>
      </Space>
      <Typography className="keyBox" style={{ marginTop: 10 }}>
        <Title level={3}>单个视频回复条数</Title>
        <Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text><Text>咨询（半匹配）</Text>
      </Typography>
    </Modal>
  );
};

export default DetailModal;
