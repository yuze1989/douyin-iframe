import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import http from 'utils/http';
import { EnterpriseMsgType, TableItem, TableDataType } from 'types/home';
import { Link } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Button,
  Table,
  Pagination,
  TablePaginationConfig,
  InputNumber,
  message,
  Radio,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

const { Option } = Select;

interface Props { }

const ConversationRules = (props: Props) => {
  const [tableData, setTableData] = useState<TableDataType>();
  const pageChange = (pagination: TablePaginationConfig) => {
    const page = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
  };
  const columns: ColumnsType<TableItem> = [
    {
      title: '规则名称',
      width: 180,
      key: 'tiktokNumber',
      dataIndex: 'tiktokNumber',
      align: 'left',
    },
    {
      title: '适用账号',
      width: 180,
      key: 'tiktokNumber',
      dataIndex: 'tiktokNumber',
      align: 'left',
    },
    {
      title: '关键词',
      width: 180,
      key: 'tiktokNumber',
      dataIndex: 'tiktokNumber',
      align: 'left',
    },
    {
      title: '回复内容',
      // width: 180,
      key: 'tiktokNumber',
      dataIndex: 'tiktokNumber',
      align: 'left',
    },
    {
      title: '启用规则',
      width: 100,
      key: 'tiktokNumber',
      dataIndex: 'tiktokNumber',
      align: 'left',
    },
    {
      title: '操作',
      // width: 180,
      key: 'tiktokNumber',
      dataIndex: 'tiktokNumber',
      align: 'left',
    },
  ];
  return (
    <SearchBox>
      <Form layout="inline">
        <Form.Item label="适用账号：">
          <Select
            style={{ width: 200 }}
            placeholder="请选择"
            optionFilterProp="children"
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="tom">Tom</Option>
          </Select>
        </Form.Item>
        <Form.Item label="关键词/回复内容：">
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
        <Link to="/save-channel">
          <Button type="primary">
            <span style={{ fontSize: '14px' }} className="font_family icon-xinjiansvg1">
              &nbsp;添加规则
            </span>
          </Button>
        </Link>
      </ButtonBox>
      <Table
        // style={{ margin: '0 2rem' }}
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
export default ConversationRules;
