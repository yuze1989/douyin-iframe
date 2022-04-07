import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import http from 'utils/http';
import {
  TiktokList, RegulationDataType, ParmasType, InteractTableDataType,
  paginationDataType, KeyWordListType,
} from 'types/home';
import { ContentListType, DetailContextType } from 'types/rules';
import { Link, useLocation } from 'react-router-dom';
import {
  Form, Input, Select, Button, Table, Pagination, TablePaginationConfig, message, Switch,
  Popconfirm, Spin, Tooltip, Typography,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import DetailModal from './DetailModal';

const { Text } = Typography;
interface Props {
  openId: String
}

const Comments = (props: Props) => {
  const { openId } = props;
  const { state } = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [accountList, setAccountList] = useState<TiktokList[]>([]);
  const [tableData, setTableData] = useState<InteractTableDataType>();
  const [pageObject, setPageObject] = useState<paginationDataType>(state?.pageObject);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailContent, setDetailContent] = useState<DetailContextType>();
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
  // 查询
  const getRegulationList = (parmas?: ParmasType) => {
    setLoading(true);
    const value = form.getFieldsValue();
    // businessType 业务类型，1-评论规则，2-会话规则，3-私信规则
    value.businessType = 1;
    const obj = parmas || pageObject;
    http.post('/social/auto-reply-rule/page-rule', { ...value, ...obj }).then((res) => {
      setLoading(false);
      const { success } = res;
      if (success) {
        setPageObject({
          pageIndex: res.pageIndex,
          pageSize: res.pageSize,
        });
        setTableData(res);
      }
    }).catch(() => setLoading(false));
  };
  const pageChange = (pagination: TablePaginationConfig) => {
    const page = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    getRegulationList(page);
  };
  const toDetail = (record: RegulationDataType) => {
    getDetail({ id: record?.id });
  };
  // 启用/关闭
  const changeStatusHandler = (status: number, record: RegulationDataType) => {
    http.post('/social/auto-reply-rule/rule-status', { ruleStatus: status === 1 ? 2 : 1, id: record?.id }).then((res) => {
      const { success, errMessage } = res;
      if (success) {
        getRegulationList();
        message.success('操作成功！');
      } else {
        message.error(errMessage);
      }
    });
  };
  // 删除规则
  const deleteHandler = (record: RegulationDataType) => {
    setLoading(true);
    http.get('/social/auto-reply-rule/del-rule', { id: record?.id }).then((res) => {
      setLoading(false);
      const { success, errMessage } = res;
      if (success) {
        getRegulationList();
        message.success('删除成功！');
      } else {
        message.error(errMessage);
      }
    }).catch(() => setLoading(false));
  };
  // 规则详情
  const getDetail = (params: {}) => {
    http.get('/social/auto-reply-rule/get_rule_detail', { ...params }).then((res) => {
      const { success, data, errMessage } = res;
      if (success) {
        setDetailContent(data);
        setIsModalVisible(true);
        return;
      }
      message.error(errMessage);
    });
  };
  // const showModal = () => {
  //   setIsModalVisible(true);
  // };
  const handleCancel = () => {
    setIsModalVisible(false);
    setDetailContent(undefined);
  };
  const onFinish = () => {
    getRegulationList({ pageIndex: 1, pageSize: 10 });
  };
  const onReset = () => {
    form.resetFields();
    getRegulationList({ pageIndex: 1, pageSize: 10 });
  };
  useEffect(() => {
    getTiktokAccount();
    getRegulationList();
  }, []);
  const columns: ColumnsType<RegulationDataType> = [
    {
      title: '规则名称',
      width: 180,
      key: 'name',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '适用账号',
      width: 180,
      key: 'tiktokUserId',
      dataIndex: 'tiktokUserId',
      align: 'left',
      render: (tiktokUserId: number) => (
        accountList.find((item: TiktokList) => item.id === tiktokUserId)?.nickname
      ),
    },
    {
      title: '关键词',
      width: 180,
      key: 'keyWordList',
      dataIndex: 'keyWordList',
      align: 'left',
      ellipsis: true,
      render: (keyWordList?: KeyWordListType[]) => (
        // keyWordList?.map((item: KeyWordListType, index: number, array: KeyWordListType[]) => (
        //   <span key={item.id}>{item.keyWord}{index !== array.length - 1 && '，'}</span>
        // ))
        <Tooltip
          placement="bottomLeft"
          color="#FFFFFF"
          overlayClassName="tooltipsBox"
          destroyTooltipOnHide
          autoAdjustOverflow
          title={
            keyWordList?.map((item: KeyWordListType, index: number, array: KeyWordListType[]) => (
              <span key={item.id}>{item.keyWord}{index !== array.length - 1 && '，'}</span>
            ))
          }
        >
          {
            keyWordList?.map((item: KeyWordListType, index: number, array: KeyWordListType[]) => (
              <span key={item.id}>{item.keyWord}{index !== array.length - 1 && '，'}</span>
            ))
          }
        </Tooltip>
      ),
    },
    {
      title: '回复内容',
      // width: 180,
      key: 'messageList',
      dataIndex: 'messageList',
      align: 'left',
      ellipsis: true,
      render: (messageList: object[]) => (
        <Tooltip
          placement="bottomLeft"
          color="#FFFFFF"
          overlayClassName="tooltipsBox"
          autoAdjustOverflow
          title={
          (
            messageList?.map((item: ContentListType, index: number, array: object[]) => (
              item.msgType === 'text' ? <div className="tooltipContent" key={item.id}>{item?.text?.content}</div> : <span style={{ color: '#65B083' }} key={item.id}>[图片]</span>
            ))
          )
        }
        >
          {
            messageList?.map((item: ContentListType, index: number, array: object[]) => (
              item.msgType === 'text' ? <Text key={item.id}>{item?.text?.content}{index !== array.length - 1 && '，'}</Text> : <span style={{ color: '#65B083' }} key={item.id}>[图片]{index !== array.length - 1 && '，'}</span>
            ))
          }
        </Tooltip>
      ),
    },
    {
      title: '启用规则',
      width: 100,
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (status: number, record, index) => (
        <Switch
          checked={status === 1}
          onChange={() => changeStatusHandler(status, record)}
        />
      ),
    },
    {
      title: '操作',
      width: 220,
      key: 'handler',
      dataIndex: 'handler',
      align: 'center',
      render: (text, record, index) => (
        <>
          <Button type="link" onClick={() => toDetail(record)}>详情</Button>
          <Link to={`/comment-rules?id=${record?.id}`} state={{ tabKey: '2', optionKey: '1', pageObject }}>
            <Button type="link">编辑</Button>
          </Link>
          <Popconfirm
            placement="topLeft"
            title="确认删除这条规则？"
            onConfirm={() => deleteHandler(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  return (
    <>
      <SearchBox>
        <Form
          layout="inline"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item label="适用账号：" name="tiktokUserId">
            <Select
              className="selectBox"
              placeholder="请选择"
            >
              {
                accountList?.map((item) => (
                  <Select.Option
                    value={item?.id}
                    key={item.apiAuthorId}
                  >
                    {item.nickname}
                  </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item label="关键词：" name="content">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item>
            <Button className="submitButton" type="primary" htmlType="submit">
              <span className="font_family icon-sousuo2 fontSize14">
                &nbsp;查询
              </span>
            </Button>
            <Button htmlType="reset" onClick={onReset}>
              <span className="font_family icon-zhongzhi1 fontSize14">
                &nbsp;重置
              </span>
            </Button>
          </Form.Item>
        </Form>
        <ButtonBox>
          <Link to="/comment-rules" state={{ tabKey: '2', optionKey: '1' }}>
            <Button type="primary">
              <span className="font_family icon-xinjiansvg1 fontSize14">
                &nbsp;添加规则
              </span>
            </Button>
          </Link>
        </ButtonBox>
        <Spin spinning={loading}>
          <TableBox>
            <Table
              // style={{ margin: '0 2rem' }}
              bordered
              columns={columns}
              dataSource={tableData?.data}
              pagination={false}
              scroll={{ x: 1300 }}
            />
          </TableBox>
        </Spin>
        <DetailModal
          isShow={isModalVisible}
          onCancel={handleCancel}
          content={detailContent}
        />
      </SearchBox>
      <div className="footer-sticky">
        <Pagination
          current={tableData?.pageIndex || 0}
          pageSize={tableData?.pageSize || 10}
          total={tableData?.totalCount || 0}
          showSizeChanger
          showTotal={(total) => `共 ${total} 条`}
          onChange={(current, pageSize) => pageChange({ current, pageSize })}
        />
      </div>
    </>
  );
};
const SearchBox = styled.div`
  margin:0 0 1.6rem 0;
  padding: 0 2rem;
  .selectBox{
    width: 20rem;
  }
  .submitButton{
    margin-right: 1rem;
  }
  .fontSize14{
    font-size: 14px;
  }
`;
const ButtonBox = styled.div`
  margin: 2.4rem 0 1.6rem 0;
`;
const TableBox = styled.div`

`;
export default Comments;
