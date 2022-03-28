/* eslint-disable react/require-default-props */
import styled from '@emotion/styled';
import { Modal, Typography } from 'antd';
import React, { useEffect } from 'react';

import { DetailContextType } from 'types/rules';

const { Title, Text } = Typography;

interface IProps {
  isShow?: boolean;
  content?: DetailContextType;
  onCancel?: () => void;
  // eslint-disable-next-line no-unused-vars
  onChange?: (val: string) => void; // 返回值没有类型，即返回值为空
}
const DetailModal = (props: IProps) => {
  const {
    isShow, content, onChange, onCancel,
  } = props;
  const KeyWordContent = () => (
    <Typography className="keyBox" style={{ marginTop: 10 }}>
      <Title className="tit" level={5}>关键词</Title>
      <div>
        {
          content?.keyWordList?.map((item: any) => (<div className="tips" key={item.id}>咨询<span>（{item.type === 1 ? '半匹配' : '全匹配'}）</span></div>))
        }
      </div>
    </Typography>
  );
  const MessageList = () => (
    <Typography className="keyBox" style={{ marginTop: 10 }}>
      <Title className="tit" level={5}>回复内容</Title>
      {
        content?.messageList?.map((item: any) => (
          item.msgType === 'text' ? <div className="txt" key={item.id}>{item?.text?.content}</div> : <div className="image" key={item.id}><img src={item?.image?.attachmentPath} alt="" /></div>
        ))
      }
    </Typography>
  );
  const ReplyTimesLimit = () => (
    <Typography className="keyBox" style={{ marginTop: 10 }}>
      <Title className="tit" level={5}>单个视频回复条数</Title>
      <Text className="txt">{content?.replyTimesLimit}</Text>
    </Typography>
  );
  useEffect(() => {
  }, []);
  return (
    <Modal
      title="规则详情"
      visible={isShow}
      footer={null}
      bodyStyle={{ minHeight: 350, maxHeight: 570, overflowY: 'auto' }}
      destroyOnClose
      onCancel={onCancel}
    >
      <DetailContent>
        {
          content?.keyWordList?.length && <KeyWordContent />
        }
        {
          content?.messageList?.length && <MessageList />
        }
        {
          content?.businessType === 1 && content?.replyTimesLimit && <ReplyTimesLimit />
        }
      </DetailContent>
    </Modal>
  );
};
const DetailContent = styled.div`
  .tit{
    font-size: 14px;
    font-weight: 500;
    color: #000000;
  }
  .tips{
    display: inline-block;
    margin-right: 40px;
    font-size: 14px;
    color: rgba(0, 0, 0, .65);
    span{
      color: rgba(0, 0, 0, .45);
    }
  }
  .txt{
    font-size: 12px;
    color: #666666;
  }
  .image{
    margin-right: 12px;
    width: 86px;
    height: 86px;
    img{
      width: 100%;
      height: 100%;
    }
  }
`;

export default DetailModal;
