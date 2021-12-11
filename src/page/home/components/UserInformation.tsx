import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import http from 'utils/http';
import { message } from 'antd';
import {
  EnterpriseMsgType,
} from 'types/home';

interface Props {
  openId:string;
}
const UserInformation = (props:Props) => {
  const { openId } = props;
  const [enterpriseMsg, setEnterpriseMsg] = useState<EnterpriseMsgType>({});
  const getEnterpriseMsg = () => {
    http.get('/douyin/api-author/enterprise', { openId }).then((res) => {
      const { success, data } = res;
      if (success) {
        setEnterpriseMsg(data);
      }
    });
  };
  const copy = (value:string | undefined) => {
    console.log(value);
    if (value) {
      navigator.clipboard.writeText(value);
      message.success('复制完成');
    }
  };
  useEffect(() => {
    getEnterpriseMsg();
  }, []);
  return (
    <UserBox>
      <Text>
        <i className="font_family icon-a-" style={{ color: '#1890FF', marginRight: 8 }} />
        <span>企业编码和企业秘钥是与巨准scrm绑定的关键属性，请妥善保管！</span>
      </Text>
      <Msg>
        <Name>企业Id：</Name>
        <Key>{enterpriseMsg?.enterpriseCode}</Key>
        <Copy onClick={() => copy(enterpriseMsg?.enterpriseCode)}>复制</Copy>
      </Msg>
      <Msg>
        <Name>企业秘钥：</Name>
        <Key>{enterpriseMsg?.enterpriseSecret}</Key>
        <Copy onClick={() => copy(enterpriseMsg?.enterpriseSecret)}>复制</Copy>
      </Msg>
    </UserBox>
  );
};

const UserBox = styled.div`
    margin:2rem;
    margin-top:0;
`;
const Text = styled.div`
    height: 40px;
    background: #E6F7FF;
    border: 1px solid #BAE7FF;
    border-radius: 2px;
    line-height: 40px;
    margin-top:0;
    margin-bottom:10px;
    padding-left:10px;
`;
const Name = styled.span`
    font-family: PingFangSC-Medium;
    font-weight: Medium;
    font-size: 14px;
    color: rgba(0,0,0,0.45);
`;
const Key = styled.span`
    color: rgba(0,0,0,0.65);
`;
const Copy = styled.span`
    font-family: PingFangSC-Regular;
    font-weight: Regular;
    font-size: 14px;
    color: #1890FF;
    margin-left:20px;
    cursor:pointer;
`;
const Msg = styled.div`
    padding:10px 0;
`;
export default UserInformation;
