import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Radio } from 'antd';
import { useLocation } from 'react-router-dom';
import Comments from './interaction/Comments';
import Conversation from './interaction/Conversation';
import PrivateLetter from './interaction/PrivateLetter';

const UserActiveSetting = () => {
  const { state } = useLocation();
  const [optionKey, setOptionKey] = useState(state?.optionKey || '1');
  const openId = localStorage.getItem('openId') || '';
  const changeOptionKey = (key: string) => {
    setOptionKey(key);
  };
  return (
    <div>
      <TabsBox>
        <Radio.Group
          defaultValue={optionKey}
          style={{ padding: '0 2rem', margin: '4px 0 20px' }}
          onChange={(e) => {
            changeOptionKey(e.target.value);
          }}
        >
          <Radio.Button value="1">评论自动回复</Radio.Button>
          <Radio.Button value="2">进入会话自动触达</Radio.Button>
          <Radio.Button value="3">私信自动回复</Radio.Button>
        </Radio.Group>
      </TabsBox>
      <div>
        {optionKey === '1' && <Comments openId={openId} />}
        {optionKey === '2' && <Conversation openId={openId} />}
        {optionKey === '3' && <PrivateLetter openId={openId} />}
      </div>
    </div>
  );
};

const TabsBox = styled.div`
  .ant-radio-button-wrapper{
    height: 36px;
    line-height: 36px;
  }
  .ant-radio-button-wrapper-checked{
    border: 1px solid rgba(24,144,255,0.45);
    background: rgba(24,144,255,0.06);
  }
`;

export default UserActiveSetting;
