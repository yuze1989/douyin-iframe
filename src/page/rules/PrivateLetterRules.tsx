import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import http from 'utils/http';
import { getUrlOption } from 'utils';
import { TiktokList } from 'types/home';
import { KeyWordListType, ContentListType } from 'types/rules';
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
  message,
  Upload,
} from 'antd';

import InputShowCount from './components/InputShowCount';
import TextAreaShowCount from './components/TextAreaShowCount';

const { Option } = Select;
const { Text } = Typography;

const PrivateLetterRules = () => {
  const navigate = useNavigate();
  const openId = localStorage.getItem('openId') || '';
  const urlParams = getUrlOption(window.location.href);
  const id = urlParams?.id || '';
  const [form] = Form.useForm();
  const headers = { 'tiktok-token': openId };
  const uploadData = { businessType: 3 };
  const messageList: object[] = [{ content: '' }];
  const action = 'https://test-scrm.juzhunshuyu.com/social/oss-upload/get-upload-policy';
  const [accountList, setAccountList] = useState<TiktokList[]>([]);
  const [keyWordList, setKeyWordList] = useState<KeyWordListType[]>([{ type: '请选择', keyWord: '' }]);
  const [msgContentList, setMsgContentList] = useState<ContentListType[]>([{ msgType: 'text' }, { msgType: 'img' }]);
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
    { label: '半匹配', value: 1 },
    { label: '全匹配', value: 2 },
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
    const { data, keywords, messages } = value;
    const content: object[] = [];
    messages?.forEach((item:any) => {
      content.push({ msgType: 'text', text: item, businessId: new Date().getTime() });
    });
    value.businessType = 3;
    http.post('/social/auto-reply-rule/save-rule', {
      businessType: 3,
      ...data,
      status: data.status === false ? 2 : 1,
      keyWordList: keywords,
      messageList: content,
    }).then((res) => {
      const { success } = res;
      if (success) {
        message.success('保存成功！');
      } else {
        message.error(res?.errMessage);
      }
    });
  };
  const beforeUpload = () => {
    console.log('beforeUpload');
  };
  const handleChange = () => {
    console.log('handleChange');
  };
  const delSelectRule = (index: number) => {
    const arr = [...msgContentList];
    arr.splice(index, 1);
    setMsgContentList(arr);
  };
  // 获取上传文件的权限
  const getUploadPolicy = () => {
    http.post('/scrm/upload/get-upload-policy', { businessType: 'messagecenter' }).then((res) => {
      console.log('090909', res);
    });
  };
  // 新增回复内容
  const addRuleType = (
    add: (defaultValue?: any, insertIndex?: number | undefined) => void,
    type: string,
  ) => {
    add();
    const arr = [...msgContentList];
    arr.push({ msgType: type });
    setMsgContentList([...arr]);
  };
  useEffect(() => {
    getTiktokAccount();
    getUploadPolicy();
  }, []);
  return (
    <ContentBox>
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
          <Form.Item label="关键词" rules={[{ required: true }]}>
            <Form.List name="keywords" initialValue={keyWordList}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'type']}
                        rules={[{ required: true, message: 'Missing first name' }]}
                      >
                        <Select
                          style={{ width: 100, display: 'inline-block', margin: '0 10px 0 0' }}
                          placeholder="请选择"
                          // defaultValue={{ value: 1 }}
                          options={rulesOption}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'keyWord']}
                        rules={[{ required: true, message: 'Missing last name' }]}
                      >
                        <InputShowCount style={{ width: 290 }} placeholder="请输入关键词" maxLength={30} />
                      </Form.Item>
                      {
                        key === 0 ? null : <span style={{ fontSize: '14px', color: '#999999' }} className="font_family icon-shanchu" onClick={() => remove(name)} />
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
            rules={[{ required: true }]}
            extra="当回复内容有多条时，随机回复一条"
          >
            {/* <Form.List name="messages" initialValue={messageList}> */}
            <Form.List name="messages" initialValue={msgContentList}>
              {(fields, { add }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center' }}>
                      {
                        msgContentList[key]?.msgType === 'text' && (
                          <Form.Item
                            {...restField}
                            style={{ marginBottom: 0 }}
                            name={[name, 'content']}
                            rules={[{ required: true, message: 'Missing first name' }]}
                          >
                            <TextareaBox>
                              <TextAreaShowCount
                                style={{ position: 'relative', width: 400 }}
                                autoSize={{ minRows: 4, maxRows: 6 }}
                                maxLength={300}
                              />
                            </TextareaBox>
                          </Form.Item>
                        )
                      }
                      {
                        msgContentList[key]?.msgType === 'img' && (
                          <Form.Item
                            {...restField}
                            style={{ marginBottom: 0, display: 'block' }}
                            name={[name, 'imageUrl']}
                            rules={[{ required: true, message: 'Missing first name' }]}
                          >
                            <Upload
                              name="file"
                              listType="picture-card"
                              className="avatar-uploader"
                              withCredentials
                              data={uploadData}
                              showUploadList={false}
                              headers={headers}
                              action={action}
                              beforeUpload={beforeUpload}
                              onChange={handleChange}
                            >
                              上传
                            </Upload>
                          </Form.Item>
                        )
                      }
                      <span
                        style={{ fontSize: '14px', color: '#999999', marginLeft: 10 }}
                        className="font_family icon-shanchu"
                        onClick={() => delSelectRule(index)}
                      />
                    </div>
                  ))}
                  <Form.Item>
                    {
                      fields.length < 10 && (
                        <DropdownBox>
                          <nav className="dropBox">
                            <div className="dropItem" onClick={() => addRuleType(add, 'text')}>文字</div>
                            <div className="dropItem" onClick={() => addRuleType(add, 'img')}>图片</div>
                          </nav>
                          <Button type="primary" ghost>
                            <span style={{ fontSize: '14px' }} className="font_family icon-tianjia1 font_14">
                              &nbsp;添加回复内容
                            </span>
                          </Button>
                        </DropdownBox>
                      )
                    }
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          <ButtonBox>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" size="large" htmlType="submit">保存</Button>
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
const DropdownBox = styled.div`
  position: relative;
  width: 130px;
  &:hover .dropBox{
    display: block;
  }
  .dropBox{
    display: none;
    position: absolute;
    bottom: 100%;
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.10);
    .dropItem{
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      color: rgba(0, 0, 0, .65);
      cursor: pointer;
      &:first-of-type{
        /* border-bottom: 1px dashed #DDDDDD; */
        position: relative;
        &:before{
          content: '';
          position: absolute;
          bottom: 0;
          left: 5px;
          display: inline-block;
          width: 120px;
          border: 1px dashed #DDDDDD;
        }
      }
      &:hover{
        color: #1890FF;
        background: rgba(69,141,255,0.04);
      }
    }
  }
`;
export default PrivateLetterRules;
