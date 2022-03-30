import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import http from 'utils/http';
import {
  TableItem, TableDataType, TiktokList, RegulationDataType, ParmasType, paginationDataType,
} from 'types/home';
import { DetailContextType } from 'types/rules';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Form, Input, Select, Button, Table, Pagination, TablePaginationConfig,
  Switch, Popconfirm, message, Spin, Tooltip, Typography,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

const { Text } = Typography;
interface Props {
  openId: String
}

const Conversation = (props: Props) => {
  const { openId } = props;
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [accountList, setAccountList] = useState<TiktokList[]>([]);
  const [tableData, setTableData] = useState<TableDataType>();
  const [pageObject, setPageObject] = useState<paginationDataType>(state?.pageObject || {
    pageIndex: 1,
    pageSize: 10,
  });
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
    value.businessType = 2;
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
  const toEdit = (record: RegulationDataType, index: number) => {
    navigate(`/save-rules-conversation?id=${record?.id}`);
  };
  const confirm = (record: RegulationDataType, index: number) => {
    deleteHandler({ id: record?.id });
  };
  // 启用/关闭
  const changeStatusHandler = (status: number, record: RegulationDataType, index: number) => {
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
  const deleteHandler = (params: {}) => {
    http.get('/social/auto-reply-rule/del-rule', { ...params }).then((res) => {
      const { success, errMessage } = res;
      if (success) {
        getRegulationList();
        message.success('删除成功！');
      } else {
        message.error(errMessage);
      }
    });
  };
  const onFinish = () => {
    getRegulationList();
  };
  const onReset = () => {
    form.resetFields();
    getRegulationList({ pageIndex: 1, pageSize: 10 });
  };
  useEffect(() => {
    getTiktokAccount();
    getRegulationList();
  }, []);
  const pageChange = (pagination: TablePaginationConfig) => {
    const page = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      // openId,
    };
    getRegulationList(page);
  };
  const columns: ColumnsType<TableItem> = [
    {
      title: '适用账号',
      width: 180,
      key: 'tiktokUserId',
      dataIndex: 'tiktokUserId',
      align: 'left',
      render: (tiktokUserId?: number) => (
        accountList.find((item: any) => item.id === tiktokUserId)?.nickname
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
            messageList?.map((item: any, index: number, array: object[]) => (
              item.msgType === 'text' ? <div className="tooltipContent" key={item.id}>{item?.text.content}</div> : <span style={{ color: '#65B083' }} key={item.id}>[图片]</span>
            ))
          )
        }
        >
          {
            messageList?.map((item: any, index: number, array: object[]) => (
              item.msgType === 'text' ? <Text key={item.id}>{item?.text.content}{index !== array.length - 1 && '，'}</Text> : <span style={{ color: '#65B083' }} key={item.id}>[图片]{index !== array.length - 1 && '，'}</span>
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
          onChange={() => changeStatusHandler(status, record, index)}
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
          <Link to={`/save-rules-conversation?id=${record?.id}`} state={{ tabKey: '2', optionKey: '2', pageObject }}>
            <Button type="link">编辑</Button>
          </Link>
          <Popconfirm
            placement="topLeft"
            title="确认删除这条规则？"
            onConfirm={() => confirm(record, index)}
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
    <SearchBox>
      <Form
        layout="inline"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="适用账号：" name="tiktokUserId">
          <Select
            style={{ width: 200 }}
            placeholder="请选择"
          >
            {
              accountList && accountList.map((item: any) => (
                <Select.Option
                  value={item.id}
                  key={item.apiAuthorId}
                >
                  {item.nickname}
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        {/* <Form.Item label="回复内容：" name="content">
          <Input placeholder="请输入" />
        </Form.Item> */}
        <Form.Item>
          <Button style={{ marginRight: '10px' }} type="primary" htmlType="submit">
            <span style={{ fontSize: '14px' }} className="font_family icon-sousuo2">
              &nbsp;查询
            </span>
          </Button>
          <Button htmlType="reset" onClick={onReset}>
            <span style={{ fontSize: '14px' }} className="font_family icon-zhongzhi1">
              &nbsp;重置
            </span>
          </Button>
        </Form.Item>
      </Form>
      <ButtonBox>
        <Link to="/save-rules-conversation" state={{ tabKey: '2', optionKey: '2' }}>
          <Button type="primary" disabled={tableData?.data?.length === 2}>
            <span style={{ fontSize: '14px' }} className="font_family icon-xinjiansvg1">
              &nbsp;添加规则
            </span>
          </Button>
        </Link>
      </ButtonBox>
      <Spin spinning={loading}>
        <Table
          // style={{ margin: '0 2rem' }}
          bordered
          columns={columns}
          dataSource={tableData?.data}
          pagination={false}
          scroll={{ x: 1300 }}
        />
      </Spin>
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
    </SearchBox>
  );
};
const SearchBox = styled.div`
  margin:0 0 16px 0;
  padding: 0 2rem;
`;
const ButtonBox = styled.div`
  margin: 20px 0;
`;
export default Conversation;
