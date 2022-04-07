import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import http from 'utils/http';
import { getUrlOption } from 'utils';
import { TiktokList } from 'types/home';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { KeyWordListType, RulesPropsType } from 'types/rules';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCloudUpload } from 'utils/upload';
import {
  Space, Typography, Card, Form, Select, Switch, Button, message, Upload, Spin, Input,
} from 'antd';
import InputShowCount from './components/InputShowCount';
import './create.css';

const { Text } = Typography;

interface Props {
  value?: RulesPropsType;
  tiktokId?: number;
  onChange?: (val: RulesPropsType) => void;
}
const TextImg = (props: Props) => {
  const { value, tiktokId, onChange } = props;
  const openId = localStorage.getItem('openId') || '';
  const headers = { 'tiktok-token': openId };
  const { ossData, getExtraData, uploadAttachment } = useCloudUpload('messagecenter');
  const uploadButton = (
    <div>
      <span className="font_family icon-tianjia1 preImgIcon" />
      <span className="preImgText">上传图片</span>
    </div>
  );
  const handleChange = async (fileInfo: UploadChangeParam<UploadFile<any>>) => {
    const {
      status, uid, name, size,
    } = fileInfo.file;
    if (status === 'uploading') return;
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
          id: value?.id,
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
      id: value?.id,
      msgType: value?.msgType,
      text: {
        content: text,
      },
    });
  };
  return (
    <>
      {
        value?.msgType === 'text' && (
          <TextAreaBox>
            <Input.TextArea
              placeholder="请输入回复内容"
              showCount
              autoSize={{ minRows: 5, maxRows: 5 }}
              maxLength={300}
              value={value?.text?.content}
              onChange={(e) => handleText(e.target.value)}
            />
          </TextAreaBox>
        )
      }
      {value?.msgType === 'image' && (
        <>
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
            {value?.image?.attachmentPath ? <img src={value?.image?.attachmentPath} alt="avatar" className="thumbImg" /> : uploadButton}
          </Upload>
          <Text className="tips">上传图片须小于1500像素，小于5M。</Text>
        </>
      )}
    </>
  );
};

const PrivateLetterRules = () => {
  const navigate = useNavigate();
  const openId = localStorage.getItem('openId') || '';
  const state = useLocation();
  const urlParams = getUrlOption(window.location.href);
  const id = Number(urlParams?.id) || '';
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tiktokUserId, setTiktokUserId] = useState(0);
  const [accountList, setAccountList] = useState<TiktokList[]>([]); // 抖音账号列表
  const [keyWordList, setKeyWordList] = useState<KeyWordListType[]>([{ keyWord: '' }]); // 关键词
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 13 },
  };
  const changeAccount = (value: number) => {
    setTiktokUserId(value);
  };
  const onFinish = () => {
    saveRegulation();
  };
  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: '${label} 不能为空!',
  };
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
    values.businessType = 3;
    values.replyTimesLimit = 1;
    http.post('/social/auto-reply-rule/save-rule', {
      ...values,
      id,
      status: values.status ? 1 : 2,
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
  // 新增回复内容
  const addRuleType = (
    add: (defaultValue?: any, insertIndex?: number) => void,
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
        Object.assign(data, { status: data.status === 1 });
        if (success) {
          setTiktokUserId(data.tiktokUserId);
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
        className="cardBox"
        title={id ? '编辑规则' : '添加规则'}
        bodyStyle={{ padding: 0 }}
        extra={<a className="font_family icon-fanhui blue" onClick={() => navigate('/home', { ...state })}>返回</a>}
      >
        <Form
          {...layout}
          form={form}
          className="paddingTop30"
          onFinish={onFinish}
          validateMessages={validateMessages}
          initialValues={
            { messageList: [{ msgType: 'text' }, { msgType: 'image' }] }
          }
        >
          <Form.Item name={['tiktokUserId']} label="适用账号" rules={[{ required: true }]}>
            <Select className="width200" placeholder="请选择" onChange={changeAccount}>
              {
                accountList?.map((item) => (
                  <Select.Option value={item.id} key={item.apiAuthorId}>
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
            <Form.List name={['keyWordList']} initialValue={keyWordList}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} className="displayFlex" align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'type']}
                        rules={[{ required: true, message: '请选择匹配模式' }]}
                        className="marginBottom16"
                      >
                        <Select
                          className="selectList"
                          placeholder="请选择"
                          options={rulesOption}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'keyWord']}
                        rules={[{ required: true, message: '关键词不能为空！' }]}
                        className="marginBottom16"
                      >
                        <InputShowCount style={{ width: 290 }} placeholder="请输入关键词" maxLength={30} />
                      </Form.Item>
                      {
                        fields.length !== 1 && (<span className="font_family icon-shanchu" onClick={() => remove(name)} />)
                      }
                    </Space>
                  ))}
                  <Form.Item className="marginBottom16">
                    {
                      fields.length < 10 && (
                        <Button type="primary" onClick={() => add()} ghost>
                          <span className="font_family icon-tianjia1 font_14">
                            &nbsp;添加关键词
                          </span>
                        </Button>
                      )
                    }
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Space direction="vertical">
              <Text type="secondary">半匹配是指评论中命中一个关键词就执行自动回复。</Text>
              <Text type="secondary">全匹配是指评论中所有关键词全部命中执行自动回复。</Text>
            </Space>
          </Form.Item>
          <Form.Item
            label="回复内容"
            className="requireTitle"
            extra="当回复内容有多条时，随机回复一条"
          >
            <Spin spinning={loading}>
              <Form.List
                name="messageList"
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <ItemBox key={key}>
                        <Form.Item
                          {...fields}
                          name={name}
                          className="marginBottom16"
                          required
                          rules={[
                            {
                              validator: (names, value, cb) => {
                                if (value?.text?.content || value?.image?.attachmentId) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('回复内容不能为空'));
                              },
                            },
                          ]}
                        >
                          <TextImg tiktokId={tiktokUserId && tiktokUserId} />
                        </Form.Item>
                        {
                          fields.length !== 1 && (<span style={{ marginLeft: 10 }} className="font_family icon-shanchu" onClick={() => remove(name)} />)
                        }
                      </ItemBox>
                    ))}
                    <Form.Item className="marginBottom16">
                      {
                        fields.length < 10 && (
                          <DropdownBox>
                            <Button type="primary" ghost>
                              <span className="font_family icon-tianjia1 font_14">
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
            <Form.Item wrapperCol={{ span: 24 }} className="saveButton">
              <Button type="primary" size="middle" htmlType="submit">保存</Button>
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
  .cardBox{
    margin: 2rem 2rem 0;
  }
  .paddingTop30{
    padding-top: 3rem;
  }
  .width200{
    width: 20rem;
  }
  .displayFlex{
    display: flex;
  }
  .marginBottom16{
    margin-bottom: 1.6rem;
  }
  .saveButton{
    margin: 1rem 0;
    text-align: center;
  }
  .selectList{
    display: inline-block;
    margin: 0 1rem 0 0;
    width: 10rem;
  }
  `;
const ButtonBox = styled.div`
  border-top: 1px solid #DDDDDD;
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
      &:click{
        color: #147AD9;
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
    position: absolute;
    width: 300px;
    bottom: 0;
    left: calc(100% + 10px);
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
  .thumbImg{
    width: 100%;
    max-height: 100%;
  }
  .preImgIcon{
    display: block;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.25);
  }
  .preImgText{
    color: rgba(0,0,0,0.25);
  }
`;
const TextAreaBox = styled.div`
  padding-bottom: 22px;
  width: 500px;
  border: 1px solid #dddddd;
  textarea.ant-input{
    height: 115px;
    border: none;
  }
`;
export default PrivateLetterRules;
