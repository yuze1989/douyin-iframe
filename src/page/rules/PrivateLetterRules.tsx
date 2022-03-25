import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import http from 'utils/http';
import { getUrlOption } from 'utils';
import { TiktokList } from 'types/home';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { KeyWordListType } from 'types/rules';
import { useNavigate } from 'react-router-dom';
import { useCloudUpload } from 'utils/upload';
import {
  Space,
  Typography,
  Card,
  Form,
  Select,
  Switch,
  Button,
  message,
  Upload,
  Spin,
  Input,
} from 'antd';

import InputShowCount from './components/InputShowCount';

const { Option } = Select;
const { Text } = Typography;

interface Props {
  value?: any;
  onChange?: (val: any) => void;
}
const TextImg = (props: Props) => {
  const { value, onChange } = props;
  const openId = localStorage.getItem('openId') || '';
  const headers = { 'tiktok-token': openId };
  const [tiktokId] = useState(1);
  const { ossData, getExtraData, uploadAttachment } = useCloudUpload('messagecenter');
  const uploadButton = (
    <div>
      <span style={{ fontSize: '14px' }} className="font_family icon-tianjiafujian">添加</span>
    </div>
  );
  const handleChange = async (fileInfo: UploadChangeParam<UploadFile<any>>) => {
    const {
      status,
      uid,
      name,
      size,
    } = fileInfo.file;
    if (status === 'uploading') {
      return;
    }
    if (status === 'done' && fileInfo.file.response.success) {
      const { response } = fileInfo.file;
      const fileTitle = name.length > 50 ? `${name.slice(0, 46)}${name.slice(name.lastIndexOf('.'))}` : name;
      if (Number(response.data?.width) > 1500) {
        message.error('图片像素超过最大限制，请重新上传');
        return;
      }
      const data = await uploadAttachment(fileTitle, 'image', response?.data?.filename, size, uid, tiktokId, 1);
      if (data) {
        onChange?.({
          msgType: value?.msgType,
          image: {
            uid,
            attachmentPath: response?.data?.filename,
            title: name,
            attachmentId: data,
          },
        });
      }
    }
    if (fileInfo.file.status === 'error') {
      message.error('接口超时，请刷新后重试');
    }
  };

  const beforeUpload = (file: UploadFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt5M = !!file.size && file.size / 1024 / 1024 < 5;
    if (!isJpgOrPng) {
      message.error('请选择jpg, png格式的图片!');
      return false;
    }
    if (!isLt5M) {
      message.error('图片不能超过 5MB!');
      return false;
    }
    return true;
  };
  const handleText = (text: string) => {
    onChange?.({
      msgType: value?.msgType,
      text: {
        content: text,
      },
    });
  };
  console.log('value', value);
  return (
    <>
      {
        value?.msgType === 'text' && (
          <TextAreaBox>
            <Input.TextArea
              placeholder="请输入回复内容"
              showCount
              maxLength={300}
              value={value?.text?.content}
              onChange={(e) => handleText(e.target.value)}
            />
          </TextAreaBox>
        )
      }
      {value?.msgType === 'image' && (
        <Upload
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          headers={headers}
          showUploadList={false}
          beforeUpload={(file) => beforeUpload(file)}
          action={ossData?.host}
          data={getExtraData}
          maxCount={1}
          onChange={(fileInfo) => handleChange(fileInfo)}
        >
          {value?.image?.attachmentPath ? <img src={value?.image?.attachmentPath} alt="avatar" style={{ width: '100%', maxHeight: '100%' }} /> : uploadButton}
        </Upload>
      )}
    </>
  );
};

const PrivateLetterRules = () => {
  const navigate = useNavigate();
  const openId = localStorage.getItem('openId') || '';
  const urlParams = getUrlOption(window.location.href);
  const id = urlParams?.id || '';
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tiktokId, setTiktokId] = useState(0);
  const [accountList, setAccountList] = useState<TiktokList[]>([]); // 抖音账号列表
  const [keyWordList, setKeyWordList] = useState<KeyWordListType[]>([{ type: '请选择', keyWord: '' }]); // 关键词
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 13 },
  };
  const changeAccount = (value: number) => {
    setTiktokId(value);
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
    const values = form.getFieldsValue();
    console.log(values);
    values.businessType = 3;
    values.replyTimesLimit = 1;
    http.post('/social/auto-reply-rule/save-rule', {
      ...values,
      status: values.status === false ? 2 : 1,
    }).then((res) => {
      const { success } = res;
      if (success) {
        message.success('保存成功！');
        navigate('/home');
      } else {
        message.error(res?.errMessage);
      }
    });
  };
  // 新增回复内容
  const addRuleType = (
    add: (defaultValue?: any, insertIndex?: number | undefined) => void,
    type: string,
  ) => {
    add({ msgType: type });
  };
  // 编辑功能
  // 获取详情
  const getRulesDetail = () => {
    if (id) {
      http.get('/social/auto-reply-rule/get_rule_detail', { id }).then((res) => {
        const { success, data } = res;
        console.log('getDetail::::', res, success, data);
        form.setFieldsValue(data);
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
        extra={<a className="font_family icon-fanhui blue" onClick={() => navigate(-1)}>返回</a>}
      >
        <Form
          {...layout}
          form={form}
          style={{ padding: '30px 0 0 0' }}
          onFinish={onFinish}
          validateMessages={validateMessages}
          initialValues={
            { messageList: [{ msgType: 'text' }, { msgType: 'image' }] }
          }
        >
          <Form.Item name={['tiktokUserId']} label="适用账号" rules={[{ required: true }]}>
            <Select
              style={{ width: 200 }}
              placeholder="请选择"
              onChange={changeAccount}
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
          <Form.Item name={['status']} label="功能启用" valuePropName="checked" rules={[{ required: true }]}>
            <Switch checked />
          </Form.Item>
          <Form.Item label="关键词" rules={[{ required: true }]}>
            <Form.List name={['keyWordList']} initialValue={keyWordList}>
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
            <Spin spinning={loading}>
              <Form.List name="messageList">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <ItemBox key={key}>
                        <Form.Item name={[name]}>
                          <TextImg />
                        </Form.Item>
                        <span style={{ fontSize: '14px', color: '#999999', marginLeft: 10 }} className="font_family icon-shanchu" onClick={() => remove(name)} />
                      </ItemBox>
                    ))}
                    <Form.Item>
                      {
                        fields.length < 10 && (
                          <DropdownBox>
                            <Button type="primary" ghost>
                              <span style={{ fontSize: '14px' }} className="font_family icon-tianjia1 font_14">
                                &nbsp;添加回复内容
                              </span>
                            </Button>
                            <nav className="dropBox">
                              <div className="dropItem" onClick={() => addRuleType(add, 'text')}>文字</div>
                              <div className="dropItem" onClick={() => addRuleType(add, 'image')}>图片</div>
                            </nav>
                          </DropdownBox>
                        )
                      }
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Spin>
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
    /* bottom: 100%; */
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
const ItemBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  .ant-upload.ant-upload-select-picture-card{
    margin: 0;
  }
  .tips{
    display: block;
    position: absolute;
    bottom: 0;
    width: 250px;
    left: calc(100% - 14px);
    bottom: 10px;
    font-size: 12px;
    color: rgba(0, 0, 0, .42);
  }
`;
const TextAreaBox = styled.div`
  padding-bottom: 22px;
  width: 500px;
  border: 1px solid #dddddd;
  textarea.ant-input{
    /* width: 500px; */
    height: 115px;
    border: none;
  }
`;
export default PrivateLetterRules;
