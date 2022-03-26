import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Radio } from 'antd';
import Comments from './interaction/Comments';
import Conversation from './interaction/Conversation';
import PrivateLetter from './interaction/PrivateLetter';

interface Props {
  // openId: string;
}
const UserActiveSetting = (props: Props) => {
  // const { openId } = props;
  const openId = localStorage.getItem('openId') || '';
  const childIndex = localStorage.getItem('childIndex') || '1';
  const [optionKey, setOptionKey] = useState(childIndex);
  const changeOptionKey = (key: string) => {
    localStorage.setItem('childIndex', key);
    setOptionKey(key);
  };
  useEffect(() => {
  }, []);
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
`;

export default UserActiveSetting;
