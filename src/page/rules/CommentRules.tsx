import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import http from 'utils/http';
import { getUrlOption } from 'utils';
import {
  EnterpriseMsgType,
  TableItem,
  TableDataType,
  TiktokList,
} from 'types/home';
import { KeyWordListType } from 'types/rules';
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
  const openId = localStorage.getItem('openId') || '';
  const urlParams = getUrlOption(window.location.href);
  const id = urlParams?.id || '';
  const [form] = Form.useForm();
  const [accountList, setAccountList] = useState<TiktokList[]>([]);
  const [keyWordList, setKeyWordList] = useState<KeyWordListType[]>([{
    type: '1',
    keyboard: '',
  }]);
  const setKey = (item: number) => {
    const key = item + new Date().getMilliseconds() * item;
    return key;
  };
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 13 },
  };
  const onFinish = (values: any) => {
    console.log('onFinish:::', values);
    saveRegulation();
  };
  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: '${label} 不能为空!',
    types: {
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
  /* eslint-enable no-template-curly-in-string */
  const rulesOption = [
    { label: '半匹配', value: '1' },
    { label: '全匹配', value: '2' },
  ];

  // 获取适用账号
  const getTiktokAccount = () => {
    if (openId) {
      http.get('/social/auto-reply-rule/list-tiktok-user', {}).then((res) => {
        const { success, data } = res;
        if (success) {
          setAccountList(data);
        }
      });
    }
  };
  // 保存
  const saveRegulation = () => {
    const value = form.getFieldsValue();
    value.businessType = 3;
    http.post('/social/auto-reply-rule/save-rule', { ...value }).then((res) => {
      console.log('res:::::', res);
    });
  };
  useEffect(() => {
    getTiktokAccount();
  }, []);
  const increaseKeywords = () => {
    const temporary = keyWordList;
    temporary.push({ type: '1', keyboard: '' });
    setKeyWordList([...temporary]);
  };
  const removeKeyWord = (e: any) => {
    const { index } = e.target.dataset;
    const temporary = keyWordList;
    temporary.splice(index, 1);
    setKeyWordList([...temporary]);
  };
  return (
    <SearchBox>
      <Card
        title={id ? '编辑规则' : '添加规则'}
        style={{ margin: '2rem 2rem 0' }}
        bodyStyle={{ padding: 0 }}
        extra={<a className="font_family icon-fanhui blue" onClick={() => navigate(-1)}>返回</a>}
      >
        <Form
          {...layout}
          form={form}
          style={{ padding: '30px 0 0 0' }}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item name={['data', 'tiktokUserId']} label="适用账号" rules={[{ required: true }]}>
            <Select
              style={{ width: 200 }}
              placeholder="请选择"
            >
              {
                accountList?.map((item: any) => (
                  <Select.Option
                    value={item.id}
                    key={item.apiAuthorId}
                  >
                    { item.nickname }
                  </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item name={['data', 'name']} label="规则名称" rules={[{ required: true }]}>
            <InputShowCount style={{ width: 400 }} placeholder="请输入规则名称" maxLength={30} />
          </Form.Item>
          <Form.Item name={['data', 'status']} label="功能启用" valuePropName="checked" rules={[{ required: true }]}>
            <Switch checked />
          </Form.Item>
          <Form.Item label="关键词" style={{ marginBottom: 0 }}>
            {
              keyWordList && keyWordList?.map((item: KeyWordListType, index: number) => (
                <KeyboardItem
                  style={{ marginTop: 0 }}
                  key={setKey(index)}
                >
                  <Select
                    style={{ width: 100, display: 'inline-block', margin: '0 10px 0 0' }}
                    placeholder="请选择"
                    defaultValue="1"
                    options={rulesOption}
                  />
                  <Form.Item name={['data', `keyword${index}`]} style={{ display: 'inline-block', width: 290, marginBottom: 0 }} rules={[{ required: true, message: '关键词不能为空' }]}>
                    <InputShowCount style={{ width: 290 }} placeholder="请输入关键词" maxLength={30} />
                  </Form.Item>
                  {
                    index !== 0 ? <span style={{ fontSize: '14px', color: '#999999' }} className="font_family icon-shanchu" data-index={index} onClick={(e) => { removeKeyWord(e); }} /> : null
                  }
                </KeyboardItem>
              ))
            }
          </Form.Item>
          <Form.Item label=" " colon={false}>
            {
              keyWordList.length < 10 && (
                <Button
                  style={{ marginRight: '10px' }}
                  type="primary"
                  ghost
                  onClick={() => { increaseKeywords(); }}
                >
                  <span style={{ fontSize: '14px' }} className="font_family icon-tianjia1 font_14">
                    &nbsp;添加关键词
                  </span>
                </Button>
              )
            }
            <Space direction="vertical" style={{ display: 'block' }}>
              <Text type="secondary">半匹配是指评论中命中一个关键词就执行自动回复。</Text>
              <Text type="secondary">全匹配是指评论中所有关键词全部命中执行自动回复。</Text>
            </Space>
          </Form.Item>
          <Form.Item
            name={['data', 'messageList']}
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
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <Button style={{ marginRight: '10px' }} type="primary" ghost>
              <span style={{ fontSize: '14px' }} className="font_family icon-tianjia1 font_14">
                &nbsp;添加回复内容
              </span>
            </Button>
          </Form.Item>
          <Form.Item
            name={['data', 'replyTimesLimit']}
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
              {/* <Button type="primary" size="large"  onClick={() => saveRegulation()}> */}
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
  `;
const ButtonBox = styled.div`
  margin: 20px 0;
  padding: 20px 0;
  border-top: 1px solid #DDDDDD;
`;
const KeyboardItem = styled.div`
  margin:0 0 16px 0;
  
  .icon-shanchu{
    margin-left: 10px;
    padding: 5px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
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
