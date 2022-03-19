import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import http from 'utils/http';
import { EnterpriseMsgType, TableItem, TableDataType } from 'types/home';
import { Link, useNavigate } from 'react-router-dom';
import {
  Space,
  Typography,
  Card,
  Form,
  Input,
  Select,
  Switch,
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
import TextAreaShowCount from './components/TextAreaShowCount';

const { Option } = Select;
const { Text } = Typography;

const CommentRules = () => {
  const navigate = useNavigate();
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 13 },
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
  const rulesOption = [
    { label: '半匹配', value: '1' },
    { label: '全匹配', value: '2' },
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
        <Form {...layout} name="nest-messages" style={{ padding: '30px 0 0 0' }} onFinish={onFinish} validateMessages={validateMessages}>
          <Form.Item name={['user', 'Account']} label="适用账号" rules={[{ required: true }]}>
            <Select
              style={{ width: 200 }}
              placeholder="请选择"
              options={optionsArray}
            />
          </Form.Item>
          <Form.Item name={['user', 'email']} label="规则名称" rules={[{ required: true }]}>
            <InputShowCount style={{ width: 400 }} placeholder="请输入规则名称" maxLength={30} />
          </Form.Item>
          <Form.Item name={['user', 'switch']} label="功能启用" valuePropName="checked" rules={[{ required: true }]}>
            <Switch />
          </Form.Item>
          <Form.Item name={['user', 'age']} label="关键词" rules={[{ required: true }]}>
            <KeyboardItem style={{ marginTop: 0 }}>
              <Select
                style={{ width: 100, display: 'inline-block', marginRight: '10px' }}
                placeholder="请选择"
                options={rulesOption}
              />
              <InputShowCount style={{ width: 290 }} placeholder="请输入关键词" maxLength={30} />
            </KeyboardItem>
            <KeyboardItem>
              <Select
                style={{ width: 100, display: 'inline-block', marginRight: '10px' }}
                placeholder="请选择"
                options={rulesOption}
              />
              <InputShowCount style={{ width: 290 }} placeholder="请输入关键词" maxLength={30} />
            </KeyboardItem>
            <KeyboardItem>
              <Select
                style={{ width: 100, display: 'inline-block', marginRight: '10px' }}
                placeholder="请选择"
                options={rulesOption}
              />
              <InputShowCount style={{ width: 290 }} placeholder="请输入关键词" maxLength={30} />
            </KeyboardItem>
            <Button style={{ marginRight: '10px' }} type="primary" ghost>
              <span style={{ fontSize: '14px' }} className="font_family icon-tianjia1 font_14">
                &nbsp;添加关键词
              </span>
            </Button>
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <Space direction="vertical">
              <Text type="secondary">半匹配是指评论中命中一个关键词就执行自动回复。</Text>
              <Text type="secondary">全匹配是指评论中所有关键词全部命中执行自动回复。</Text>
            </Space>
          </Form.Item>
          <Form.Item
            name={['user', 'introduction']}
            label="回复内容"
            rules={[{ required: true }]}
            extra="当回复内容有多条时，随机回复一条"
          >
            <TextareaBox>
              <TextAreaShowCount
                style={{ position: 'relative', width: 400 }}
                autoSize={{ minRows: 4, maxRows: 6 }}
                maxLength={300}
              />
            </TextareaBox>
            <Button style={{ marginRight: '10px' }} type="primary" ghost>
              <span style={{ fontSize: '14px' }} className="font_family icon-tianjia1 font_14">
                &nbsp;添加回复内容
              </span>
            </Button>
          </Form.Item>
          <Form.Item
            name={['user', 'count']}
            label="单个视频回复条数"
            extra="为了避免回复评论雷同过多，请设置每个视频每天的自动回复条数在50条左右。"
            rules={[{
              required: true,
              type: 'number',
              min: 0,
              max: 50,
            }]}
          >
            <InputNumber style={{ marginBottom: '16px' }} placeholder="请输入" />
          </Form.Item>
          <ButtonBox>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" size="large" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </ButtonBox>
        </Form>
      </Card>
    </SearchBox>
  );
};
const SearchBox = styled.div`
  margin:0 0 16px 0;
  padding: 0 2rem;
  .ant-form-ite:nth-last-of-type(0){
  }
  `;
const ButtonBox = styled.div`
  margin: 20px 0;
  padding: 20px 0;
  border-top: 1px solid #DDDDDD;
`;
const KeyboardItem = styled.div`
  margin:0 0 16px 0;
`;
const TextareaBox = styled.div`
  position: relative;
  margin-bottom: 16px;
  .ant-input-textarea-show-count::after{
    position: absolute;
    right: 12px;
    bottom: 30px;
    color: rgba(0, 0, 0, 0.25);
  }
`;
export default CommentRules;
