import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import http from 'utils/http';
import { getUrlOption } from 'utils';
import { TiktokList } from 'types/home';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeyWordListType, RulesPropsType } from 'types/rules';
import {
  Space, Typography, Card, Form, Select, Switch, Button, InputNumber, message, Input,
} from 'antd';

import InputShowCount from './components/InputShowCount';
import './create.css';

const { Text } = Typography;

const CommentRules = () => {
  const navigate = useNavigate();
  const state = useLocation();
  const openId = localStorage.getItem('openId') || '';
  const urlParams = getUrlOption(window.location.href);
  const id = Number(urlParams?.id) || '';
  const [form] = Form.useForm();
  const [accountList, setAccountList] = useState<TiktokList[]>([]);
  // const [keyWordList, setKeyWordList] = useState<KeyWordListType[]>([{ keyWord: '' }]);
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 13 },
  };
  const onFinish = () => {
    saveRegulation();
  };
  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: '${label}不能为空!',
  };
  const rulesOption = [
    { label: '半匹配', value: 1 },
    { label: '全匹配', value: 2 },
  ];
  const addRuleType = (
    add: (defaultValue?: RulesPropsType, insertIndex?: number) => void,
    type: string,
  ) => {
    add({ msgType: type });
  };
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
  // const handleChange = (value: string) => {
  //   console.log(value);
  // };
  // 保存
  const saveRegulation = () => {
    const value = form.getFieldsValue();
    const { status } = value;
    value.businessType = 1;
    http.post('/social/auto-reply-rule/save-rule', {
      ...value,
      id,
      status: status ? 1 : 2,
    }).then((res) => {
      const { success } = res;
      if (success) {
        navigate('/home', { ...state });
        message.success('保存成功！');
      } else {
        message.error(res?.errMessage);
      }
    });
  };
  // 编辑功能
  // 获取详情
  const getRulesDetail = () => {
    if (id) {
      http.get('/social/auto-reply-rule/get_rule_detail', { id }).then((res) => {
        const { success, data } = res;
        Object.assign(data, { status: data.status === 1 });
        if (success) {
          form.setFieldsValue(data);
        }
      });
    }
  };
  useEffect(() => {
    getTiktokAccount();
    getRulesDetail();
  }, []);
  return (
    <ContentBox>
      <Card
        title={id ? '编辑规则' : '添加规则'}
        style={{ margin: '2rem 2rem 0' }}
        bodyStyle={{ padding: 0 }}
        extra={<a className="font_family icon-fanhui blue" onClick={() => navigate('/home', { ...state })}>返回</a>}
      >
        <Form
          {...layout}
          form={form}
          style={{ padding: '30px 0 0 0' }}
          onFinish={onFinish}
          validateMessages={validateMessages}
          initialValues={
            {
              messageList: [{ msgType: 'text' }],
              keyWordList: [{ keyWord: '' }],
            }
          }
        >
          <Form.Item name={['tiktokUserId']} label="适用账号" rules={[{ required: true }]}>
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
          <Form.Item name={['name']} label="规则名称" rules={[{ required: true }]}>
            <InputShowCount style={{ width: 400 }} placeholder="请输入规则名称" maxLength={30} />
          </Form.Item>
          <Form.Item name={['status']} label="功能启用" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="关键词" className="requireTitle" rules={[{ required: true }]}>
            <Form.List name="keyWordList">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'type']}
                        rules={[{ required: true, message: '请选择匹配模式' }]}
                      >
                        <Select
                          style={{ width: 100, display: 'inline-block', margin: '0 10px 0 0' }}
                          placeholder="请选择"
                          options={rulesOption}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'keyWord']}
                        rules={[{ required: true, message: '关键词不能为空！' }]}
                      >
                        <InputShowCount style={{ width: 290 }} placeholder="请输入关键词" maxLength={30} />
                      </Form.Item>
                      {
                        key !== 0 && (<span className="font_family icon-shanchu" onClick={() => remove(name)} />)
                      }
                    </Space>
                  ))}
                  <Form.Item>
                    {
                      fields.length < 10 && (
                        <Button type="primary" onClick={() => add()} ghost>
                          <span style={{ fontSize: '14px' }} className="font_family icon-tianjia1 font_14">
                            &nbsp;添加关键词
                          </span>
                        </Button>
                      )
                    }
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Space direction="vertical" style={{ display: 'block' }}>
              <Text type="secondary">半匹配是指评论中命中一个关键词就执行自动回复。</Text>
              <Text type="secondary">全匹配是指评论中所有关键词全部命中执行自动回复。</Text>
            </Space>
          </Form.Item>
          <Form.Item
            label="回复内容"
            className="requireTitle"
            rules={[{ required: true }]}
            extra="当回复内容有多条时，随机回复一条"
          >
            <Form.List name="messageList">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <ItemBox key={key}>
                      <Form.Item
                        {...restField}
                        className="textareaBox"
                        name={[name, 'text', 'content']}
                        rules={[{ required: true, message: '回复内容不能为空' }]}
                      >
                        <Input.TextArea
                          showCount
                          autoSize={{ minRows: 5, maxRows: 5 }}
                          maxLength={300}
                          className="inputTextArea"
                          // onChange={(e) => handleChange(e.target.value)}
                        />
                      </Form.Item>
                      {
                        key !== 0 && (<span className="font_family icon-shanchu" onClick={() => remove(name)} />)
                      }
                    </ItemBox>
                  ))}
                  <Form.Item>
                    {
                      fields.length < 10 && (
                        <Button type="primary" onClick={() => addRuleType(add, 'text')} ghost>
                          <span style={{ fontSize: '14px' }} className="font_family icon-tianjia1 font_14">
                            &nbsp;添加回复内容
                          </span>
                        </Button>
                      )
                    }
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item
            name={['replyTimesLimit']}
            label="单个视频回复条数"
            extra="为了避免回复评论雷同过多，请设置每个视频每天的自动回复条数在50条左右。"
            rules={[{
              required: true,
            }]}
          >
            <InputNumber style={{ marginBottom: '16px' }} min={1} max={200} placeholder="请输入" />
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
    </ContentBox>
  );
};
const ContentBox = styled.div`
  margin:0 0 16px 0;
  padding: 0 2rem;
  `;
const ButtonBox = styled.div`
  margin: 20px 0;
  padding: 20px 0;
  border-top: 1px solid #DDDDDD;
`;
const ItemBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1.6rem;
  width: 50rem;
  border: 1px solid #dddddd;
  /* .ant-upload.ant-upload-select-picture-card{
    margin: 0;
  } */
  .icon-shanchu{
    margin-left: 10px;
    padding: 5px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .inputTextArea{
    textarea.ant-input{
      width: 49.8rem;    
      height: 115px;
      border: none;
    }
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
