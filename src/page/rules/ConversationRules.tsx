import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import http from 'utils/http';
import { getUrlOption } from 'utils';
import { TiktokList } from 'types/home';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  Form,
  Select,
  Button,
  message,
  Switch,
  Input,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Avatar from 'assets/avatar.png';
import ChatBg from 'assets/chat-bg.png';
import ChatInput from 'assets/chat-input.png';

import TextAreaShowCount from './components/TextAreaShowCount';

const { Title, Paragraph } = Typography;
// const { Option } = Select;

interface Props { }

const ConversationRules = (props: Props) => {
  const navigate = useNavigate();
  const openId = localStorage.getItem('openId') || '';
  const urlParams = getUrlOption(window.location.href);
  const id = urlParams?.id || '';
  const [form] = Form.useForm();
  const [accountList, setAccountList] = useState<TiktokList[]>([]);
  const [msg, setMsg] = useState('亲，您好！');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onChange = (checked: boolean) => {
    console.log(checked);
  };
  const onFinish = () => {
    const value = form.getFieldsValue();
    console.log(value);
    saveRegulation();
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
  const handleChange = (value: string) => {
    console.log(value);
    setMsg(value);
  };
  // 保存
  const saveRegulation = () => {
    const value = form.getFieldsValue();
    const { data } = value;
    const { checked, msgText, tiktokUserId } = data;
    const content: object[] = [{
      msgType: 'text',
      text: { content: msgText },
    }];
    setMsg(msgText);
    const status = checked === false ? 2 : 1;
    http.post('/social/auto-reply-rule/save-rule', {
      name: '会话自动触达规则',
      replyTimesLimit: 1,
      businessType: 2,
      tiktokUserId,
      status,
      messageList: content,
    }).then((res) => {
      const { success } = res;
      if (success) {
        navigate(-1);
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
        form.setFieldsValue(data);
      });
    }
  };
  useEffect(() => {
    getTiktokAccount();
    getRulesDetail();
  }, []);
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
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 9 },
  };
  return (
    <ContentBox>
      <Card
        className="cardBox"
        title={id ? '编辑规则' : '添加规则'}
        style={{ margin: '2rem 2rem 0' }}
        bodyStyle={{ padding: 0 }}
        extra={<a className="font_family icon-fanhui blue" onClick={() => navigate(-1)}>返回</a>}
      >
        <Form
          className="formBox"
          {...layout}
          form={form}
          onFinish={onFinish}
          validateMessages={validateMessages}
          // initialValues={
          //   { status: false }
          // }
        >
          <Form.Item label=" " colon={false} style={{ margin: 0 }}>
            <Title className="title">进入回话自动触达</Title>
          </Form.Item>
          <Form.Item label="适用账号：" name={['tiktokUserId']} rules={[{ required: true }]}>
            <Select
              style={{ width: 200 }}
              placeholder="请选择"
            >
              {
                accountList && accountList?.map((item: any) => (
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
          <Form.Item label="功能启用" name={['status']} valuePropName="checked">
            <Switch onChange={(checked) => onChange(checked)} />
          </Form.Item>
          <Form.Item label="自动回复内容" name={['messageList']} rules={[{ required: true }]}>
            <Form.Item name={['text', 'content']}>
              <TextareaBox>
                <Input.TextArea
                  showCount
                  placeholder="请输入回复语"
                  maxLength={300}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </TextareaBox>
            </Form.Item>
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <Button style={{ marginRight: '10px' }} type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
        <ChatModel>
          <div className="chat-content">
            <img src={Avatar} alt="" />
            <Paragraph className="text">{ msg }</Paragraph>
          </div>
          <img className="chat-input" src={ChatInput} alt="" />
        </ChatModel>
      </Card>
    </ContentBox>
  );
};
const ContentBox = styled.div`
  margin:0 0 16px 0;
  padding: 0 2rem;
  .cardBox{
    position: relative;
  }
  .formBox{
    padding: 30px 0 0 0;
    height: calc(100vh - 90px - 2rem);
  }
  .title{
    position: relative;
    display: flex;
    align-items: center;
    font-size: 14px;
    text-indent: -80px;
    color: #333333;
    &:before{
      content: '';
      position: absolute;
      left: -90px;
      width: 4px;
      height: 14px;
      background: #458DFF;
    }
  }
`;
const TextareaBox = styled.div`
  position: relative;
  padding-bottom: 22px;
  width: 500px;
  border: 1px solid #dddddd;
  textarea.ant-input{
    padding: 5px;
    box-sizing: border-box;
    height: 115px;
    border: none;
    outline: none;
  }
`;
const ChatModel = styled.div`
  position: absolute;
  right: 150px;
  top: 100px;
  width: 254px;
  height: 510px;
  background: url(${ChatBg}) no-repeat center 100%/100%;
  .chat-content{
    display: flex;
    margin: 85px 24px 0;
    img{
      width: 22px;
      height: 22px;
    }
    .text{
      margin-left: 6px;
      padding: 5px 10px;
      box-sizing: border-box;
      border-radius: 8px;
      background: #F3F3F3;
    }
  }
  .chat-input{
    position: absolute;
    bottom: 20px;
    padding: 0 15px;
    box-sizing: border-box;
    width: 100%;
    /* height: 40px; */
  }
`;
export default ConversationRules;
