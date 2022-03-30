/* eslint-disable react/require-default-props */
import styled from '@emotion/styled';
import { Modal, Typography } from 'antd';
import React, { useEffect } from 'react';
import { KeyWordListType } from 'types/home';
import { DetailContextType, RulesPropsType } from 'types/rules';
import './modal.css';

const { Title, Text } = Typography;

interface IProps {
  isShow?: boolean;
  content?: DetailContextType;
  onCancel?: () => void;
}
const DetailModal = (props: IProps) => {
  const {
    isShow, content, onCancel,
  } = props;
  const KeyWordContent = () => (
    <Typography className="keyBox">
      <div className="tit">关键词</div>
      <div>
        {
          content?.keyWordList?.map((item: KeyWordListType) => (<div className="tips" key={item.id}>{item?.keyWord}<span>（{item.type === 1 ? '半匹配' : '全匹配'}）</span></div>))
        }
      </div>
    </Typography>
  );
  const MessageList = () => (
    <Typography className="keyBox">
      <div className="tit">回复内容</div>
      {
        content?.messageList?.sort((a: any, b: any) => {
          if (a.msgType > b.msgType) {
            return -1;
          }
          if (a.msgType < b.msgType) {
            return 1;
          }
          return 0;
        })?.map((item: RulesPropsType) => (
          item.msgType === 'text' ? <div className="txt" key={item.id}>{item?.text?.content}</div> : <div className="image" key={item.id}><img src={item?.image?.attachmentPath} alt="" /></div>
        ))
      }
    </Typography>
  );
  const ReplyTimesLimit = () => (
    <Typography className="keyBox">
      <div className="tit">单个视频回复条数</div>
      <Text className="txt">{content?.replyTimesLimit}</Text>
    </Typography>
  );
  useEffect(() => {
  }, []);
  return (
    <Modal
      className="detailModalBox"
      title="规则详情"
      visible={isShow}
      footer={null}
      width={640}
      bodyStyle={{ minHeight: 390, maxHeight: 580, overflowY: 'auto' }}
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
  .keyBox{
    margin-bottom: 1.8rem;
    font-size: 14px;
    .tit{
      font-weight: 500;
      color: #000000;
    }
    .tips{
      margin: 0.6rem 4rem 0.6rem 0;
      display: inline-block;
      font-weight: 400;
      color: rgba(0, 0, 0, .65);
      span{
        color: rgba(0, 0, 0, .45);
      }
    }
    .txt{
      margin: 0.6rem 0;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
    }
    .image{
      display: inline-block;
      margin: 1.2rem 1.2rem 0 0;
      width: 86px;
      height: 86px;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
`;

export default DetailModal;
