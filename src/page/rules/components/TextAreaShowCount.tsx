import React, { useState } from 'react';
import { Input } from 'antd';
import styled from '@emotion/styled';

interface Content {
  msgType?: string;
  text?: {
    content?: string;
  };
}
interface Props {
  // eslint-disable-next-line no-unused-vars
  onChange?: (val: Content) => void;
  value?: Content;
  maxLength?: number;
  autoSize?: Object;
  style?:Object;
}

const TextAreaShowCount = (props: Props) => {
  const {
    value,
    onChange,
    maxLength,
    autoSize,
    style,
  } = props;
  const [contentVal, setContentVal] = useState<string>();
  return (
    <TextAreaBox style={style}>
      <Input.TextArea
        value={value?.text?.content || contentVal}
        onChange={(e) => {
          setContentVal(e.target.value);
          onChange?.({ msgType: 'text', text: { content: e.target.value } });
        }}
        placeholder="请输入消息内容..."
        showCount
        bordered={false}
        autoSize={autoSize || false}
        maxLength={maxLength || 300}
      />
    </TextAreaBox>
  );
};
const TextAreaBox = styled.div`
  border: 1px solid #d9d9d9;
  padding-bottom: 2.5rem;
  .ant-input-textarea-show-count > .ant-input {
    border: 0;
  }
`;
export default TextAreaShowCount;
