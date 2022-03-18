import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import http from 'utils/http';
import { EnterpriseMsgType, TableItem, TableDataType } from 'types/home';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Table,
  Pagination,
  TablePaginationConfig,
  InputNumber,
  message,
  Radio,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

import InputShowCount from './components/InputShowCount';

const { Option } = Select;

const CommentRules = () => {
  const navigate = useNavigate();
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };
  const onFinish = (values: any) => {
    console.log(values);
  };
  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
  /* eslint-enable no-template-curly-in-string */
  const optionsArray = [
    { label: 'x', value: 'x' },
    { label: 'y', value: 'y' },
    { label: 'z', value: 'z' },
  ];
  return (
    <SearchBox>
      <Card
        // title={id ? '编辑SOP' : '新建SOP'}
        title="添加规则"
        style={{ margin: '2rem 2rem 0' }}
        bodyStyle={{ padding: 0 }}
        extra={<a className="font_family icon-fanhui blue" onClick={() => navigate(-1)}>返回</a>}
      >
        <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
          <Form.Item name={['user', 'Account']} label="适用账号" rules={[{ required: true }]}>
            <Select
              style={{ width: '273px' }}
              placeholder="请选择"
              options={optionsArray}
            />
          </Form.Item>
          <Form.Item name={['user', 'email']} label="功能名称" rules={[{ type: 'email' }]}>
            <InputShowCount style={{ width: '500px' }} placeholder="请输入" maxLength={20} />
            {/* <Input style={{ width: '500px' }} maxLength={20} /> */}
          </Form.Item>
          <Form.Item name={['user', 'age']} label="关键词" rules={[{ type: 'number', min: 0, max: 99 }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name={['user', 'introduction']} label="回复内容">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name={['user', 'count']} label="单个视频回复条数" rules={[{ type: 'number', min: 0, max: 50 }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </SearchBox>
  );
};
const SearchBox = styled.div`
  margin:0 0 16px 0;
  padding: 0 2rem;
`;
const ButtonBox = styled.div`
  margin: 20px 0;
`;
export default CommentRules;
