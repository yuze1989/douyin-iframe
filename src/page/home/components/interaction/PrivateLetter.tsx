import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import http from 'utils/http';
import {
  RegulationDataType,
  TableDataType,
  ParmasType,
  TiktokList,
} from 'types/home';
import { Link } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Button,
  Table,
  Pagination,
  TablePaginationConfig,
  message,
  Switch,
  Popconfirm,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

const { Option } = Select;

interface Props {
  openId: String
}

const PrivateLetter = (props: Props) => {
  const { openId } = props;
  const [form] = Form.useForm();
  const [accountList, setAccountList] = useState<TiktokList[]>([]);
  const [tableData, setTableData] = useState<TableDataType>();
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
  const changeStatus = (status: number | string, record: RegulationDataType, index: number) => {
    // console.log(status, record, index);
    changeStatusHandler({ ruleStatus: status === 1 ? 2 : 1, id: record?.id }, index);
  };
  const toDetail = (record: RegulationDataType, index: number) => {
    // console.log(record, index);
    getDetail({ id: record?.id });
  };
  const toEdit = (record: RegulationDataType, index: number) => {
    console.log(record, index);
  };
  const confirm = (record: RegulationDataType, index: number) => {
    // console.log(record, index);
    deleteHandler({ id: record?.id });
  };
  // 启用/关闭
  const changeStatusHandler = (params: {}, index: number) => {
    http.post('/social/auto-reply-rule/rule-status', { ...params }).then((res) => {
      const { success, data, errMessage } = res;
      if (success) {
        message.success('操作成功！');
      } else {
        message.error(errMessage);
      }
    });
  };
  // 删除规则
  const deleteHandler = (params: {}) => {
    http.get('/social/auto-reply-rule/del-rule', { ...params }).then((res) => {
      const { success, data, errMessage } = res;
      if (success) {
        getRegulationList();
        message.success('删除成功！');
      } else {
        message.error(errMessage);
      }
    });
  };
  // 规则详情
  const getDetail = (params: {}) => {
    http.get('/social/auto-reply-rule/get_rule_detail', { ...params }).then((res) => {
      const { success, data } = res;
      console.log('getDetail::::', res);
    });
  };
  // 查询
  const getRegulationList = (parmas?: ParmasType) => {
    const value = form.getFieldsValue();
    // businessType 业务类型，1-评论规则，2-会话规则，3-私信规则
    value.businessType = 3;
    http.post('/social/auto-reply-rule/page-rule', { ...value, ...parmas }).then((res) => {
      const { success, data } = res;
      if (success) {
        setTableData(res);
      }
    });
  };
  const onFinish = () => {
    getRegulationList();
  };
  useEffect(() => {
    getTiktokAccount();
    getRegulationList();
  }, []);
  const pageChange = (pagination: TablePaginationConfig) => {
    const page = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    getRegulationList(page);
  };
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
      render: (tiktokUserId?: number) => (
        accountList.find((item: any) => item.id === tiktokUserId)?.nickname
      ),
    },
    {
      title: '关键词',
      width: 180,
      key: 'keyWordList',
      dataIndex: 'keyWordList',
      align: 'left',
      render: (keyWordList?: object[]) => (
        keyWordList?.map((item: any) => (
          <span key={item.id}>{item.keyWord},</span>
        ))
      ),
    },
    {
      title: '回复内容',
      // width: 180,
      key: 'messageList',
      dataIndex: 'messageList',
      align: 'left',
      render: (messageList: object[]) => (
        messageList?.map((item: any) => (
          item.msgType === 'text' ? <span key={item.id}>{item?.text.content}</span> : <span style={{ color: '#65B083' }} key={item.id}>[图片]</span>
        ))
      ),
    },
    {
      title: '启用规则',
      width: 180,
      key: 'status',
      dataIndex: 'status',
      align: 'left',
      render: (status: number, record, index) => (
        <Switch
          defaultChecked={Boolean(status === 1)}
          onChange={() => changeStatus(status, record, index)}
        />
      ),
    },
    {
      title: '操作',
      width: 220,
      key: 'handler',
      dataIndex: 'handler',
      align: 'left',
      render: (text, record, index) => (
        <>
          <Button type="link" onClick={() => toDetail(record, index)}>详情</Button>
          <Button type="link" onClick={() => toEdit(record, index)}>编辑</Button>
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
        initialValues={{
          tiktokUserId: '',
          content: '',
        }}
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
        <Form.Item label="关键词/回复内容：" name="content">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item>
          <Button style={{ marginRight: '10px' }} type="primary" htmlType="submit">
            <span style={{ fontSize: '14px' }} className="font_family icon-sousuo2">
              &nbsp;查询
            </span>
          </Button>
          <Button htmlType="reset">
            <span style={{ fontSize: '14px' }} className="font_family icon-zhongzhi1">
              &nbsp;重置
            </span>
          </Button>
        </Form.Item>
      </Form>
      <ButtonBox>
        <Link to="/save-rules-private-letter">
          <Button type="primary">
            <span style={{ fontSize: '14px' }} className="font_family icon-xinjiansvg1">
              &nbsp;添加规则
            </span>
          </Button>
        </Link>
      </ButtonBox>
      <Table
        // style={{ margin: '0 2rem' }}
        bordered
        columns={columns}
        dataSource={tableData?.data}
        pagination={false}
        scroll={{ x: 1300 }}
      />
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
export default PrivateLetter;
